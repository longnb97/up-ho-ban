// Models
import { User } from './../../../../core/auth/_models/user.model';
// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { AuthService } from './../../../../core/auth/_services/auth.service';
import { AuthNoticeService } from './../../../../core/auth/auth-notice/auth-notice.service';

// Auth
import { Subject } from 'rxjs';
import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
	selector: 'kt-register',
	templateUrl: './register.component.html',
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {
	registerForm: FormGroup;
	loading = false;
	errors: any = [];

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	constructor(
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private authService: AuthService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.initRegisterForm();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	initRegisterForm() {
		this.registerForm = this.fb.group({
			fullName: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
				Validators.maxLength(320)
			]),
			],
			username: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			]),
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			confirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			agree: [false, Validators.compose([Validators.required])]
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});
	}

	submit() {
		const controls = this.registerForm.controls;

		// check form
		if (this.registerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		if (!controls['agree'].value) {
			// you must agree the terms and condition
			// checkbox cannot work inside mat-form-field https://github.com/angular/material2/issues/7891
			this.authNoticeService.setNotice('You must agree the terms and condition', 'danger');
			this.loading = false;
			return;
		}

		const _user: User = new User();
		_user.clear();
		_user.email = controls['email'].value;
		_user.username = controls['username'].value;
		_user.fullName = controls['fullName'].value;
		_user.password = controls['password'].value;

		this.registerForm.disable();
		this.authService.register(this.registerForm.value).subscribe(
			registerRes => {
				if (registerRes) {
					this.authNoticeService.setNotice('Register Success', 'success');
					this.registerForm.reset();
					setTimeout(() => {
						this.registerForm.enable();
						this.router.navigateByUrl('/auth/login');
					}, 1000);
				} else {
					this.authNoticeService.setNotice('Register Fail', 'danger');
				}
			},
			errLogin => {
				this.registerForm.enable();
				this.authNoticeService.setNotice(errLogin.error.error.message, 'danger');
			},
		)
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.registerForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
