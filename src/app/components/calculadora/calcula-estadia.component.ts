import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { differenceInHours } from 'date-fns';
import { NgxMaskDirective } from 'ngx-mask';
import { LocalidadeService } from '@app/services/localidade.service';
import { Estado } from '@app/models/Estado';
import { Municipio } from '@app/models/Municipio';
import { Endereco } from '@app/models/Endereco';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { CustomValidators } from '@app/shared/custom-validators';

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
    NgbTimepickerModule,
    FormsModule,
    JsonPipe,
    NgxMaskDirective,
  ],
})
export class CalculaEstadiaComponent {
  form!: FormGroup;
  formCertidao!: FormGroup;
  valorCalculado: string = '';
  formattedValueMotorista: string = ''; // Valor formatado para exibição
  formattedValueLocalCarga: string = ''; // Valor formatado para exibição
  formattedValueLocalDescarga: string = ''; // Valor formatado para exibição
  formattedValueContratante: string = ''; // Valor formatado para exibição
  estados: Estado[];
  municipios: Municipio[];
  public estadoMotoristaInserido: string = '';
  public cepMotoristaInserido: string = '';
  public estadoLocalCargaInserido: string = '';
  public cepLocalCargaInserido: string = '';
  public estadoLocalDescargaInserido: string = '';
  public cepLocalDescargaInserido: string = '';
  public estadoContratanteInserido: string = '';
  public cepContratanteInserido: string = '';
  dadosCertidaoVisivel: boolean = false;
  dataInvalida: boolean = false;

  get f(): any {
    return this.form.controls;
  }

  get fc(): any {
    return this.formCertidao.controls;
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
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localidadeService: LocalidadeService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEstados();
  }

  public validation(): void {
    this.form = this.fb.group({
      dataChegada: ['', Validators.required],
      horaChegada: ['', Validators.required],
      dataSaida: ['', Validators.required],
      horaSaida: ['', Validators.required],
      capacidadeCargaVeiculo: ['', [Validators.required, Validators.min(1)]],
    });

    this.formCertidao = this.fb.group({
      placa: ['', Validators.required],
      rntrc: [''],
      nomeMotorista: ['', Validators.required],
      cpfCnpjMotorista: [
        '',
        [Validators.required, this.validarCPFouCNPJ.bind(this)],
      ],
      cepMotorista: ['', Validators.required],
      logradouroMotorista: ['', Validators.required],
      bairroMotorista: ['', Validators.required],
      numeroMotorista: [''],
      complementoMotorista: [''],
      estadoMotorista: ['', Validators.required],
      cidadeMotorista: ['', Validators.required],
      emailMotorista: ['', Validators.required],
      telefoneMotorista: ['', Validators.required],
      cpfCnpjLocalCarga: ['', this.validarCPFouCNPJ.bind(this)],
      nomeLocalCarga: ['', Validators.required],
      cepLocalCarga: ['', Validators.required],
      logradouroLocalCarga: ['', Validators.required],
      bairroLocalCarga: ['', Validators.required],
      numeroLocalCarga: [''],
      complementoLocalCarga: [''],
      estadoLocalCarga: ['', Validators.required],
      cidadeLocalCarga: ['', Validators.required],
      emailLocalCarga: ['', Validators.required],
      telefoneLocalCarga: ['', Validators.required],
      cpfCnpjLocalDescarga: ['', this.validarCPFouCNPJ.bind(this)],
      nomeLocalDescarga: ['', Validators.required],
      cepLocalDescarga: ['', Validators.required],
      logradouroLocalDescarga: ['', Validators.required],
      bairroLocalDescarga: ['', Validators.required],
      numeroLocalDescarga: [''],
      complementoLocalDescarga: [''],
      estadoLocalDescarga: ['', Validators.required],
      cidadeLocalDescarga: ['', Validators.required],
      emailLocalDescarga: ['', Validators.required],
      telefoneLocalDescarga: ['', Validators.required],
      cteCiotContratante: ['', Validators.required],
      cpfCnpjContratante: [
        '',
        [Validators.required, this.validarCPFouCNPJ.bind(this)],
      ],
      nomeContratante: ['', Validators.required],
      cepContratante: ['', Validators.required],
      logradouroContratante: ['', Validators.required],
      bairroContratante: ['', Validators.required],
      numeroContratante: [''],
      complementoContratante: [''],
      estadoContratante: ['', Validators.required],
      cidadeContratante: ['', Validators.required],
      emailContratante: ['', Validators.required],
      telefoneContratante: ['', Validators.required],
    });
  }

