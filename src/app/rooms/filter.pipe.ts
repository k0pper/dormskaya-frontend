import { Pipe, PipeTransform } from '@angular/core';
import {Room} from '../room/room.model';

@Pipe({
  name: 'filterRooms'
})
export class FilterRoomsPipe implements PipeTransform {
  transform(rooms: Room[], searchTerm: string): Room[] {
    if (!rooms) { return rooms; }
    return rooms.filter((room: Room) => {
      return room.roomnumber.toLowerCase().startsWith(searchTerm.toLowerCase());
    });
  }

}
