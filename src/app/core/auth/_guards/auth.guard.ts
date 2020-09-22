// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
// Models
import { User } from './../_models/user.model';
// Services
import { AuthService } from './../_services/auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return new Observable(observer => {

            this.authService.getUserByToken().subscribe(
                user => {
                    console.log(user)
                    if (user) {
                        observer.next(true);
                    } else {
                        this.router.navigateByUrl('/auth/login');
                    }
                },
                error => {
                    this.router.navigateByUrl('/auth/login');
                });
        });
    }
}
