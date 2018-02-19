import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatSort} from '@angular/material';
import {AccesslistService} from './accesslist.service';
@Component({
  selector: 'app-accesslist',
  templateUrl: './accesslist.component.html',
  styleUrls: ['./accesslist.component.css']
})
export class AccesslistComponent implements OnInit {
  displayedColumns = ['name', 'readerType', 'readerName'];
  dataSource;
  selectedAccessName:AccessList = {
    id: null,
    name: "",
    readerId: null,
    Description: "",
    readerName: "",
    readerType: "",
  };
nextaccess = 0;
listResponse;
  @ViewChild(MatSort) sort: MatSort;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue; // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSource.sort = this.sort;
  }
  constructor(private accesslistService:AccesslistService) {
    accesslistService.accessConfirmed$.subscribe(
      astronaut => {
        this.listResponse.push(astronaut);
        this.dataSource.data = this.listResponse;
      });
   }
   announce(row) {
    this.accesslistService.announceaccess(row);
  }
  ngOnInit() {
    this.getAcessList();
  }
  selectAccessName(row) {
    row.add = false;
    this.announce(row);
  }
  addAccessName() {
    this.announce({
        add: true
    });
  }
  getAcessList() {
    this.accesslistService.getReaders().subscribe((readers: any) => {
      this.accesslistService.getReadersTypes().subscribe((readerTypes: any) => {
        this.accesslistService.readers = readers.json();
        this.accesslistService.readersTypes = readerTypes.json();
        this.accesslistService.getAccessLevels().subscribe((accessList: any) => { 
          this.listResponse = accessList.json();
          let self = this;
          this.listResponse.forEach(function (item) {
            var readerObj = self.accesslistService.getReaderById(item.readerId);
            item.readerName = readerObj.name;
            item.readerType = readerObj.readerType;
          });
          this.dataSource = new MatTableDataSource(this.listResponse);
          this.dataSource.sort = this.sort;
         });
      });
    });
  }
}
export interface AccessList {
  id: number;
  name: string;
  readerId: number;
  Description: string;
  readerName?: string;
  readerType?: string;
}