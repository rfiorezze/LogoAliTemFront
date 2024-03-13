import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { Motorista } from '@app/models/Motorista';
import { MotoristaService } from '@app/services/motorista.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '@app/shared/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { CPFPipe } from '@app/helpers/cpf.pipe';
import { PhonePipe } from '@app/helpers/phone.pipe';

@Component({
  selector: 'app-motorista-lista',
  standalone: true,
  templateUrl: './motorista-lista.component.html',
  styleUrl: './motorista-lista.component.scss',
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
export class MotoristaListaComponent {
  public motoristas: Motorista[] = [];
  public motoristasFiltrados: any = [];
  public motoristaId = 0;

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

  detalheMotorista(id: number): void {
    this.router.navigate([`motoristas/detalhe/${id}`]);
  }

  title = 'angular-reusable-modal';

  @ViewChild('confirmationModal')
  private modalComponent!: ConfirmationModalComponent;

  modalStyle: string = 'modal-style-danger';
  modalTitle: string = 'Atenção';
  // modalBody: string = `Tem certeza que deseja deletar o motorista de Id ${this.motoristaId}`;
  modalButtonColor: string = 'btn-danger';

  async openModal() {
    return await this.modalComponent.open();
  }

  getConfirmationValue(value: any) {
    this.spinner.show();
    this.motoristaService
      .deleteMotorista(this.motoristaId)
      .subscribe(
        (result: any) => {
          if (result.message === 'Deletado') {
            this.toastr.success('O motorista foi deletado com sucesso', 'Deletado!');
            this.carregarMotoristas();
          }
        },
        (error: any) => {
          console.error(error);
          this.toastr.error(
            `Erro ao tentar deletar o motorista ${this.motoristaId}`, 'Erro');
        }
        ).add(() => this.spinner.hide());
  }

  open(event: any, motoristaId: number) {
    event.stopPropagation();
    this.motoristaId = motoristaId;
    this.openModal();
  }
}
