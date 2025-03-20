import { Component, OnInit, inject } from '@angular/core';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { CommonModule } from '@angular/common';
import { AccountService } from '@app/services/account.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [TituloComponent, CommonModule, RouterModule] // Adicionado RouterModule
})
export class HomeComponent implements OnInit {
  
  accountService = inject(AccountService);
  isUserLoggedIn: boolean = false;

  constructor() { }

  ngOnInit() {
    this.accountService.currentUser$.subscribe(user => {
      this.isUserLoggedIn = !!user; // Se houver usuário, retorna true
    });
  }
}
