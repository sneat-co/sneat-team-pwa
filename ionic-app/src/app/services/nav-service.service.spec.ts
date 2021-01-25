import {TestBed} from '@angular/core/testing';

import {NavService} from './nav.service';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';

describe('NavService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			RouterTestingModule,
			AngularFireModule.initializeApp(environment.firebaseConfig),
		],
	}));

	it('should be created', () => {
		const service: NavService = TestBed.inject(NavService);
		expect(service).toBeTruthy();
	});
});
