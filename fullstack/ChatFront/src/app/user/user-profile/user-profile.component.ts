import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

    userId!: number;  // Store the userId
    user!: UserModel;  // Store the fetched user data
    isLoading = true;  // Loading state
    userName!: string | null;
    userPhoto!: string | null;
  
    constructor(private authService: AuthService, private userService: UserService) {}
  
    ngOnInit(): void {
      // Retrieve userId from localStorage
      this.userId = parseInt(localStorage.getItem('userId')!, 10);
      console.log('User ID in ProfileComponent:', this.userId); // Debugging
  
      // Load user details from localStorage
      this.loadUserDetailsFromStorage();
  
      if (this.userId) {
        this.loadUserProfile();
      }
    }
  
    loadUserProfile() {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;  // Set loading state to false after data is fetched
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          this.isLoading = false;  // Set loading state to false even on error
        }
      });
    }
  
    // Load stored user details from localStorage if available
    loadUserDetailsFromStorage() {
      this.userName = localStorage.getItem('userName');
      this.userPhoto = localStorage.getItem('userPhoto');
    }
  }