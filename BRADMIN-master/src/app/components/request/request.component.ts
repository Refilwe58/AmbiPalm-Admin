import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Request } from 'src/app/models/request.model';
import { DatabaseService } from 'src/app/services/database.service';
import { jsPDF } from 'jspdf';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['checkbox', 'id', 'date', 'status'];
  dataSource: MatTableDataSource<Request>;
  requests: Request[] = [];
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;

  constructor(
    private dbs: DatabaseService,
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  ngOnInit() {
    this.dbs.getRequests();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.dbs.requests);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isVisible = false;
    }, 3000);
  }

  select(checked, id) {

    this.isIndeterminate = true;
    this.selecedtAll = false;
    if (checked) {
      this.requests.push(this.dataSource.filteredData.find(request => request.id === id));
    } else {
      this.requests = this.requests.filter(request => request.id !== id);
    }

    if (this.requests.length === this.dataSource.filteredData.length) {
      this.isIndeterminate = false;
      this.selecedtAll = true;
    }

    if (this.requests.length === 0) {
      this.selecedtAll = false;
      this.isIndeterminate = false;
    }



  }

  applyFilter(value) {
    this.dataSource.filter = value;
  }

  checkAll(checked) {

    this.isIndeterminate = false;

    if (checked) {
      this.selected = true;
      this.requests = this.dataSource.filteredData;
      this.selecedtAll = true;
    } else {
      this.requests = [];
      this.selecedtAll = false;
      this.selected = false;
    }

  }

  generateReport() {

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text('REQUEST REPORT', 115, 20);
    let index = 1;

    doc.cell(10, 40, 80, 10, 'Id', index, 'left');
    doc.cell(10, 40, 70, 10, 'Date & time'.toUpperCase(), index, 'left');
    doc.cell(10, 40, 70, 10, 'Status'.toUpperCase(), index, 'left');

    index++;

    if (this.selecedtAll) {



      for (const request of this.dataSource.filteredData) {

        doc.cell(10, 40, 80, 10, request.id, index, 'left');
        doc.cell(10, 40, 70, 10, request.date.toLocaleString(), index, 'left');
        doc.cell(10, 40, 70, 10, request.status, index, 'left');

        index++;
      }
    } else {

      for (const requestt of this.requests) {

        doc.cell(10, 40, 80, 10, requestt.id, index, 'left');
        doc.cell(10, 40, 70, 10, requestt.date.toLocaleString(), index, 'left');
        doc.cell(10, 40, 70, 10, requestt.status, index, 'left');

        index++;
      }
    }


    doc.save('Requests Report.pdf');



  }

  deleteSelected() {

    if (confirm('Are you sure you want to delete seleted requests?')) {
      this.isIndeterminate = false;

      if (this.selecedtAll) {
        for (const request of this.dataSource.filteredData) {
          this.dbs.deleteAllrequests(request.id);
        }
        this.snackBar.open('requests deleted', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        this.dbs.requests = [];
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.requests = [];

        this.selecedtAll = false;

      } else {
        for (const request of this.requests) {
          this.dbs.deleteAllrequests(request.id);
        }
        this.snackBar.open('requests deleted', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        for (const request of this.requests) {
          this.dbs.requests = this.dbs.requests.filter(dr => dr.id !== request.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.requests = [];
      }

    }

  }

  requestDetails(id: string) {
    this.router.navigate(['home/requests/' + id]);
  }

}
