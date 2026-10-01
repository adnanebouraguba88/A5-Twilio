import { Component , OnInit} from '@angular/core';
import { UsersListComponent } from '../user/users-list/users-list.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [UsersListComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}

}
