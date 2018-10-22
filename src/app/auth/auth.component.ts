import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {User} from './user.model';
import {NotifierService} from 'angular-notifier';
import {HttpResponse} from '@angular/common/http';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  user: User;
  loginCredentials;
  registerCredentials;
  rememberMe: boolean;
  loginLoading = false;
  signupLoading = false;

  userLoggedInFail;
  userLoggedIn;
  userLoggedOut;

  SPbRoomAppUsername = 'SPbRoomAppUsername';
  SPbRoomAppPassword = 'SPbRoomAppPassword';
  SPbRoomAppRememberme = 'SPbRoomAppRememberme';

  errors: String[] = [];

  constructor(private authService: AuthService, private notifierService: NotifierService, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscribeToEvents();
    this.initializeModels();
    this.getCookiesIfAvailable();
  }

  login() {
    this.loginLoading = true;
    this.authService.login(this.loginCredentials).subscribe((response: HttpResponse<any>) => {
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
      user = {
        name: this.loginCredentials.name,
        password: this.loginCredentials.password,
        // Comes back from backend
        roomnumber: response['roomnumber']
      };
      this.loginLoading = false;
    }
    this.authService.setUser(user);

    this.setCookies();

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

  /*
  Cookies
   */

  setCookies() {
    if (this.rememberMe) {
      this.cookieService.put(this.SPbRoomAppUsername, this.loginCredentials.name);
      this.cookieService.put(this.SPbRoomAppPassword, this.loginCredentials.password);
    } else {
      this.deleteCookies();
    }
    this.cookieService.put(this.SPbRoomAppRememberme, this.rememberMe + '');
  }

  deleteCookies() {
    this.cookieService.remove(this.SPbRoomAppUsername);
    this.cookieService.remove(this.SPbRoomAppPassword);
  }

  getCookiesIfAvailable() {
    const username = this.cookieService.get(this.SPbRoomAppUsername);
    const password = this.cookieService.get(this.SPbRoomAppPassword);
    const rememberMe = this.cookieService.get(this.SPbRoomAppRememberme);

    if (username && password) {
      this.loginCredentials.name = username;
      this.loginCredentials.password = password;
    } else {
      this.loginCredentials.name = '';
      this.loginCredentials.password = '';
    }

    if (rememberMe) {
      this.rememberMe = true;
    } else {
      this.rememberMe = false;
    }
  }
}
