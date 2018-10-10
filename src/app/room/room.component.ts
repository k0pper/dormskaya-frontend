import {Component, Input, OnInit} from '@angular/core';
import {Room} from './room.model';
import {User} from '../auth/user.model';
import {AuthService} from '../auth/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input()
  room: Room;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  getRoomColor() {
    if (this.room.status === 'PARTY') {
      return '#1caa00';
    } else if (this.room.status === 'DO NOT DISTURB') {
      return '#e00008';
    } else if (this.room.status === 'RELAXING') {
      return '#0067ff';
    } else if (this.room.status === 'DRINKING') {
      return '#ffaa00';
    }
  }

  isOwner(): boolean {
    if (this.authService.isLoggedIn()) {
      return this.authService.getUser().roomnumber === this.room.roomnumber;
    } else {
      return false;
    }
  }

  goToEditPageIfOwner() {
    if (this.isOwner()) {
      this.router.navigateByUrl('/editRoom');
    }
  }
}
