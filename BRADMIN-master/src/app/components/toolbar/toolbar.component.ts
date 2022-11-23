import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  constructor(
    public afa: AngularFireAuth, public router: Router, public auth: AuthService,
    public dbs: DatabaseService,
    public popoverController: PopoverController,
    public acs: AccountService) { }

  ngOnInit() { }

  async profile(event) {
    const popover = await this.popoverController.create({
      component: ProfileComponent,
      cssClass: 'my-custom-class',
      translucent: true,
    });
    await popover.present();
  }

  signout() {
    this.router.navigateByUrl('');
    this.afa.signOut().then(res => {
      this.acs.loginStatus = false;
      this.dbs.isToolbarVisible = false;
      this.auth.isAuthorised = false;
      this.acs.user = null;

    });

    this.popoverController.dismiss();
  }
}
