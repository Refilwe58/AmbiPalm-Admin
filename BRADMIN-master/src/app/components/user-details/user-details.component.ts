import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  user;
  nextKin;
  address;
  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private location: Location
  ) { }

  ngOnInit() {
    this.getUserDetails(this.activatedRoute.snapshot.params.id);
  }

  getUserDetails(id: string) {
    this.afs.collection('user').doc(id).snapshotChanges().subscribe(userData => {
      this.user = userData.payload.data();
      this.user.id = id;
      this.afs.collection('address', ref => ref.where('userid', '==', id)).snapshotChanges().subscribe(addressData => {
        this.address = addressData[0].payload.doc.data();
        if (this.user.nxtKinId) {
          this.afs.collection('user').doc(this.user.nxtKinId).snapshotChanges().subscribe(nxtKinData => {
            this.nextKin = nxtKinData.payload.data();
            this.nextKin.id = nxtKinData.payload.id;
            console.log(this.address);
            console.log(this.nextKin);
          });
        }
      });
    });
  }

  back() {
    this.location.back();
  }

}
