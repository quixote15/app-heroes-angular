import { Injectable } from '@angular/core';

import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap,filter } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  
  heroes = HEROES;
  api = 'https://swapi.co/api/'
  heroesUrl = this.api + 'people';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
    ) { }

  getHeroes(): Hero[]{
    return this.heroes;
  }

  searchHeroes(term: String) : Observable<Hero[]>{

    return this.http.get<Hero[]>(`${this.heroesUrl}?search=${term}`)
    .pipe(
      tap(_ => console.log(`found heroes matching "${term}"`)),
      map(data => {
        console.log(data)
        return data.results.map((hero, index) =>{
          return {id: index + 1, name: hero.name};
        });
      }),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  getHeroesObservable(): Observable<Hero[]>{
    this.messageService.add("HeroService:  Fetched heroes data!")
    //return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
      
        map(data => {
          console.log(data)
          return data.results.map((hero, index) =>{
            return {id: index + 1, name: hero.name};
          });
        })
      );
  }

  getHero(id: number): Observable<Hero>{
    let heroUrl = 'people/' + id ;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
   // return of(HEROES.find(hero => hero.id === id));
   return this.http.get<Hero>(this.api + heroUrl)
    .pipe(
      tap(_ => console.log(`fetched hero id=${id}`)),
      map(hero =>{ 
        return  {id: id, name: hero.name} 
      })
    );    
  }


  updateHero(hero: Hero): Observable<Hero>{
    let heroUrl = 'people/' + hero.id ;
    this.messageService.add(`HeroService: fetched hero id=${hero.id}`);
   // return of(HEROES.find(hero => hero.id === id));
   return this.http.put<Hero>(this.api + heroUrl, hero, httpOptions)
    .pipe(
      tap(_ => console.log(`updated hero id=${hero.id}`)),
    );
      
  }

  saveHero(hero: Hero): Observable<Hero>{
    let heroUrl = 'people/' + hero.id ;
    this.messageService.add(`HeroService: fetched hero id=${hero.id}`);
   // return of(HEROES.find(hero => hero.id === id));
   return this.http.post<Hero>(this.api + heroUrl,hero, httpOptions)
      .pipe(
        tap(_ => console.log(`saved hero id=${hero.id}`)),
      );
      
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
  
 
}
