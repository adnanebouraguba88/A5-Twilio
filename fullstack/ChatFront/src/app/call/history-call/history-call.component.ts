import { Component, OnInit } from '@angular/core';
import { Call } from '../../models/call.model';
import { UserService } from '../../service/user/user.service';
import { AuthService } from '../../service/auth/auth.service';  // Importer AuthService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-call.component.html',
  styleUrls: ['./history-call.component.css']  // correction de "styleUrl" en "styleUrls"
})
export class HistoryCallComponent implements OnInit {
  calls: Call[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService  // Injection du service AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCallHistory();
  }

  fetchCallHistory(): void {
    const userId = this.authService.userId;  // Récupérer l'ID de l'utilisateur authentifié

    if (!userId) {
      console.error('User not authenticated');
      return;  // Si l'utilisateur n'est pas authentifié, ne pas effectuer l'appel
    }

    // Passer le userId à la méthode de récupération de l'historique des appels
    this.userService.getUserCallHistory(userId).subscribe(
      (data) => this.calls = data,  // Stocker les appels récupérés
      (error) => console.error('Error fetching call history:', error)  // Gestion des erreurs
    );
  }
}
