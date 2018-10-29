import {EventEmitter, Injectable} from '@angular/core';
import {User} from './user.model';
import {HttpClient} from '@angular/common/http';
import {ENDPOINT} from '../endpoint';

@Injectable()
export class AuthService {
  public userLoggedIn: EventEmitter<User> = new EventEmitter();
  public userLoggedOut: EventEmitter<User> = new EventEmitter();
  public userLoggedInFail: EventEmitter<String> = new EventEmitter();
  private signUpEndpoint = '/auth/signup/';
  private loginEndpoint = '/auth/login/';
  private user: User;

  constructor(private http: HttpClient) {
  }

  register(user: User) {
    return this.http.post(ENDPOINT + this.signUpEndpoint, user);
  }

  login(user: User) {
    const postUser = {
      name: user.name,
      password: user.password
    };
    return this.http.post(ENDPOINT + this.loginEndpoint, postUser);
  }

  logout() {
    if (this.isLoggedIn()) {
      const u = this.user;
      this.user = undefined;
      this.userLoggedOut.emit(u);
    }
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }


}
