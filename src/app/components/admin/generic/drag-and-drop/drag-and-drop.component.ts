import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mergeMap, startWith } from 'rxjs';
import { Base } from '../../../../models/base.model';
import { ApiService } from '../../../../service/api.service';
import { MatchMode } from '../../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../../models/enum/StringMatcher.model';


@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.css'
})
export class DragAndDropComponent implements OnInit {

  @Input({ required: true }) form?: FormGroup
  @Input({ required: true }) propertyToDisplay: string = ''
  @Input({ required: true }) property: string = ''
  @Input({ required: true }) type: string = ''

  dragList: Base[] = []

  formSearch = new FormGroup({
    term: new FormControl('')
  })

  constructor(private service: ApiService, private snack: MatSnackBar) { }
  ngOnInit(): void {

    this.formSearch.controls.term.valueChanges.pipe(
      startWith(''),
      mergeMap(value => {
        let searchDto = new Base()
        searchDto[this.propertyToDisplay] = value
        return this.service.search(this.type, searchDto,
          MatchMode.ALL, StringMatcher.CONTAINING, null, null)
      })
    ).subscribe((dtos: Base[]) => this.dragList = dtos)

    if (this.form) {
      this.service.getAll(this.type).subscribe((dtos: Base[]) => this.dragList = dtos)
      this.form.get(this.property)?.setValue([])
      this.form.addControl(this.type, new FormControl<Base[]>([]))
    }

  }

  drop(event: CdkDragDrop<Base[]>) {
    const base = event.previousContainer.data[event.previousIndex]
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (!event.container.data.includes(base)) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.dragList.push(base)
    } else {
      this.snack.open('L\'élément est déjà présent dans la liste cible', 'Fermer', { duration: 5 * 1000 })
    }
  }
}
