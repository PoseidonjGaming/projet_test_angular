import { DataSource } from "@angular/cdk/collections";
import { ReplaySubject, Observable } from "rxjs";
import { Base } from "./base.model";

export class CustomDataSource extends DataSource<Base>{
    private _dataStream = new ReplaySubject<Base[]>();
    private datas: Base[] = []

    constructor() {
        super();
    }

    connect(): Observable<Base[]> {
        return this._dataStream;
    }

    disconnect() { }

    getData() {
        return this.datas
    }

    setData(data: Base[]) {
        this.datas = data
        this._dataStream.next(data);
    }

    addData(value: Base, index: number) {

        if (index > 0) {
            this.datas[index] = value
        }
        else if (index == 0) {
            this.datas.push(value)
        } else {
            this.datas = []
        }

        this.setData(this.datas)
    }

    removeData(index: number) {
        this.setData(this.datas.slice(index, index))
    }


}