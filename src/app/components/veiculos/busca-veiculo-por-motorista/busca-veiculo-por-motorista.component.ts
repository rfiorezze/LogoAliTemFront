import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { Motorista } from '@app/models/Motorista';
import { MotoristaService } from '@app/services/motorista.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { CPFPipe } from '@app/helpers/cpf.pipe';
import { PhonePipe } from '@app/helpers/phone.pipe';
import { VeiculoService } from '@app/services/veiculo.service';
import { Veiculo } from '@app/models/Veiculo';
import { ConfirmationModalComponent } from '@app/shared/confirmation-modal/confirmation-modal.component';
import { NgxMaskDirective } from 'ngx-mask';
import { PlacaPipe } from '@app/helpers/placa.pipe';

@Component({
  selector: 'app-busca-veiculo-por-motorista',
  standalone: true,
  templateUrl: './busca-veiculo-por-motorista.component.html',
  styleUrl: './busca-veiculo-por-motorista.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    SharedModule,
    TituloComponent,
    RouterModule,
    CPFPipe,
    PhonePipe,
    PlacaPipe,
    NgxMaskDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BuscaVeiculoPorMotoristaComponent {
  public motorista: Motorista = null;
  public motoristaEncontrado: boolean = false;
  public veiculos: Veiculo[] = [];
  public veiculosFiltrados: any = [];
  public motoristaId = 0;
  public veiculoId = 0;
  public cpfInserido: string = '';

  constructor(
    private motoristaService: MotoristaService,
    private veiculoService: VeiculoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  public carregarMotoristaPorCpf(cpf: string): void {
    this.spinner.show();    
    this.motoristaService.getMotoristaByCpf(cpf).subscribe({
      next: (_motorista: Motorista) => {
        if(_motorista != null){
        this.motorista = _motorista;
        this.carregarVeiculosPorMotorista(this.motorista.id);
        }
        else{
          this.motorista = null;
          this.veiculos = null;
          this.veiculosFiltrados = this.veiculos;
          this.toastr.error(
            'Motorista não encontrado', 'Não encontrado');
        }
      },
      error: (error) => {
        this.motorista = null;
        this.veiculos = null;
        this.veiculosFiltrados = this.veiculos;
        this.spinner.hide();
        this.toastr.error(
          'Erro ao tentar buscar o motorista', 'Erro');
        console.log(error);
      },
      complete: () => this.spinner.hide(),
    });
  }

  public carregarVeiculosPorMotorista(idMotorista: number): void {
    this.motoristaId = idMotorista;
    this.spinner.show();    
    this.veiculoService.getVeiculosByMotoristaId(idMotorista).subscribe({
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

  detalheveiculo(id: number): void {
    this.router.navigate(
      ['veiculos/detalhe'],
      { queryParams: { id: id, motoristaId: this.motoristaId}}
    );
  }

  //Modal

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
            this.carregarVeiculosPorMotorista(this.motoristaId);
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
