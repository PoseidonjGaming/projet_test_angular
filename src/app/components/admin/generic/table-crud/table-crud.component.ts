import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Observable, Subject, mergeMap } from 'rxjs';
import { Base } from '../../../../models/base.model';
import { PageResponse } from '../../../../models/pageResponse.model';
import { ApiService } from '../../../../service/api.service';

@Component({
  selector: 'app-table-crud',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './table-crud.component.html',
  styleUrl: './table-crud.component.css'
})
export class TableCRUDComponent implements OnInit {


  @Input({ required: true }) columns: { name: string, header: string }[] = []
  @Input({ required: true }) type = ''

  @Output() populateEmitter = new EventEmitter<Base>()

  @Input({ required: true }) dataSource = new Subject<Base[]>()

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.columns.push({ name: 'action', header: 'Action' })
    this.sendRequest().subscribe((dtos: PageResponse<Base>) => {
      this.dataSource.next(dtos.content)
    })
  }

  populate(dto: Base) {
    this.populateEmitter.emit(dto)
  }

  delete(dto: Base) {
    this.service.delete(this.type, dto['id']).pipe(
      mergeMap(() => this.sendRequest())
    ).subscribe((dtos: PageResponse<Base>) => this.dataSource.next(dtos.content))
  }

  getColumnNames() {
    return this.columns.map(c => c.name)
  }
  sendRequest(): Observable<PageResponse<Base>> {
    return this.service.getAllPaged(this.type, 10, 0)
  }
}


