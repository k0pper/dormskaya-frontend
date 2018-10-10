import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Room} from "../room/room.model";
import {Observable} from "rxjs/index";

@Injectable()
export class RoomsService {
  rooms: Room[];
  roomUpdated: EventEmitter<Room> = new EventEmitter();

  constructor(private http: HttpClient) {

  }

  url = 'http://localhost:8000';
  allRooms = '/room/all';
  postRoom = '/room/update';

  getRooms() {
    return this.http.get(this.url + this.allRooms);
  }

  updateRoom(room: Room) {
    return this.http.post(this.url + this.postRoom, room);
  }

  getCurrentRoom(): Room {
    return new Room();
  }

}
