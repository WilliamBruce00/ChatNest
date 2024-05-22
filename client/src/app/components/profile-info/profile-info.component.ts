import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent implements OnInit {
  @Input('user') user!: User;

  constructor() {}

  ngOnInit(): void {}
}
