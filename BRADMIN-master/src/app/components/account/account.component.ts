import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/services/account.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  signupForm: FormGroup;
  fenabled = false;
  lenabled = false;
  penabled = false;
  emenabled = false;
  passenabled = false;
  hasCode = false;
  disable;
  constructor(private router: Router, public auth: AuthService,
    private snackBar: MatSnackBar, private acs: AccountService, private dbs: DatabaseService) { }

  ngOnInit() {
    this.signupForm = new FormBuilder().group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      email: [''],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]{9}$')]],
    });

    this.signupForm.controls.firstname.setValue(this.acs.user.firstname);
    this.signupForm.controls.lastname.setValue(this.acs.user.lastname);
    this.signupForm.controls.phone.setValue(this.acs.user.phone);
    this.signupForm.controls.email.setValue(this.acs.user.email);
  }

  get firstname() { return this.signupForm.get('firstname'); }

  get lastname() { return this.signupForm.get('lastname'); }

  get email() { return this.signupForm.get('email'); }

  get phone() { return this.signupForm.get('phone'); }


  update() {
    this.dbs.updateProfile(this.signupForm.value.firstname, this.signupForm.value.lastname,
      this.signupForm.value.phone);

  }

  fnameEnable() {
    this.fenabled = true;
  }

  lnameEnable() {
    this.lenabled = true;
  }

  phoneEnable() {
    this.penabled = true;

  }

  emailEnable() {
    this.emenabled = true;
  }

  passEnable() {
    this.passenabled = true;
  }

  keydown() {

    if (String(this.signupForm.value.phone).length === 3) {
      this.hasCode = String(this.signupForm.value.phone).substring(0, 3) === '+27' ? true : false;
    };

  }



}
