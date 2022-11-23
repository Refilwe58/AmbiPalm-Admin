

export class Request {
    id;
    status;
    date;
    constructor(id, status, date?) {

        this.id = id;

        this.date = date;

        this.status = status;

        this.date = date?.toDate();

    }
}
