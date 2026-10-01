import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { CommonModule } from '@angular/common';
import { MailModels } from '../../models/mail.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../service/auth/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-mail',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,RouterModule],
  templateUrl: './list-mail.component.html',
  styleUrl: './list-mail.component.css'
})
export class ListMailComponent implements OnInit {
  mails: MailModels[] = []; // Pour stocker les emails récupérés
  loading: boolean = false;
  error: string | null = null;
  p: number = 1; // For pagination, initialize to page 1


  constructor(private userService: UserService , private authService : AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.userId; // Use the persisted userId
    if (userId) {
      this.fetchMails(userId);
    } else {
      console.error('User ID is missing. Unable to fetch mails.');
    }
  }
  
  fetchMails(userId: number): void {
    this.loading = true;
    this.error = null;
  
    this.userService.getMailsByUser(userId).subscribe({
      next: (data) => {
        this.mails = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des mails.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}