import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  cities = ['Ahmedabad', 'Surat', 'Rajakot', 'Vadodara', 'Gandhinagar'];
  selected = 'Surat';
  checked: string;
  mycity = 'ahmedabad';
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  selectedButton: string;
  bgColor = 'primary';
  color = 'accent';
  constructor() {
  }

  ngOnInit() {
  }

  onChange(event) {
    console.log(event);
  }

}
