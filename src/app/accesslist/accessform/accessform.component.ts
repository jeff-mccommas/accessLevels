import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AccesslistService } from '../../accesslist/accesslist.service';
import { Subscription }   from 'rxjs/Subscription';
@Component({
  selector: 'app-accessform',
  templateUrl: './accessform.component.html',
  styleUrls: ['./accessform.component.css']
})
export class AccessformComponent implements OnInit {
  @Input() astronaut: string;
  confirmed = false;
  announced = false;
  subscription: Subscription;
  selectedAccessName:any = {
    name: "",
    readerId: null,
    Description: "",
    readerName: "",
    readerType: "",
    add: true
  };
  selectedAccessNameRef:any;
  readers = [];
  constructor(private accesslistService: AccesslistService) { 
    this.accesslistService.getReaders().subscribe((readers: any) => {
        this.readers = readers.json();
    });
    this.subscription = accesslistService.accessAnnounced$.subscribe(
      access => {
        if (!access.add) {
            this.selectedAccessName.edit = true;
            this.selectedAccessName = Object.assign({}, access);
            this.selectedAccessNameRef = access;
        } else {
          this.selectedAccessName.add = true;
          this.selectedAccessNameRef = null;
          this.cancel();
        }
    });
  }
  selectedValue: string;
  saveAccess() {
    //edit mode
    if (this.selectedAccessName && !this.selectedAccessName.add && this.selectedAccessName.name) {
      this.selectedAccessNameRef.name = this.selectedAccessName.name;
      this.selectedAccessNameRef.Description = this.selectedAccessName.Description;
      this.selectedAccessNameRef.readerId = this.selectedAccessName.readerId;
      var readerObj = this.accesslistService.getReaderById(this.selectedAccessNameRef.readerId);
      this.selectedAccessNameRef.readerName = readerObj.name;
      this.selectedAccessNameRef.readerType = readerObj.readerType;
    }
    //add mode
    if (this.selectedAccessName && this.selectedAccessName.add) {
      var readerObj = this.accesslistService.getReaderById(this.selectedAccessName.readerId);
      this.selectedAccessName.readerName = readerObj.name;
      this.selectedAccessName.readerType = readerObj.readerType;
      this.accesslistService.confirmaccess(this.selectedAccessName);
    }
  }
  cancel() {
    this.selectedAccessName.name = "";
    this.selectedAccessName.Description = "";
    this.selectedAccessName.readerId = "";
  }
  ngOnInit() {
  }

}
