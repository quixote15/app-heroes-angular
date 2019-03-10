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
      tap(_ => this.log(`fetched hero id=${id}`)),
    );    
  }

  
  updateHero(hero: Hero): Observable<Hero>{
    let heroUrl = 'people/' + hero.id ;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
   // return of(HEROES.find(hero => hero.id === id));
   return this.http.put<Hero>(this.api + heroUrl, hero, httpOptions)
    .pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
    );
      
  }

  saveHero(hero: Hero): Observable<Hero>{
    let heroUrl = 'people/' + hero.id ;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
   // return of(HEROES.find(hero => hero.id === id));
   return this.http.post<Hero>(this.api + heroUrl,hero, httpOptions)
      .pipe(
        tap(_ => this.log(`saved hero id=${hero.id}`)),
      );
      
  }
  
 
}
