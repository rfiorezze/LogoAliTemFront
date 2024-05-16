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
import { NgxMaskDirective } from 'ngx-mask';
import { ConfirmationModalComponent } from '@app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-busca-motorista-por-cpf',
  standalone: true,
  templateUrl: './busca-motorista-por-cpf.component.html',
  styleUrl: './busca-motorista-por-cpf.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    SharedModule,
    TituloComponent,
    RouterModule,
    CPFPipe,
    PhonePipe,
    NgxMaskDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BuscaMotoristaPorCpfComponent {
  public motorista: Motorista = null;
  public cpfInserido: string = '';

  constructor(
    private motoristaService: MotoristaService,
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
        }
        else{
          this.motorista = null;
          this.toastr.error(
            'Motorista não encontrado', 'Não encontrado');
        }
      },
      error: (error) => {
        this.motorista = null;
        this.spinner.hide();
        this.toastr.error(
          'Erro ao tentar buscar o motorista', 'Erro');
        console.log(error);
      },
      complete: () => this.spinner.hide(),
    });
  }

  detalheMotorista(id: number): void {
    this.router.navigate([`motoristas/detalhe/${id}`]);
  }

  limparCampos(){
    this.motorista = null;
    this.cpfInserido = '';
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
      .deleteMotorista(this.motorista.id)
      .subscribe(
        (result: any) => {
          if (result.message === 'Deletado') {
            this.toastr.success('O motorista foi deletado com sucesso', 'Deletado!');
            this.limparCampos();
          }
        },
        (error: any) => {
          console.error(error);
          this.toastr.error(
            `Erro ao tentar deletar o motorista ${this.motorista.id}`, 'Erro');
        }
        ).add(() => this.spinner.hide());
  }

  open(event: any, motoristaId: number) {
    event.stopPropagation();
    this.motorista.id = motoristaId;
    this.openModal();
  }
}
