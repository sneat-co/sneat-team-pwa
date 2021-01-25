// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import {getTestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {ErrorLogger, IErrorLogger, ILogErrorOptions} from '@sneat-team/ui-core';
import {NgModule} from '@angular/core';

declare const require: any;

export class ErrorLoggerMock implements IErrorLogger {
	// @ts-ignore
	logError(e: any, message?: string, options?: ILogErrorOptions): void {
		//
	}

	logErrorHandler(message?: string, options?: ILogErrorOptions): (error: any) => void {
		return (e: any) => this.logError(e, message, options);
	}
}

@NgModule({
	imports: [
		BrowserDynamicTestingModule,
		// All repeated modules
	],
	providers: [
		{
			provide: ErrorLogger,
			useClass: ErrorLoggerMock,
		}
	],
})
export class TestModule {
}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
	TestModule,
	platformBrowserDynamicTesting(),
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
