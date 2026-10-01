import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';  // Import du UserService
import { AuthService } from '../../service/auth/auth.service';  // Import du AuthService
import { FormsModule } from '@angular/forms';  // Importation de FormsModule
import { CommonModule } from '@angular/common';  // Pour les directives comme ngIf, ngFor

@Component({
  selector: 'app-make-call', // Mise à jour du sélecteur
  templateUrl: './make-call.component.html',  // Chemin vers le template HTML
  styleUrls: ['./make-call.component.css'],  // Style du composant
  standalone: true,
  imports: [FormsModule, CommonModule],  // Ajout de FormsModule et CommonModule
})
export class MakeCallComponent {
  phoneNumber: string = '';  // Numéro de téléphone à appeler
  callStatus: string = '';   // Statut de l'appel (succès ou échec)

  constructor(
    private userService: UserService,  // Injection du UserService
    private authService: AuthService,  // Injection du AuthService
    private router: Router             // Injection du Router pour la redirection
  ) {}

  // Fonction pour ajouter un chiffre à phoneNumber
  addDigit(digit: string): void {
    this.phoneNumber += digit;
  }

  // Fonction pour effacer un chiffre de phoneNumber
  clearDigit(): void {
    this.phoneNumber = this.phoneNumber.slice(0, -1);
  }

  // Fonction pour effectuer l'appel
  makeCall(): void {
    // Vérification si le numéro de téléphone est rempli
    if (!this.phoneNumber) {
      this.callStatus = 'Please enter a valid phone number.';
      return;
    }

    // Récupération de l'ID de l'utilisateur authentifié
    const userId = this.authService.userId; // On suppose que `authService` gère l'utilisateur authentifié

    if (!userId) {
      this.callStatus = 'User not authenticated. Please log in.';  // Si l'utilisateur n'est pas authentifié
      return;
    }

    // Appel au service UserService pour effectuer l'appel avec l'ID de l'utilisateur
    this.userService.makeCall(this.phoneNumber, userId).subscribe({
      next: (response) => {
        // Affichage du statut de l'appel en cas de succès
        this.callStatus = 'Call initiated successfully!';
        console.log(response);

        // Redirection vers une autre page (ex: tableau de bord) après l'appel
        this.router.navigate(['/user-dashboard']);
      },
      error: (error) => {
        // Affichage du message d'erreur en cas d'échec
        this.callStatus = 'Error making call: ' + error.message;
        console.error(error);
      }
    });
  }
}
