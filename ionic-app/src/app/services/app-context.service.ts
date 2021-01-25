import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


// eslint-disable-next-line no-shadow
export enum AppCode {
	sneatTeam = 'sneat',
	// dataTug = 'datatug',
}

// export const AppCodes = [AppCode.SneatTeam, AppCode.DataTug] as const;
// type AppCodeType = typeof AppCodes[number];

export interface AppContext {
	readonly appCode: AppCode;
}

@Injectable({
	providedIn: 'root'
})
export class AppContextService {

	private current = new BehaviorSubject<AppContext | undefined>(undefined);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public readonly currentApp = this.current.asObservable();

	constructor() {
		if (location.hostname.indexOf('datatug') >= 0 || location.pathname.indexOf('datatug') >= 0) {
			// this.setCurrent(AppCode.dataTug);
		} else {
			this.setCurrent(AppCode.sneatTeam);
		}
	}

	public setCurrent(appCode: AppCode): void {
		if (this.current.value?.appCode !== appCode) {
			this.current.next({appCode});
		}
	}
}
