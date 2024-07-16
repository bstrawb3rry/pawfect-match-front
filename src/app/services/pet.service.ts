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

   
       getPetsForPossibleMatching(id: number, ownerId: number, startAge?: number, endAge?: number): Observable<Pet[] | null> {
      let params = new HttpParams();
      if (startAge !== undefined) params = params.set('startAge', startAge.toString());
      if (endAge !== undefined) params = params.set('endAge', endAge.toString());
      return this.http.get(this.path+ `/${id}/owner/${ownerId}`, { params })
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



    getPetsMatches(id: number, startAge?: number, endAge?: number, color?: string, awardName?: string, city?: string): Observable<Pet[] | null> {
      let params = new HttpParams();
      if (startAge !== undefined) params = params.set('startAge', startAge.toString());
      if (endAge !== undefined) params = params.set('endAge', endAge.toString());
      if (color) params = params.set('color', color);
      if (awardName) params = params.set('awardName', awardName);
      if (city) params = params.set('city', city);
  
      return this.http.get<Pet[]>(`${this.path}/${id}/matches`, { params })
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

    getPetsByOwner(id: number): Observable<Pet[] | null> {
      return this.http.get<Pet[]>(`${this.path}/owner/${id}`)
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

    getBreedsByType(type: string): Observable<string[] | null> {
      return this.http.get<string[]>(`${this.path}/breeds/${type}`)
        .pipe(
          map((response: unknown) => {
            const breeds = (response as string[]);
            if (breeds) {
              return breeds;
            }
            return [];
          })
        );
    }

    getColorsByType(type: string): Observable<string[] | null> {
      return this.http.get<string[]>(`${this.path}/colors/${type}`)
        .pipe(
          map((response: unknown) => {
            const colors = (response as string[]);
            if (colors) {
              return colors;
            }
            return [];
          })
        );
    }

    getPetImageUrl(photoId: number){
      return this.path + `/photo/${photoId}`
    }

    addPet(ownerId: number, petDto: Pet): Observable<Pet> {
      return this.http.post<Pet>(`${this.path}/owner/${ownerId}`, petDto);
    }

    editPet(petDto: Pet): Observable<Pet> {
      return this.http.put<Pet>(`${this.path}/edit`, petDto);
    }

    // addPhoto(petId: number, image: File): Observable<number> {
    //   const uploadedData = new FormData();
    //   uploadedData.append('image', image);
    //   return this.http.post<number>(`${this.path}/photo/${petId}`, uploadedData);
    // }

     addPhoto(petId: number, image: File): Observable<number> {
      const uploadedData = new FormData();
      uploadedData.append('image', image);
      return this.http.post<number>(`${this.path}/photo/${petId}`, uploadedData);
    }
  }