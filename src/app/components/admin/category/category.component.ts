import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { mergeMap } from 'rxjs';
import { Sorter } from 'src/app/models/Sorter.model';
import { Category } from 'src/app/models/category.model';
import { ApiService } from 'src/app/service/api.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = []
  toAddCategories: Category[] = []
  columns = ['name', 'action']

  notification: number = 0

  @ViewChild('tableToAddCategries') table: MatTable<Category> | undefined

  formCategory = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(null, [Validators.required]),
    seriesIds: new FormControl(null)
  })

  constructor(private service: ApiService, public utilService: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll<Category>('category').subscribe((dtos: Category[]) => this.categories = dtos)
  }

  populate(category: Category) {
    this.utilService.populate(category, this.formCategory)
  }

  submit() {
    if (this.formCategory.valid) {
      this.service.save<Category>('category', this.setValue(new Category())).pipe(
        mergeMap(() => this.service.getAll<Category>('category'))
      ).subscribe((dtos: Category[]) => {
        this.categories = dtos
        this.utilService.reset()
      })
    }
  }

  sort(sort: Sort) {
    let field = sort.active;
    let dir: Sorter;
    switch (sort.direction) {
      case 'asc': {
        dir = Sorter.ASC
        break;
      }
      case 'desc': {
        dir = Sorter.DESC
        break;
      }
      default: {
        field = 'id'
        dir = Sorter.ASC
        break;
      }
    }

    this.service.sort<Category>('category', field, dir).subscribe((dtos: Category[]) => this.categories = dtos)
  }

  saves() {
    this.service.saves<Category>('category', this.toAddCategories).pipe(
      mergeMap(() => this.service.getAll<Category>('category'))
    ).subscribe((dtos: Category[]) => {
      this.categories = dtos
      this.toAddCategories = []
    })
  }
  add() {
    this.formCategory.markAllAsTouched()
    if (this.formCategory.valid) {
      let category = this.setValue(new Category())
      console.log(category);

      this.toAddCategories.push(category)
      this.notification++;
      this.utilService.updateTable(this.table!)

      this.utilService.reset()
      this.formCategory.controls.id.setValue(0)
    }
  }

  remove(index: number) {
    this.toAddCategories.splice(index, 1)
    this.utilService.updateTable(this.table!)
  }

  deletes(id: number) {
    this.service.delete('category', id.toString()).pipe(
      mergeMap(() => this.service.getAll<Category>('category'))
    ).subscribe((dtos: Category[]) => this.categories = dtos)
  }

  private setValue(category: Category) {
    Object.keys(this.formCategory.controls).forEach((e: string) => {
      let control = this.formCategory.get(e)
      if (control)
        category[e] = control.value
    })
    return category
  }

  updateNotification(event: number) {
    if (event == 0)
      this.notification = 0
  }


}
