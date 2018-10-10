import { Pipe, PipeTransform } from '@angular/core';
import {Room} from "../room/room.model";

@Pipe({
  name: 'sortRooms'
})
export class SortingRoomsPipe implements PipeTransform {

  transform(rooms: Room[]): Room[] {
    if (!rooms) return rooms;
    return rooms.sort((a: Room, b: Room) => {
      if (a.roomnumber > b.roomnumber) return 1;
      else if (b.roomnumber > a.roomnumber) return -1;
      else return 1
    })
  }

}
