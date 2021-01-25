import {Component} from '@angular/core';
import {UserService} from '../../services/user-service';
import {IUser} from '../../models/interfaces';
import {FormControl, Validators} from '@angular/forms';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.page.html',
	styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {

	public user: IUser;
	public userTitle = new FormControl('', [Validators.required]);

	edit = false;

	constructor(
		private readonly userService: UserService,
	) {
		userService.userRecord.subscribe(user => {
			console.log('UserProfilePage => user:', user);
			this.user = user?.data;
			this.userTitle.setValue(user?.data.title || '');
		})
	}

}
