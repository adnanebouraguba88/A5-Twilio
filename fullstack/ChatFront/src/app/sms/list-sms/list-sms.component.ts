import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsModel } from '../../models/sms.model';
import { UserService } from '../../service/user/user.service';
import { AuthService } from '../../service/auth/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-list-sms',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './list-sms.component.html',
  styleUrls: ['./list-sms.component.css']
})
export class ListSmsComponent implements OnInit {
  smsList: SmsModel[] = []; // List of SMS messages
  errorMessage: string = ''; // Error message in case of an issue
  userId: number = 1; // Assuming you want to fetch SMS for a user with a specific userId
  p: number = 1; // For pagination, initialize to page 1

  constructor(private userService: UserService, private authService : AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.userId; // Use the persisted userId
    if (userId) {
      this.fetchSmsByUser(userId);
    } else {
      console.error('User ID is missing. Unable to fetch mails.');
    }
  }

  fetchSmsByUser(userId: number): void {
    this.userService.getSmsByUser(userId).subscribe({
      next: (data) => {
        this.smsList = data; // Populate the smsList with the received data
      },
      error: (error) => {
        this.errorMessage = 'Error occurred while loading SMS.';
        console.error(error);
      }
    });
  }
}
