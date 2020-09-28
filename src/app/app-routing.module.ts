// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component'; // defined in ThemeModule
import { WithoutPermissionComponent } from './views/pages/components/without-permission/without-permission.component'; // defined in ThemeModule

// Auth
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
	{ path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule) },

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('app/views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'jsonschema',
				loadChildren: () => import('app/views/pages/jsonschema/jsonschema.module').then(m => m.JsonSchemaModule)
			},
			{
				path: 'error/401',
				component: WithoutPermissionComponent,
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{
				path: 'error/404',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 404,
					'title': '404... Not Found',
					'desc': 'The requested URL [URL] was not found on this server'
				}
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: '**', redirectTo: 'error/404', pathMatch: 'full' }
		]
	},
	{ path: '**', redirectTo: 'error/404', pathMatch: 'full' },
];

@NgModule({
	declarations: [
	],
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
