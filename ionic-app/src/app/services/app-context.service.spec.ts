import {TestBed} from '@angular/core/testing';

import {AppContextService} from './app-context.service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';

describe('AppContextService', () => {
	let service: AppContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
		});
		service = TestBed.inject(AppContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
