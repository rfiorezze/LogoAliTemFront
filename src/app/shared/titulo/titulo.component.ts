import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  standalone:true,
  styleUrls: ['./titulo.component.scss'],
  imports:[CommonModule]
})
export class TituloComponent implements OnInit {
@Input() titulo?: string;
@Input() subtitulo?: string;
@Input() iconClass?: string;
@Input() botaoListar = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  listar(): void{
    this.router.navigate([`/${this.titulo?.toLocaleLowerCase()}/lista`]);
  }
}
