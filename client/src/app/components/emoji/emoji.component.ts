import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmojiService } from '../../services/emoji.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-emoji',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './emoji.component.html',
  styleUrl: './emoji.component.scss',
})
export class EmojiComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<string>();

  emoji: any[] = [];

  constructor(private emojiService: EmojiService) {}

  ngOnInit(): void {
    this.getEmoji();
  }

  getEmoji(): void {
    this.emojiService.findAll().subscribe({
      next: (value: any) => {
        this.emoji = value.slice(0, 200);
      },
    });
  }

  sendEmoji(data: string): void {
    this.dataEvent.emit(data);
  }
}
