import { Component, OnInit } from '@angular/core';
import { TituloComponent } from '@app/shared/titulo/titulo.component';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.scss'],
  imports: [TituloComponent]
})
export class VeiculosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
