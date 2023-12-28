import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Base } from '../../../models/base.model';
import { CrudService } from '../../../service/admin/crud/crud.service';
import { ToAddService } from '../../../service/admin/toAdd/to-add.service';
import { ApiService } from '../../../service/api/api.service';
import { UtilsService } from '../../../service/api/utils/utils.service';
import { Character } from '../../../models/character.model';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragAndDropComponent } from '../generic/drag-and-drop/drag-and-drop.component';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [
    MenuComponent,
    FormComponent,
    TableCRUDComponent,
    ToAddTableComponent,
    DragAndDropComponent,
    MatTabsModule,
    ScrollingModule
  ],
  templateUrl: './character.component.html',
  styleUrl: './character.component.css'
})
export class CharacterComponent implements OnInit {
  type = 'character'

  columns: { name: string, header: string }[] = [
    { name: 'name', header: 'Nom' },
    { name: 'action', header: 'Action' }
  ]

  controls: { name: string, type: string }[] = []
  formCharacter?: FormGroup
  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()



  constructor(private formBuilder: FormBuilder,
    private service: ApiService,
    private crudService: CrudService,
    private toAddService: ToAddService,
    private utilsService: UtilsService) { }
  ngOnInit(): void {
    this.formCharacter = this.formBuilder.group(new Character())



    Object.keys(this.formCharacter.controls).forEach(control => {
      this.controls.push({ name: control, type: typeof (this.formCharacter?.controls[control].value) })
    })

    this.formCharacter.addControl('actor', new FormControl([]))


    this.displayMap.set('actorId', 'firstname')
    this.typeMap.set('actorId', 'actor')
  }

  populate(series: Base) {
    if (this.formCharacter) {
      this.utilsService.populate(series, this.formCharacter)
    }
  }

  submit(event: { dto: Base, type: string }) {
    if (event.type === 'submit')
      this.service.save(this.type, event.dto).subscribe((character) => {
        this.crudService.next(character)
      })
    else
      this.toAddService.next(event.dto)

  }

  saves(bases: Base[]) {
    this.service.saves(this.type, bases).subscribe(() => {
      this.crudService.next(new Character())
      this.toAddService.next(new Character())
    })
  }
}
