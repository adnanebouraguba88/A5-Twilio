import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { apiURL } from '../../config';
import { Observable, throwError } from 'rxjs';
import { catchError, tap , map} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SmsModel } from '../../models/sms.model';
import { Call } from '../../models/call.model';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  jwt:string;
  httpHeaders:HttpHeaders;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.jwt = "Bearer " + this.authService.getToken();
    this.httpHeaders = new HttpHeaders({ "Authorization": this.jwt});
  }

    // Add a new user

    addUser(user: UserModel, file: File): Observable<UserModel> {
      const formData = new FormData();
      formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
      formData.append('file', file);

      return this.http.post<UserModel>(`${apiURL}/users`, formData, { withCredentials: true });
    }

   // Get a user by ID
getUserById(userId: number): Observable<UserModel> {
  return this.http.get<UserModel>(`${apiURL}/users/${userId}`,{headers:this.httpHeaders})
    .pipe(
      catchError(this.handleError) // Handle errors
    );
}

sendMail(senderEmail: string, recipientEmail: string, subject: string, body: string): Observable<any> {
  const params = new HttpParams()
    .set('senderEmail', senderEmail)
    .set('recipientEmail', recipientEmail)
    .set('subject', subject)
    .set('body', body);

  return this.http.post<any>(`${apiURL}/mail/send`, null, {
    headers: this.httpHeaders,
    params
  }).pipe(
    tap(response => console.log(response)) // The response will be a JSON object with the "message" key
  );
}

getMailsByUser(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${apiURL}/mail/user/${userId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)
    );
}

// Add this method to your UserService
getMailById(mailId: number): Observable<any> {
  return this.http.get<any>(`${apiURL}/mail/${mailId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError) // Handle errors
    );
}


  // Handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error); // Log the error to the console
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

// Function to send SMS
sendSms(toPhoneNumber: string, message: string, userId: number): Observable<string> {
  const params = new HttpParams()
    .set('toPhoneNumber', toPhoneNumber)
    .set('message', message)
    .set('userId', userId.toString()); // Include the user ID

  return this.http
    .post(`${apiURL}/sms/send`, null, {
      headers: this.httpHeaders,
      params: params,
      responseType: 'text', // Specify response type as 'text'
    })
    .pipe(
      tap((response) => console.log('SMS Response:', response)) // Log response for debugging
    );
}

// Fonction pour récupérer tous les SMS envoyés
getAllSms(): Observable<SmsModel[]> {
  return this.http.get<SmsModel[]>(`${apiURL}/sms`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError)  // Gestion des erreurs
    );
}



  //method to fetch SMS by userId
  getSmsByUser(userId: number): Observable<SmsModel[]> {
    return this.http.get<SmsModel[]>(`${apiURL}/sms/user/${userId}`, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  makeCall(toPhoneNumber: string, userId: number): Observable<string> {
    return this.http.post(`${apiURL}/twilio/makeCall`, null, {
      params: { toPhoneNumber, userId: userId.toString() }, // Ajout de userId
      responseType: 'text' // Explicitement pour gérer les réponses en texte
    });
  }


  getUserCallHistory(userId: number): Observable<Call[]> {
    return this.http.get<Call[]>(`${apiURL}/twilio/calls/user/${userId}`, { headers: this.httpHeaders });
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${apiURL}/users`, { headers: this.httpHeaders })
      .pipe(
        map(users => users.map(user => ({
          ...user,
          roles: user.roles?.map((role: any) => role.name) || [] // Prend juste role.name
        }))),
        catchError(this.handleError)
      );
  }

  // Delete user by ID
  deleteUser(userId: number): Observable<void> {
  return this.http.delete<void>(`${apiURL}/users/${userId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  updateUserRole(userId: number, role: string, action: string): Observable<UserModel> {
    const body = { role, action };
    return this.http.post<UserModel>(
      `${apiURL}/users/${userId}/roles`,
      body,
      { headers: this.httpHeaders }
    ).pipe(
      map(user => ({
        ...user,
        roles: user.roles?.map((r: any) => r.name || r) || [] // Transformation des rôles
      })),
      catchError(this.handleError)
    );
  }


}
