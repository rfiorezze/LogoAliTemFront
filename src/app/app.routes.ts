import { Routes } from '@angular/router';
import { MotoristasComponent } from './components/motoristas/motoristas.component';
import { VeiculosComponent } from './components/veiculos/veiculos.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MotoristaDetalheComponent } from './components/motoristas/motorista-detalhe/motorista-detalhe.component';
import { MotoristaListaComponent } from './components/motoristas/motorista-lista/motorista-lista.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', redirectTo: 'user/perfil' },
      { path: 'user/perfil', component: PerfilComponent },
      { path: 'motoristas', redirectTo: 'motoristas/lista' },
      {
        path: 'motoristas',
        component: MotoristasComponent,
        children: [
          { path: 'detalhe/:id', component: MotoristaDetalheComponent },
          { path: 'detalhe', component: MotoristaDetalheComponent },
          { path: 'lista', component: MotoristaListaComponent },
        ],
      },
      { path: 'veiculos', component: VeiculosComponent },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
    ],
  },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
