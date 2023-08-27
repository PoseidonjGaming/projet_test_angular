
import { Saison } from "./saison.model"

export class Series {
    id: number = 0
    nom: String = ''
    dateDiff: Date = new Date()
    resume: String = ''
    affiche: String = ''
    urlBa: String = ''
    saisonsIds: number[] = []
}