import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ActivatedRoute } from '@angular/router';
import { VeiculoService } from '@app/services/veiculo.service';
import { Veiculo } from '@app/models/Veiculo';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalidadeService } from '@app/services/localidade.service';
import { Estado } from '@app/models/Estado';
import { Municipio } from '@app/models/Municipio';
import { NgxMaskDirective } from 'ngx-mask';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-veiculo-detalhe',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule,
    NgxMaskDirective,
  ],
  templateUrl: './veiculo-detalhe.component.html',
  styleUrl: './veiculo-detalhe.component.scss',
})
export class VeiculoDetalheComponent {
  veiculo = {} as Veiculo;
  form!: FormGroup;
  estadoSalvar = 'post';
  motoristaId = '';
  estados: Estado[];
  municipios: Municipio[];
  public estadoInserido: string = '';
  public cepInserido: string = '';
  public categorias: any[];
  public tiposCarroceria: any[];
  public marcas: any[];

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

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private VeiculoService: VeiculoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localidadeService: LocalidadeService
  ) {
    this.localeService.use('pt-br');
  }

  public carregarVeiculo(): void {
    const veiculoIdParam = this.router.snapshot.queryParamMap.get('id');
    this.motoristaId = this.router.snapshot.queryParamMap.get('motoristaId');

    if (veiculoIdParam != null) {
      this.estadoSalvar = 'put';

      this.VeiculoService.getVeiculoById(+veiculoIdParam).subscribe(
        (Veiculo: Veiculo) => {
          this.veiculo = { ...Veiculo };
          this.form.patchValue(this.veiculo);
        },
        (error: any) => {
          console.error(error);
        },
        () => {}
      );
    }
  }

  ngOnInit(): void {
    this.carregarVeiculo();
    this.validation();

    this.VeiculoService.getCategorias().subscribe(data => {
      this.categorias = data;
    });

    this.VeiculoService.getTiposCarroceria().subscribe(data => {
      this.tiposCarroceria = data;
    });

    this.VeiculoService.getMarcas().subscribe(data => {
      this.marcas = data;
    });
  }

  public validation(): void {
    this.form = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      ano: ['', Validators.required],
      modelo: ['', Validators.required],
      categoria: ['', Validators.required],
      chassi: ['', Validators.required],
      renavam: ['', Validators.required],
      tipoCarroceria: ['', Validators.required],
      qtdEixos: ['', Validators.required]
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarAlteracao(): void {
    this.spinner.show();

    if (this.form.valid) {
      this.veiculo =
        this.estadoSalvar === 'post'
          ? { motoristaId: this.motoristaId, ...this.form.value }
          : { id: this.veiculo.id, motoristaId: this.veiculo.motoristaId, ...this.form.value };

      this.veiculo.placa = this.veiculo.placa.toUpperCase();
      
      this.VeiculoService[this.estadoSalvar](this.veiculo).subscribe(
        () => this.toastr.success('Veiculo salvo com sucesso!', 'Sucesso'),
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar o Veiculo', 'Erro');
        },
        () => {
          this.spinner.hide();
          if(this.estadoSalvar === 'post'){
            this.resetForm();
          }
        }
      );
    }
  }
}
