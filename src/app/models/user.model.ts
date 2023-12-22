import { Base } from "./base.model"

export class User extends Base {
    username: string = ''
    roles: string = ''
    password: string | null = null
    avatarFile: string = ''
}