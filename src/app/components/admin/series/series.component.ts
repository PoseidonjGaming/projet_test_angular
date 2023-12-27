import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MenuComponent } from '../../menu/menu.component';
import { DragAndDropComponent } from '../generic/drag-and-drop/drag-and-drop.component';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';
import { MatButtonModule } from '@angular/material/button';
import { CrudService } from '../../../service/admin/crud/crud.service';
import { Series } from '../../../models/series.model';
import { Base } from '../../../models/base.model';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [MenuComponent,
    TableCRUDComponent,
    ToAddTableComponent,
    FormComponent,
    DragAndDropComponent,
    ScrollingModule,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.css'
})
export class SeriesComponent {

  columns: { name: string, header: string }[] = [
    { name: 'name', header: 'Nom' }
  ]

  constructor(private crudService: CrudService) { }

  populate(series: Base) {
    console.log(series);
  }
}
