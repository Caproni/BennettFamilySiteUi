import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trunc'
})
export class TruncatePipe implements PipeTransform {

  transform(input?: string, chars?: number): string {
    if (!input || !chars) { return ''; }
    if (isNaN(chars)) { return input; }
    if (chars <= 0) { return ''; }
    if (input && input.length > chars) {
      input = input.substring(0, chars);

      const lastSpace = input.lastIndexOf(' ');
      // get last space
      if (lastSpace !== -1) {
        input = input.substr(0, lastSpace);
      }
      return input + '…';
    }
    return input;
  }

}
