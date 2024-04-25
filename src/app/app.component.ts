import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { VeiculosComponent } from './components/veiculos/veiculos.component';
import { MotoristasComponent } from './components/motoristas/motoristas.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './shared/nav/nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MotoristaService } from './services/motorista.service';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AccountService } from './services/account.service';
import { User } from './models/identity/User';
import { VeiculoService } from './services/veiculo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MotoristaService, VeiculoService],
  imports: [
    CommonModule,
    RouterOutlet,
    VeiculosComponent,
    MotoristasComponent,
    HttpClientModule,
    NavComponent,
    NgbModule,
    PerfilComponent,
    NgxSpinnerModule,
  ],
})
export class AppComponent {
  constructor(
    public accountService: AccountService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setCurrentUser();
    }
  }

  setCurrentUser(): void {
    let user: User;

    if (localStorage.getItem('user'))
      user = JSON.parse(localStorage.getItem('user') ?? '{}');
    else user = null;

    if (user) this.accountService.setCurrentUser(user);
  }
}
