import { Component, OnInit } from '@angular/core';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { CommonModule } from '@angular/common';
import { MotoristaService } from '@app/services/motorista.service';
import { VeiculoService } from '@app/services/veiculo.service';
import { EstadiaService } from '@app/services/estadia.service';
import { ReboqueService } from '@app/services/reboque.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, TituloComponent],
})
export class DashboardComponent implements OnInit {
  qtdMotoristas: number = 0;
  qtdVeiculos: number = 0;

  qtdEstadias: number = 0;
  qtdCertidoes: number = 0;
  percConversaoEstadia: string = '0';

  qtdReboquesCalculados: number = 0;
  qtdReboquesContratados: number = 0;
  percConversaoReboque: string = '0';

  constructor(
    private motoristaService: MotoristaService,
    private veiculoService: VeiculoService,
    private estadiaService: EstadiaService,
    private reboqueService: ReboqueService
  ) {}

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  carregarIndicadores(): void {
    this.motoristaService.getQuantidadeMotoristas().subscribe({
      next: qtd => this.qtdMotoristas = qtd,
      error: err => console.error('Erro ao buscar motoristas', err)
    });

    this.veiculoService.getQuantidadeVeiculos().subscribe({
      next: qtd => this.qtdVeiculos = qtd,
      error: err => console.error('Erro ao buscar veículos', err)
    });

    this.estadiaService.obterIndicadores().subscribe({
      next: dados => {
        this.qtdEstadias = dados.totalCalculos;
        this.qtdCertidoes = dados.totalCertidoes;
        this.percConversaoEstadia = dados.taxaConversao;
      },
      error: err => console.error('Erro ao buscar indicadores de estadia', err)
    });

    this.reboqueService.obterIndicadores().subscribe({
      next: dados => {
        this.qtdReboquesCalculados = dados.totalCalculos;
        this.qtdReboquesContratados = dados.totalContratacoes;
        this.percConversaoReboque = dados.taxaConversao;
      },
      error: err => console.error('Erro ao buscar indicadores de reboque', err)
    });
  }
}
