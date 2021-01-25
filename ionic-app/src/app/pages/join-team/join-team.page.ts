import {Component, Inject, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../../services/team.service';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import {ITeam, IUserTeamInfo} from '../../models/interfaces';
import {NavService} from '../../services/nav.service';
import {Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

export const getPinFromUrl: () => number | undefined = () => {
	const m = location.hash.match(/[#&]pin=(\d+)($|&)/);
	if (m) {
		return +m[1];
	}
	return undefined;
}

@Component({
	selector: 'app-join-team',
	templateUrl: './join-team.page.html',
	styleUrls: ['./join-team.page.scss'],
})
export class JoinTeamPage implements OnDestroy {

	public teamId: string;
	public pin?: number;
	public team?: ITeam;
	public invitedBy?: IUserTeamInfo;
	public joining: boolean;
	public refusing: boolean;
	public isUserAuthenticated: boolean;

	private subscriptions: Subscription[] = [];

	constructor(
		protected readonly route: ActivatedRoute,
		private readonly navService: NavService,
		private readonly teamService: TeamService,
		private readonly afAuth: AngularFireAuth,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		console.log('JoinTeamPage.constructor()');
		try {
			this.teamId = this.route.snapshot.queryParamMap.get('id');
			this.pin = getPinFromUrl();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle URL query parameters');
		}
		if (this.teamId && this.pin) {
			const errMsg = 'Failed to get team information';
			this.teamService.getTeamJoinInfo(this.teamId, this.pin).subscribe({
				next: response => {
					console.log('join_team:', response);
					if (response) {
						this.team = response.team;
						this.invitedBy = response.invitedBy;
					} else {
						this.errorLogger.logError('EmptyResponse', errMsg);
					}
				},
				error: err => this.errorLogger.logError(err, errMsg),
			});
		}
		this.subscriptions.push(this.afAuth.idToken.subscribe(token => {
			this.isUserAuthenticated = !!token;
			if (this.isUserAuthenticated) {
				const m = location.hash.match(/[#&]action=(\w+)/);
				console.log('m:', m);
				if (m && this.teamId && this.pin) {
					switch (m[1]) {
						case 'join':
							this.joinTeam(this.teamId, this.pin);
							break;
						case 'refuse':
							this.refuseToJoinTeam(this.teamId, this.pin);
							break;
						default:
							console.warn('Unknown action:', m[1]);
					}
				}
			}
		}));
	}

	public ngOnDestroy(): void {
		this.unsubscribe();
	}

	public join(): void {
		const id = this.teamId;
		if (this.isUserAuthenticated) {
			this.joinTeam(id, this.pin);
		} else {
			this.navService.navigateToLogin({
					returnTo: 'join-team',
					queryParams: {id},
					fragment: `pin=${this.pin}&action=join`,
				},
			);
		}
	}

	public refuse(): void {
		const id = this.teamId;
		if (this.isUserAuthenticated) {
			this.refuseToJoinTeam(id, this.pin);
		} else {
			this.navService.navigateToLogin({
					returnTo: 'join-team',
					queryParams: {id},
					fragment: `pin=${this.pin}&action=refuse`,
				},
			);
		}
	}

	private unsubscribe(): void {
		this.subscriptions.forEach(s => s.unsubscribe());
		this.subscriptions = [];
	}

	private joinTeam(id: string, pin: number): void {
		this.joining = true;
		this.teamService.joinTeam(id, pin).subscribe({
			next: team => {
				this.navService.navigateToTeam(id, undefined, team);
			},
			error: err => {
				this.joining = false;
				this.errorLogger.logError(err, 'Failed to join team');
			},
		});
	}

	private refuseToJoinTeam(id: string, pin: number): void {
		this.refusing = true;
		this.teamService.refuseToJoinTeam(id, pin).subscribe({
			next: () => this.navService.navigateToTeams('forward'),
			error: err => {
				this.refusing = false;
				this.errorLogger.logError(err, 'Failed to join team');
			},
		});
	}

}
