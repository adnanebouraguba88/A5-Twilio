import { Component , OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard-user.component.html',
  styleUrl: './dashboard-user.component.css'
})
export class DashboardUserComponent implements OnInit{


  ngOnInit(): void {

  }
}
