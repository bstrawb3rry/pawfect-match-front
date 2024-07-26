import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageSubject = new BehaviorSubject(null);

  watchStorage(){
    return this.storageSubject.asObservable();
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
    this.storageSubject.next({ key, value });
  }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageSubject.next({ key, value: null });
  }
}
