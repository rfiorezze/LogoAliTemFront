import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  templateUrl: './veiculos.component.html',
  styleUrls: ['./veiculos.component.scss'],
  imports: [CommonModule, TituloComponent, RouterOutlet],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VeiculosComponent implements OnInit {
  ngOnInit(): void {

  }
}
