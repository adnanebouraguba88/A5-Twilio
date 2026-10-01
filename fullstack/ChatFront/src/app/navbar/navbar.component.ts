import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Ensure token is loaded on component initialization
    if (!this.authService.isloggedIn) {
      this.authService.loadToken();
    }
  }

  logout() {
    this.authService.logout();
  }
}
