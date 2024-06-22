import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable, map } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  path = '/api/auth';

  signup(user: User): Observable<any> {
    return this.http.post(`${this.path}/signup`, user);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ jwt: string, ownerId: number }>(`${this.path}/login`, { username, password }).pipe(
      map(response => {
        // Store the JWT token in local storage
        localStorage.setItem('jwt', response.jwt);
        localStorage.setItem('ownerId', response.ownerId.toString());
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt'); // Remove the JWT token from local storage
    this.router.navigate(['/login']); // Redirect to login page
  }
}