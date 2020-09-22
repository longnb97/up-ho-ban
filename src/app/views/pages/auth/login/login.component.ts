// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Service
import { AuthService } from './../../../../core/auth/services/auth.service';
import { AuthNoticeService } from './../../../../core/auth/auth-notice/auth-notice.service';
// environment
import { environment } from './../../../../../environments/environment.prod';

const DEMO_PARAMS = {
	EMAIL: 'quan1234@gmail.com',
	PASSWORD: '1234'
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	constructor(
		private router: Router,
		private authService: AuthService,
		private translate: TranslateService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private authNoticeService: AuthNoticeService
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params['returnUrl'] || '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	initLoginForm() {
		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>${DEMO_PARAMS.EMAIL}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'info');
		}

		this.loginForm = this.fb.group({
			username: [DEMO_PARAMS.EMAIL, Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320)
			])
			],
			password: [DEMO_PARAMS.PASSWORD, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		this.loading = true;

		this.authService.login(controls['username'].value, controls['password'].value).subscribe(
			loginRes => {
				this.loginForm.enable();
				if (loginRes) {
					localStorage.setItem( environment.authTokenUserKey, JSON.stringify(loginRes) );
					this.authNoticeService.setNotice('Login Success', 'success');
					setTimeout(() => {
						this.loginForm.enable();
						console.log(this.returnUrl)
						this.router.navigateByUrl(this.returnUrl);
					}, 1000);
				} else {
					this.authNoticeService.setNotice('Login Fail', 'error');
				}
			},
			errLogin => {
				this.loginForm.enable();
				this.authNoticeService.setNotice(errLogin.error.error.statusCode + ' : ' + errLogin.error.error.message, 'error');
			},
		)
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

}
