import { DatePipe } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Actor } from '../../../models/actor.model';
import { Character } from '../../../models/character.model';
import { Episode } from '../../../models/episode.model';
import { Season } from '../../../models/season.model';
import { Series } from '../../../models/series.model';
import { ApiService } from '../../../service/api/api.service';
import { MenuComponent } from '../../menu/menu.component';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, mergeMap, switchMap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { Review } from '../../../models/review.model';
import { MatchMode } from '../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../models/enum/StringMatcher.model';
import { User } from '../../../models/user.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TokenService } from '../../../service/api/token/token.service';

@Component({
  selector: 'app-detail-series',
  standalone: true,
  imports: [MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    RouterLink,
    MenuComponent,
    MatToolbarModule,
    DatePipe],
  templateUrl: './detail-series.component.html',
  styleUrl: './detail-series.component.css'
})
export class DetailSeriesComponent {


  series: Series = new Series()
  seasons: Season[] = []
  characters: Character[] = []
  actors: Actor[] = []
  reviews: Review[] = []
  userReview: Review = {
    note: 0,
    comment: '',
    userId: 0,
    seriesId: 0
  }

  sumReview: { avg: number, total: number } = { avg: 0, total: 0 };



  constructor(private service: ApiService,
    private tokenService: TokenService,
    @Inject(LOCALE_ID) public locale: string,
    private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap(paramMap => {
        return this.service.getById<Series>('series', Number.parseInt(paramMap.get('id')!))
      }),
      mergeMap(series => {
        this.series = series
        return combineLatest([
          this.service.getByIds<Season>('season', this.series.seasonIds),
          this.service.getByIds<Character>('character', this.series.characterIds),
          this.service.search<Review>('review', { seriesId: series.id },
            MatchMode.ALL, StringMatcher.EXACT, null, null),
          this.service.search<User>('user', { username: this.tokenService.getClaims().sub },
            MatchMode.ALL, StringMatcher.EXACT, null, null)
        ])
      }),
      switchMap(([seasonDtos, characterDtos, reviewDto, userDtos]) => {
        this.characters = characterDtos
        this.seasons = seasonDtos
        this.reviews = reviewDto.filter(r => r.userId != userDtos[0].id)
        this.userReview = reviewDto.find(r => r.userId == userDtos[0]['id'])!
        this.sumReview.total = reviewDto.length
        this.sumReview.avg = reviewDto.map(r => r.note).reduce((p, s) => p + s) / reviewDto.length
        return combineLatest([
          this.service.getByIds<Actor>('actor', characterDtos.map(e => e.actorId)),
          this.service.getByIds<Episode>('episode', seasonDtos.map(e => e.episodeIds).flat()),
          this.service.getByIds<User>('user', reviewDto.map(r => r.userId))
        ])
      })
    ).subscribe(([actorDtos, episodeDtos, userDtos]) => {
      this.seasons.forEach(season => {
        season['episodes'] = episodeDtos.filter(e => e.seasonId == season.id)
      })

      this.characters.forEach(character => {
        character['actor'] = actorDtos.find(a => a.id == character.actorId)
      })
      this.reviews.forEach(review => {
        review['username'] = userDtos.find(u => u['id'] == review.userId)?.username
      })
    })




  }
}
