
export class Slot{
    id;
    from;
    to;
    date: Date;
    busid;
    avail;
    booked;
    status;

    constructor(id, from, to, date, busid, avail, booked, delivered?){
        this.id = id;

        this.from = from;

        this.to = to;

        this.date = date.toDate();

        this.busid = busid;

        this.avail = avail;

        this.booked = booked;

        if(delivered != undefined){
            if(delivered){
                this.status = "Delivered"
            }else{
                this.status = ""
            }
        }
    }
}