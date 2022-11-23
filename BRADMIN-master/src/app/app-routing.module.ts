import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddAmbulanceComponent } from './components/addambulance/addambulance.component';
import { AdddriverComponent } from './components/adddriver/adddriver.component';
import { AddstudentComponent } from './components/addstudent/addstudent.component';
import { RequestComponent } from './components/request/request.component';
import { AmbulanceComponent } from './components/ambulance/ambulance.component';
import { HomePage } from './components/home/home.page';
import { DriverComponent } from './components/driver/driver.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthComponent } from './components/unauth/unauth.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'unauth',
    component: UnauthComponent,
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [],
    children: [
      {
        path: '',
        component: DriverComponent
      },
      {
        path: 'driver',
        component: DriverComponent
      },
      {
        path: 'ambulances',
        component: AmbulanceComponent
      },

      {
        path: 'addbus',
        component: AddAmbulanceComponent
      },
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: 'users/:id',
        component: UserDetailsComponent
      },

      {
        path: 'addstudent',
        component: AddstudentComponent
      },

      {
        path: 'requests',
        component: RequestComponent
      },
      {
        path: 'requests/:id',
        component: RequestDetailsComponent
      },
      {
        path: 'account',
        component: AccountComponent
      }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
