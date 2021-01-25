import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ScrumPageRoutingModule} from './scrum-routing.module';

import {ScrumPage} from './scrum-page/scrum.page';
import {ScrumCardComponent} from './components/scrum-card/scrum-card.component';
import {ScrumTasksComponent} from './components/scrum-tasks/scrum-tasks.component';
import {SrumQnaComponent} from './components/srum-qna/srum-qna.component';
import {ScrumBlockersComponent} from './components/scrum-blockers/scrum-blockers.component';
import {MetricsComponent} from './components/metrics/metrics.component';
import {ScrumTaskComponent} from './components/scrum-task/scrum-task.component';
import {TimerMemberButtonComponent} from '../components/timer/timer-member-button/timer-member-button.component';
import {TimerMeetingButtonComponent} from '../components/timer/timer-meeting-button/timer-meeting-button.component';
import {MyRetroItemsComponentModule} from '../retrospective/components/my-retro-items/my-retro-items.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		ScrumPageRoutingModule,
		MyRetroItemsComponentModule,
	],
	declarations: [
		ScrumPage,
		TimerMemberButtonComponent,
		TimerMeetingButtonComponent,
		ScrumCardComponent,
		ScrumTasksComponent,
		ScrumTaskComponent,
		SrumQnaComponent,
		ScrumBlockersComponent,
		MetricsComponent,
	]
})
export class ScrumPageModule {
}
