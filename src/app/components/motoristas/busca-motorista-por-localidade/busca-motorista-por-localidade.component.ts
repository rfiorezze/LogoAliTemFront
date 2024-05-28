import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { Motorista } from '@app/models/Motorista';
import { MotoristaService } from '@app/services/motorista.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { CPFPipe } from '@app/helpers/cpf.pipe';
import { PhonePipe } from '@app/helpers/phone.pipe';
import { NgxMaskDirective } from 'ngx-mask';
import { LocalidadeService } from '@app/services/localidade.service';
import { Estado } from '@app/models/Estado';
import { Municipio } from '@app/models/Municipio';
import { ExcelService } from '@app/services/ExcelSerivice';

@Component({
  selector: 'app-busca-motorista-por-localidade',
  standalone: true,
  templateUrl: './busca-motorista-por-localidade.component.html',
  styleUrl: './busca-motorista-por-localidade.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    SharedModule,
    TituloComponent,
    RouterModule,
    CPFPipe,
    PhonePipe,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BuscaMotoristaPorLocalidadeComponent {
  public motoristas: Motorista[] = [];
  estados: Estado[];
  municipios: Municipio[];
  public estadoInserido: string = '';
  public cidadeInserida: string = '';

  constructor(
    private motoristaService: MotoristaService,
    private localidadeService: LocalidadeService,
    private excelService: ExcelService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarEstados();
  }

  public carregarMotoristaPorLocalidade(estado: string, cidade: string): void {    
    if (this.estadoInserido == '' || this.cidadeInserida == '') {
      this.toastr.info(
        'Selecione um estado e uma cidade para continuar',
        'Pesquisa não realizada'
      );
    } else {
      this.spinner.show();
      this.motoristaService
        .getMotoristasByLocalidade(estado, cidade)
        .subscribe({
          next: (_motoristas: Motorista[]) => {
            if (_motoristas != null && _motoristas.length > 0) {
              this.motoristas = _motoristas;
            }
            else{
              this.motoristas = [];
              this.toastr.error(
                'Nenhum motorista encontrado',
                'Não encontrado'
              );
            }
          },
          error: (error) => {
            this.motoristas = null;
            this.spinner.hide();
            this.toastr.error('Erro ao tentar buscar o motorista', 'Erro');
            console.log(error);
          },
          complete: () => this.spinner.hide(),
        });
    }
  }

  public FiltrarPorEstado(value: string) {
    this.localidadeService.getMunicipiosPorUF(value).subscribe(
      (municipios: Municipio[]) => {
        this.municipios = municipios;
      },
      (error: any) => {
        console.error(error);
      },
      () => {}
    );
  }

  limparCampos() {
    this.estadoInserido = "";
    this.cidadeInserida = "";
    this.motoristas = [];
  }

  public carregarEstados(): void {
    this.localidadeService.getEstados().subscribe(
      (estado: Estado[]) => {
        this.estados = estado;
      },
      (error: any) => {
        console.error(error);
      },
      () => {}
    );
  }

  detalheMotorista(id: number): void {
    this.router.navigate([`motoristas/detalhe/${id}`]);
  }

  export(data: any): void {
    this.excelService.exportToExcel(data, 'MotoristasPorLocal');
  }
}
