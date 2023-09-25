import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { mergeMap } from 'rxjs';
import { Actor } from 'src/app/models/actor.model';
import { Base } from 'src/app/models/base.model';
import { Character } from 'src/app/models/character.model';
import { Series } from 'src/app/models/series.model';
import { ApiActorService } from 'src/app/service/actor/api-actor.service';
import { ApiService } from 'src/app/service/api.service';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  characters: Character[] = []
  toAddCharacters: Character[] = []

  actors: Actor[] = []
  series: Series[] = []


  columns = ['name', 'action']
  actorsColumns = ['firstname', 'lastname', 'action']

  private arrayNumber: number[] = []

  formCharacter = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    actorIds: new FormControl(this.arrayNumber, [Validators.required]),
    seriesIds: new FormControl(this.arrayNumber, [Validators.required]),
    actors: new FormControl(this.actors),
    series: new FormControl(this.series)
  })

  constructor(private service: ApiService<Character>,
    private actorService: ApiActorService,
    private seriesService: ApiSeriesService,
    private utils: UtilsService) { }

  ngOnInit(): void {
    this.actorService.getAll('actor').subscribe((dtos: Actor[]) => this.actors = dtos)
    this.seriesService.getAll('series').subscribe((dtos: Series[]) => this.series = dtos)
    this.service.getAll('character').subscribe((dtos: Character[]) => this.characters = dtos)
  }

  populate(character: Character) {
    this.utils.populate(character, this.formCharacter)

    let tempSeries: Series[] = []
    let tempActors: Actor[] = []
    this.series.forEach((e) => {
      if (this.formCharacter.controls.seriesIds.value?.includes(e.id))
        tempSeries.push(e)
    })

    this.actors.forEach((e) => {
      if (this.formCharacter.controls.actorIds.value?.includes(e.id))
        tempActors.push(e)
    })
    this.formCharacter.controls.series.setValue(tempSeries)
    this.formCharacter.controls.actors.setValue(tempActors)
  }

  submit() {
    console.log(this.setValues());
    this.service.save('character', this.setValues()).pipe(
      mergeMap(() => this.service.getAll('character'))
    ).subscribe((dtos: Character[]) => {
      this.characters = dtos
      this.utils.reset()
    })

  }

  saves() {
    this.service.saves('character', this.toAddCharacters).pipe(
      mergeMap(() => this.service.getAll('character'))
    ).subscribe((dtos: Character[]) => {
      this.characters = dtos
      this.toAddCharacters = []
    })
  }

  add() {
    this.toAddCharacters.push(this.setValues())
    this.utils.reset()
  }


  removeFromList<E extends Base>(list: any[], index: number, table: MatTable<E>) {
    list.splice(index, 1)
    table.renderRows()
  }

  deletes(character: Character) {
    this.service.delete('character', character.id.toString()).pipe(
      mergeMap(() => this.service.getAll('character'))
    ).subscribe((dtos: Character[]) => this.characters = dtos)
  }

  setValues() {
    this.formCharacter.controls.actorIds.setValue(this.formCharacter.controls.actors.value?.map(e => e.id)!)
    this.formCharacter.controls.seriesIds.setValue(this.formCharacter.controls.series.value?.map(e => e.id)!)
    let character = new Character()
    Object.keys(character).forEach((e) => {
      const control = this.formCharacter.get(e)
      if (control)
        character[e] = control.value
    })

    return character
  }

}
