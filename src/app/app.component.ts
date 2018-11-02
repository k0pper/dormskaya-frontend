import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    constructor(private auth: AuthService, private cookieService: CookieService, private router: Router) {

    }

    ngOnInit() {
        if (this.cookieService.get('SPbRoomAppUsername') && this.cookieService.get('SPbRoomAppPassword')) {
            this.router.navigateByUrl('/login');
        }
    }

    ngOnDestroy() {
        this.auth.logout();
    }
}
