import { environment } from './../../../../environments/environment';
import { AuthService } from './../../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    noAccessTokenUrls: string[] = ['customer/refreshtoken', 'customer/key'];
    noActiveLoader: string[] = [];

    constructor(
        public authService: AuthService,
        private spinner: NgxSpinnerService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const activeLoader = this.noActiveLoader.some(item => req.url.includes(item)) === true ? false : true;
        if (activeLoader) {
            this.spinner.show();
        }
        // check if url in no access token url list
        const shouldNotIncludeAccessToken = this.noAccessTokenUrls.some(item => req.url.includes(item));
        const user = JSON.parse(localStorage.getItem(environment.authTokenUserKey));
        if (user && shouldNotIncludeAccessToken === false) {
            const newRequest = req.clone({
                setHeaders: {
                    Authorization: environment.tokenType + user.accessToken,
                    Client_Id: environment.clientId
                }
            });
            return next.handle(newRequest).pipe(finalize(() => {
                if (activeLoader === true) {
                    this.spinner.hide();
                }
            }));
        } else {
            return next.handle(req).pipe(finalize(() => {
                if (activeLoader === true) {
                    this.spinner.hide();
                }
            }));
        }
    }
}
