import { enviroments } from './../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = enviroments.baseUrl;

  constructor( private http: HttpClient ) { }


  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>( `${this.baseUrl}/heroes` )
  }

  getHeroeById(idHeroe: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${idHeroe}`)
    .pipe(
      catchError( error => of(undefined))
    )
  }


  getSuggestions( query:string ): Observable<Hero[]> {
      return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${ query }&_limit=6`);
  }
}
