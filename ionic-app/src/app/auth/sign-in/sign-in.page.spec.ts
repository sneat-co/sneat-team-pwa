import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {SignInPage} from './sign-in.page';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';

describe('SignInPage', () => {
	let component: SignInPage;
	let fixture: ComponentFixture<SignInPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SignInPage],
			imports: [
				IonicModule.forRoot(),
				RouterTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SignInPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
