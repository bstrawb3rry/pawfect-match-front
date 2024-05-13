import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Pet } from "../models/pet.model";

export enum OrderDirection {
    DESC = 'desc',
  }

  @Injectable({
    providedIn: 'root',
  })
  export class PetService {
    
    constructor(private http: HttpClient) {}

    path = '/api/pets';

    getPetsForPossibleMatching(id: number, ownerId: number): Observable<Pet[] | null> {
      return this.http.get(this.path+ `/${id}/owner/${ownerId}`)
        .pipe(
          map((response: unknown) => {
            const petList = (response as Pet[]);
            if (petList) {
                return petList;
            }
            return [];
          })
        );
    }

    getPetImageUrl(photoId: number){
      return this.path + `/photo/${photoId}`
    }
  }