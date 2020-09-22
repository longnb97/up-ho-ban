// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// Service
import { AuthService } from './../../../../../core/auth/_services/auth.service';
// Models
import { User } from './../../../../../core/auth/_models/user.model';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	constructor(
		private authService: AuthService
	) {
	}

	ngOnInit(): void {
		this.user$ = this.authService.getUserByToken();
	}

	/**
	 * Log out
	 */
	logout() {
		this.authService.signOut();
	}
}
