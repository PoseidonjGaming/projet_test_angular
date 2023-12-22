import { DatePipe } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Actor } from '../../../models/actor.model';
import { Character } from '../../../models/character.model';
import { Episode } from '../../../models/episode.model';
import { Season } from '../../../models/season.model';
import { Series } from '../../../models/series.model';
import { ApiService } from '../../../service/api.service';
import { MenuComponent } from '../../menu/menu.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detail-series',
  standalone: true,
  imports: [MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    RouterLink,
    MenuComponent,
    DatePipe],
  templateUrl: './detail-series.component.html',
  styleUrl: './detail-series.component.css'
})
export class DetailSeriesComponent {

  @Input()
  set id(seriesId: string) {
    this.service.getById<Series>('series', Number.parseInt(seriesId)).subscribe((dto: Series) => {
      this.series = dto
    })
  }

  series?: Series
  saisons: Season[] = []
  episodes: Episode[][] = []
  characters: Character[] = []
  actors: Actor[] = []

  constructor(private service: ApiService, @Inject(LOCALE_ID) public locale: string) { }
  ngOnInit(): void {
    console.log(this.series);

  }
}
