import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 
  heroes = [];
  selectedHero: Hero;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
   // this.heroes = this.heroService.getHeroes()
   this.getHeroes()
  }

  getHeroes(){
    this.heroService.getHeroesObservable()
      .subscribe(heroes => this.heroes = heroes.slice(1,5));
  }
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}
