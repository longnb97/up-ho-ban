import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable()
export class JsonSchemaService {

    constructor(private http: HttpClient) { }

    addJsonSchemaModel(jsonData: any) {
        this.http.post(environment.apiUrl + '/json-schema/create', jsonData).subscribe((res: any) => {
            console.log(res);
        });
    }

    updateJsonSchemaModel(jsonData: any) {
        const paramsUpdate =
        {
            "query": {
                "_id": jsonData._id
            },
            "params": jsonData,
            "options": {
                "multi": false
            }
        };
        return this.http.put(environment.apiUrl + '/json-schema/update', paramsUpdate).subscribe((res: any) => {
            console.log(res);
        });
    }

    searchJsonSchemaModel() {
        return this.http.get(environment.apiUrl + '/json-schema/get').subscribe((res: any) => {
            console.log(res);
        });
    }
}