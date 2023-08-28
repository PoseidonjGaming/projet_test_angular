
import { Saison } from "./saison.model"

export class Series {
    id: number = 0
    nom: string = ''
    dateDiff: Date = new Date()
    resume: string = ''
    affiche: string = ''
    urlBa: string = ''
    saisonsIds: number[] = []
}