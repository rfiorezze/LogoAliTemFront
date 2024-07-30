import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-calcula-estadia',
  standalone: true,
  templateUrl: './calcula-estadia.component.html',
  styleUrls: ['./calcula-estadia.component.scss'],
  imports: [
    CommonModule,
    TituloComponent,
    RouterOutlet,
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule,
    NgxMaskDirective
  ]
})
export class CalculaEstadiaComponent {
  form!: FormGroup;

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
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      dataHoraChegada: ['', Validators.required],
      horaChegada: ['', Validators.required],
      dataHoraSaida: ['', Validators.required],
      horaSaida: ['', Validators.required],
      capacidadeCargaVeiculo: ['', Validators.required]
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }
}
