import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Base } from '../../../../models/base.model';
import { CustomDataSource } from '../../../../models/customDataSource.model';

@Component({
  selector: 'app-to-add-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './to-add-table.component.html',
  styleUrl: './to-add-table.component.css'
})
export class ToAddTableComponent implements OnInit, OnDestroy {


  @Input({ required: true }) columns: { name: string, type: string }[] = []
  @Input({ required: true }) type = ''

  @Output() populateEvent = new EventEmitter<Base>()
  @Output() saveEvent = new EventEmitter<Base[]>()

  dataSource = new CustomDataSource()

  private index = 0
  private toAddSub?: Subscription

  constructor(@Inject(LOCALE_ID) public locale: string) { }
  ngOnDestroy(): void {
    if (this.toAddSub)
      this.toAddSub.unsubscribe()
  }


  ngOnInit(): void {
    
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
