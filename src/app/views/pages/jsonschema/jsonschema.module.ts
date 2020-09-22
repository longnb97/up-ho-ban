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

// Libs

const routes: Routes = [
    {
        path: '',
        component: JsonSchemaComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        DropdownModule,
        ButtonModule
    ],
    exports: [],
    declarations: [JsonSchemaComponent],
    providers: [JsonSchemaService, MessagesUtilsService],
})

export class JsonSchemaModule { }
