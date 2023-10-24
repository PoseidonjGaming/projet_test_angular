import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { Base } from 'src/app/models/base.model';
import { Category } from 'src/app/models/category.model';
import { Character } from 'src/app/models/character.model';
import { Movie } from 'src/app/models/movie.model';
import { ApiService } from 'src/app/service/api.service';
import { ApiCharacterService } from 'src/app/service/character/api-character.service';
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
  characters: Character[] = []
  columns = ['name', 'releaseDate', 'action']
  notification: number = 0

  temp: number[] = []

  formMovie = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null),
    summary: new FormControl(null),
    releaseDate: new FormControl(new Date()),
    categories: new FormControl(this.categories),
    categoryIds: new FormControl(this.temp),
    characters: new FormControl(this.characters),
    characterIds: new FormControl(this.temp)
  })

  constructor(private service: ApiService,
    private categoryService: ApiService,
    private characterService: ApiCharacterService,
    private utilsService: UtilsService,
    @Inject(LOCALE_ID) public locale: string
  ) { }


  ngOnInit(): void {
    combineLatest([
      this.service.getAll<Movie>('movie'),
      this.categoryService.getAll<Category>('category'),
      this.characterService.getAll<Character>()
    ]).subscribe(([movieDtos, categoryDtos, characterDtos]) => {
      this.movies = movieDtos
      this.categories = categoryDtos
      this.characters = characterDtos
    })
  }

  set<T extends Base>(values: T[], list: T[], ids: number[]) {
    values.forEach(e => {
      if (ids.includes(e['id']))
        list.push(e)
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

    combineLatest([
      this.categoryService.getAll<Category>('category'),
      this.characterService.getAll<Character>()
    ]).subscribe(([categoryDtos, characterDtos]) => {
      this.set(categoryDtos,
        this.formMovie.controls.categories.value!,
        this.formMovie.controls.categoryIds.value!)

      this.set(characterDtos,
        this.formMovie.controls.characters.value!,
        this.formMovie.controls.characterIds.value!)
    })
  }

  updateNotif(event: number) {

  }

  drop<T>(event: CdkDragDrop<T[]>) {
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
