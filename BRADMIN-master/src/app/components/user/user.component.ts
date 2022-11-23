import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { User } from 'src/app/models/user.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['checkbox', 'id', 'firstname', 'lastname', 'email', 'action'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;

  constructor(
    private dbs: DatabaseService,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  ngOnInit() {
    this.dbs.getUsers();
  }
  ngAfterViewInit() {

    setTimeout(() => {
      console.log(this.dbs.users);
      this.dataSource = new MatTableDataSource(this.dbs.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isVisible = false;
    }, 2000);
  }
  applyFilter(filter) {
    this.dataSource.filter = filter;
    this.selected = false;
    this.selecedtAll = false;
    this.users = [];
    this.isIndeterminate = false;
  }

  delete(id) {
    if (confirm('Are you sure you want to delete this user?')) {

      this.dbs.deleteUser(id);
      this.dbs.users = this.dbs.users.filter(user => user.id !== id);
      this.dataSource = new MatTableDataSource(this.dbs.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  select(checked, id) {

    this.isIndeterminate = true;
    this.selecedtAll = false;
    if (checked) {
      this.users.push(this.dataSource.filteredData.find(user => user.id === id));
    } else {
      this.users = this.users.filter(user => user.id !== id);
    }

    if (this.users.length === this.dataSource.filteredData.length) {
      this.isIndeterminate = false;
      this.selecedtAll = true;
    }

    if (this.users.length === 0) {
      this.selecedtAll = false;
      this.isIndeterminate = false;
    }



  }

  checkAll(checked) {

    this.isIndeterminate = false;

    if (checked) {
      this.selected = true;
      this.users = this.dataSource.filteredData;
      this.selecedtAll = true;
    } else {
      this.users = [];
      this.selecedtAll = false;
      this.selected = false;
    }

  }

  userDetails(id: string) {
    this.router.navigate(['home/users/' + id]);
  }

  generateReport() {

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text('Users REPORT', 115, 20);

    let index = 1;

    doc.cell(10, 40, 110, 10, 'Id'.toUpperCase(), index, 'left');
    doc.cell(10, 40, 55, 10, 'First Name'.toUpperCase(), index, 'left');
    doc.cell(10, 40, 55, 10, 'Last Name'.toUpperCase(), index, 'left');
    index++;

    if (this.selecedtAll) {


      for (const user of this.dataSource.filteredData) {

        doc.cell(10, 40, 110, 10, user.id, index, 'left');
        doc.cell(10, 40, 55, 10, user.firstname.toUpperCase(), index, 'left');
        doc.cell(10, 40, 55, 10, user.lastname.toUpperCase(), index, 'left');
        index++;
      }
    } else {


      for (const user of this.users) {

        doc.cell(10, 40, 110, 10, user.id, index, 'left');
        doc.cell(10, 40, 55, 10, user.firstname.toUpperCase(), index, 'left');
        doc.cell(10, 40, 55, 10, user.lastname.toUpperCase(), index, 'left');
        index++;
      }
    }
    doc.save('Users Report.pdf');
  }

  deleteSelected() {
    if (confirm('Are you sure you want to delete seleted users?')) {
      this.isIndeterminate = false;

      if (this.selecedtAll) {
        for (const user of this.dataSource.filteredData) {
          // this.dbs.deleteAllSlots(user.id);
        }
        this.snackBar.open('Users deleted', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        this.dbs.users = [];
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.users = [];

        this.selecedtAll = false;

      } else {
        for (const user of this.users) {
          // this.dbs.deleteAllSlots(user.id);
        }
        this.snackBar.open('Users deleted', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        for (const user of this.users) {
          this.dbs.users = this.dbs.users.filter(dr => dr.id !== user.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.users = [];
      }

    }

  }
}
