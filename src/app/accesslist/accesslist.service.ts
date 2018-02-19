import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Subject }    from 'rxjs/Subject';
@Injectable()
export class AccesslistService {
  accessLevelsApi = "https://jsonblob.com/api/6288ae43-14b9-11e8-b68a-1b36f9d3cc31";
  readerTypesApi = "https://jsonblob.com/api/0af94c0d-14bb-11e8-b68a-2b3580ecc1a0";
  readersApi = "https://jsonblob.com/api/fb4a1956-14ba-11e8-b68a-4f0a5ced34ac";
  constructor(private http: Http) { }
   private accessAnnouncedSource = new Subject<any>();
   private accessConfirmedSource = new Subject<any>();
 
   accessAnnounced$ = this.accessAnnouncedSource.asObservable();
   accessConfirmed$ = this.accessConfirmedSource.asObservable();
   readersTypes;
   readers;
  getReaderTypeById(id) {
    var i = 0;
    var readerTypeObj;
    while (i < this.readersTypes.length) {
      if (this.readersTypes[i].id == id) {
        readerTypeObj = this.readersTypes[i];
        break;
      }
      i += 1;
    }
    return readerTypeObj;
  }
  getReaderById(readerid) {
    var i = 0;
    var readerObj;
    while (i < this.readers.length) {
      if (this.readers[i].id  == readerid) {
        readerObj = this.readers[i];
        readerObj.readerType = this.getReaderTypeById(readerObj.typeId).name;
        break;
      }
      i += 1;
    }
    return readerObj;
  }
  
  announceaccess(access: any) {
    this.accessAnnouncedSource.next(access);
  }
 
  confirmaccess(astronaut: any) {
    this.accessConfirmedSource.next(astronaut);
  }
  getHeader = function () {
    let header = new Headers();
    header.append("Content-Type", "application/json");
    return {headers: header};
  }
  getAccessLevels() {
    return this.http.get(this.accessLevelsApi, this.getHeader());
  }
  getReadersTypes() {
    return this.http.get(this.readerTypesApi, this.getHeader());
  }
  getReaders() {
    return this.http.get(this.readersApi, this.getHeader());
  }
}
