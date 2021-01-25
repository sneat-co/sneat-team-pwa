import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AvatarComponent} from './avatar/avatar.component';
import {InviteLinksComponent} from './invite-links/invite-links.component';
import {RetroMyItemsComponent} from './retro-my-items/retro-my-items.component';
import {RetroTimerComponent} from './retro-timer/retro-timer.component';

const components = [
	AvatarComponent,
	InviteLinksComponent,
	RetroMyItemsComponent,
	RetroTimerComponent,
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
	],
	declarations: components,
	exports: components,
})
export class CommonComponentsModule {
}
