import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
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

  formActor = new FormGroup({
    id: new FormControl(0),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required])
  })

  constructor(private service: ApiService<Actor>, private utils: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll('actor').subscribe((dtos: Actor[]) => this.actors = dtos)
  }

  populate(actor: Actor) {
    this.utils.populate(actor, this.formActor)
  }

  submit() {
    if (this.formActor.valid) {
      this.service.save('actor', this.setValue()).pipe(
        mergeMap(() => this.service.getAll('actor'))
      ).subscribe((dtos: Actor[]) => {
        this.actors = dtos
        var resetForm = <HTMLFormElement>document.getElementById('form');
        resetForm.reset();
      })
    }
  }

  saves() {
    this.service.saves('actor', this.toAddActors).pipe(
      mergeMap(() => this.service.getAll('actor'))
    ).subscribe((dtos: Actor[]) => {
      this.toAddActors = []
      this.actors = dtos
    })
  }

  add() {
    if (this.formActor.valid) {
      this.toAddActors.push(this.setValue())
      var resetForm = <HTMLFormElement>document.getElementById('form');
      resetForm.reset();
    }

  }

  deletes(actor: Actor) {
    this.service.delete('actor', actor.id.toString()).pipe(
      mergeMap(() => this.service.getAll('actor'))
    ).subscribe((dtos: Actor[]) => this.actors = dtos)
  }

  remove(index: number) {
    this.toAddActors.splice(index, 1)
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

}
