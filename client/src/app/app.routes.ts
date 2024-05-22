import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OtpComponent } from './pages/otp/otp.component';
import { otpGuard } from './guards/otp.guard';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { videocallGuard } from './guards/videocall.guard';
import { GroupComponent } from './pages/home/group/group.component';
import { ContactComponent } from './pages/home/contact/contact.component';
import { SearchComponent } from './pages/home/search/search.component';
import { FriendComponent } from './pages/home/friend/friend.component';
import { RequestComponent } from './pages/home/friend/request/request.component';
import { ListComponent } from './pages/home/friend/list/list.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home Page',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ContactComponent,
      },
      {
        path: 'group',
        title: 'Group Page',
        component: GroupComponent,
      },
      {
        path: 'search/:keyword',
        title: 'Search Page',
        component: SearchComponent,
      },
      {
        path: 'friend',
        title: 'Friend Page',
        component: FriendComponent,
        children: [
          {
            path: 'request',
            component: RequestComponent,
            title: 'Friend Request Page',
          },
          {
            path: 'list',
            component: ListComponent,
            title: 'Friend List Page',
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    title: 'Login Page',
    component: LoginComponent,
  },
  {
    path: 'register',
    title: 'Register Page',
    component: RegisterComponent,
  },
  {
    path: 'otp/:id',
    title: 'OTP Page',
    component: OtpComponent,
    canActivate: [otpGuard],
  },
  {
    path: '**',
    title: 'Page Not Found',
    component: NotfoundComponent,
  },
];
