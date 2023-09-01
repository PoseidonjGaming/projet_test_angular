import { Base } from "./base.model"

export class Episode extends Base {
    
    id: number = 0
    nom: String = ''
    resume: String = ''
    datePremDiff: Date = new Date()
    saisonId: number = 0
    seriesId: number = 0
}