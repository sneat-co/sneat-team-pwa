import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TestBed, waitForAsync} from '@angular/core/testing';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {RouterTestingModule} from '@angular/router/testing';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {CommonModule} from '@angular/common';

class MockBackButton {
	subscribeWithPriority: jasmine.Spy<any>;
}

class MockPlatform { // Taken from: https://forum.ionicframework.com/t/ionic-4-angular-8-test-failure/181245/6
	ready: jasmine.Spy<any>;
	backButton: any;
}

describe('AppComponent', () => {

	let
		mockBackButton,
		mockPlatform,
		statusBarSpy,
		splashScreenSpy
		// platformSpy,
	;
	const platformReadySpy = jasmine.createSpy().and.returnValue(Promise.resolve());

	beforeEach(waitForAsync(() => {
		mockBackButton = new MockBackButton();
		// noinspection JSUnusedLocalSymbols
		mockBackButton.subscribeWithPriority = jasmine.createSpy(
			'subscribeWithPriority',
			(priority, fn) => {
			},
		);
		mockPlatform = new MockPlatform();
		mockPlatform.backButton = mockBackButton;
		mockPlatform.ready = platformReadySpy;

		statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
		splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
		// platformSpy = jasmine.createSpyObj('Platform', {ready: platformReadySpy});

		TestBed.configureTestingModule({
			declarations: [AppComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{provide: StatusBar, useValue: statusBarSpy},
				{provide: SplashScreen, useValue: splashScreenSpy},
				{provide: Platform, useValue: mockPlatform},
			],
			imports: [
				CommonModule,
				RouterTestingModule.withRoutes([]),
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
		}).compileComponents();
	}));

	it('should create the app', async () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it('should initialize the app', async () => {
		TestBed.createComponent(AppComponent);
		expect(mockPlatform.ready).toHaveBeenCalled();
		await platformReadySpy;
		expect(statusBarSpy.styleDefault).toHaveBeenCalled();
		expect(splashScreenSpy.hide).toHaveBeenCalled();
	});

	// it('should have menu labels', async () => {
	// 	const fixture = await TestBed.createComponent(AppComponent);
	// 	await fixture.detectChanges();
	// 	const app = fixture.nativeElement;
	// 	const menuItems = app.querySelectorAll('ion-label');
	// 	expect(menuItems.length).toEqual(2);
	// 	expect(menuItems[0].textContent).toContain('Home');
	// 	expect(menuItems[1].textContent).toContain('List');
	// });
	//
	// it('should have urls', async () => {
	// 	const fixture = await TestBed.createComponent(AppComponent);
	// 	await fixture.detectChanges();
	// 	const app = fixture.nativeElement;
	// 	const menuItems = app.querySelectorAll('ion-item');
	// 	expect(menuItems.length).toEqual(2);
	// 	expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
	// 	expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/list');
	// });

});
