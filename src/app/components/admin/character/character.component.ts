import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { combineLatest, mergeMap } from 'rxjs';
import { PageResponse } from 'src/app/models/PageResponse.model';
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
  notification = 0
  toAddIndex = -1

  actors: Actor[] = []
  series: Series[] = []

  @ViewChild('tableToAddCharacter') table: MatTable<Character> | undefined

  columns = ['name', 'action']
  actorsColumns = ['firstname', 'lastname', 'action']

  private arrayNumber: number[] = []

  formCharacter = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    actorIds: new FormControl(this.arrayNumber, [Validators.required]),
    actors: new FormControl(this.actors),
  })

  constructor(private service: ApiService,
    private actorService: ApiActorService,
    private seriesService: ApiSeriesService,
    private utils: UtilsService) { }

  ngOnInit(): void {
    combineLatest([
      this.actorService.getAll<PageResponse<Actor>>(0, 0),
      this.seriesService.getAll<PageResponse<Series>>(0, 0),
      this.service.getAll<PageResponse<Character>>(0, 0, 'character')
    ]).subscribe(([actorDtos, seriesDtos, characterDtos]) => {
      this.actors = actorDtos.content
      this.series = seriesDtos.content
      this.characters = characterDtos.content
    })
  }

  populate(character: Character) {
    this.utils.populate(character, this.formCharacter)

    let tempActors: Actor[] = []

    this.actors.forEach((e) => {
      if (this.formCharacter.controls.actorIds.value?.includes(e.id))
        tempActors.push(e)
    })
    this.formCharacter.controls.actors.setValue(tempActors)

    if (character.id == 0)
      this.toAddIndex = this.toAddCharacters.indexOf(character)

  }

  submit() {
    console.log(this.setValues());
    this.service.save<Character>('character', this.setValues()).pipe(
      mergeMap(() => this.service.getAll<PageResponse<Character>>(0, 0, 'character'))
    ).subscribe((dtos: PageResponse<Character>) => {
      this.characters = dtos.content
      this.utils.reset()
    })

  }

  saves() {
    this.service.saves<Character>('character', this.toAddCharacters).pipe(
      mergeMap(() => this.service.getAll<PageResponse<Character>>(0, 0, 'character'))
    ).subscribe((dtos: PageResponse<Character>) => {
      this.characters = dtos.content
      this.toAddCharacters = []
    })
  }

  add() {
    if (this.toAddIndex != -1) {
      this.toAddCharacters[this.toAddIndex] = this.setValues()
    }
    else {
      this.toAddCharacters.push(this.setValues())
    }
    this.notification++
    this.utils.reset()
    this.table?.renderRows()
  }


  removeFromList<E extends Base>(list: any[], index: number, table: MatTable<E>) {
    list.splice(index, 1)
    table.renderRows()
  }

  deletes(character: Character) {
    this.service.delete('character', character.id.toString()).pipe(
      mergeMap(() => this.service.getAll<PageResponse<Character>>(0, 0, 'character'))
    ).subscribe((dtos: PageResponse<Character>) => this.characters = dtos.content)
  }

  setValues() {
    this.formCharacter.controls.actorIds.setValue(this.formCharacter.controls.actors.value?.map(e => e.id)!)
    let character = new Character()
    Object.keys(character).forEach((e) => {
      const control = this.formCharacter.get(e)
      if (control)
        character[e] = control.value
    })

    return character
  }

  updateNotification(event: number) {
    if (event == 0)
      this.notification = 0
  }
}
