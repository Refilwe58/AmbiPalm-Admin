import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ambulance } from 'src/app/models/ambulance.model';
import { DatabaseService } from 'src/app/services/database.service';
import { jsPDF } from 'jspdf';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmbulanceEditComponent } from '../ambulanceedit/ambulanceedit.component';
import { AddAmbulanceComponent } from '../addambulance/addambulance.component';


@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.component.html',
  styleUrls: ['./ambulance.component.scss'],
})
export class AmbulanceComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['checkbox', 'id', 'regno', 'status', 'action'];
  dataSource: MatTableDataSource<Ambulance>;
  ambulances: Ambulance[] = [];
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;
  constructor(private dbs: DatabaseService, private afs: AngularFirestore,
    public dialog: MatDialog, private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.dbs.getAmbulances();

  }
  ngAfterViewInit() {

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.dbs.ambulances);
      console.log(this.dbs.ambulances);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isVisible = false;
    }, 2000);

  }


  applyFilter(filter) {
    this.dataSource.filter = filter;
    this.selected = false;
    this.selecedtAll = false;
    this.ambulances = [];
    this.isIndeterminate = false;
  }

  deleteAmbulance(id) {
    if (confirm('Are you sure you want to delete this ambulance?')) {
      this.dbs.deleteAmbulance(id);
      this.dbs.ambulances = this.dbs.ambulances.filter(ambulance => ambulance.id !== id);
      this.dataSource = new MatTableDataSource(this.dbs.ambulances);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  addAmbulance() {
    const dialogRef = this.dialog.open(AddAmbulanceComponent, {
      height: '250px',
      width: '450px',
    });
  }
  openDialog(ambulance) {
    const dialogRef = this.dialog.open(AmbulanceEditComponent, {
      height: '250px',
      width: '450px',
      data: ambulance
    });
  }

  select(checked, id) {

    this.isIndeterminate = true;
    if (checked) {
      this.ambulances.push(this.dataSource.filteredData.find(ambulance => ambulance.id === id));
    } else {
      this.ambulances = this.ambulances.filter(ambulance => ambulance.id !== id);
      this.selecedtAll = false;
    }

    if (this.ambulances.length === this.dataSource.filteredData.length) {
      this.isIndeterminate = false;
      this.selecedtAll = true;
    }

    if (this.ambulances.length === 0) {
      this.selecedtAll = false;
      this.isIndeterminate = false;
    }

  }

  checkAll(checked) {

    this.selected = checked;

    if (checked) {
      this.ambulances = this.dataSource.filteredData;
      this.selecedtAll = checked;
      this.selected = checked;
      this.isIndeterminate = false;
    } else {
      this.ambulances = [];
    }

  }

  generateReport() {

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text('Ambulances REPORT', 115, 20);
    let index = 1;

    doc.cell(48, 40, 110, 10, 'Id'.toUpperCase(), index, 'left');
    doc.cell(48, 40, 80, 10, 'Registration No'.toUpperCase(), index, 'left');

    index++;

    if (this.selecedtAll) {

      for (const ambulance of this.dataSource.filteredData) {

        doc.cell(48, 40, 110, 10, ambulance.id, index, 'left');
        doc.cell(48, 40, 80, 10, ambulance.regno, index, 'left');
        index++;
      }


    } else {

      for (const ambulance of this.ambulances) {

        doc.cell(48, 40, 110, 10, ambulance.id, index, 'left');
        doc.cell(48, 40, 80, 10, ambulance.regno, index, 'left');
        index++;
      }

    }
    doc.save('Ambulances Report.pdf');
  }

  deleteSelected() {

    if (confirm('Are you sure you want to delete seleted ambulances?')) {
      this.isIndeterminate = false;

      if (this.selecedtAll) {
        for (const ambulance of this.dataSource.filteredData) {
          this.dbs.deleteAllambulances(ambulance.id);
        }
        this.snackBar.open('Ambulances deleted', '', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        this.dbs.ambulances = [];
        this.ambulances = [];
        this.dataSource = new MatTableDataSource(this.dbs.ambulances);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


      } else {

        for (const ambulance of this.ambulances) {
          this.dbs.deleteAllambulances(ambulance.id);

        }
        this.snackBar.open('Ambulances deleted', '', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        for (const ambulance of this.ambulances) {
          this.dbs.ambulances = this.dbs.ambulances.filter(bs => bs.id !== ambulance.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.ambulances);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ambulances = [];
      }

    }

  }

}


