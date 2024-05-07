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

@Component({
  selector: 'app-cadastrar-veiculo-por-motorista',
  standalone: true,
  templateUrl: './cadastrar-veiculo-por-motorista.component.html',
  styleUrl: './cadastrar-veiculo-por-motorista.component.scss',
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
export class CadastrarVeiculoMotoristaComponent {
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

  detalheveiculo(id: number): void {
    this.router.navigate(
      ['veiculos/detalhe'],
      { queryParams: { motoristaId: this.motorista.id}}
    );
  }

  limparCampos(){
    this.motorista = null;
    this.cpfInserido = '';
  }
}
