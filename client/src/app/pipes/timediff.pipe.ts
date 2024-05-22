import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timediff',
  standalone: true,
})
export class TimediffPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    const date = new Date(value);
    const current = new Date();
    const diff = current.getTime() - date.getTime();

    const timediff = {
      second: Math.floor(diff / 1000),
      minutes: Math.floor(diff / 1000 / 60),
      hour: Math.floor(diff / (1000 * 60 * 60)),
      day: Math.floor(diff / (1000 * 60 * 60 * 24)),
      month: Math.floor(diff / (1000 * 60 * 60 * 24 * 30)),
      year: Math.floor(diff / (1000 * 60 * 60 * 24 * 365)),
    };

    if (timediff.second < 60) {
      return timediff.second + ' giây trước';
    } else if (timediff.minutes < 60) {
      return timediff.minutes + ' phút truóc';
    } else if (timediff.hour < 24) {
      return timediff.hour + ' giờ trước';
    } else if (timediff.day < 30) {
      return timediff.day + ' ngày trước';
    } else if (timediff.month < 12) {
      return timediff.month + ' tháng truóc';
    } else {
      return timediff.year + ' năm trước';
    }
  }
}
