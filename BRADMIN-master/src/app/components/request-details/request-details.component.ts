import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent implements OnInit {
  request;
  user;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private afs: AngularFirestore) { }

  ngOnInit() {
    this.getRequestDetials(this.activatedRoute.snapshot.params.id);
  }

  back() {
    this.location.back();
  }

  getRequestDetials(id: string) {
    this.afs.collection('ambulance_request').doc(id).snapshotChanges().subscribe(data => {
      this.request = data.payload.data();
      this.request.id = data.payload.id;
      this.request.createdAt = this.request.createdAt.toDate();
      this.afs.collection('user').doc((data.payload.data() as any).userId).snapshotChanges().subscribe(userData => {
        this.user = userData.payload.data();
        this.user.id = userData.payload.id;
        console.log(this.request);
        console.log(this.user);
      });
    });
  }

}