  onInput(event: Event, nomeCampo: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Permite apenas números
    const rawValue = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (nomeCampo === 'cpfCnpjMotorista')
      this.formattedValueMotorista = this.formatValueLocal(rawValue);
    else if (nomeCampo === 'cpfCnpjLocalCarga')
      this.formattedValueLocalCarga = this.formatValueLocal(rawValue);
    else if (nomeCampo === 'cpfCnpjLocalDescarga')
      this.formattedValueLocalDescarga = this.formatValueLocal(rawValue);
    else this.formattedValueContratante = this.formatValueLocal(rawValue);

    this.form.get(nomeCampo)?.setValue(rawValue, { emitEvent: false });
    this.form.get(nomeCampo)?.updateValueAndValidity(); // Força a validação
  }

  formatValueLocal(value: string): string {
    if (value.length <= 11) {
      // Máscara para CPF
      return value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Máscara para CNPJ
      return value
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
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

  public BuscarPorCep(value: string, area: string) {
    this.localidadeService.getEnderecoPorCep(value).subscribe(
      (endereco: Endereco) => {
        this.formCertidao
          .get('logradouro' + area)
          ?.setValue(endereco.logradouro);
        this.formCertidao
          .get('complemento' + area)
          ?.setValue(endereco.complemento);
        this.formCertidao.get('bairro' + area)?.setValue(endereco.bairro);
        this.formCertidao.get('estado' + area)?.setValue(endereco.uf);
        this.formCertidao.get('cidade' + area)?.setValue(endereco.localidade);
      },
      (error: any) => {
        console.error(error);
      },
      () => {}
    );
  }

  gerarCertidao() {
    this.gerarPdf();
  }

  calcularEstadia(valorHora: number) {
    // Reseta a flag de data inválida antes de cada cálculo
    this.dataInvalida = false;

    // Força a marcação dos campos como "touched" para que o Angular exiba os erros corretamente
    this.form.get('dataChegada')?.markAsTouched();
    this.form.get('dataSaida')?.markAsTouched();
    this.form.updateValueAndValidity();

    const formValues = this.form.value;
    const dataChegada = new Date(formValues.dataChegada);
    const dataSaida = new Date(formValues.dataSaida);

    // Verifica se a data de saída é anterior à data de chegada
    if (dataSaida < dataChegada) {
      this.dataInvalida = true; // Exibe a mensagem de erro se a data for inválida
      return;
    }

    // Se a validação passar, realiza o cálculo
    this.spinner.show();
    const horaChegada = formValues.horaChegada;
    const horaSaida = formValues.horaSaida;

    const chegada = new Date(
      dataChegada.getFullYear(),
      dataChegada.getMonth(),
      dataChegada.getDate(),
      horaChegada.hour,
      horaChegada.minute,
      horaChegada.second
    );

    const saida = new Date(
      dataSaida.getFullYear(),
      dataSaida.getMonth(),
      dataSaida.getDate(),
      horaSaida.hour,
      horaSaida.minute,
      horaSaida.second
    );

    const diferencaHoras = differenceInHours(saida, chegada);
    const capacidadeCargaVeiculo = formValues.capacidadeCargaVeiculo;

    this.valorCalculado =
      'R$ ' + (diferencaHoras * capacidadeCargaVeiculo * valorHora).toFixed(2);
    this.spinner.hide();
  }

  exibirCamposPreencherCertidao() {
    this.dadosCertidaoVisivel = true;
  }

  resetForm(): void {
    this.form.reset();
    this.valorCalculado = '';
    this.dataInvalida = false;
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  gerarPdf() {
    const doc = new jsPDF();
    const imgLogo = 'assets/logo.png'; // Caminho para a logo
    const formCalculo = this.form.value;
    const formCertidao = this.formCertidao.value;

    // Adicionar o cabeçalho
    const logo = new Image();
    logo.src = imgLogo;
    doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Logo a 10,10, com largura 50 e altura 20
    doc.setFontSize(10);
    doc.text('Cálculos homologados por SINDITACMG.', 70, 25);

    // Adicionar o título
    doc.setFontSize(14);
    doc.setFont('Arial', 'bold');
    doc.text('Certidão de Estadia', 105, 50, { align: 'center' });

    // Adicionar o corpo do texto
    doc.setFontSize(12);
    doc.setFont('Arial', 'bold');
    doc.text('Dados do Motorista', 10, 75);
    doc.setFont('Arial', 'normal');
    doc.text(
      `Transportador/Usuário: ${formCertidao.nomeMotorista} CPF: ${formCertidao.cpfCnpjMotorista} RNTRC:${formCertidao.rntrc}`,
      10,
      80
    );
    doc.text(
      `Placa do Veículo ${formCertidao.placa} Capacidade de Carga do Veículo: ${formCalculo.capacidadeCargaVeiculo} toneladas`,
      10,
      85
    );
    doc.text(
      `Endereço: ${formCertidao.logradouroMotorista}, ${formCertidao.numeroMotorista} Bairro: ${formCertidao.bairroMotorista} CEP: ${formCertidao.cepMotorista} Cidade: ${formCertidao.cidadeMotorista}`,
      10,
      90
    );
    doc.text(
      `Estado: ${formCertidao.estadoMotorista} E-mail: ${formCertidao.emailMotorista} Telefone: ${formCertidao.telefoneMotorista}`,
      10,
      95
    );

    const dataChegadaFormatada = format(
      new Date(formCalculo.dataChegada),
      'dd/MM/yyyy'
    );
    const dataSaidaFormatada = format(
      new Date(formCalculo.dataSaida),
      'dd/MM/yyyy'
    );

    // Adicionar o corpo do texto
    doc.setFontSize(12);
    doc.setFont('Arial', 'bold');
    doc.text('Local da Carga', 10, 105);
    doc.setFont('Arial', 'normal');
    doc.text(
      `Chegada do veículo Placa: ${formCertidao.placa}, no dia ${dataChegadaFormatada}, às ${formCalculo.horaChegada.hour}:${formCalculo.horaChegada.minute} horas e a saída no dia ${dataSaidaFormatada}, às ${formCalculo.horaSaida.hour}:${formCalculo.horaSaida.minute}`,
      10,
      110
    );
    doc.text(
      `horas nas dependências de carga da empresa ${formCertidao.nomeLocalCarga}, CNPJ ${formCertidao.cpfCnpjLocalCarga} localizada`,
      10,
      115
    );
    doc.text(
      `à ${formCertidao.logradouroLocalCarga}, ${formCertidao.numeroLocalCarga}, Bairro: ${formCertidao.bairroLocalCarga}, CEP ${formCertidao.cepLocalCarga}, Cidade: ${formCertidao.cidadeLocalCarga}, Estado: ${formCertidao.estadoLocalCarga}`,
      10,
      120
    );

    // Adicionar o corpo do texto
    doc.setFontSize(12);
    doc.setFont('Arial', 'bold');
    doc.text('Local da Descarga', 10, 130);
    doc.setFont('Arial', 'normal');
    doc.text(
      `Chegada do veículo Placa: ${formCertidao.placa}, no dia ${dataChegadaFormatada}, às ${formCalculo.horaChegada.hour}:${formCalculo.horaChegada.minute} horas e a saída no dia ${dataSaidaFormatada}, às ${formCalculo.horaSaida.hour}:${formCalculo.horaSaida.minute}`,
      10,
      135
    );
    doc.text(
      `horas nas dependências de descarga da empresa ${formCertidao.nomeLocalDescarga}, CNPJ ${formCertidao.cpfCnpjLocalDescarga} localizada`,
      10,
      140
    );
    doc.text(
      `à ${formCertidao.logradouroLocalDescarga}, ${formCertidao.numeroLocalDescarga}, Bairro: ${formCertidao.bairroLocalDescarga}, CEP ${formCertidao.cepLocalDescarga}, Cidade: ${formCertidao.cidadeLocalDescarga}, Estado: ${formCertidao.estadoLocalDescarga}`,
      10,
      145
    );

    // Adicionar o corpo do texto
    doc.setFontSize(12);
    doc.setFont('Arial', 'bold');
    doc.text('Empresa Contratante/Transportadora', 10, 155);
    doc.setFont('Arial', 'normal');
    doc.text(
      `Empresa Contratante/transportadora: ${formCertidao.nomeContratante} , CNPJ: ${formCertidao.cpfCnpjContratante},`,
      10,
      160
    );
    doc.text(
      `Endereço: ${formCertidao.logradouroContratante}, ${formCertidao.numeroContratante} Bairro: ${formCertidao.bairroContratante},`,
      10,
      165
    );
    doc.text(
      `CEP: ${formCertidao.cepContratante}  Cidade: ${formCertidao.cidadeContratante}  E-mail: ${formCertidao.emailContratante}  Telefone: ${formCertidao.telefoneContratante}`,
      10,
      170
    );
    doc.text(
      `contrato de transporte firmado nº CTe/CIOT: ${formCertidao.cteCiotContratante}`,
      10,
      175
    );

    doc.setFontSize(12);
    doc.setFont('Arial', 'bold');
    doc.text('Direito indenizatório', 10, 185);
    doc.setFont('Arial', 'normal');
    doc.text(
      'Conforme previstos nas Leis nºs 11.442/07 e 13.103/15 e na Resolução nº 4675/15, da ANTT, que regulamenta',
      10,
      190
    );
    doc.text(
      'o tempo para carga e descarga prazo máximo para carga e descarga do Veículo de Transporte Rodoviário de',
      10,
      195
    );
    doc.text(
      'Cargas será de 05 (cinco) horas, contadas da chegada do veículo ao endereço de destino, após o qual será',
      10,
      200
    );
    doc.text(
      'devido ao Transportador TAC ou à ETC direito indenizatório no Valor de R$ R$ 240,45',
      10,
      205
    );

    // Adicionar a linha e o texto para "Local e Data"
    const localDataY = 250;
    const localDataTexto = 'Local e Data:';
    const localDataLargura = 100;
    const localDataX = (doc.internal.pageSize.width - localDataLargura) / 2;

    // Desenhar a linha para "Local e Data"
    doc.line(localDataX, localDataY, localDataX + localDataLargura, localDataY);

    // Adicionar o texto "Local e Data" centralizado abaixo da linha
    doc.setFontSize(12);
    doc.setFont('Arial', 'normal');
    doc.text(localDataTexto, doc.internal.pageSize.width / 2, localDataY + 5, {
      align: 'center',
    });

    // Adicionar a linha e o texto para assinatura
    const assinaturaY = localDataY + 20; // Ajuste para garantir que a seção de assinatura fique abaixo da seção de "Local e Data"
    const assinaturaTexto = 'Assinatura do Transportador:';
    const assinaturaLargura = 100;
    const assinaturaX = (doc.internal.pageSize.width - assinaturaLargura) / 2;

    // Desenhar a linha para assinatura
    doc.line(
      assinaturaX,
      assinaturaY,
      assinaturaX + assinaturaLargura,
      assinaturaY
    );

    // Adicionar o texto da assinatura centralizado abaixo da linha
    doc.setFontSize(12);
    doc.setFont('Arial', 'normal');
    doc.text(
      assinaturaTexto,
      doc.internal.pageSize.width / 2,
      assinaturaY + 5,
      { align: 'center' }
    );

    // Salvar o PDF
    doc.save('certidao.pdf');
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false; // CPF inválido
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  // Função para validar CNPJ
  validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
      return false; // Verifica se o CNPJ tem 14 dígitos e se não são todos iguais
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  validarCPFouCNPJ(control: FormControl): ValidationErrors | null {
    let value = control.value;
    value = value.replace(/\D/g, '');

    // Ignora validação se o campo estiver vazio
    if (!value) {
      return null; // Sem erros
    }

    if (value.length <= 11) {
      return this.validarCPF(value) ? null : { cpfInvalido: true };
    } else {
      return this.validarCNPJ(value) ? null : { cnpjInvalido: true };
    }
  }
}