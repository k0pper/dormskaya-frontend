import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterFaq'
})
export class FaqFilterPipe implements PipeTransform {
  transform(faqEntries: Array<any>, searchTerm: string): Array<any> {
    return faqEntries;
  }

}
