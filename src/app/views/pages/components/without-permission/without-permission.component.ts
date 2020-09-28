import { Component, OnInit } from '@angular/core';


declare var require: any;
@Component({
    selector: 'kt-without-permission',
    templateUrl: './without-permission.component.html',
    styles: ['.btn { margin-right: 10px; }']
})

export class WithoutPermissionComponent implements OnInit {
    constructor() {
       
    }

    ngOnInit() { }
}
