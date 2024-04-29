import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EMPTY, Subscription, combineLatest, iif, mergeMap, startWith } from 'rxjs';
import { Base } from '../../../../models/base.model';
import { CustomDataSource } from '../../../../models/customDataSource.model';
import { Sorter } from '../../../../models/sorter.model';
import { AdminService } from '../../../../service/admin/admin.service';
import { ApiService } from '../../../../service/api/api.service';


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

  @Input({ required: true }) columns: { name: string, type: string }[] = []
  @Input({ required: true }) type = ''
  @Input({ required: true }) typeMap = new Base()
  @Input({ required: true }) displayMap = new Base()
  @Output() populateEvent = new EventEmitter<Base>()


  dataSource = new CustomDataSource()
  paginator = { pageSize: 10, pageIndex: 0, length: 10 }

  private sorting = { field: 'id', direction: Sorter.ASC }

  private sub?: Subscription

  constructor(private service: ApiService, private adminService: AdminService,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  ngOnInit(): void {
    this.sub = this.adminService.get().pipe(
      mergeMap((value) => iif(() => value.isPost, this.sendRequest(), EMPTY)),
    ).subscribe(page => {
      this.dataSource.setData(page.content)
      this.paginator.length = page.size

    })
  }

  paginate(event: PageEvent) {
    this.paginator.pageIndex = event.pageIndex
    this.paginator.pageSize = event.pageSize

    this.sendRequest().subscribe((page) => {
      this.dataSource.setData(page.content)
      this.paginator.length = page.size
    })
  }

  sort(event: Sort) {
    this.sorting.field = (event.direction === '') ? 'id' : event.active
    this.sorting.direction = (event.direction === '' || event.direction === 'asc') ? Sorter.ASC : Sorter.DESC

    this.sendRequest().subscribe((page) => {
      this.dataSource.setData(page.content)
      this.paginator.length = page.size
    })

  }

  delete(base: Base) {
    this.service.delete(this.type, base['id']).subscribe(() => {
      if (this.dataSource.getData().length-- == 0 && this.paginator.pageIndex-- > 0)
        this.paginator.pageIndex = this.paginator.pageIndex--

      this.adminService.next({ dto: { id: '' }, isPost: true })
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




