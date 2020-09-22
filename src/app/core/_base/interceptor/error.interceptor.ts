// https://medium.com/angular-in-depth/top-10-ways-to-use-interceptors-in-angular-db450f8a62d6
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../../auth/services/auth.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    isRefreshingToken = false;
    constructor(
        private translate: TranslateService, private authService: AuthService, public router: Router
    ) { }

    // exceptional urls
    noAccessTokenUrls: string[] = ['customer/refreshtoken', 'customer/key'];
    noAppendUrl: string[] = ['.json', '.svg'];

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
            switch (err.status) {
                case 0:
                case 500:
                    const connectErrorMessage = this.translate.instant('ERROR.CONNECT_TO_SERVER_ERROR');
                    return throwError(new Error(connectErrorMessage));
                    break;
                case 401:
                    if (err.error.error.message !== undefined && err.error.error.message === 'jwt expired') {
                        // handle token expired
                        return this.handleTokenExpiredError(req, next);
                    }
                    else {
                        return throwError(err);
                    }
                    break;
                default:
                    return throwError(err);
            }
        }));
    }

    handleTokenExpiredError(req: HttpRequest<any>, next: HttpHandler) {
        // https://angular-academy.com/angular-jwt/#http-interceptor
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);
            return this.authService.refreshToken().pipe(
                switchMap(
                    (newToken: string) => {
                        if (newToken) {
                            this.tokenSubject.next(newToken);
                            // get current header
                            const newReqHeader = req.headers.set('Authorization', 'Bearer ' + newToken);
                            return next.handle(req.clone({ headers: newReqHeader }));
                        }
                    }
                ),
                catchError(
                    (errorRefreshToken) => {
                        // refreshToken expried => login
                        this.router.navigateByUrl('/auth/login');
                        return throwError(errorRefreshToken);
                    }
                ),
                finalize(() => {
                    this.isRefreshingToken = false;
                })
            );
        } else {
            this.isRefreshingToken = false;
            return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(() => {
                return next.handle(req);
            }));
        }
    }
}