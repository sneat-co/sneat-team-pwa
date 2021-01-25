import {Inject, Injectable} from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import firebase from 'firebase';
import {ErrorLogger, IErrorLogger, ILogErrorOptions} from '@sneat-team/ui-core';
import AnalyticsCallOptions = firebase.analytics.AnalyticsCallOptions;

const logErrOptions: ILogErrorOptions = {show: false, feedback: false};

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly angularFireAnalytics: AngularFireAnalytics,
	) {
	}

	logEvent(eventName: string, eventParams?: { [key: string]: any; }, options?: AnalyticsCallOptions): void {
		this.angularFireAnalytics
			.logEvent(eventName, eventParams, options)
			.catch(err => this.errorLogger.logError(err, 'Failed to log analytics event', logErrOptions));
	}

	setCurrentScreen(
		screenName: string,
		options?: firebase.analytics.AnalyticsCallOptions
	): void {
		this.angularFireAnalytics
			.setCurrentScreen(screenName, options)
			.catch(err => this.errorLogger.logError(err, 'Failed to set analytics screen name', logErrOptions));
	}
}
