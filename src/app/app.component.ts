// Angular + rxjs
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Layout
import { LayoutConfigService, SplashScreenService, TranslationService } from './core/_base/layout';
// language list
import { locale as enLang } from './core/_config/i18n/en';
import { locale as viLang } from './core/_config/i18n/vi';
import { locale as esLang } from './core/_config/i18n/es';
import { locale as jpLang } from './core/_config/i18n/jp';
import { locale as deLang } from './core/_config/i18n/de';
import { locale as frLang } from './core/_config/i18n/fr';

// Permissions + role
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[kt-root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
	// Public properties
	title = 'Metronic';
	loader: boolean;
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 * @param layoutConfigService: LayoutCongifService
	 * @param splashScreenService: SplashScreenService
	 */
	constructor(
		private translationService: TranslationService,
		private router: Router,
		private layoutConfigService: LayoutConfigService,
		private splashScreenService: SplashScreenService,
		private permissionsService: NgxPermissionsService,
		private rolesService: NgxRolesService
	) {

		// register translations
		this.translationService.loadTranslations(enLang, viLang, esLang, jpLang, deLang, frLang);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		// enable/disable loader
		this.loader = this.layoutConfigService.getConfig('loader.enabled');

		const routerSubscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				// hide splash screen
				this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);

				// to display back the body content
				setTimeout(() => {
					document.body.classList.add('kt-page--loaded');
				}, 500);
			}
		});
		this.unsubscribe.push(routerSubscription);

		// load translate
		this.translationService.setLanguage(this.translationService.getSelectedLanguage());

		// loadRoleWithPermission
		this.loadRoleWithPermission();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}


	loadRoleWithPermission() {
		this.rolesService.flushRoles();
		this.permissionsService.flushPermissions();

		// load permission
		let userPermission = ['listMeeting', 'seeMeeting'];
		let adminPermission = ['canReadInvoices', 'canEditInvoices'];


		// this.permissionsService.loadPermissions(userPermission);
		// this.rolesService.addRoles({'USER': userPermission});


		this.permissionsService.loadPermissions(adminPermission);
		this.rolesService.addRoles({'ADMIN': adminPermission});

		/*
			Removing ALL roles
			this.rolesService.flushRoles();

			Removing ONE roles
			this.rolesService.removeRole('USER');
		*/

		/*
			Retrieving permissions
			Case 1:
			let roles = this.rolesService.getRoles();
			
			Case 2:
			this.rolesService.roles$.subscribe((data) => {
				console.log(data);
			})		
		*/
	}
}
