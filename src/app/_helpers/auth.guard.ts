import { Injectable } from '@angular/core';
import { Router,  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AccountService } from '../_services/account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

      constructor(
            private router: Router,
            private accountService: AccountService
      ) {}

      canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
            ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            const user = this.accountService.userValue;

            // If auth'd then continue
            if (user) {
                  return true;
            }

            // otherwise return to root
            this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
            return false;
      }

}
