import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { mergeMap } from 'rxjs';
import { PageResponse } from 'src/app/models/PageResponse.model';
import { Actor } from 'src/app/models/actor.model';
import { ApiService } from 'src/app/service/api.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css']
})
export class ActorComponent implements OnInit {

  actors: Actor[] = []
  toAddActors: Actor[] = []
  columns = ['firstname', 'lastname', 'action']
  notification = 0

  @ViewChild('tableToAddActors') table: MatTable<Actor> | undefined

  formActor = new FormGroup({
    id: new FormControl(0),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required])
  })

  constructor(private service: ApiService, private utils: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll<PageResponse<Actor>>(0, 0, 'actor').subscribe((dtos: PageResponse<Actor>) => this.actors = dtos.content)
  }

  populate(actor: Actor) {
    this.utils.populate(actor, this.formActor)
  }

  submit() {
    if (this.formActor.valid) {
      this.service.save<Actor>('actor', this.setValue()).pipe(
        mergeMap(() => this.service.getAll<PageResponse<Actor>>(0, 0, 'actor'))
      ).subscribe((dtos: PageResponse<Actor>) => {
        this.actors = dtos.content
        this.utils.reset()
      })
    }
  }

  saves() {
    this.service.saves<Actor>('actor', this.toAddActors).pipe(
      mergeMap(() => this.service.getAll<PageResponse<Actor>>(0, 0, 'actor'))
    ).subscribe((dtos: PageResponse<Actor>) => {
      this.toAddActors = []
      this.actors = dtos.content
    })
  }

  add() {
    if (this.formActor.valid) {
      this.toAddActors.push(this.setValue())
      this.utils.updateTable(this.table!)
      this.utils.reset()
      this.formActor.controls.id.setValue(0)
      this.notification++
    }

  }

  deletes(actor: Actor) {
    this.service.delete('actor', actor.id.toString()).pipe(
      mergeMap(() => this.service.getAll<PageResponse<Actor>>(0, 0, 'actor'))
    ).subscribe((dtos: PageResponse<Actor>) => this.actors = dtos.content)
  }

  remove(index: number) {
    this.toAddActors.splice(index, 1)
    this.utils.updateTable(this.table!)
  }

  setValue() {
    let actor = new Actor()
    Object.keys(actor).forEach((e) => {
      const control = this.formActor.get(e)
      if (control)
        actor[e] = control.value
    })
    return actor
  }

  updateNotification(event: number) {
    if (event == 0)
      this.notification = 0
  }

}
