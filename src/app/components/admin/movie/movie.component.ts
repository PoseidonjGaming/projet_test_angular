import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, forkJoin } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Movie } from 'src/app/models/movie.model';
import { ApiService } from 'src/app/service/api.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movies: Movie[] = []
  toAddMovie: Movie[] = []
  categories: Category[] = []
  columns = ['name', 'releaseDate', 'action']
  notification: number = 0

  formMovie = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null),
    summary: new FormControl(null),
    releaseDate: new FormControl(new Date()),
    categories: new FormControl(this.categories)
  })

  constructor(private service: ApiService<Movie>,
    private categoryService: ApiService<Category>,
    private utilsService: UtilsService,
    @Inject(LOCALE_ID) public locale: string
  ) { }


  ngOnInit(): void {


    combineLatest([
      this.service.getAll('movie'),
      this.categoryService.getAll('category')
    ]).subscribe(([movieDtos, categoryDtos]) => {
      this.movies = movieDtos
      this.categories = categoryDtos
    })
  }

  add() {

  }

  submit() {

  }

  saves() {

  }

  remove(index: number) {

  }

  deletes(movie: Movie) {

  }

  populate(movie: Movie) {
    this.utilsService.populate(movie, this.formMovie)
  }

  updateNotif(event: number) {

  }

  drop(event: CdkDragDrop<Category[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );


    }
  }

  search(term: string) {

  }
}
