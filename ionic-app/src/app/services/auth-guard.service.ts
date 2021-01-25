import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuthGuard, AuthPipeGenerator} from '@angular/fire/auth-guard';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'any',
})
export class AngularFireAuthGuardWithReturnUrl extends AngularFireAuthGuard {
	constructor(
		afAuth: AngularFireAuth,
		private readonly router2: Router,
	) {
		super(router2, afAuth);
	}

	public canActivate = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> =>
		super.canActivate(next, state).pipe(
			map(can => can
				|| this.router2.createUrlTree(['login'], {
					queryParams: {
						to: next.url.join('/'),
						...(next.queryParams || {})
					}
				}),
			),
		)
}

const canActivate = (authGuardPipe: AuthPipeGenerator) => ({
	canActivate: [AngularFireAuthGuardWithReturnUrl],
	data: {authGuardPipe},
});

export const redirectUnauthorizedToLoginWithReturnUrl = {}; // canActivate((): AuthPipe => loggedIn);
