import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TeamService} from '../../services/team.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user-service';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import {NavService} from '../../services/nav.service';
import {AnalyticsService} from '../../services/analytics.service';
import {BaseTeamPageDirective} from '../base-team-page-directive';
import {TeamContextService} from '../../services/team-context.service';

@Component({
	selector: 'app-team',
	templateUrl: './team.page.html',
	styleUrls: ['./team.page.scss'],
})
export class TeamPage extends BaseTeamPageDirective {

	public teamId?: string;

	constructor(
		readonly changeDetectorRef: ChangeDetectorRef,
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly navController: NavController,
		readonly teamService: TeamService,
		readonly teamContextService: TeamContextService,
		readonly userService: UserService,
		private readonly analyticsService: AnalyticsService,
		public readonly navService: NavService,
	) {
		super(changeDetectorRef, route, errorLogger, navController, teamService, teamContextService, userService);
		console.log('TeamPage.constructor()');
		this.trackTeamIdFromUrl('id');
	}

	// noinspection JSUnusedGlobalSymbols
	ionViewDidEnter() {
		this.analyticsService.setCurrentScreen('Team');
	}
}
