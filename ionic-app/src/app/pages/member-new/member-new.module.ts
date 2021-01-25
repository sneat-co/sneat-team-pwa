import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MemberNewPageRoutingModule} from './member-new-routing.module';
import {MemberNewPage} from './member-new.page';
import {CommonComponentsModule} from '../../components/common-components.module';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		MemberNewPageRoutingModule,
		CommonComponentsModule,
	],
	declarations: [
		MemberNewPage,
	],
})
export class MemberNewPageModule {
}
