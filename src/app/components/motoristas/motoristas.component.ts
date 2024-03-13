import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-motoristas',
  standalone: true,
  templateUrl: './motoristas.component.html',
  styleUrls: ['./motoristas.component.scss'],
  imports: [CommonModule, TituloComponent, RouterOutlet],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MotoristasComponent implements OnInit {
  ngOnInit(): void {

  }
}
