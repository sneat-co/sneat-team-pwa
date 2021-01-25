import {Component, Inject, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {IErrorLogger, ErrorLogger} from '@sneat-team/ui-core';
import {NavService} from '../../services/nav.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.page.html',
	styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

	public email: string;
	public isSigning: boolean;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly afAuth: AngularFireAuth,
		private readonly navService: NavService,
	) {
	}

	ngOnInit() {
		this.signInFromLink();
	}

	signInFromLink(): void {
		// Confirm the link is a sign-in with email link.
		this.afAuth.isSignInWithEmailLink(window.location.href).then(signedIn => {
			if (signedIn) {
				// Additional state parameters can also be passed via URL.
				// This can be used to continue the user's intended action before triggering
				// the sign-in operation.
				// Get the email if available. This should be available if the user completes
				// the flow on the same device where they started it.
				this.email = window.localStorage.getItem('emailForSignIn');
				if (this.email) {
					this.signInWithEmail();
				}
			}
		});
	}

	public signInWithEmail(): void {
		this.isSigning = true;
		// The client SDK will parse the code from the link for you.
		this.afAuth.signInWithEmailLink(this.email, window.location.href)
			.then(() => {
				// You can access the new user via result.user
				// Additional user info profile not available via:
				// result.additionalUserInfo.profile == null
				// You can check if the user is new or existing:
				// result.additionalUserInfo.isNewUser
				this.navService.navigateToTeams('forward');
			})
			.catch(err => {
				this.isSigning = false;
				this.errorLogger.logError(err, 'Failed to sign in with email link');
			});
	}

	goLogin(): void {
		this.navService.navigateToLogin();
	}
}
