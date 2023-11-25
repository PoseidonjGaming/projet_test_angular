import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { mergeMap } from 'rxjs/operators';
import { Base } from 'src/app/models/base.model';
import { ApiService } from 'src/app/service/api.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {


  notification: number = 0
  toAdd: Base[] = []
  files: File[] = []

  @Input() type: string = ''
  @Input() columns: string[] = []
  @Output() listOutput = new EventEmitter<Base[]>()
  @Output() populateOutput = new EventEmitter<Base>()

  @ViewChild('tableToAdd') tableToAdd: MatTable<Base> | undefined

  constructor(private service: ApiService,
    private utilService: UtilsService,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string) { }

  saves() {
    this.service.saveFiles(this.files).pipe(
      mergeMap(() => this.service.saves<Base>(this.type, this.toAdd)),
      mergeMap(() => this.service.getAll<Base>(this.type))
    ).subscribe((dtos: Base[]) => {
      this.toAdd = []
      this.listOutput.emit(dtos)
      this.snack.open(`${this.type} modifié et/ou ajoutés avec succès`, 'Fermer', { duration: 5 * 1000 })
    })

  }

  remove(index: number) {
    this.toAdd.splice(index, 1)
    this.utilService.updateTable(this.tableToAdd!)
  }
  populate(dto: Base) {
    this.populateOutput.emit(dto)
  }

  update(toAdd: Base[]) {
    this.toAdd = toAdd
    this.utilService.reset()
    this.utilService.updateTable(this.tableToAdd!)
  }
}
