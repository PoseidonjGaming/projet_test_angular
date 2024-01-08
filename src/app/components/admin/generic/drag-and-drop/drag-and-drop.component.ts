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
import { ApiService } from '../../../../service/api/api.service';
import { MatchMode } from '../../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../../models/enum/StringMatcher.model';
import { UtilsService } from '../../../../service/utils/utils.service';


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

  propertyList: string = ''

  dragList: Base[] = []

  formSearch = new FormGroup({
    term: new FormControl('')
  })

  constructor(private service: ApiService, private snack: MatSnackBar, private utilsService: UtilsService) { }

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
      this.propertyList = this.utilsService.getRelatedName(this.property, 3)
      this.form.addControl(this.propertyList, new FormControl([]))

      this.service.getAll(this.type).subscribe(values => {
        this.dragList = values
      })

      console.log(this.form.value);

    }


  }

  drop(event: CdkDragDrop<Base[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.data === this.dragList) {

        const item = event.previousContainer.data[event.previousIndex]
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        this.dragList.splice(event.previousIndex, 0, item)
      }
      else if (event.previousContainer.data === this.form?.get(this.propertyList)?.value) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        this.dragList.splice(event.currentIndex, 1)
      }

    }
  }
}
