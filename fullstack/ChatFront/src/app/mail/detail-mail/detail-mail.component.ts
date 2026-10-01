import { Component } from '@angular/core';
import { MailModels } from '../../models/mail.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-mail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-mail.component.html',
  styleUrl: './detail-mail.component.css'
})
export class DetailMailComponent {

    mail: MailModels | null = null;
  
    constructor(private route: ActivatedRoute, private userService: UserService,  private router: Router
    ) {}
  
    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const mailId = Number(params.get('id'));
        if (mailId) {
          this.loadMail(mailId);
        }
      });
    }
  
    loadMail(mailId: number): void {
      this.userService.getMailById(mailId).subscribe({
        next: (response) => {
          this.mail = response; // Assuming the response is of type MailModels
        },
        error: (err) => {
          console.error('Error fetching mail:', err);
        }
      });
    }
     // goBack method to navigate to the previous page or mail list
  goBack(): void {
    this.router.navigate(['/mail-list']); // Replace '/mail-list' with your actual mail list route
  }
  }