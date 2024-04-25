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
    PhonePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CadastrarVeiculoMotoristaComponent {
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

  detalheveiculo(id: number): void {
    this.router.navigate(
      ['veiculos/detalhe'],
      { queryParams: { motoristaId: id}}
    );
  }
}
