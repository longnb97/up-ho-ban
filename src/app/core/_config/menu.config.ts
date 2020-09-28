// theme demo: https://preview.keenthemes.com/metronic/demo1/index.html
export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
				}
			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot',
				},
				{
					title: 'Jsonschema',
					root: true,
					icon: 'flaticon2-shield',
					page: '/jsonschema'
				},
				{
					title: 'error/401',
					root: true,
					icon: 'flaticon2-shield',
					page: '/error/401'
				},
				
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
