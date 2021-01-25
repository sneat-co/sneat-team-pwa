import {NgModule} from '@angular/core';
import {SneatTeamMenuComponent} from './sneat-team-menu/sneat-team-menu.component';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@NgModule({
	declarations: [
		SneatTeamMenuComponent,
	],
	exports: [SneatTeamMenuComponent],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule,
	]
})
export class SneatTeamAppModule {

}
