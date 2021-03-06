import {Component, OnInit} from '@angular/core';
import {RoomsService} from './rooms.service';
import {Room} from '../room/room.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Room[];
  searchTerm = '';
  loading = true;

  filter = {
    doNotDisturb: true,
    party: true,
    relaxing: true,
    drinking: true
  };

  tagArray = [];


  constructor(private roomsService: RoomsService) {
  }

  ngOnInit() {
    this.convertFilterToArray();
    this.subscribeToRoomEvents();
    this.getRooms();
  }

  getRooms() {
    this.loading = true;
    this.roomsService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
      this.loading = false;
    });
  }

  convertFilterToArray() {
    const tagArray: Array<String> = [];

    if (this.filter.doNotDisturb) {
      tagArray.push('DO NOT DISTURB');
    }
    if (this.filter.party) {
      tagArray.push('PARTY');
    }
    if (this.filter.relaxing) {
      tagArray.push('RELAXING');
    }
    if (this.filter.drinking) {
      tagArray.push('DRINKING');
    }
    this.tagArray = tagArray;
  }

  hasFilter(): boolean {
    return (this.searchTerm.length > 0 || (this.filter.drinking || this.filter.doNotDisturb || this.filter.relaxing || this.filter.party));
  }

  private subscribeToRoomEvents() {
    this.roomsService.roomUpdated.subscribe((room: Room) => {
      this.rooms[this.rooms.indexOf(room)] = room;
    });
  }

}
