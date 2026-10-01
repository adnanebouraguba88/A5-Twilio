import { Routes } from '@angular/router';
import { AddUserComponent } from './user/add-user/add-user.component';
import { LoginComponent } from './login/login.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { authGuard } from './guard/auth.guard';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { SendMailComponent } from './mail/send-mail/send-mail.component';
import { ListMailComponent } from './mail/list-mail/list-mail.component';
import { DetailMailComponent } from './mail/detail-mail/detail-mail.component';
import { SendSmsComponent } from './sms/send-sms/send-sms.component';
import { ListSmsComponent } from './sms/list-sms/list-sms.component';
import { MakeCallComponent } from './call/make-call/make-call.component';
import { HistoryCallComponent } from './call/history-call/history-call.component';
import { UsersListComponent } from './user/users-list/users-list.component';


export const routes: Routes = [

    {
        path: 'register',
        component: AddUserComponent,
        canActivate: [authGuard], // Protect the route with the guard
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [authGuard], // Protect the route with the guard
      },
      {
        path: 'admin-dashboard',
        component: DashboardAdminComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }  // Only allow users with 'ADMIN' role
      },
      {
        path: 'user-dashboard',
        component: DashboardUserComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      {
        path: 'mail',
        component: SendMailComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      {
        path: 'mail-list',
        component: ListMailComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      {
        path: 'detail-mail/:id',
        component: DetailMailComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      { path: 'profile', component: UserProfileComponent },

      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'sms',
        component: SendSmsComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      {
        path: 'smsList',
        component: ListSmsComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      {
        path: 'call',
        component: MakeCallComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      {
        path: 'historyCall',
        component: HistoryCallComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }  // Only allow users with 'USER' role
      },
      {
        path: 'usersList',
        component: UsersListComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }  // Only allow users with 'USER' role
      },


    ];
