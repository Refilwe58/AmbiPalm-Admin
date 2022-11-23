import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { HomePage } from './components/home/home.page';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DriverComponent } from './components/driver/driver.component';
import { AmbulanceComponent } from './components/ambulance/ambulance.component';
import { AdddriverComponent } from './components/adddriver/adddriver.component';
import { AddAmbulanceComponent } from './components/addambulance/addambulance.component';
import { UserComponent } from './components/user/user.component';
import { AddstudentComponent } from './components/addstudent/addstudent.component';
import { RequestComponent } from './components/request/request.component';

import { MatDialog } from '@angular/material/dialog';
import { DrivereditComponent } from './components/driveredit/driveredit.component';
import { AmbulanceEditComponent } from './components/ambulanceedit/ambulanceedit.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthComponent } from './components/unauth/unauth.component';
import { AccountComponent } from './components/account/account.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { Location } from '@angular/common';
const firebaseConfig = {
  apiKey: 'AIzaSyCsKBwG7VSGwF9G0SMTLr0ZMjdHPubr9jE',
  authDomain: 'ampipalm.firebaseapp.com',
  projectId: 'ampipalm',
  storageBucket: 'ampipalm.appspot.com',
  messagingSenderId: '66175782572',
  appId: '1:66175782572:web:f201d4fbf5a060e423d909',
  measurementId: 'G-7Q1KT83HBR'
};
@NgModule({
  declarations: [AppComponent,
    HomePage,
    ToolbarComponent,
    DriverComponent,
    AmbulanceComponent,
    AdddriverComponent,
    AddAmbulanceComponent,
    UserComponent,
    UserDetailsComponent,
    AddstudentComponent,
    DrivereditComponent,
    AmbulanceEditComponent,
    RequestComponent,
    RequestDetailsComponent,
    LoginComponent,
    AccountComponent],
  entryComponents: [DrivereditComponent],
  imports: [BrowserModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MatDialog, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],

})
export class AppModule { }
