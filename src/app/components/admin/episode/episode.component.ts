import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mergeMap } from 'rxjs';
import { Episode } from 'src/app/models/episode.model';
import { Season } from 'src/app/models/season.model';
import { Series } from 'src/app/models/series.model';
import { ApiEpisodeService } from 'src/app/service/episode/api-episode.service';
import { ApiSeasonService } from 'src/app/service/season/api-season.service';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';
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
  saisons: Season[] = []

  columns = ['name', 'releaseDate', 'action']

  formEpisode = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    summary: new FormControl(''),
    releaseDate: new FormControl(new Date()),
    seasonId: new FormControl(0),
    seriesId: new FormControl(0, [Validators.required, Validators.min(1)]),
    isNewSaison: new FormControl(false)
  })

  constructor(private service: ApiEpisodeService,
    private seriesService: ApiSeriesService,
    private saisonService: ApiSeasonService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string
  ) {
  }


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
    this.saisonService.getBySeriesId(series.id.toString()).subscribe((dtos: Season[]) => this.saisons = dtos)
  }

  add() {
    if (this.formEpisode.valid) {
      this.toAddEpisodes.push(this.setValue(new Episode()))
    }
  }

  submit() {
    if (this.formEpisode.valid) {
      if (this.formEpisode.controls.isNewSaison.value) {
        this.saisonService.save('saison', new Season(this.formEpisode.controls.seriesId.value!, this.saisons.length + 1)).pipe(
          mergeMap(() => this.saisonService.getBySeriesId(this.formEpisode.controls.seriesId.value?.toString()!)),
          mergeMap((dtos: Season[]) => {
            this.formEpisode.controls.seasonId.setValue(dtos.slice(-1)[0].id)
            return this.service.save('episode', this.setValue(new Episode()))
          }),
          mergeMap(() => this.service.getAll('episode'))
        ).subscribe((dtos: Episode[]) => {
          this.episodes = dtos
          const type = (this.formEpisode.controls.id.value! > 0) ? 'modifié' : 'ajouté'
          this.snack.open(`Episode ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })

        })
      }
      else {
        this.service.save('episode', this.setValue(new Episode())).pipe(
          mergeMap(() => this.service.getAll('episode'))
        ).subscribe((dtos: Episode[]) => {
          this.episodes = dtos
          const type = (this.formEpisode.controls.id.value! > 0) ? 'modifié' : 'ajouté'
          this.snack.open(`Episode ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
        })
      }

      var resetForm = <HTMLFormElement>document.getElementById('form');
      resetForm.reset();
    }

  }

  saves() {
    this.service.saves('episode', this.toAddEpisodes).pipe(
      mergeMap(() => this.service.getAll('episode'))
    ).subscribe((dtos: Episode[]) => {
      this.toAddEpisodes = []
      this.episodes = dtos

      this.snack.open(`Episodes modifié et/ou ajoutés avec succès`, 'Fermer', { duration: 5 * 1000 })

    })
  }

  remove(index: number) {
    this.toAddEpisodes.splice(index, 1)
  }

  setValue(episode: Episode) {
    Object.keys(episode).forEach((e) => {
      const control = this.formEpisode.get(e)
      if (control)
        episode[e] = control.value
    })
    return episode
  }
}
