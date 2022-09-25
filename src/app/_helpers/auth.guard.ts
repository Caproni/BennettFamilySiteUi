import { Injectable } from '@angular/core';
import { Router,  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from 'src/app/_services/login/login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

      constructor(
            private router: Router,
            private loginService: LoginService
      ) {}

      canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
            ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

            return this.loginService.getAuthorised();
      }

}
