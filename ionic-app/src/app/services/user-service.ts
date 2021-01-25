import {IRecord, IUser} from '../models/interfaces';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable, ReplaySubject, Subscription} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {SneatTeamApiService} from './sneat-team-api.service';
import firebase from 'firebase';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import User = firebase.User;

@Injectable()
export class UserService {

	public userDocSubscription?: Subscription;
	private readonly userCollection: AngularFirestoreCollection<IUser>;
	private uid?: string;

	private readonly userChanged$ = new ReplaySubject<string | undefined>();
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly userChanged = this.userChanged$.asObservable();

	private readonly userRecord$ = new BehaviorSubject<IRecord<IUser> | undefined>(undefined);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly userRecord = this.userRecord$.asObservable();

	private $userTitle: string;

	constructor(
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
		private db: AngularFirestore,
		private afAuth: AngularFireAuth,
		private sneatTeamApiService: SneatTeamApiService,
	) {
		this.userCollection = db.collection<IUser>('users');
		afAuth.authState.subscribe(afUser => {
			if (afUser) {
				this.onUserSignedIn(afUser);
			} else {
				this.onUserSignedOut();
			}
			this.userChanged$.next(this.uid);
		});
		// this.userRecord.subscribe(userRecord => console.log('userRecord:', userRecord));
	}

	public get currentUserId(): string | undefined {
		return this.uid;
	}

	public get userTitle(): string {
		return this.$userTitle;
	}

	public setUserTitle(title: string): Observable<void> {
		return this.sneatTeamApiService.post<void>('users/set_user_title', {title});
	}

	public onUserSignedIn(afUser: User): void {
		console.log('onUserSignedIn()');
		if (afUser.uid === this.uid) {
			return;
		}
		console.log('afUser:', afUser);
		// afUser.getIdToken().then(idToken => {
		// 	console.log('Firebase idToken:', idToken);
		// }).catch(err => this.errorLogger.logError(err, 'Failed to get Firebase ID token'));
		if (afUser.email && afUser.emailVerified) {
			this.$userTitle = afUser.email;
		}
		if (this.uid === afUser.uid) {
			return;
		}
		if (this.userDocSubscription) {
			this.userDocSubscription.unsubscribe();
			this.userDocSubscription = undefined;
		}
		const {uid} = afUser;
		this.uid = uid;
		const userDoc = this.userCollection.doc(uid);
		this.userDocSubscription = userDoc
			.snapshotChanges()
			.subscribe(changes => {
				console.log('Firestore: User record changed', changes);
				if (changes.type === 'value') {
					const userDocSnapshot = changes.payload;
					if (userDocSnapshot.exists) {
						throw new Error('not implemented');
						// if (userDocSnapshot.ref.id === this.uid) { // Should always be equal as we unsubscribe if uid changes
						// 	const userRecord: IRecord<IUser> = {
						// 		id: uid,
						// 		data: userDocSnapshot.data() as IUser,
						// 	};
						// 	this.userRecord$.next(userRecord);
						// }
					} else {
						setTimeout(() => this.createUserRecord(userDoc.ref, afUser), 1);
					}
				}
			}, err => this.errorLogger.logError(err, 'failed to process user changed'));
	}

	private onUserSignedOut(): void {
		this.uid = undefined;
		if (this.userDocSubscription) {
			this.userDocSubscription.unsubscribe();
		}
	}

	private createUserRecord(userDocRef: DocumentReference, afUser: User): void {
		if (this.userRecord$.value) {
			return;
		}
		this.db.firestore.runTransaction(async tx => {
			if (this.userRecord$.value) {
				return;
			}
			const u = await tx.get(userDocRef);
			if (!u.exists) {
				const user: IUser = {
					title: afUser.displayName,
				};
				if (afUser.email) {
					user.email = afUser.email;
				}
				await tx.set(userDocRef, user);
				return user;
			}
		}).then(user => {
			// if (user) {
			// 	console.log('user record created:', user);
			// }
			if (!this.userRecord$.value) {
				this.userRecord$.next({id: afUser.uid, data: user});
			}
		}).catch(err => this.errorLogger.logError('failed to create user record', err));
	}
}
