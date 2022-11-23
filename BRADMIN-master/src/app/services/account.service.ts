import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  user: User = {
    firstname: "Emmanuel",
    lastname: "Mametja",
    phone: "934343433",
    email: "makwale.em@gmail.com"
  };
  loginStatus = true
  constructor() { }
}
