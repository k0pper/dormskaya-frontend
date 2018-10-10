import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {NotifierService} from 'angular-notifier';

@Injectable()
export class AuthGuard implements CanActivate {
  private pleaseLogIn = 'Please log into your account';

  constructor(private auth: AuthService, private router: Router, private notifier: NotifierService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isLoggedIn = this.auth.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigateByUrl('/login');
      this.notifier.notify('error', this.pleaseLogIn);
    }
    return isLoggedIn;
  }
}
