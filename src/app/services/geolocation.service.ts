import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CountryInformation } from "../models/country-info.model";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) {}

  path = '/api/location';


  getCountries(): Observable<CountryInformation[] | null> {
    return this.http.get<CountryInformation[]>(`${this.path}/countries`);
  }

  getCounties(geonameId: string): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.path}/counties/${geonameId}`);
  }

  getCities(adminCode: string, country: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.path}/cities/${country}/${adminCode}`);
  }

  geocodeAddress(address: string): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`;
    return this.http.get(url);
  }
}
