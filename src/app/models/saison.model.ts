import { Base } from "./base.model";

export class Saison extends Base {
    id: number = 0
    seriesId: number = 0
    numero: number = 1;
    episodesIds: number[] = [];

    constructor(seriesId: number, numero: number) {
        super()
        this.seriesId = seriesId
        this.numero = numero
    }
}