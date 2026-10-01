import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { UserModel, UserStatus } from '../../models/user.model';
import { UserService } from '../../service/user/user.service';


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./add-user.component.html",
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  newUser: UserModel = {
    username: '',
    email: '',
    password: '',
    profilePictureUrl: '',
    status: UserStatus.OFFLINE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null; // To store the preview image URL

  constructor(private userService: UserService, private router: Router) {}

  // Handle file input change and generate preview
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      this.imageUrl = reader.result; // File preview
    };

    reader.readAsDataURL(this.selectedFile);
  } else {
    console.warn('No file selected.');
  }
}


  addUser(): void {
    if (this.selectedFile) {
      this.userService.addUser(this.newUser, this.selectedFile).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
        },
      });
    } else {
      console.error('No file selected');
    }
  }
}
