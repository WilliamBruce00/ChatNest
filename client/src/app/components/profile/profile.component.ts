import { Component, OnInit } from '@angular/core';
import { OpenProfileService } from '../../services/open-profile.service';
import { User } from '../../model/user.model';
import { ProfileFriendComponent } from '../profile-friend/profile-friend.component';
import { ProfilePostComponent } from '../profile-post/profile-post.component';
import { ProfileInfoComponent } from '../profile-info/profile-info.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileFriendComponent, ProfilePostComponent, ProfileInfoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user!: User;
  page: string = 'information';

  constructor(private openProfileService: OpenProfileService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.openProfileService.getData().subscribe({
      next: (value: any) => {
        this.user = value.user;
      },
    });
  }

  handleCloseProfile(): void {
    this.openProfileService.setData({ open: false, user: null });
  }

  handleUpdatePage(page: string): void {
    this.page = page;
  }
}
