import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TokenService } from '../../../service/api/token/token.service';
import { ApiService } from '../../../service/api/api.service';
import { User } from '../../../models/user.model';
import { MatchMode } from '../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../models/enum/StringMatcher.model';
import { mergeMap } from 'rxjs';
import { Series } from '../../../models/series.model';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {

  series: Series[] = []

  constructor(private service: ApiService, private tokenService: TokenService) { }


  ngOnInit(): void {
    this.service.search<User>('user', { username: this.tokenService.getUsername() },
      MatchMode.ALL, StringMatcher.EXACT, null, null).pipe(
        mergeMap((userDTOS: User[]) => this.service.getByIds<Series>('series', userDTOS[0].seriesIds))
      ).subscribe((seriesDTOS: Series[]) => {
        this.series = seriesDTOS
      })
  }

}
