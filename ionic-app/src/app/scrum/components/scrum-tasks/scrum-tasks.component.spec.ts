import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ScrumTasksComponent} from './scrum-tasks.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../../environments/environment';
import {TeamService} from '../../../services/team.service';
import {UserService} from '../../../services/user-service';

describe('ScrumTasksComponent', () => {
	let component: ScrumTasksComponent;
	let fixture: ComponentFixture<ScrumTasksComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ScrumTasksComponent],
			imports: [
				IonicModule.forRoot(),
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [
				TeamService,
				UserService,
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ScrumTasksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
