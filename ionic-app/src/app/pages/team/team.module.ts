import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TeamPageRoutingModule} from './team-routing.module';
import {TeamPage} from './team.page';
import {MembersListComponent} from '../../components/members-list/members-list.component';
import {MetricsComponent} from './metrics/metrics.component';
import {RetrospectivesComponent} from './retrospectives/retrospectives.component';
import {ScrumsComponent} from './scrums/scrums.component';
import {MembersComponent} from './members/members.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TeamPageRoutingModule,
	],
	declarations: [TeamPage, MembersListComponent, MetricsComponent, RetrospectivesComponent, ScrumsComponent, MembersComponent]
})
export class TeamPageModule {
}
