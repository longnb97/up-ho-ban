import { Router } from '@angular/router';
// Angular
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Models
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }
    login(username: string, password: string): Observable<User> {
        return this.http.post<User>(environment.apiUrl + '/auth/login', { username, password })
            .pipe(
                map((res: any) => {
                    if (res.message === 'success') {
                        return res.result.user;
                    } else {
                        return throwError('Valid token not returned');
                    }
                }),
                catchError(loginErr => {
                    return throwError(loginErr);
                })
            );
    }

    getUserByToken(): Observable<User> {
        try {
            const userToken = localStorage.getItem(environment.authTokenUserKey);
            return of<User>(JSON.parse(userToken));
        } catch (err) {
            return null;
        }
    }

    register(user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
        return this.http.post<User>(environment.apiUrl + '/auth/register', user, { headers: httpHeaders })
            .pipe(
                map((res: any) => {
                    if (res.message === 'success') {
                        return res.result;
                    } else {
                        return throwError('Valid token not returned');
                    }
                }),
                catchError(loginErr => {
                    return throwError(loginErr);
                })
            );
    }

    refreshToken() {
        // get user profile
        const userWithOldToken = localStorage.getItem(environment.authTokenUserKey);
        if (userWithOldToken !== null) {
            const currentUser: User = JSON.parse(userWithOldToken);
            // get refresh token
            return this.http.post(environment.apiUrl + '/auth/refresh-token',
                { refreshToken: currentUser.refreshToken }
            ).pipe(map((tokenRes: any) => {
                if (tokenRes.message === 'success') {
                    currentUser.refreshToken = tokenRes.result.accessToken;
                    localStorage.setItem(environment.authTokenUserKey, JSON.stringify(currentUser));
                    return tokenRes.result.accessToken;
                } else {
                    // refreshToken expried
                    this.router.navigateByUrl('/auth/login');
                }
            }));
        } else {
            throwError(new Error('no user info'));
        }
    }


    signOut() {
        localStorage.removeItem(environment.authTokenUserKey);
        this.router.navigateByUrl('/auth/login');
    }

    clearUserStorage() {
        localStorage.removeItem(environment.authTokenUserKey);
    }

    requestPassword(email) {

    }

    /*
     * Handle Http operation that failed.
     * Let the app continue.
   *
   * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
