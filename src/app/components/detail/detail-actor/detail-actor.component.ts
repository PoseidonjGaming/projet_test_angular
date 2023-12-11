import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mergeMap } from 'rxjs';
import { Actor } from 'src/app/models/actor.model';
import { ApiActorService } from 'src/app/service/actor/api-actor.service';

@Component({
  selector: 'app-detail-actor',
  templateUrl: './detail-actor.component.html',
  styleUrls: ['./detail-actor.component.css']
})
export class DetailActorComponent implements OnInit {
  actor?: Actor


  constructor(private service: ApiActorService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((param: ParamMap) => this.service.getById<Actor>('actor', Number.parseInt(param.get('id')!)))
    ).subscribe((dto: Actor) => {
      console.log(dto);

    })
  }

}
