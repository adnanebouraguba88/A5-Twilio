import { Component } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { UserService } from '../../service/user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-mail',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './send-mail.component.html',
  styleUrl: './send-mail.component.css'
})
export class SendMailComponent {

  recipientEmail: string = '';
  subject: string = '';
  body: string = '';
  responseMessage: string = '';

  constructor(private userService : UserService, private authService: AuthService, private router: Router) {}

  sendEmail() {
    const senderEmail = this.authService.getLoggedInUserName(); // Retrieve logged-in user's email
  
    if (senderEmail && this.recipientEmail && this.subject && this.body) {
      this.userService.sendMail(senderEmail, this.recipientEmail, this.subject, this.body).subscribe({
        next: (response) => {
          // Handle successful response
          this.responseMessage = 'Email sent successfully!';
          console.log(response);
  
          // Navigate to user-dashboard after email is sent
          this.router.navigate(['/user-dashboard']);
        },
        error: (error) => {
          // Handle error response
          this.responseMessage = 'Failed to send email. Please try again.';
          console.error(error);
        }
      });
    }
  }
  
  
}