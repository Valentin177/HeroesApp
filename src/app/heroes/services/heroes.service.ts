import { enviroments } from './../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, map, of } from 'rxjs';

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

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero)
  }

  updateHero(hero: Hero): Observable<Hero> {
    if(!hero.id) throw new Error("Hero id is required")
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero)
  }

  deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${ id }`)
    .pipe(
      map( resp => true ),
      catchError(err => of(false))
    )
  }


}
