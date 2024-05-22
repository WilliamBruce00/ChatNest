import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { OpenChatService } from '../../services/open-chat.service';
import { User } from '../../model/user.model';
import { TimediffPipe } from '../../pipes/timediff.pipe';
import { SocketService } from '../../services/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOnlineService } from '../../services/user-online.service';

@Component({
  selector: 'app-contact-item',
  standalone: true,
  imports: [TimediffPipe],
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.scss',
})
export class ContactItemComponent implements OnInit, AfterViewInit {
  @Input() data: any;

  online: string[] = [];

  constructor(
    private openChatService: OpenChatService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router,
    private userOnlineService: UserOnlineService
  ) {}

  ngOnInit(): void {
    this.userOnlineService.getData().subscribe({
      next: (value: any) => {
        this.online = value;
      },
    });
  }

  ngAfterViewInit(): void {}

  HandleOpenChat(): void {
    this.openChatService.setData({
      open: true,
      type: 'private',
      data: this.data,
    });
  }
}
