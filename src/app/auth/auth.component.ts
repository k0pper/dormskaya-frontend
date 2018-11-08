import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {User} from './user.model';
import {NotifierService} from 'angular-notifier';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    user: User;
    loginCredentials;
    registerCredentials;
    loginLoading = false;
    signupLoading = false;
    keepMeLoggedIn = true;

    userLoggedInFail;
    userLoggedIn;
    userLoggedOut;

    SPbRoomAppUsername: string;
    SPbRoomAppPassword: string;
    SPbRoomAppRememberme: string;

    cookie;

    errors: String[] = [];

    constructor(private authService: AuthService, private notifierService: NotifierService, private router: Router,
                private cookieService: CookieService) {
    }

    ngOnInit() {
        this.user = this.authService.getUser();
        this.subscribeToEvents();
        this.initializeModels();
        this.SPbRoomAppUsername = 'SPbRoomAppUsername';
        this.SPbRoomAppPassword = 'SPbRoomAppPassword';
        this.SPbRoomAppRememberme = 'SPbRoomAppRememberme';
        this.setCookieObjectFromCookie();
        if (this.hasCookieObject()) {
            this.loginCredentials.name = this.cookie.name;
            this.loginCredentials.password = this.cookie.password;
            this.login(this.cookie);
        } else {
            this.deleteAllCookies();
        }
        if (this.cookie.rememberMe) {
            this.keepMeLoggedIn = JSON.parse(this.cookie.rememberMe);
        }
    }

    login(user) {
        this.loginLoading = true;
        this.authService.login(user).subscribe((response: HttpResponse<any>) => {
            this.handleSuccessLogin(response);
        }, ((err) => {
            this.handleFailedLogin(err);
        }));

    }

    register() {
        this.signupLoading = true;
        const newUser: User = {
            name: this.registerCredentials.name,
            roomnumber: this.registerCredentials.roomnumber,
            password: this.registerCredentials.password
        };
        this.authService.register(newUser).subscribe((response: HttpResponse<any>) => {
            this.authService.login(newUser).subscribe((response2: HttpResponse<any>) => {
                this.handleSuccessLogin(response2, true);
            }, ((err) => {
                this.handleFailedLogin(err);
            }));
        }, (failedRegistration) => {
            this.handleFailedLogin(failedRegistration);
        });
    }

    private handleSuccessLogin(response: HttpResponse<any>, isRegistration?: boolean) {
        let user: User;
        if (isRegistration) {
            user = {
                name: this.registerCredentials.name,
                password: this.registerCredentials.password,
                // Comes back from backend
                roomnumber: response['roomnumber']
            };
            this.signupLoading = false;
        } else {
            if (this.keepMeLoggedIn) {
                this.saveCredentialsCookies();
            }
            user = {
                name: this.loginCredentials.name,
                password: this.loginCredentials.password,
                roomnumber: response['roomnumber']
            };
            this.loginLoading = false;
        }
        this.authService.setUser(user);
        this.router.navigateByUrl('/rooms');

        this.clearLoginCredentials();
        this.clearRegisterCredentials();

        this.authService.userLoggedIn.emit(user);
    }

    private handleFailedLogin(response: HttpResponse<any>) {
        this.loginLoading = false;
        this.signupLoading = false;
        this.authService.userLoggedInFail.emit(response['error']);
    }

    private initializeModels() {
        this.loginCredentials = {
            name: '',
            password: '',
        };
        this.registerCredentials = {
            name: '',
            roomnumber: '',
            password: '',
            passwordRepeat: '',
        };
    }

    private subscribeToEvents() {
        this.userLoggedInFail = this.authService.userLoggedInFail.subscribe((errMsg) => {
            this.notifierService.notify('error', errMsg);
        });
        this.userLoggedIn = this.authService.userLoggedIn.subscribe((user: User) => {
            this.user = user;
            this.authService.setUser(this.user);
            this.notifierService.notify('success', user.name + ' logged in successfully');
        });
        this.userLoggedOut = this.authService.userLoggedOut.subscribe((user: User) => {
            this.user = undefined;
            this.deleteAllCookies();
            this.notifierService.notify('warning', user.name + ' logged out successfully');
        });
    }

    clearLoginCredentials() {
        this.loginCredentials = {
            name: '',
            password: '',
        };
    }

    clearRegisterCredentials() {
        this.registerCredentials = {
            name: '',
            password: '',
            roomnumber: '',
            passwordRepeat: ''
        };
    }

    loginNameIsValid() {
        return this.loginCredentials.name.length > 0;
    }

    loginPasswordIsValid() {
        return this.loginCredentials.password.length > 0;
    }

    registerNameIsValid() {
        const isValid = this.registerCredentials.name.length > 3;
        const errorMsg = 'Username must be at least 4 characters long';
        if (isValid) {
            this.removeErrorMessage(errorMsg);
        } else {
            this.addErrorMessage(errorMsg);
        }
        return isValid;
    }

    /*
    Validation functions
     */

    roomNumberIsValid() {
        const regexp = new RegExp('^\\d{3}[a|b]{1}$');
        const isValid = regexp.test(this.registerCredentials.roomnumber.toLowerCase());
        const errorMsg = 'Roomnumber must be 3 digits and an \'a\' or \'b\' e.g. 500b';
        if (isValid) {
            this.removeErrorMessage(errorMsg);
        } else {
            this.addErrorMessage(errorMsg);
        }
        return isValid;
    }

    passwordStrengthIsValid() {
        const isValid = this.registerCredentials.password.length > 4;
        const errorMsg = 'Password must have at least 5 characters';
        if (isValid) {
            this.removeErrorMessage(errorMsg);
        } else {
            this.addErrorMessage(errorMsg);
        }
        return isValid;
    }

    passwordRepeatIsValid() {
        const isValid = this.registerCredentials.passwordRepeat === this.registerCredentials.password;
        const errorMsg = 'Passwords must match';
        if (isValid) {
            this.removeErrorMessage(errorMsg);
        } else {
            this.addErrorMessage(errorMsg);
        }
        return isValid;
    }

    loginFormIsValid() {
        return this.loginNameIsValid() && this.loginPasswordIsValid();
    }

    registerFormIsValid() {
        return this.registerNameIsValid() && this.roomNumberIsValid() && this.passwordStrengthIsValid() && this.passwordRepeatIsValid();
    }

    removeErrorMessage(errorMsg) {
        this.errors = this.errors.filter((err: String) => {
            return err !== errorMsg;
        });
    }

    addErrorMessage(errorMsg) {
        if (!this.errors.some(((err: String) => err === errorMsg))) {
            this.errors.push(errorMsg);
        }
    }

    formKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.login(this.loginCredentials);
        }
    }

    /*
    Cookies
     */

    private saveCredentialsCookies() {
        this.cookieService.set(this.SPbRoomAppUsername, this.loginCredentials.name);
        this.cookieService.set(this.SPbRoomAppPassword, this.loginCredentials.password);
        this.cookieService.set(this.SPbRoomAppRememberme, 'true');
    }

    private deleteAllCookies() {
        this.cookieService.delete(this.SPbRoomAppUsername);
        this.cookieService.delete(this.SPbRoomAppPassword);
        this.cookieService.delete(this.SPbRoomAppRememberme);
    }

    private hasCookieObject() {
        return this.cookie.name && this.cookie.password;
    }

    private setCookieObjectFromCookie() {
        this.cookie = {
            name: this.cookieService.get(this.SPbRoomAppUsername),
            password: this.cookieService.get(this.SPbRoomAppPassword),
            rememberMe: this.cookieService.get(this.SPbRoomAppRememberme)
        };
    }

}
