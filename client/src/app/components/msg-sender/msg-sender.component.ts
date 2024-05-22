import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '../../pipes/date.pipe';

@Component({
  selector: 'app-msg-sender',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './msg-sender.component.html',
  styleUrl: './msg-sender.component.scss',
})
export class MsgSenderComponent implements OnInit {
  @Input() data: any;

  size: number[] = [];

  ngOnInit(): void {
    this.getSize();
  }

  async getSize() {
    const size = await Promise.all(
      this.data.message.message.split(',').map(async (item: string) => {
        return (await (await fetch(item)).blob()).size;
      })
    );

    this.size = size.map((item: number) => Math.floor(item / 1024));
  }
}
