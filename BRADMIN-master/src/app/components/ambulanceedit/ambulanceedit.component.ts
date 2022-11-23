import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Ambulance } from 'src/app/models/ambulance.model';
import { Driver } from 'src/app/models/driver.model';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-ambulanceedit',
  templateUrl: './ambulanceedit.component.html',
  styleUrls: ['./ambulanceedit.component.scss'],
})
export class AmbulanceEditComponent implements OnInit {

  signupForm: FormGroup;
  enregno = false;
  ennumpassengers = false;
  drivers: Driver[] = [];


  constructor(private router: Router, private auth: AuthService,
    private dbs: DatabaseService, private afs: AngularFirestore,
    private df: MatDialogRef<Ambulance>, @Inject(MAT_DIALOG_DATA) public ambulance: Ambulance) { }

  ngOnInit() {
    this.getDrivers();
    this.signupForm = new FormBuilder().group({
      regno: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*[0-9-]*[a-zA-Z ]*')]],
      driverid: ['']
    });

    this.signupForm.controls.regno.setValue(this.ambulance.regno);
    this.signupForm.controls.driverid.setValue(this.ambulance.driverId);

  }

  get regno() { return this.signupForm.get('regno'); }


  save() {

    this.dbs.updateAmbulance(this.ambulance.id, this.signupForm.value.regno,
      this.signupForm.value.numPassengers, this.signupForm.value.driverid);

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
