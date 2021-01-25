import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable, throwError} from 'rxjs';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument,
	DocumentReference
} from '@angular/fire/firestore';
import {IMemberInfo, IRecord, IScrum, IStatus, ITask, ITeam, TaskType} from '../models/interfaces';
import {RandomId} from '../../util/auto-id';
import {filter, map, tap} from 'rxjs/operators';
import {SneatTeamApiService} from './sneat-team-api.service';
import {HttpParams} from '@angular/common/http';
import {IAddCommentRequest, IAddTaskRequest, IReorderTaskRequest, IThumbUpRequest} from '../models/dto-models';
import {AnalyticsService} from './analytics.service';
import {UserService} from './user-service';
import {BaseMeetingService} from './meeting.service';
import firebase from 'firebase';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import FieldPath = firebase.firestore.FieldPath;

const getOrCreateMemberStatus = (scrum: IScrum, member: IMemberInfo): IStatus => {
	const mid = member.id;
	const statusOfMember = (item: IStatus) => mid && item.member.id === mid;
	let status = scrum.statuses.find(statusOfMember);
	if (!status) {
		status = {
			member,
			byType: {
				done: [],
				risk: [],
				todo: [],
				qna: [],
			},
		};
		scrum.statuses.push(status);
	}
	return status;
}

export interface ITaskWithUiStatus extends ITask {
	uiStatus?: 'adding' | 'deleting';
}


@Injectable({
	providedIn: 'root'
})
export class ScrumService extends BaseMeetingService {

	constructor(
		readonly sneatTeamApiService: SneatTeamApiService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly userService: UserService,
		private readonly db: AngularFirestore,
		private readonly analyticsService: AnalyticsService,
	) {
		super('scrum', sneatTeamApiService);
	}

	public getScrums(teamId: string, limit = 10): Observable<IRecord<IScrum>[]> {
		console.log('getScrums()', teamId, limit, this.userService.currentUserId);
		const scrums = this.scrumsCollection(teamId);
		const query = scrums.ref
			.where('userIds', 'array-contains', this.userService.currentUserId)
			.orderBy(FieldPath.documentId(), 'desc')
			.limit(limit);
		return from(query.get()).pipe(
			map(result => {
				console.log('result', result);
				// TODO: Remove `@ts-ignore`
				// @ts-ignore
				return result.docs.map(d => {
					console.log('d', d);
					return {
						id: d.id,
						data: d.data() as IScrum,
					};
				});
			}),
		);
	}

	public watchScrum(teamId: string, scrumId: string): Observable<IScrum> {
		console.log(`watchScrum(${teamId}, ${scrumId})`);
		const scrumDoc = this.getScrumDoc(teamId, scrumId);
		return scrumDoc.snapshotChanges()
			.pipe(
				tap(changes => {
					console.log('scrum changes:', changes);
				}),
				filter(changes => changes.type === 'value'),
				map(changes => changes.payload.data() as IScrum),
			);
	}

	public deleteTask(team: string, scrumId: string, member: IMemberInfo, type: TaskType, id: string): Observable<void> {
		console.log('deleteTask', team, scrumId, member, type, id);
		const params = new HttpParams()
			.append('team', team)
			.append('date', scrumId)
			.append('member', member.id)
			.append('type', type)
			.append('id', id);

		return this.sneatTeamApiService.delete<void>('scrum/delete_task', params);
	}

	public reorderTask(request: IReorderTaskRequest): Observable<void> {
		console.log('reorderTask', request);
		return this.sneatTeamApiService.post<void>('scrum/reorder_task', request);
	}

	public thumbUp(request: IThumbUpRequest): Observable<void> {
		console.log('thumbUp', request);
		return this.sneatTeamApiService.post<void>('scrum/thumb_up_task', request);
	}

	public addComment(request: IAddCommentRequest): Observable<string> {
		console.log('addComment', request);
		if (!request.message) {
			return throwError('message required');
		}
		if (!request.team) {
			return throwError('team required');
		}
		if (!request.member) {
			return throwError('member required');
		}
		if (!request.meeting) {
			return throwError('meeting required');
		}
		if (!request.type) {
			return throwError('task type required');
		}
		return this.sneatTeamApiService.post<string>('scrum/add_comment', request);
	}

	public setTaskCompletion(
		teamId: string,
		scrumId: string,
		member: IMemberInfo,
		taskId: string,
		isCompleted: boolean,
	): Observable<IStatus> {
		let memberStatus: IStatus;
		return this.updateStatus(teamId, scrumId, member, (scrum, status) => {
			const move = (src: 'done' | 'todo', dst: 'done' | 'todo'): void => {
				memberStatus = status;
				const index = status[src].findIndex(t => t.id === taskId);
				if (index >= 0) {
					status[dst] = status[dst].filter(t => t.id !== taskId);
					status[dst].push(status[src][index]);
					status[src].splice(index, 1);
				}
			};
			if (isCompleted) {
				move('todo', 'done');
			} else {
				move('done', 'todo');
			}
			return scrum;
		}).pipe(
			tap(() => {
				const eventParams: any = {teamId, id: taskId};
				if (member.id) {
					eventParams.memberId = member.id;
				} else if (member.uid) {
					eventParams.memberUid = member.uid;
				}
				this.analyticsService.logEvent('taskCompletionChanged', eventParams);
			}),
			map(() => memberStatus),
		);
	}

	public addTask(team: IRecord<ITeam>, scrumId: string, member: IMemberInfo, type: TaskType, title: string):
		Observable<ITaskWithUiStatus> {
		const task: ITaskWithUiStatus = {
			id: RandomId.newRandomId(9),
			title,
			uiStatus: 'adding',
		};
		const request: IAddTaskRequest = {
			type,
			team: team.id,
			meeting: scrumId,
			member: member.id,
			task: task.id,
			title: task.title,
		};
		const subj = new BehaviorSubject(task);
		this.sneatTeamApiService.post('scrum/add_task', request).subscribe({
			next: () => {
				subj.next({...task, uiStatus: undefined});
				subj.complete();
			},
			error: subj.error,
		});
		return subj;
	}

	private getScrumRef(teamId: string, scrumId: string): DocumentReference {
		return this.getScrumDoc(teamId, scrumId).ref;
	}

	private scrumsCollection(teamId: string): AngularFirestoreCollection<IScrum> {
		const teamDoc = this.db.collection('teams').doc<ITeam>(teamId);
		return teamDoc.collection<IScrum>('scrums');
	}

	private getScrumDoc(teamId: string, scrumId: string): AngularFirestoreDocument<IScrum> {
		return this.scrumsCollection(teamId).doc(scrumId);
	}

	private updateStatus(
		teamId: string, scrumId: string, member: IMemberInfo,
		// TODO: Invalid eslint-disable-next-line no-shadow - lambda definition should not cause shadowing.
		// https://github.com/sneat-team/sneat-team-pwa/issues/381
		// eslint-disable-next-line no-shadow
		worker: (scrum: IScrum, status: IStatus) => IScrum,
	): Observable<IScrum> {
		let scrum: IScrum;
		return from(this.db.firestore.runTransaction(transaction => {
			const scrumRef = this.getScrumRef(teamId, scrumId);
			return transaction
				.get(scrumRef)
				.then(scrumDoc => {
					scrum = scrumDoc.data() as IScrum;
					const status = getOrCreateMemberStatus(scrum, member);
					scrum = worker(scrum, status);
					return transaction.update(scrumRef, {statuses: scrum.statuses});
				});
		})).pipe(map(() => scrum));
	}
}
