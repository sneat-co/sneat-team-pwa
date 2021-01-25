import {Component, Inject} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import {IRecord, IUser, IUserTeamInfoWithId} from '../../../models/interfaces';
import {UserService} from '../../../services/user-service';
import {NavigationEnd, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {NavService} from '../../../services/nav.service';
import {AppContextService} from '../../../services/app-context.service';
import firebase from 'firebase';
import User = firebase.User;

@Component({
	selector: 'app-sneat-team-menu',
	templateUrl: './sneat-team-menu.component.html',
	styleUrls: ['./sneat-team-menu.component.scss'],
})
export class SneatTeamMenuComponent {

	public showAbout: boolean;
	public currentTeamId: string;
	public fbUser?: User;
	public user?: IUser;
	public teams: IUserTeamInfoWithId[];

	currentPage: string;

	constructor(
		private readonly appContextService: AppContextService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly router: Router,
		public readonly afAuth: AngularFireAuth,
		private readonly userService: UserService,
		private readonly navController: NavController,
		public readonly navService: NavService,
	) {
		this.afAuth.authState.subscribe({
			next: user => {
				this.fbUser = user;
			},
			error: err => this.errorLogger.logError(err, 'Failed to load auth state'),
		});
		this.userService.userRecord.subscribe({
			next: user => this.setUser(user),
			error: err => this.errorLogger.logError(err, 'Failed to get user record'),
		});
		this.router.events.subscribe(val => {
			if (val instanceof NavigationEnd) {
				this.currentPage = val.urlAfterRedirects.match(/\/([-\w]+)/)[1];
				console.log('NavigationEnd:', val.urlAfterRedirects, this.currentPage);
				const m = val.urlAfterRedirects.match(/(?:\/team\?id|[&?])=(\w+)/);
				this.currentTeamId = m?.[1];
				console.log('currentTeamId:', this.currentTeamId);
			}
		});
	}

	goTeam(team: IUserTeamInfoWithId) {
		this.navService.navigateToTeam(team.id, team);
	}

	goDataTug(): void {
		// this.navController.navigateForward('datatug')
		// 	.then(() => this.appContextService.setCurrent(AppCode.dataTug))
		// 	.catch(err => this.errorLogger.logError(err, 'Failed to navigate to datatug app'));
	}

	signOut() {
		this.afAuth.signOut()
			.then(() => {
				this.navController.navigateRoot('login', {animationDirection: 'back'})
					.catch(err => this.errorLogger.logError(err, 'Failed to navigate to login page'));
			})
			.catch(err => this.errorLogger.logError(err, 'Failed to sign out'));
	}

	public itemId = (_: number, item: { id: string }) => item.id;

	private setUser(user: IRecord<IUser>): void {
		this.user = user?.data;
		if (!user?.data) {
			return;
		}
		this.teams = [];
		for (const [id, team] of Object.entries(user.data.teams)) {
			this.teams.push({id, ...team});
		}
		this.teams.sort((a, b) => a.title > b.title ? 1 : -1);
	}
}
