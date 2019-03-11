import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Hero } from '../hero';
import { debounce, debounceTime, distinct, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;

  private searchTerms = new Subject<String>();

  constructor(private heroService: HeroService) { }
  /**
   * A Subject is both a source of observable values and an Observable itself. 
   * You can subscribe to a Subject as you would any Observable.
    
    You can also push values into that Observable 
    by calling its next(value) method as the search() method does.
   * @param term 
   */
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
 
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
 
      // ignore new term if same as previous term
      distinctUntilChanged(),
 
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }


}
