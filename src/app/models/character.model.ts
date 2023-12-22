import { Actor } from "./actor.model";
import { Base } from "./base.model";

export interface Character extends Base {
    id: number
    name: String
    actorId: number
    seriesIds: number[]
}