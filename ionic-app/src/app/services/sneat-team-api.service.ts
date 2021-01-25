import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
	providedIn: 'root'
})
export class SneatTeamApiService {

	private baseUrl = 'https://api.sneat.team/v0/';

	private firebaseIdToken: string;

	constructor(
		private readonly httpClient: HttpClient,
		readonly afAuth: AngularFireAuth,
	) {
		afAuth.idToken.subscribe(idToken => {
			// console.log('SneatTeamApiService => new Firebase token:', idToken);
			this.setFirebaseToken(idToken);
		});
	}

	public setFirebaseToken(token: string): void {
		this.firebaseIdToken = token;
	}

	public post<T>(endpoint: string, body: any): Observable<T> {
		if (!this.firebaseIdToken) {
			return throwError('User is not authenticated - no Firebase ID token');
		}
		return this.httpClient
			.post<T>(
				this.baseUrl + endpoint,
				body,
				{
					headers: this.headers(),
				}
			);
	}

	public put<T>(endpoint: string, body: any): Observable<T> {
		if (!this.firebaseIdToken) {
			return throwError('User is not authenticated - no Firebase ID token');
		}
		return this.httpClient
			.put<T>(
				this.baseUrl + endpoint,
				body,
				{
					headers: this.headers(),
				}
			);
	}

	public get<T>(endpoint: string, params?: HttpParams): Observable<T> {
		if (!this.firebaseIdToken) {
			return throwError('User is not authenticated - no Firebase ID token');
		}
		return this.httpClient
			.get<T>(
				this.baseUrl + endpoint,
				{
					headers: this.headers(),
					params,
				}
			);
	}

	public getAsAnonymous<T>(endpoint: string, params?: HttpParams): Observable<T> {
		return this.httpClient
			.get<T>(
				this.baseUrl + endpoint,
				{
					params,
				}
			);
	}

	public delete<T>(endpoint: string, params: HttpParams): Observable<T> {
		if (!this.firebaseIdToken) {
			return throwError('User is not authenticated - no Firebase ID token');
		}
		return this.httpClient.delete<T>(this.baseUrl + endpoint, {
			params,
			headers: this.headers(),
		});
	}

	private headers(): HttpHeaders {
		return new HttpHeaders().append('X-Firebase-Id-Token', this.firebaseIdToken);
	}
}
