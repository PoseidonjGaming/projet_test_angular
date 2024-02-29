import { Base, BaseType } from "./base.model";

export class Actor extends Base {
    id: number = 0
    lastname: string = ''
    firstname: string = ''
    characterIds: number[] = []
}

export class ActorType extends BaseType {
    id = 'id'
    lastname = 'string'
    firstname = 'string'
    characterIds = 'ids'
}