// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Auth
import { AuthNoticeService } from './../../../../core/auth/auth-notice/auth-notice.service';

@Component({
	selector: 'kt-auth-notice',
	templateUrl: './auth-notice.component.html',
})
export class AuthNoticeComponent implements OnInit, OnDestroy {
	@Output() type: any;
	@Output() message: any = '';

	// Private properties
	private subscriptions: Subscription[] = [];

	constructor(public authNoticeService: AuthNoticeService, private cdr: ChangeDetectorRef) {
	}

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

	/**
	 * On init
	 */
	ngOnInit() {
		this.subscriptions.push(this.authNoticeService.onNoticeChanged$.subscribe(
			(notice: any) => {
				notice = Object.assign({}, {message: '', type: ''}, notice);
				this.message = notice.message;
				this.type = notice.type;
				this.cdr.markForCheck();
			}
		));
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
