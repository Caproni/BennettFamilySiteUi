import { Injectable } from '@angular/core';
import { Router,  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services/api/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

      constructor(
            private router: Router,
            private authenticationService: AuthenticationService
      ) {}

      canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
            ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

            // If auth'd then continue
            if (this.authenticationService.isAuth()) {
              return true;
            }

            // otherwise return to root
            this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
            return false;
      }

}
