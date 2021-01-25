import {Component, Inject} from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AngularFireAuth} from '@angular/fire/auth';
import {ErrorLogger, IErrorLogger} from '@sneat-team/ui-core';
import {NavService} from './services/nav.service';
import {Router} from '@angular/router';
import {AppCode, AppContextService} from './services/app-context.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent {
	public appPages = [
		{
			title: 'Teams',
			url: '/teams',
			icon: 'home'
		},
	];
	readonly sneatTeam = AppCode.sneatTeam as const;

	constructor(
		public readonly appContext: AppContextService,
		private readonly router: Router,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly platform: Platform,
		private readonly splashScreen: SplashScreen,
		private readonly statusBar: StatusBar,
		public readonly afAuth: AngularFireAuth,
		private readonly navController: NavController,
		public readonly navService: NavService,
	) {
		try {
			this.initializeApp();
		} catch (e) {
			errorLogger.logError(e, 'failed to initialize the app');
		}
	}

	private initializeApp() {
		console.log('initializeApp()');
		this.platform.ready().then(() => {
			try {
				this.statusBar.styleDefault();
				this.splashScreen.hide();
			} catch (e) {
				this.errorLogger.logError(e, 'Failed to process platform ready event');
			}
		});
	}
}
