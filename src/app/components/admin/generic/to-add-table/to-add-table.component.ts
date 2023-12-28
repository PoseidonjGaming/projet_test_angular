import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { Base } from '../../../../models/base.model';
import { CustomDataSource } from '../../../../models/customDataSource.model';
import { MatButtonModule } from '@angular/material/button';
import { CrudService } from '../../../../service/admin/crud/crud.service';
import { ToAddService } from '../../../../service/admin/toAdd/to-add.service';
import { ApiService } from '../../../../service/api/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-to-add-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './to-add-table.component.html',
  styleUrl: './to-add-table.component.css'
})
export class ToAddTableComponent implements OnInit {


  @Input({ required: true }) columns: { name: string, header: string }[] = []
  @Input({ required: true }) type = ''

  @Output() populateEvent = new EventEmitter<Base>()
  @Output() saveEvent = new EventEmitter<Base[]>()

  dataSource = new CustomDataSource()

  private index = 0

  constructor(private toAddService: ToAddService, @Inject(LOCALE_ID) public locale: string) { }


  ngOnInit(): void {   
    this.toAddService.get().subscribe((value) => {
      this.dataSource.addData(value, this.index)
    })
  }

  save() {
    this.index = -1
    this.saveEvent.emit(this.dataSource.getData())
  }

  populate(dto: Base, index: number) {
    this.index = index
    this.populateEvent.emit(dto)
  }

  getColumnsName() {
    return this.columns.map(c => c.name)
  }

  remove(index: number) {
    this.dataSource.removeData(index)
  }
}
