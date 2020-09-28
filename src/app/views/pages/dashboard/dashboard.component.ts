import { ChangeDetectorRef } from '@angular/core';
// Angular
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	constructor(private cdr: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		this.cdr.detectChanges();
		this.cdr.markForCheck();
	}
}
