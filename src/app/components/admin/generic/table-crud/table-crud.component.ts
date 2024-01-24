import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Base } from '../../../../models/base.model';
import { CrudService } from '../../../../service/admin/crud/crud.service';
import { ApiService } from '../../../../service/api/api.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject, Subscription, combineLatest, mergeMap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PageResponse } from '../../../../models/pageResponse.model';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Sorter } from '../../../../models/sorter.model';
import { CustomDataSource } from '../../../../models/customDataSource.model';
import { DatePipe } from '@angular/common';
import { UtilsService } from '../../../../service/utils/utils.service';


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
export class TableCRUDComponent implements OnInit, OnDestroy {

  @Input({ required: true }) columns: { name: string, header: string, display: string[] }[] = []
  @Input({ required: true }) type = ''
  @Input() typeMap = new Map<string, string>()

  @Output() populateEvent = new EventEmitter<Base>()


  dataSource = new CustomDataSource()
  paginator = { pageSize: 10, pageIndex: 0, length: 10 }

  private sorting = { field: 'id', direction: Sorter.ASC }
  private crudSub?: Subscription

  constructor(private service: ApiService,
    private crudService: CrudService,
    private utilsService: UtilsService,
    @Inject(LOCALE_ID) public locale: string) { }
  ngOnDestroy(): void {
    if (this.crudSub)
      this.crudSub.unsubscribe()
  }

  ngOnInit(): void {
    this.crudSub = this.crudService.get().subscribe({
      next: () => {
        this.sendRequest().pipe(
          mergeMap((values) => {
            this.paginator.length = values.size
            this.dataSource.setData(values.content)
            const obs = this.columns.filter(c => c.name.endsWith('Id')).map(c => {
              const idSet = new Set(values.content.map(e => e[c.name]))
              return this.service.getByIds(this.typeMap.get(c.name)!, Array.from(idSet))
            })
            return combineLatest(obs)
          })
        ).subscribe(values => {
          const filteredColumns = this.columns.filter(c => c.name.endsWith('Id'))
          filteredColumns.forEach(c => {
            const index = filteredColumns.indexOf(c)
            const relatedValue = values[index]
            this.dataSource.getData().forEach(source => {
              relatedValue.forEach(r => {
                if (r['id'] == source[c.name])
                  source[c.name.slice(0, c.name.length - 2)] = this.utilsService.getDisplay(r, c.display)
                else if (source[c.name] == 0)
                  source[c.name.slice(0, c.name.length - 2)] = 'Empty'
              })
            })
          })
        });

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
      if (this.dataSource.getData().length - 1 == 0 && this.paginator.pageIndex - 1 > 0)
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




