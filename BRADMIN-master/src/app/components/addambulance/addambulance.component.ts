import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Driver } from 'src/app/models/driver.model';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-addambulance',
  templateUrl: './addambulance.component.html',
  styleUrls: ['./addambulance.component.scss'],
})
export class AddAmbulanceComponent implements OnInit {

  signupForm: FormGroup;
  enregno = false;
  ennumpassengers = false;
  drivers: Driver[] = [];
  driverid;

  constructor(public router: Router, public auth: AuthService,
    public dbs: DatabaseService, public afs: AngularFirestore) { }

  ngOnInit() {
    this.getDrivers();
    this.signupForm = new FormBuilder().group({
      regno: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*[0-9-]*[a-zA-Z ]*')]],
      driverid: ['']
    });

  }

  get regno() { return this.signupForm.get('regno'); }

  get numPassengers() { return this.signupForm.get('numPassengers'); }



  navigate() {
    this.router.navigateByUrl('menu/signin');
  }

  createAmbulance() {

    if (this.signupForm.value.regno === '') {
      this.dbs.createAmbulance(this.signupForm.value.regno);
    } else {
      this.dbs.createAmbulance(this.signupForm.value.regno, this.signupForm.value.driverid);
    }

  }

  regEnable() {
    this.enregno = true;
  }

  numPassEnable() {
    this.ennumpassengers = true;
  }

  getDrivers() {
    this.afs.collection('driver').snapshotChanges().subscribe(data => {
      for (const dr of data) {
        const id = dr.payload.doc.id;
        const driverdata: any = dr.payload.doc.data();

        const driver = new Driver(id, driverdata.firstname, driverdata.lastname, driverdata.phone, driverdata.email);
        console.log(driver);
        if (!this.searchDriver(driver)) {
          this.drivers.push(driver);
        }

      }
    });
  }

  searchDriver(driver: Driver) {
    for (const dr of this.drivers) {
      if (dr.id === driver.id) {
        return true;
      }
    }
    return false;
  }


}
