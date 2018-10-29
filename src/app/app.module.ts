/*
Modules
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material';
import {NotifierModule} from 'angular-notifier';
import {MaterialModule} from './material/material.module';

/*
Components
 */

import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {AuthComponent} from './auth/auth.component';
import {RoomsComponent} from './rooms/rooms.component';
import {RoomComponent} from './room/room.component';
import {EditRoomComponent} from './edit-room/edit-room.component';
import {InfoComponent} from './info/info.component';

/*
Services
 */

import {AuthService} from './auth/auth.service';
import {RoomsService} from './rooms/rooms.service';
import {CookieService} from 'angular2-cookie/core';

/*
Pipes
 */

import {SortingRoomsPipe} from './rooms/sort.pipe';
import {FilterRoomsPipe} from './rooms/filter.pipe';
import {TagFilterPipe} from './rooms/tagfilter.pipe';

/*
Guards and Routes
 */

import {routing} from './app.routing';
import {AuthGuard} from './auth/auth.guard';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        AuthComponent,
        RoomsComponent,
        RoomComponent,
        EditRoomComponent,
        InfoComponent,
        SortingRoomsPipe,
        FilterRoomsPipe,
        TagFilterPipe,
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
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
