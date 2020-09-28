import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { JsonSchemaComponent } from './jsonschema.component';

// PrimeNg
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

// Services
import { MessagesUtilsService } from './../../../core/messages/messages-utils.service';
import { JsonSchemaService } from './../../../core/jsonschema/services/jsonschema.service';

// NgxPermissions
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

const routes: Routes = [
    {
        path: '',
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['canReadInvoices'],
                except: ['USER'],
                redirectTo: 'error/401'
            },
        },
        component: JsonSchemaComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NgxPermissionsModule.forChild(),
        DropdownModule,
        ButtonModule
    ],
    exports: [],
    declarations: [JsonSchemaComponent],
    providers: [JsonSchemaService, MessagesUtilsService],
})

export class JsonSchemaModule { }
