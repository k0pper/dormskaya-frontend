import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {RoomsComponent} from './rooms/rooms.component';
import {EditRoomComponent} from "./edit-room/edit-room.component";
import {AuthGuard} from "./auth/auth.guard";
import {InfoComponent} from "./info/info.component";

const appRoutes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard]},
  { path: 'editRoom', component: EditRoomComponent, canActivate: [AuthGuard]},
  { path: 'info', component: InfoComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(appRoutes);
