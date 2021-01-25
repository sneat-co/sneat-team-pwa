import {Component, Inject, Input} from '@angular/core';
import {IRecord, ITeam} from '../../../models/interfaces';
import {IErrorLogger, ErrorLogger} from '@sneat-team/ui-core';
import {TeamService} from '../../../services/team.service';
import {RetroItemType} from '../../../retrospective/retrospective.service';
import {NavService} from '../../../services/nav.service';
import {NavController} from '@ionic/angular';
import {UserService} from '../../../services/user-service';

@Component({
	selector: 'app-team-retrospectives',
	templateUrl: './retrospectives.component.html',
	styleUrls: ['./retrospectives.component.scss'],
})
export class RetrospectivesComponent {

	@Input() public team: IRecord<ITeam>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamService: TeamService,
		private readonly userService: UserService, // TODO: replace with user context service
		private readonly navController: NavController,
		public readonly navService: NavService,
	) {
	}

	navigateToCurrentRetro(): void {
		console.log('navigateToCurrentRetro()');
		try {
			this.navService.navigateToRetrospective(this.navController, this.team, this.team?.data.active?.retrospective?.id || 'upcoming');
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to navigate to retrospective page');
		}
	}

	retroCount(itemType: RetroItemType): number {
		return this.team?.data?.upcomingRetro?.itemsByUserAndType?.[this.userService.currentUserId]?.[itemType] || 0;
	}
}
