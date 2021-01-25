import {Component} from '@angular/core';
import {AppCode, AppContextService} from '../../services/app-context.service';

@Component({
	selector: 'app-teams-page',
	templateUrl: 'teams-page.component.html',
})
export class TeamsPage {
	constructor(
		private readonly appContext: AppContextService,
	) {
	}

	ionViewDidEnter(): void {
		this.appContext.setCurrent(AppCode.sneatTeam);
	}
}
