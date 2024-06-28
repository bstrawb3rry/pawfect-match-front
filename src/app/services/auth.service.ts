import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable, map } from "rxjs";
import { Router } from "@angular/router";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private storageService: StorageService) { }

  path = '/api/auth';

  signup(user: User): Observable<any> {
    return this.http.post(`${this.path}/signup`, user);
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<{ jwt: string; ownerId: number }>(`${this.path}/login`, { username, password })
      .pipe(
        map((response) => {
          this.storageService.setItem('jwt', response.jwt);
          this.storageService.setItem('ownerId', response.ownerId.toString());
          this.storageService.setItem('selectedPetId', -1);
          return response;
        })
      );
  }

  logout(): void {
    this.storageService.removeItem('jwt');
    this.storageService.removeItem('ownerId');
    this.storageService.removeItem('selectedPetId');
    this.storageService.removeItem('selectedPetType');
    this.router.navigate(['/login']);
  }
}