import { throwError } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(value: any, type: string): string {
    const date = new Date(value);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    const minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();

    const action: any = {
      dd: day.toString(),
      mm: month.toString(),
      yyyy: year.toString(),
      'dd/mm/yyyy': `${day}/${month}/${year}`,
      'h:m': `${hour}:${minutes}`,
    };

    return action[type];
  }
}
