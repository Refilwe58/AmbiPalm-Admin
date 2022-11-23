import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { jsPDF } from 'jspdf';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [MatDialog]
})
export class HomePage implements OnInit, AfterViewInit {

  constructor(public dbs: DatabaseService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dbs.isToolbarVisible = true;
  }

  generate(cat) {
    let name;
    let report;
    const doc = new jsPDF({
      orientation: 'l',
    });


    let index = 1;

    if (cat === 'd') {
      name = 'Drivers Report.pdf';

      doc.text('DRIVERS REPORT', 115, 20);

      doc.cell(10, 40, 110, 10, 'Id'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'First Name'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'Last Name'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'Phone No'.toUpperCase(), index, 'left');

      index++;

      for (const driver of this.dbs.drivers) {

        doc.cell(10, 40, 110, 10, driver.id, index, 'left');
        doc.cell(10, 40, 55, 10, driver.firstname.toUpperCase(), index, 'left');
        doc.cell(10, 40, 55, 10, driver.lastname.toUpperCase(), index, 'left');
        doc.cell(10, 40, 55, 10, `0${driver.phone}`, index, 'left');


        index++;
      }



    } else if (cat === 'b') {

      console.log(this.dbs.ambulances);

      name = 'Ambulances Report.pdf';

      doc.text('Ambulances REPORT', 115, 20);

      doc.cell(48, 40, 110, 10, 'Id'.toUpperCase(), index, 'left');
      doc.cell(48, 40, 80, 10, 'Registration No'.toUpperCase(), index, 'left');

      index++;

      for (const bus of this.dbs.ambulances) {

        doc.cell(48, 40, 110, 10, bus.id, index, 'left');
        doc.cell(48, 40, 80, 10, bus.regno, index, 'left');
        index++;
      }

    } else if (cat === 'sl') {



      name = 'Slots Report.pdf';

      doc.text('SLOTS REPORT', 115, 20);

      doc.cell(10, 40, 80, 10, 'Id'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'From'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'To'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 70, 10, 'Date & time'.toUpperCase(), index, 'left');

      index++;

      for (const slot of this.dbs.slots) {

        doc.cell(10, 40, 80, 10, slot.id, index, 'left');
        doc.cell(10, 40, 55, 10, slot.from.toUpperCase(), index, 'left');
        doc.cell(10, 40, 55, 10, slot.to.toUpperCase(), index, 'left');
        doc.cell(10, 40, 70, 10, slot.date.toLocaleString(), index, 'left');


        index++;
      }

    } else if (cat === 'st') {


      name = 'users Report.pdf';

      doc.text('users REPORT', 115, 20);

      doc.cell(10, 40, 110, 10, 'Id'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'First Name'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'Last Name'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 55, 10, 'user No'.toUpperCase(), index, 'left');

      index++;

      for (const user of this.dbs.users) {

        doc.cell(10, 40, 110, 10, user.id, index, 'left');
        doc.cell(10, 40, 55, 10, user.firstname.toUpperCase(), index, 'left');
        doc.cell(10, 40, 55, 10, user.lastname.toUpperCase(), index, 'left');
        index++;
      }

    } else if (cat === 'bk') {

      name = 'Bookings Report.pdf';

      doc.text('BOOKINGS REPORT', 115, 20);

      doc.cell(10, 40, 80, 10, 'Id', index, 'left');
      doc.cell(10, 40, 70, 10, 'Booking Date & time'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 70, 10, 'Initial & Last Name'.toUpperCase(), index, 'left');
      doc.cell(10, 40, 50, 10, 'user No'.toUpperCase(), index, 'left');

      index++;

      // for (const booking of this.dbs.bookings) {

      //   doc.cell(10, 40, 80, 10, booking.id, index, 'left');
      //   doc.cell(10, 40, 70, 10, booking.date.toLocaleString(), index, 'left');
      //   doc.cell(10, 40, 70, 10, `${booking.user.firstname.toUpperCase().substring(0, 1)} 
      //   ${booking.user.lastname.toUpperCase()}`, index, 'left');
      //   doc.cell(10, 40, 50, 10, String(booking.user.userNumber), index, 'left');

      //   index++;
      // }

    }

    doc.save(name);

  }


}
