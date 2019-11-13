import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  checked: string;
  mycity = 'ahmedabad';


  constructor() { }

  ngOnInit() {
  }
  onChange(event) {
    console.log(event);
  }

}
