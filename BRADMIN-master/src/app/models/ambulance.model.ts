
export class Ambulance {

    id;

    regno;

    driverId;

    status;

    constructor(id, regno, status, driverId?) {
        this.id = id;

        this.regno = regno;

        this.driverId = driverId;

        this.status = status;

    }
}
