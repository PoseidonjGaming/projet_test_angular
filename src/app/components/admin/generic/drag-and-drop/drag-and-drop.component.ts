import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  copyArrayItem
} from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mergeMap, startWith } from 'rxjs';
import { Base } from '../../../../models/base.model';
import { MatchMode } from '../../../../models/enum/matchMode.model';
import { StringMatcher } from '../../../../models/enum/stringMatcher.model';
import { ApiService } from '../../../../service/api/api.service';
import { UtilsService } from '../../../../service/utils/utils.service';


@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.css'
})
export class DragAndDropComponent implements OnInit {

  @Input({ required: true }) form: FormGroup = new FormGroup({})
  @Input({ required: true }) propertyToDisplay: string = ''
  @Input({ required: true }) property: string = ''
  @Input({ required: true }) currentProperty: string = ''
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

    this.propertyList = this.property.slice(0, -3)
    this.form.addControl(this.propertyList, new FormControl<Base[]>([]))


    this.service.getAll(this.type).subscribe(values => {
      this.dragList = values
    })
  }

  drop(event: CdkDragDrop<Base[]>) {
    if (event.previousContainer.data === this.dragList && !event.container.data.includes(event.item.data)) {
      copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
      this.form.controls[this.property].setValue(event.container.data.map(v=>v['id']))

    } else if (event.previousContainer.data === this.form.controls[this.propertyList].value) {
      this.form.controls[this.propertyList].value.splice(this.form.controls[this.propertyList].value.indexOf(event.item.data), 1)
      this.form.controls[this.property].setValue(event.previousContainer.data.map(v => v['id']))
    }
  }

  isAlreadyPresent(item: CdkDrag<Base>, list: CdkDropList<Base[]>) {
    return !list.data.map(e => e['id']).includes(item.data['id'])
  }
}
