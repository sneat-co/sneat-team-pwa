import {TestBed} from '@angular/core/testing';

import {AngularFireAuthGuardWithReturnUrl} from './auth-guard.service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';
import {RouterTestingModule} from '@angular/router/testing';

describe('AuthGuardService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			RouterTestingModule,
			AngularFireModule.initializeApp(environment.firebaseConfig),
		],
	}));

	it('should be created', () => {
		const service: AngularFireAuthGuardWithReturnUrl = TestBed.inject(AngularFireAuthGuardWithReturnUrl);
		expect(service).toBeTruthy();
	});
});
