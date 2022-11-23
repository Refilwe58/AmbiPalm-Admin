import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthorised = false;
  isVisible = false;
  isUpdated = false;
  constructor(private afa: AngularFireAuth, private afs: AngularFirestore,
    private acs: AccountService, private router: Router,
    private snackBar: MatSnackBar) { }

  createDriver(name: string, surname: string, phone: number, email: string, password: string) {
    this.isVisible = true;
    this.afa.createUserWithEmailAndPassword(email, password).then(userCredentials => {
      const id = userCredentials.user.uid;
      this.afs.collection('driver').doc(id).set({
        firstname: name,
        lastname: surname,
        phone,
        email,
      }).then(res => {

        this.snackBar.open('Driver profile is created', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        this.isVisible = false;

      }).catch(error => {

        this.snackBar.open(error.message, '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isVisible = false;
      });

    }).catch(error => {
      this.snackBar.open(error.message, '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.isVisible = false;
    });
  }
  signin(email, password) {
    this.isVisible = true;
    this.afa.signInWithEmailAndPassword(email, password).then(res => {

      this.afs.collection('admin').doc(res.user.uid).snapshotChanges().subscribe(data => {

        if (data.payload.data()) {
          this.isAuthorised = true;
          this.isVisible = false;
          if (!this.isUpdated) {
            this.router.navigateByUrl('home');
          } else {
            this.router.navigateByUrl('home/account');
          }
          this.acs.user = data.payload.data();
          this.acs.user.id = res.user.uid;

        } else {
          this.isVisible = false;
          if (!this.isUpdated) {
            this.router.navigateByUrl('home');
          } else {
            this.router.navigateByUrl('home/account');
          }
        }
      });
    }).catch(error => {
      this.snackBar.open(error.message, '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.isVisible = false;
    });
  }
}
