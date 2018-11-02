import { Component, OnInit } from '@angular/core';
import {User} from '../auth/user.model';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  user: User;
  title = 'Dormskaya';
  version = '1.0.2';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authService.userLoggedIn.subscribe((user) => {
      this.user = user;
    });
    this.authService.userLoggedOut.subscribe(() => {
      this.user = undefined;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }


}
