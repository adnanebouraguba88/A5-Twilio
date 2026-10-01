import { Injectable } from '@angular/core';
import { UserModel, UserStatus } from '../../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private helper = new JwtHelperService();
  token!: string;
  public loggedUser! : string;
  public isloggedIn : Boolean =false;
  public roles! : string[];
  public userId!: number; // Add a property to store the user ID
  public userName: string | null = null;
  public userPhoto: string | null = null;

  constructor(private router: Router, private httpClient: HttpClient) {
      this.loadToken(); // Ensure the token is loaded when the service is created

  }

  login(user: UserModel) {
    console.log('user',user);

    return this.httpClient.post<UserModel>('http://localhost:8080/login', user, { observe: 'response' });
  }
  saveToken(jwt: string) {
    localStorage.setItem("jwt", jwt);
    this.token = jwt;
    this.decodedJWT();
    this.isloggedIn = true;



    this.fetchUserId(); // Fetch the user ID after saving the token
  }


  async decodedJWT() {
    if (this.token) {
      const decodedToken = this.helper.decodeToken(this.token);
      console.log('Decoded token:', decodedToken); // Log decoded token for debugging
      if (decodedToken) {
        this.loggedUser = decodedToken.sub || null;
        this.roles = decodedToken.roles || [];
        // Reset userId to ensure it matches the logged user
        this.userId = undefined!;
        await this.fetchUserId();
      } else {
        console.error('The token could not be decoded correctly');
      }
    }
  }

  // Fetching user ID from the backend

  fetchUserId() {
    if (this.loggedUser && this.token) {
      const headers = { Authorization: `Bearer ${this.token}` };
      this.httpClient
        .get<UserModel>(`http://localhost:8080/api/users/email?email=${this.loggedUser}`, { headers })
        .subscribe({
          next: (user) => {
            this.userId = user.userId!; // Store the user ID
            localStorage.setItem('userId', this.userId.toString()); // Save userId to localStorage
            this.fetchUserDetails(this.userId); // Fetch user details with the ID
            console.log('user this.userId',this.userId);
 // Update the user's status to ONLINE
 this.updateUserStatus(this.userId, UserStatus.ONLINE);
          },
          error: (err) => {
            console.error('Error fetching user by email:', err);
          },
        });
    }
  }
  // Fetch user details with image URL
  fetchUserDetails(userId: number) {
    const headers = { Authorization: `Bearer ${this.token}` };
    this.httpClient
      .get<{ username: string; profilePictureUrl: string }>(`http://localhost:8080/api/users/${userId}`, { headers })
      .subscribe({
        next: (user) => {
          this.userName = user.username || '';
          this.userPhoto = `http://localhost:8080/api/users/profile-image/${user.profilePictureUrl}`; // Build the profile image URL
          // Store user details in localStorage to persist across refreshes
          localStorage.setItem('userName', this.userName || '');
          localStorage.setItem('userPhoto', this.userPhoto || '');
                  localStorage.setItem('userId', this.userId.toString()); // Save userId to localStorage

        },
        error: (err) => {
          console.error('Error fetching user details:', err);
        },
      });
  }

    // Load stored user details from localStorage if available
    loadUserDetailsFromStorage() {
      this.userName = localStorage.getItem('userName');
      this.userPhoto = localStorage.getItem('userPhoto');
    }


  isUser(){
    if(!this.roles)
        return false
    return (this.roles.indexOf('USER')>-1) ;
    }
  isAdmin(){
    if(!this.roles)
        return false
    return (this.roles.indexOf('ADMIN')>-1) ;
    }
    getLoggedInUserName(): string {
      return this.loggedUser;
    }
    getToken() {
      return this.token;
    }
    logout() {
      if (this.userId) {
        this.setUserOffline(); // Set status to OFFLINE before logging out
      }
      this.loggedUser = undefined!;
      this.isloggedIn = false;
      this.roles = undefined!;
      this.userId = undefined!; // Clear the userId
      this.token = "";
      localStorage.removeItem('jwt');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPhoto');
      localStorage.removeItem('userId'); // Remove userId from localStorage
      console.clear(); // Clear the console when logging out

      // Navigate to '/login' (make sure the path matches the route definition)
      this.router.navigate(["/login"]);
    }


    setLoggedUserLS(login: string): void {
      this.loggedUser = login;
      this.isloggedIn = true;
    }
    loadToken() {
      this.token = localStorage.getItem('jwt')!;
      if (this.token && !this.helper.isTokenExpired(this.token)) {
        this.decodedJWT();
        this.isloggedIn = true; // Set loggedIn to true if the token is valid
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          this.userId = parseInt(storedUserId, 10); // Restore userId from localStorage
          this.fetchUserDetails(this.userId); // Fetch user details again
        }
      } else {
        this.logout(); // If the token is expired, log the user out
      }
    }

    isTokenExpired() {
      return this.helper.isTokenExpired(this.token);
    }


updateUserStatus(userId: number, status: UserStatus) {
  const headers = { Authorization: `Bearer ${this.token}` };
  console.log(`Updating user status for userId: ${userId} to ${status}`);

  this.httpClient
    .put<void>(`http://localhost:8080/api/users/${userId}/status?status=${status}`, null, { headers })
    .subscribe({
      next: () => {
        console.log(`User statuss set to ${status} for userId: ${userId}`);
      },
      error: (err) => {
        console.error(`Error setting user status to ${status}:`, err);
      },
    });
}
    setUserOnline() {
      console.log('Current userId for status change:', this.userId);
      if (this.userId) {


        this.updateUserStatus(this.userId, UserStatus.ONLINE);
      }
    }

    setUserOffline() {
      if (this.userId) {
        this.updateUserStatus(this.userId, UserStatus.OFFLINE);
      }
    }

  }
