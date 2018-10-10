import {Component, EventEmitter, OnInit} from '@angular/core';
import {Room} from '../room/room.model';
import {User} from '../auth/user.model';
import {AuthService} from '../auth/auth.service';
import {NotifierService} from "angular-notifier";
import {RoomsService} from "../rooms/rooms.service";
import {RoomStatus} from "../room/room.status";

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class EditRoomComponent implements OnInit {
  room: Room;
  postRoom: Room;
  user: User;

  MAX_CHARACTERS = 120;
  charactersLeft = 120;

  enterKeyErrorMessage = 'The Enter Key is not supported';

  constructor(private authService: AuthService, private notify: NotifierService, private roomService: RoomsService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.room = this.roomService.getCurrentRoom();
    this.postRoom = {
      roomnumber: this.user.roomnumber,
      description: '',
      status: RoomStatus.DO_NOT_DISTURB,
    };
  }

  saveRoom(room: Room) {
    this.cleanDescription();
    this.roomService.updateRoom(this.postRoom).subscribe( (room: Room) => {
      this.notify.notify('success', 'Room Status Updated!');
    }, ((err => {
      this.notify.notify('error', err);
    })));
  }

  input(event) {
    if (event.key === 'Enter') {
      this.notify.notify('warning', this.enterKeyErrorMessage);
    } else {
      this.charactersLeft = this.MAX_CHARACTERS - this.postRoom.description.length;
    }
    this.cleanDescription()
  }

  cleanDescription() {
    this.postRoom.description = this.postRoom.description.replace('\n', '');
  }
}
