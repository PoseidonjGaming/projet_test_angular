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
import { AfficheDialogComponent } from '../affiche-dialog/affiche-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageResponse } from 'src/app/models/PageResponse.model';

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
  files: File[] = []

  temp: number[] = []

  formMovie = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null),
    summary: new FormControl(null),
    releaseDate: new FormControl(new Date()),
    poster: new FormControl(''),
    trailerUrl: new FormControl(null),
    categories: new FormControl(this.categories),
    categoryIds: new FormControl(this.temp),
    characters: new FormControl(this.characters),
    characterIds: new FormControl(this.temp)
  })

  constructor(private service: ApiService,
    private categoryService: ApiService,
    private characterService: ApiCharacterService,
    private utilsService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string
  ) { }


  ngOnInit(): void {
    combineLatest([
      this.service.getAllPaged<Movie>('movie', 10, 0),
      this.categoryService.getAllPaged<Category>('category', 10, 0),
      this.characterService.getAllPaged<Character>('character', 10, 0)
    ]).subscribe(([movieDtos, categoryDtos, characterDtos]) => {
      this.movies = movieDtos.content
      this.categories = categoryDtos.content
      this.characters = characterDtos.content
    })
  }

  set<T extends Base>(values: T[], list: T[], ids: number[]) {
    values.forEach(e => {
      if (ids.includes(e['id']))
        list.push(e)
    })
  }

  setPoster(event: any) {
    let file = event.target.files[0] as File
    console.log(file.name);

    if (!this.files.find((f: File) => file.name === f.name)) {
      this.files.push(file)
      this.formMovie.controls.poster.setValue(file.name as string)
    }
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
      this.categoryService.getAllPaged<Category>('category', 10, 0),
      this.characterService.getAllPaged<Character>('character', 10, 0)
    ]).subscribe(([categoryDtos, characterDtos]) => {
      this.set(categoryDtos.content,
        this.formMovie.controls.categories.value!,
        this.formMovie.controls.categoryIds.value!)

      this.set(characterDtos.content,
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

  openPosterDialog() {
    const file = this.files.find((value: File) => value.name === this.formMovie.controls.poster.value)
    if (file)
      this.dialog.open(AfficheDialogComponent, {
        data: file,
        height: '95%'
      });
    else
      this.snack.open("Aucune affiche n'a été sélectionnée", "Fermer", { duration: 5 * 1000 })
  }
}
