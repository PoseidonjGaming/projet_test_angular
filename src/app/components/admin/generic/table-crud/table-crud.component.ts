import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Subject, mergeMap } from 'rxjs';
import { Sorter } from 'src/app/models/Sorter.model';
import { Base } from 'src/app/models/base.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-table-crud',
  templateUrl: './table-crud.component.html',
  styleUrl: './table-crud.component.css'
})
export class TableCRUDComponent implements OnInit {

  @Input() type = ''
  @Input() columns: string[] = []
  @Input() headers: string[] = []

  @Output() populateEvent = new EventEmitter<Base>()

  dataSource = new Subject<Base[]>()

  length = 10

  private paginator = { pageSize: 10, pageIndex: 0 }
  private sort = { active: 'id', direction: Sorter.ASC }

  constructor(private service: ApiService, @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.sendRequest().subscribe(dtos => {
      this.dataSource.next(dtos.content)
      this.length = dtos.size
    })
  }

  populate(base: Base) {
    this.populateEvent.emit(base)
  }

  delete(base: Base) {
    this.service.delete(this.type, base['id']).pipe(
      mergeMap(() => this.sendRequest())
    ).subscribe(dto => {
      this.length = dto.size
      this.dataSource.next(dto.content)
    })
  }

  page(event: PageEvent) {
    this.paginator = { pageSize: event.pageSize, pageIndex: event.pageIndex }
    this.sendRequest().subscribe(dto => {
      this.length = dto.size
      this.dataSource.next(dto.content)
    })
  }

  sorting(event: Sort) {
    if (event.direction == 'asc' || event.direction === '') {
      this.sort.direction = Sorter.ASC
    } else {
      this.sort.direction = Sorter.DESC
    }

    if (event.direction === '')
      this.sort.active = 'id'
    else
      this.sort.active = event.active

    this.sendRequest().subscribe(dtos => {
      this.dataSource.next(dtos.content)
      this.length = dtos.size
    })
  }

  private sendRequest() {
    return this.service.sortPaged(this.type,
      this.sort.active, this.sort.direction,
      this.paginator.pageSize, this.paginator.pageIndex)
  }

}
