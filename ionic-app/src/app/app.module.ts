import {ErrorHandler, Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AngularFireModule} from '@angular/fire';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAnalyticsModule} from '@angular/fire/analytics';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {TeamService} from './services/team.service';
import {UserService} from './services/user-service';
import {HttpClientModule} from '@angular/common/http';
import * as Sentry from '@sentry/browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularDndCoreModule} from '@angular-dnd/core';
import {defaultMultiBackendFactory} from '@angular-dnd/multi-backend';
import {FormsModule} from '@angular/forms';
import {SneatTeamAppModule} from './apps/sneat/sneat.team.app.module';
import {CodemirrorModule} from '@ctrl/ngx-codemirror'
import {ErrorLogger, ErrorLoggerService} from '@sneat-team/ui-core';

if (location.hostname !== 'localhost') {
	Sentry.init({
		dsn: 'https://1d322b8512f54bceaa1842a39ac2e947@sentry.io/2690837',
	});
}

@Injectable()
export class MyErrorHandler extends ErrorHandler {
	handleError(error) {
		super.handleError(error);
		// console.error('Error:', error);
		const eventId = Sentry.captureException(error.originalError || error);
		Sentry.showReportDialog({eventId});
	}
}

export const createDefaultMultiBackendFactory = () => defaultMultiBackendFactory;

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		HttpClientModule,
		BrowserModule,
		BrowserAnimationsModule,
		AngularDndCoreModule.forRoot({backendFactory: createDefaultMultiBackendFactory}),
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireAnalyticsModule,
		AngularFireAuthModule,
		AngularFirestoreModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		FormsModule,
		SneatTeamAppModule,
		CodemirrorModule,
	],
	providers: [
		{provide: ErrorHandler, useClass: MyErrorHandler},
		StatusBar,
		SplashScreen,
		AngularFireAuth,
		AngularFireAuthGuard,
		UserService,
		TeamService,
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		{
			provide: ErrorLogger,
			useClass: ErrorLoggerService,
		}
	],
	exports: [AngularFireAuthModule, AngularFirestoreModule],
	bootstrap: [AppComponent]
})
export class AppModule {
}
