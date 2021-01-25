import {TestBed} from '@angular/core/testing';

import {SneatTeamApiService} from './sneat-team-api.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';

describe('SneatTeamApiService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			HttpClientTestingModule,
			AngularFireModule.initializeApp(environment.firebaseConfig),
		],
	}));

	it('should be created', () => {
		const service: SneatTeamApiService = TestBed.inject(SneatTeamApiService);
		expect(service).toBeTruthy();
	});
});
