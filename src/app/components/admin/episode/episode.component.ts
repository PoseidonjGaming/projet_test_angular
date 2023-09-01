import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, mergeMap } from 'rxjs';
import { Episode } from 'src/app/models/episode.model';
import { Saison } from 'src/app/models/saison.model';
import { Series } from 'src/app/models/series.model';
import { ApiEpisodeService } from 'src/app/service/episode/api-episode.service';
import { ApiSaisonService } from 'src/app/service/saison/api-saison.service';
import { SeriesService } from 'src/app/service/series/series.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit {
  episodes: Episode[] = []
  toAddEpisodes: Episode[] = []
  series: Series[] = []
  saisons: Saison[] = []

  columns = ['nom', 'datePremDiff', 'action'] 

  formEpisode = new FormGroup({
    id: new FormControl(0),
    nom: new FormControl('', [Validators.required]),
    resume: new FormControl(''),
    datePremDiff: new FormControl(new Date()),
    saisonId: new FormControl(0, [Validators.required, Validators.min(1)]),
    seriesId: new FormControl(0, [Validators.required, Validators.min(1)])
  })

  constructor(private service: ApiEpisodeService,
    private seriesService: SeriesService,
    private saisonService: ApiSaisonService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string
  ) { }


  ngOnInit(): void {
    this.service.getAll('episode').subscribe((episodes: Episode[]) => {
      this.episodes = episodes
    })
    this.seriesService.getAll('series').subscribe((dtos: Series[]) => this.series = dtos);

  }

  populate(episode: Episode) {
    this.utilService.populate(episode, this.formEpisode)
  }

  deletes(episode: Episode) {
    this.service.delete('episode', episode.id.toString()).pipe(
      mergeMap(() => this.service.getAll('episode'))
    ).subscribe((dtos: Episode[]) => {
      this.episodes = dtos
      this.snack.open('Episode supprimé avec succès', 'Fermer', { duration: 5 * 1000 })
    })
  }

  getSaisons(series: Series) {
    this.saisonService.getBySeriesId(series.id.toString()).subscribe((dtos: Saison[]) => this.saisons = dtos)
  }

  add() {
    if (this.formEpisode.valid) {
      this.toAddEpisodes.push(this.formEpisode.value as Episode)
    }
  }

  submit() {
    if (this.formEpisode.valid) {
      const type = (this.formEpisode.controls.id.value! > 0) ? 'modifié' : 'ajouté'
      this.service.save('episode', this.formEpisode.value as Episode).pipe(
        mergeMap(() => this.service.getAll('episode'))
      ).subscribe((dtos: Episode[]) => {
        this.episodes = dtos
        this.snack.open(`Episode ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
        var resetForm = <HTMLFormElement>document.getElementById('form');
        resetForm.reset();
      })
    }

  }

  saves() {
    this.service.saves('episode', this.toAddEpisodes).pipe(
      mergeMap(() => this.service.getAll('episode'))
    ).subscribe((dtos: Episode[]) => {
      this.toAddEpisodes = []
      this.episodes = dtos
    })
  }

  remove(index: number) {
    this.toAddEpisodes.splice(index, 1)
  }
}
