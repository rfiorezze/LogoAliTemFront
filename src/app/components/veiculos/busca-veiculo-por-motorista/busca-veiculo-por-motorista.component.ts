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
    PhonePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BuscaVeiculoPorMotoristaComponent {
  public motoristas: Motorista[] = [];
  public motoristasFiltrados: any = [];
  public veiculos: Veiculo[] = [];
  public veiculosFiltrados: any = [];
  public motoristaId = 0;
  public veiculoId = 0;

  private _filtroLista: string = '';

  public get filtroLista() {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.motoristasFiltrados = this.filtroLista
      ? this.filtrarMotoristas(this.filtroLista)
      : this.motoristas;
  }

  filtrarMotoristas(filtrarPor: string): Motorista[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.motoristas.filter(
      (motorista: Motorista) =>
        motorista.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        motorista.cpf.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        motorista.numeroCNH.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private motoristaService: MotoristaService,
    private veiculoService: VeiculoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.carregarMotoristas();
  }

  public carregarMotoristas(): void {
    this.motoristaService.getMotoristas().subscribe({
      next: (_motoristas: Motorista[]) => {
        this.motoristas = _motoristas;
        this.motoristasFiltrados = this.motoristas;
      },
      error: (error) => {
        this.spinner.hide();
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
