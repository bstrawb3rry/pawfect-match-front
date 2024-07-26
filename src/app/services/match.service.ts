import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private path = '/api/matches';

  constructor(private http: HttpClient) {}

  createMatch(initiatorId: number, receiverId: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.path}/initiator/${initiatorId}/receiver/${receiverId}`, {});
  }
}
