import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user/user.service'; // Import du UserService
import { AuthService } from '../../service/auth/auth.service'; // Import du AuthService
import { FormsModule } from '@angular/forms';  // Importation de FormsModule
import { CommonModule } from '@angular/common';  // Pour les directives comme ngIf, ngFor


@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],  // Ajout de FormsModule et CommonModule

})
export class SendSmsComponent {
  recipientPhoneNumber: string = '';  // Numéro de téléphone du destinataire
  message: string = '';               // Message du SMS
  responseMessage: string = '';       // Message de réponse (succès ou échec)

  constructor(
    private userService: UserService,  // Injection du service utilisateur
    private authService: AuthService,  // Injection du service d'authentification
    private router: Router             // Injection du service de routage
  ) {}

  // Fonction pour envoyer le SMS
  sendSms() {
    // Vérifie que les champs nécessaires sont remplis
    if (this.recipientPhoneNumber && this.message) {
      // Appel du service UserService pour envoyer le SMS
      const userId = this.authService.userId; // Get the logged-in user's ID

      if (!userId) {
        this.responseMessage = 'User not authenticated. Please log in.';
        return;
      }
      this.userService.sendSms(this.recipientPhoneNumber, this.message,userId).subscribe({
        next: (response) => {
          // Affiche le message de succès
          this.responseMessage = 'SMS envoyé avec succès!';
          console.log(response);

          // Redirige vers le tableau de bord de l'utilisateur après l'envoi du SMS
          this.router.navigate(['/user-dashboard']);
        },
        error: (error) => {
          // Gère l'erreur si l'envoi du SMS échoue
          this.responseMessage = 'Échec de l\'envoi du SMS. Veuillez réessayer.';
          console.error(error);
        }
      });
    } else {
      // Affiche un message d'erreur si les champs ne sont pas remplis
      this.responseMessage = 'Veuillez remplir tous les champs.';
    }
  }
}
