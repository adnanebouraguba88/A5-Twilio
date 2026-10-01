import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user/user.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: UserModel[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
    console.log('Utilisateurs chargés :', this.users);

  }



  getUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      console.log("Users fetched:", users);
      this.users = users;
  });
  }

  deleteUser(userId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        const index = this.users.findIndex(user => user.userId === userId);
        if (index !== -1) {
          this.users.splice(index, 1);
        }
      });
    }
  }


  toggleRole(user: UserModel, role: string): void {
    if (!user.userId) {
      console.error("L'ID de l'utilisateur est indéfini !");
      alert("Erreur : ID utilisateur manquant.");
      return;
    }

    const action = user.roles?.includes(role) ? 'remove' : 'add';
    this.userService.updateUserRole(user.userId, role, action).subscribe({
      next: (updatedUser) => {
        // Transformation des rôles renvoyés par l'API en tableau de chaînes
        const updatedRoles = updatedUser.roles?.map((r: any) => r.name || r) || [];
        user.roles = updatedRoles; // Mise à jour des rôles de l'utilisateur local
        // Remplace l'utilisateur dans le tableau pour forcer la détection de changement
        this.users = this.users.map(u => (u.userId === user.userId ? { ...u, roles: updatedRoles } : u));
        console.log('Rôle mis à jour :', user.roles);
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du rôle :", err);
        alert("Erreur lors de la mise à jour du rôle.");
      }
    });
  }



}
