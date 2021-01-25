import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {SneatTeamMenuComponent} from './sneat-team-menu.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../services/user-service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SneatTeamMenuComponent', () => {
	let component: SneatTeamMenuComponent;
	let fixture: ComponentFixture<SneatTeamMenuComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SneatTeamMenuComponent],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				UserService,
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SneatTeamMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
