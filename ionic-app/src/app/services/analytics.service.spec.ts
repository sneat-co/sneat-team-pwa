import {TestBed} from '@angular/core/testing';

import {AnalyticsService} from './analytics.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';

describe('AnalyticsService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			HttpClientTestingModule,
			AngularFireModule.initializeApp(environment.firebaseConfig),
		]
	}));

	it('should be created', () => {
		const service: AnalyticsService = TestBed.inject(AnalyticsService);
		expect(service).toBeTruthy();
	});
});
