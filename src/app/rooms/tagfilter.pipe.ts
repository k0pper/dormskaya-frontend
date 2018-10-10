import { Pipe, PipeTransform } from '@angular/core';
import {Room} from '../room/room.model';

@Pipe({
  name: 'tagFilter'
})
export class TagFilterPipe implements PipeTransform {
  transform(rooms: Room[], tags: Array<String>): Room[] {
    if (rooms) {
      return rooms.filter((room) => {
        return tags.indexOf(room.status) > -1;
      });
    }
  }

}
