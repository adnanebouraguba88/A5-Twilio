import { Component } from '@angular/core';
import { UserModel } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,RouterLink,
    FormsModule, // <-- Add FormsModule to the imports array
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error: number = 0;
  user = new UserModel();

  constructor(private authService: AuthService, private router: Router) {}


  onLoggedin() {
    this.authService.login(this.user).subscribe((data) => {
      try {
        const jwtToken = data.headers?.get('Authorization');
        if (jwtToken) {
          console.log('JWT token received:', jwtToken);
          this.authService.saveToken(jwtToken);

          if (this.authService.isAdmin()) {
            
            this.router.navigate(['/admin-dashboard']);
          } else if (this.authService.isUser()) {
            this.router.navigate(['/user-dashboard']);
          }
        } else {
          console.error('JWT token is missing from the response headers.');
          this.error = 1; // Handle missing token
        }
      } catch (error) {
        console.error('Error in processing login response:', error);
        this.error = 1;
      }
    });
  }
  
  }
