import { JsonSchemaService } from './../../../core/jsonschema/services/jsonschema.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var require: any;
@Component({
    selector: 'app-jsonschema-list',
    templateUrl: './jsonschema.component.html',
    styles: ['.btn { margin-right: 10px; }']
})

export class JsonSchemaComponent implements OnInit {
    jsonFileList: SelectItem[];
    schemaActionForm: FormGroup;
    currentJsonSchema: any;
    constructor(private fb: FormBuilder, private jsonSchemaService: JsonSchemaService) {
        // initialize form
        this.schemaActionForm = this.fb.group({
            jsonFile: ['', Validators.required]
        });

        this.jsonFileList = [
            { label: 'Library', value: 'library.json' }
        ];
    }

    ngOnInit() { }

    createSchema() {
        // get selected schema file
        console.log('selected schema:', this.schemaActionForm.value);
        const formValue = this.schemaActionForm.value;
        const jsonContent = require('./json/' + formValue.jsonFile);
        this.jsonSchemaService.addJsonSchemaModel(jsonContent);
    }

    updateSchema() {
        // get selected schema file
        console.log('selected schema:', this.schemaActionForm.value);
        const formValue = this.schemaActionForm.value;
        const jsonContent = require('./json/' + formValue.jsonFile);
        this.jsonSchemaService.updateJsonSchemaModel(jsonContent);
    }

    searchSchema() {
        this.jsonSchemaService.searchJsonSchemaModel();
    }

    showJson($event){
        this.currentJsonSchema  =  require('./json/' + $event.value);
    }
}
