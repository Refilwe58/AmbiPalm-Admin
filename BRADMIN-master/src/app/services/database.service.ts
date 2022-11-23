import { Injectable } from '@angular/core';
import { Driver } from '../models/driver.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Slot } from '../models/slot.model';
import { Request as Request } from '../models/request.model';
import { Ambulance } from '../models/ambulance.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  drivers: Driver[] = [];
  users: User[] = [];
  slots: Slot[] = [];
  requests: Request[] = [];
  ambulances: Ambulance[] = [];
  isToolbarVisible = false;

  constructor(private afs: AngularFirestore, private snackBar: MatSnackBar,
    private auth: AuthService, private acs: AccountService, private router: Router) { }

  createSlot(from, to, datetime, ambulanceid, numPassagners) {
    this.auth.isVisible = true;
    this.afs.collection('Slot').add({
      from,
      to,
      date: datetime,
      ambulanceid,
      avail: numPassagners,
      booked: 0,
      delivered: ''
    }).then(() => {

      this.snackBar.open('Slot is created', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.auth.isVisible = false;
    });
  }

  updateProfile(firstname, lastname, phone) {
    this.auth.isVisible = true;
    this.afs.collection('admin').doc(this.acs.user.id).update({
      firstname,
      lastname,
      phone
    }).then(() => {
      this.auth.isUpdated = true;
      this.auth.isVisible = false;
      this.snackBar.open('Profile updated', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

    });
  }

  createAmbulance(regno, id?) {
    this.auth.isVisible = true;
    console.log(regno);
    if (this.searchAmbulanceByReg(regno)) {
      this.snackBar.open(`Ambulance with registration number ${regno} is already added`, '', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.auth.isVisible = false;

    } else {
      if (id !== '' && id !== undefined) {
        if (this.searchAssignedDrivers(id)) {
          this.snackBar.open('Ambulance driver cannot be assigned to more than 1 ambulance', '', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'

          });

          this.auth.isVisible = false;
        } else {
          this.afs.collection('ambulance').add({
            regno,
            driverId: id,
            status: 'unavailable',
            geo: [0, 0],
          }).then(() => {
            this.snackBar.open('ambulance is added', '', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.auth.isVisible = false;
          });
        }
      } else {

        this.afs.collection('ambulance').add({
          regno,
          driverId: '',
          status: 'unavailable',
          geo: [0, 0]
        }).then(() => {
          this.snackBar.open('Ambulance is added', '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.auth.isVisible = false;
        });
      }
    }


  }

  searchAmbulanceByReg(regno) {
    for (const ambulance of this.ambulances) {
      if (ambulance.regno === regno) {
        return true;
      }
    }
    return false;
  }

  searchAssignedDrivers(id) {
    for (const ambulance of this.ambulances) {
      if (ambulance.driverId === id) {
        return true;
      }
    }
    return false;
  }

  deleteDriver(id) {

    this.auth.isVisible = true;

    this.afs.collection('driver').doc(id).delete().then(() => {

      this.afs.collection('ambulance', ref => ref.where('driverId', '==', id)).snapshotChanges().subscribe(data => {
        for (const d of data) {
          this.afs.collection('ambulance').doc(d.payload.doc.id).update({
            driverId: ''
          }).then(() => {
            this.auth.isVisible = false;

          });
        }

      });

      this.snackBar.open('Driver is deleted', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.auth.isVisible = false;
    });

    this.drivers = this.drivers.filter(driver => driver.id !== id);
  }

  deleteambulance(id) {
    this.auth.isVisible = true;

    this.afs.collection('ambulance').doc(id).delete().then(() => {
      this.snackBar.open('ambulance is deleted', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.auth.isVisible = false;
    });

  }

  deletSlot(id) {
    this.auth.isVisible = true;

    this.afs.collection('Slot').doc(id).delete().then(() => {
      this.snackBar.open('Slot is deleted', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.auth.isVisible = true;
    });

    this.afs.collection('Booking', ref => ref.where('slotid', '==', id)).snapshotChanges().subscribe(data => {
      for (const d of data) {
        this.afs.collection('Booking').doc(d.payload.doc.id).delete();
      }
    });

    this.slots = this.slots.filter(slot => slot.id !== id);
  }

  deleteStudent(id) {
    this.auth.isVisible = true;
    this.afs.collection('Student').doc(id).delete().then(() => {
      this.snackBar.open('Student is deleted', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

      this.auth.isVisible = false;
    });

    this.afs.collection('Booking', ref => ref.where('studentid', '==', id)).snapshotChanges().subscribe(data => {
      for (const d of data) {
        this.afs.collection('Booking').doc(d.payload.doc.id).delete();
      }
    });

    this.users = this.users.filter(student => student.id !== id);
  }

  updateDriver(id, firstname, lastname, phone) {
    this.auth.isVisible = true;

    this.afs.collection('driver').doc(id).update({
      firstname,
      lastname,
      phone
    }).then(() => {
      this.snackBar.open('Driver is updated', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

      this.auth.isVisible = false;
    });

    this.drivers.filter(driver => {
      if (driver.id === id) {
        driver.firstname = firstname;

        driver.lastname = lastname;

        driver.phone = phone;
      }
    });
  }

  updateAmbulance(id, regno, pass, drid) {

    this.auth.isVisible = true;

    if (drid !== '' && drid !== undefined) {
      if (this.searchAssignedDrivers(drid)) {
        this.snackBar.open('Ambulance driver cannot be assigned to more than 1 ambulance', '', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'

        });

        this.afs.collection('ambulance').doc(id).update({
          regno,
          numPassangers: pass,
        }).then(() => {
          this.snackBar.open('ambulance is updated', '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          this.ambulances.filter(ambulance => {
            if (ambulance.id === id) {
              ambulance.regno = regno;
            }
          });

          this.auth.isVisible = false;
        });

        this.auth.isVisible = false;
      } else {

        this.ambulances.filter(ambulance => {
          if (ambulance.id === id) {
            ambulance.driverId = drid;
          }
        });

        this.afs.collection('ambulance').doc(id).update({
          regno,
          numPassangers: pass,
          driverId: drid
        }).then(() => {
          this.snackBar.open('Ambulance is updated', '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          this.ambulances.filter(ambulance => {
            if (ambulance.id === id) {
              ambulance.regno = regno;
              ambulance.driverId = drid;
            }
          });

          this.auth.isVisible = false;
        });
      }
    } else {

      this.afs.collection('ambulance').doc(id).update({
        regno,
        numPassangers: pass
      }).then(() => {
        this.snackBar.open('ambulance is updated', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        this.auth.isVisible = false;
      });

    }

  }

  getDrivers() {
    this.afs.collection('driver').snapshotChanges().subscribe(data => {
      for (const dr of data) {
        const id = dr.payload.doc.id;
        const driverdata: any = dr.payload.doc.data();
        const driver = new Driver(id, driverdata.firstname, driverdata.lastname, driverdata.phone, driverdata.email);
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

  getAmbulances() {
    this.afs.collection('ambulance').snapshotChanges().subscribe(data => {
      for (const dr of data) {
        const id = dr.payload.doc.id;
        const ambulancedata: any = dr.payload.doc.data();
        if (ambulancedata.driverId === '' || ambulancedata.driverId === undefined) {

          const ambulance = new Ambulance(id, ambulancedata.regno, ambulancedata.status, '');

          if (!this.searchambulance(ambulance)) {
            this.ambulances.push(ambulance);
          }

        } else {

          this.afs.collection('driver').doc(ambulancedata.driverId).snapshotChanges().subscribe(drData => {

            const driverdata: any = drData.payload.data();

            const driver = new Driver(ambulancedata.driverId, driverdata?.firstname,
              driverdata?.lastname, driverdata?.phone, driverdata?.email);

            const ambulance = new Ambulance(id, ambulancedata.regno, ambulancedata.status, driver.id);

            if (!this.searchambulance(ambulance)) {

              this.ambulances.push(ambulance);

            }

          });
        }

      }
    });
  }

  getUsers() {
    this.afs.collection('user').snapshotChanges().subscribe(data => {
      for (const d of data) {
        this.users.push(new User(d.payload.doc.id,
          (d.payload.doc.data() as any).firstname, (d.payload.doc.data() as any).lastname, (d.payload.doc.data() as any).email));
      }
    });
  }

  searchambulance(ambulance: Ambulance) {
    for (const dr of this.ambulances) {
      if (dr.id === ambulance.id) {
        return true;
      }
    }
    return false;
  }

  deleteAllDrivers(id) {
    this.afs.collection('driver').doc(id).delete();
  }

  deleteAllambulances(id) {
    this.afs.collection('ambulance').doc(id).delete();
    this.snackBar.open('Ambulance is deleted', '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

  }

  deleteAmbulance(id) {
    this.afs.collection('ambulance').doc(id).delete();
  }

  deleteAllrequests(id) {
    this.afs.collection('Booking').doc(id).delete();
  }

  deleteUser(id: any) {
    throw new Error('Method not implemented.');
  }

  getRequests() {
    this.afs.collection('ambulance_request').snapshotChanges().subscribe(data => {
      for (const d of data) {
        this.requests.push(new Request(d.payload.doc.id,
          (d.payload.doc.data() as any).status, (d.payload.doc.data() as any).createdAt));
      }
    });
  }
}
