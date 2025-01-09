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
import { VeiculoDetalheComponent } from './components/veiculos/veiculo-detalhe/veiculo-detalhe.component';
import { BuscaVeiculoPorPlacaComponent } from './components/veiculos/busca-veiculo-por-placa/busca-veiculo-por-placa.component';
import { BuscaVeiculoPorMotoristaComponent } from './components/veiculos/busca-veiculo-por-motorista/busca-veiculo-por-motorista.component';
import { CadastrarVeiculoMotoristaComponent } from './components/veiculos/cadastrar-veiculo-por-motorista/cadastrar-veiculo-por-motorista.component';
import { BuscaMotoristaPorCpfComponent } from './components/motoristas/busca-motorista-por-cpf/busca-motorista-por-cpf.component';
import { BuscaMotoristaPorLocalidadeComponent } from './components/motoristas/busca-motorista-por-localidade/busca-motorista-por-localidade.component';
import { CalculaEstadiaComponent } from './components/calculadora/calcula-estadia.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';

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
          { path: 'busca-por-cpf', component: BuscaMotoristaPorCpfComponent },
          { path: 'busca-por-regiao', component: BuscaMotoristaPorLocalidadeComponent },
          { path: 'lista', component: MotoristaListaComponent }
        ],
      },
      { path: 'veiculos', redirectTo: 'veiculos/lista' },
      {
        path: 'veiculos',
        component: VeiculosComponent,
        children: [
          { path: 'detalhe/:id', component: VeiculoDetalheComponent },
          { path: 'detalhe', component: VeiculoDetalheComponent },
          { path: 'busca-veiculo-por-placa', component: BuscaVeiculoPorPlacaComponent },
          { path: 'busca-veiculo-por-motorista', component: BuscaVeiculoPorMotoristaComponent },
          { path: 'cadastrar-veiculo-por-motorista', component: CadastrarVeiculoMotoristaComponent }
        ],
      },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent }
    ],
  },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  { path: 'home', component: HomeComponent },
  { path: 'calcula-estadia', component: CalculaEstadiaComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
