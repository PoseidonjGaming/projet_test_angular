import { Base } from "./base.model"

export class Series extends Base{
   
    id: number = 0
    nom: string = ''
    dateDiff: Date = new Date()
    resume: string = ''
    affiche: string = ''
    urlBa: string = ''
    saisonsIds: number[] = []
}