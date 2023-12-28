import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Base } from '../../../../models/base.model';
import { CrudService } from '../../../../service/admin/crud/crud.service';
import { ApiService } from '../../../../service/api/api.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageResponse } from '../../../../models/pageResponse.model';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Sorter } from '../../../../models/Sorter.model';
import { CustomDataSource } from '../../../../models/customDataSource.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-table-crud',
  standalone: true,
  imports: [MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    DatePipe],
  templateUrl: './table-crud.component.html',
  styleUrl: './table-crud.component.css'
})
export class TableCRUDComponent implements OnInit {

  @Input({ required: true }) columns: { name: string, header: string }[] = []
  @Input({ required: true }) type = ''

  @Output() populateEvent = new EventEmitter<Base>()


  dataSource = new CustomDataSource()
  paginator = { pageSize: 10, pageIndex: 0, length: 10 }

  private sorting = { field: 'id', direction: Sorter.ASC }

  constructor(private service: ApiService, private crudService: CrudService, @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.crudService.get().subscribe({
      next: () => {
        this.sendRequest().subscribe((values: PageResponse<Base>) => {
          this.paginator.length = values.size
          this.dataSource.setData(values.content)

        })
      }
    })

    this.crudService.next(new Base())
  }

  paginate(event: PageEvent) {
    this.paginator.pageIndex = event.pageIndex
    this.paginator.pageSize = event.pageSize

    this.crudService.next(new Base())
  }

  sort(event: Sort) {
    this.sorting.field = (event.direction === '') ? 'id' : event.active
    this.sorting.direction = (event.direction === '' || event.direction === 'asc') ? Sorter.ASC : Sorter.DESC

    this.crudService.next(new Base())
  }

  delete(base: Base) {
    this.service.delete(this.type, base['id']).subscribe((value) => {
      if (this.dataSource.getData().length - 1 == 0)
        this.paginator.pageIndex = this.paginator.pageIndex - 1
      this.crudService.next(value)

    })
  }

  populate(base: Base) {
    this.populateEvent.emit(base)
  }

  private sendRequest() {
    return this.service.sortPaged(this.type,
      this.sorting.field, this.sorting.direction,
      this.paginator.pageSize, this.paginator.pageIndex)
  }


  getColumnNames() {
    return this.columns.map(c => c.name)
  }
}




