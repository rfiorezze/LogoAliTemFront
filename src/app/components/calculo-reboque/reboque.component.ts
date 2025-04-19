import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LocalizacaoService } from '@app/services/localizacao.service';
import { ReboqueService } from '@app/services/reboque.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-reboque',
  standalone: true,
  templateUrl: './reboque.component.html',
  styleUrls: ['./reboque.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TituloComponent,
    NgxMaskDirective,
    NgxMaskPipe
  ]
})
export class ReboqueComponent implements OnInit {
  formCalculo!: FormGroup;
  formPlaca!: FormGroup;
  valorEstimado: number | null = null;
  solicitacaoEmAndamento = false;
  solicitacaoConfirmada = false;
  whatsappBloqueado = false;
  ultimaMensagemWhatsApp: string = '';

  sugestoesRetirada: string[] = [];
  sugestoesDestino: string[] = [];
  campoFocado: 'localRetirada' | 'localDestino' | null = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localizacaoService: LocalizacaoService,
    private reboqueService: ReboqueService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.formCalculo = this.fb.group({
      tipoVeiculo: ['', Validators.required],
      localRetirada: ['', Validators.required],
      localDestino: ['', Validators.required]
    });
  
    this.formPlaca = this.fb.group({
      placa: ['', [
        Validators.required
      ]]
    });

    this.ativarAutocomplete();
  }

  get f() {
    return this.formCalculo.controls;
    return this.formPlaca.controls;
  }

  ativarAutocomplete(): void {
    this.f.localRetirada.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      if (typeof value === 'string' && value.length > 2) {
        this.localizacaoService.obterSugestoesEnderecos(value).subscribe({
          next: sugestoes => this.sugestoesRetirada = sugestoes,
          error: () => console.error('Erro ao obter sugestões')
        });
      } else {
        this.sugestoesRetirada = [];
      }
    });

    this.f.localDestino.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      if (typeof value === 'string' && value.length > 2) {
        this.localizacaoService.obterSugestoesEnderecos(value).subscribe({
          next: sugestoes => this.sugestoesDestino = sugestoes,
          error: () => console.error('Erro ao obter sugestões')
        });
      } else {
        this.sugestoesDestino = [];
      }
    });
  }

  selecionarSugestao(endereco: string, campo: 'localRetirada' | 'localDestino'): void {
    this.formCalculo.get(campo)?.setValue(endereco, { emitEvent: false });
    this.sugestoesRetirada = [];
    this.sugestoesDestino = [];
    this.campoFocado = null;
  }

  usarGeolocalizacao(): void {
    if (!navigator.geolocation) {
      this.toastr.warning('Seu navegador não suporta geolocalização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.localizacaoService.obterEnderecoPorCoordenadas(latitude, longitude).subscribe({
          next: (response) => {
            this.f.localRetirada.setValue(response.endereco);
          },
          error: () => {
            this.toastr.error('Erro ao obter o endereço.');
          }
        });
      },
      () => {
        this.toastr.error('Erro ao acessar geolocalização.');
      }
    );
  }

  calcularValor(): void {
    if (this.formCalculo.invalid) {
      this.toastr.warning('Preencha todos os campos obrigatórios.');
      return;
    }

    const { localRetirada, localDestino, tipoVeiculo } = this.formCalculo.value;

    this.solicitacaoEmAndamento = true;
    this.spinner.show();

    this.reboqueService.calcularValor(localRetirada, localDestino, tipoVeiculo).subscribe({
      next: (response) => {
        this.valorEstimado = response.valor;
        this.solicitacaoEmAndamento = false;
        this.spinner.hide();
      },
      error: () => {
        this.toastr.error('Erro ao calcular a distância.');
        this.solicitacaoEmAndamento = false;
        this.spinner.hide();
      }
    });
  }

  contratarReboque(): void {
    const placa = this.formPlaca.get('placa')?.value?.trim().toUpperCase();
    this.formPlaca.get('placa')?.setValue(placa);
  
    if (!this.valorEstimado) {
      this.toastr.warning('Calcule o valor antes de contratar.');
      return;
    }
  
    if (this.formPlaca.invalid) {
      this.toastr.warning('Placa inválida. Verifique o preenchimento.');
      return;
    }
  
    this.solicitacaoEmAndamento = true;
    this.spinner.show();
  
    const { localRetirada, localDestino, tipoVeiculo } = this.formCalculo.value;
  
    this.reboqueService.contratarReboque(
      localRetirada,
      localDestino,
      tipoVeiculo,
      this.valorEstimado,
      placa
    ).subscribe({
      next: () => {
        this.toastr.success('Solicitação realizada com sucesso!');
        this.solicitacaoConfirmada = true;
        this.spinner.hide();
      },
      error: () => {
        this.toastr.error('Erro ao contratar reboque.');
        this.solicitacaoEmAndamento = false;
        this.spinner.hide();
      }
    });
  }  

  enviarWhatsApp(): void {
    const { localRetirada, localDestino, tipoVeiculo } = this.formCalculo.value;
    const { placa } = this.formPlaca.value;

    const telefoneWhatsApp = '5531992049301';
    this.ultimaMensagemWhatsApp = `
      Olá, gostaria de contratar um reboque.

      - Local de retirada: ${localRetirada}
      - Destino: ${localDestino}
      - Tipo do veículo: ${tipoVeiculo}
      - Placa: ${placa}
      - Valor estimado: R$ ${this.valorEstimado?.toFixed(2)}

      Por favor, me envie mais detalhes.
    `;

    const urlWhatsApp = `https://api.whatsapp.com/send/?phone=${telefoneWhatsApp}&text=${encodeURIComponent(this.ultimaMensagemWhatsApp)}&type=phone_number&app_absent=0`;

    window.location.href = urlWhatsApp;
  }
}