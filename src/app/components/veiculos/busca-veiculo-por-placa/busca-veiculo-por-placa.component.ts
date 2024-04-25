import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { Veiculo } from '@app/models/Veiculo';
import { VeiculoService } from '@app/services/veiculo.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '@app/shared/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-busca-veiculo-por-placa',
  standalone: true,
  templateUrl: './busca-veiculo-por-placa.component.html',
  styleUrl: './busca-veiculo-por-placa.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    SharedModule,
    TituloComponent,
    RouterModule,
    NgxMaskDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BuscaVeiculoPorPlacaComponent {
  public veiculos: Veiculo[] = [];
  public veiculosFiltrados: any = [];
  public veiculoId = 0;
  public placaInserida: string = '';

  constructor(
    private veiculoService: VeiculoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  public carregarVeiculosPorPlaca(placa: string): void {
    this.spinner.show();    
    this.veiculoService.getVeiculosByPlaca(placa.toUpperCase()).subscribe({
      next: (_veiculos: Veiculo[]) => {
        this.veiculos = _veiculos;
        this.veiculosFiltrados = this.veiculos;
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
      complete: () => this.spinner.hide(),
    });
  }

  detalheveiculo(id: number, motoristaId: number): void {
    this.router.navigate(
      ['veiculos/detalhe'],
      { queryParams: { id: id, motoristaId: motoristaId}}
    );
  }

  title = 'angular-reusable-modal';

  @ViewChild('confirmationModal')
  private modalComponent!: ConfirmationModalComponent;

  modalStyle: string = 'modal-style-danger';
  modalTitle: string = 'Atenção';
  // modalBody: string = `Tem certeza que deseja deletar o veiculo de Id ${this.veiculoId}`;
  modalButtonColor: string = 'btn-danger';

  async openModal() {
    return await this.modalComponent.open();
  }

  getConfirmationValue(value: any) {
    this.spinner.show();
    this.veiculoService
      .deleteVeiculo(this.veiculoId)
      .subscribe(
        (result: any) => {
          if (result.message === 'Deletado') {
            this.toastr.success('O veiculo foi deletado com sucesso', 'Deletado!');
            this.carregarVeiculosPorPlaca(this.placaInserida);
          }
        },
        (error: any) => {
          console.error(error);
          this.toastr.error(
            `Erro ao tentar deletar o veiculo ${this.veiculoId}`, 'Erro');
        }
        ).add(() => this.spinner.hide());
  }

  open(event: any, veiculoId: number) {
    event.stopPropagation();
    this.veiculoId = veiculoId;
    this.openModal();
  }
}
