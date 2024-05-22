import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio!: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  playAudio(url: string): void {
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }

  stopAudio(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
