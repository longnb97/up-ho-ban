import { LoaderService, LoadingOverlayRef } from './../layout/services/loader.service';
import { AuthService } from './../../auth/services/auth.service';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    noAccessTokenUrls: string[] = ['customer/refreshtoken', 'customer/key'];
    noActiveLoader: string[] = [];

    constructor(
        public loaderService: LoaderService,
        public authService: AuthService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let loadingRef: LoadingOverlayRef;
        const activeLoader = this.noActiveLoader.some(item => req.url.includes(item)) === true ? false : true;
        if (activeLoader) {
            Promise.resolve(null).then(() => loadingRef = this.loaderService.open());
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
                    loadingRef.close();
                }
            }));
        } else {
            return next.handle(req).pipe(finalize(() => {
                if (activeLoader === true) {
                    loadingRef.close();
                }
            }));
        }
    }
}
