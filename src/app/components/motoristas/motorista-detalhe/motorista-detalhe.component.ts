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
import { ActivatedRoute, Router } from '@angular/router';
import { MotoristaService } from '@app/services/motorista.service';
import { Motorista } from '@app/models/Motorista';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalidadeService } from '@app/services/localidade.service';
import { Estado } from '@app/models/Estado';
import { Municipio } from '@app/models/Municipio';
import { NgxMaskDirective } from 'ngx-mask';
import { Endereco } from '@app/models/Endereco';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-motorista-detalhe',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule,
    NgxMaskDirective
  ],
  templateUrl: './motorista-detalhe.component.html',
  styleUrl: './motorista-detalhe.component.scss',
})
export class MotoristaDetalheComponent {
  motorista = {} as Motorista;
  form!: FormGroup;
  estadoSalvar = 'post';
  estados: Estado[];
  municipios: Municipio[];
  public estadoInserido: string = '';
  public cepInserido: string = '';

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

  public BuscarPorCep(value: string) {
    this.localidadeService.getEnderecoPorCep(value).subscribe(
      (endereco: Endereco) => {
        this.motorista.logradouro = endereco.logradouro;
        this.motorista.complemento = endereco.complemento;
        this.motorista.bairro = endereco.bairro;
        this.motorista.estado = endereco.uf;
        this.motorista.cidade = endereco.localidade;
        this.form.patchValue(this.motorista);
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
    private motoristaService: MotoristaService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localidadeService: LocalidadeService,
    private route: Router
  ) {
    this.localeService.use('pt-br');
  }

  public carregarMotorista(): void {
    const motoristaIdParam = this.router.snapshot.paramMap.get('id');

    if (motoristaIdParam != null) {
      this.estadoSalvar = 'put';

      this.motoristaService.getMotoristaById(+motoristaIdParam).subscribe(
        (motorista: Motorista) => {
          this.motorista = { ...motorista };
          this.form.patchValue(this.motorista);
        },
        (error: any) => {
          console.error(error);
        },
        () => {}
      );
    }
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

  ngOnInit(): void {
    this.carregarMotorista();
    this.validation();
    this.carregarEstados();
  }

  public validation(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      numeroCNH: ['', [Validators.required, Validators.minLength(9)]],
      categoriaCNH: ['', Validators.required],
      dataVencimentoCNH: [],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      numero: [''],
      complemento: [''],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
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
      this.motorista =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.motorista.id, ...this.form.value };

      this.motoristaService[this.estadoSalvar](this.motorista).subscribe(
        (_motorista: Motorista) => {
          this.toastr.success('Motorista salvo com sucesso!', 'Sucesso');
          if(this.estadoSalvar === 'post')
            this.resetForm();
          this.route.navigate(
            ['veiculos/detalhe'],
            { queryParams: { motoristaId: _motorista.id}}
          );
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar o motorista', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }
}
