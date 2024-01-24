import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Actor } from '../../../models/actor.model';
import { MenuComponent } from '../../menu/menu.component';
import { ApiService } from '../../../service/api/api.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-detail-actor',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule
  ],
  templateUrl: './detail-actor.component.html',
  styleUrl: './detail-actor.component.css'
})
export class DetailActorComponent implements OnInit {
  actor: Actor = new Actor()

  constructor(private service: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap(paramMap => {
        return this.service.getById<Actor>('actor', Number.parseInt(paramMap.get('id')!))
      })
    ).subscribe()
  }


}
