import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MaterialModule} from './material/material.module';
import { NavComponent } from './nav/nav.component';
import { AuthComponent } from './auth/auth.component';
import {routing} from './app.routing';
import { RoomsComponent } from './rooms/rooms.component';
import {AuthService} from './auth/auth.service';
import { RoomComponent } from './room/room.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import {RoomsService} from "./rooms/rooms.service";
import {SortingRoomsPipe} from "./rooms/sort.pipe";
import {FilterRoomsPipe} from "./rooms/filter.pipe";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthGuard} from "./auth/auth.guard";
import {TagFilterPipe} from "./rooms/tagfilter.pipe";
import {CookieService} from "angular2-cookie/core";
import {MatProgressSpinnerModule} from "@angular/material";
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AuthComponent,
    RoomsComponent,
    RoomComponent,
    EditRoomComponent,
    SortingRoomsPipe,
    FilterRoomsPipe,
    TagFilterPipe,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NotifierModule.withConfig({
      animations: {
        show: {
          speed: 0,
        },
        hide: {
          speed: 0,
        }
      },
      behaviour: {
        stacking: 1,
      }
    }),
    routing
  ],
  providers: [AuthService, RoomsService, AuthGuard, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
