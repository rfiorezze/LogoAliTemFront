import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { EmailService } from '@app/services/email.service';
import { isPlatformBrowser } from '@angular/common';
import { AccountService } from '@app/services/account.service';
import { take } from 'rxjs';
import { MotoristaService } from '@app/services/motorista.service';
import { Motorista } from '@app/models/Motorista';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-calcula-estadia',
  standalone: true,
  templateUrl: './calcula-estadia.component.html',
  styleUrls: ['./calcula-estadia.component.scss'],
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CommonModule,
    BsDatepickerModule,
    NgbTimepickerModule,
    FormsModule,
    NgxMaskDirective,
  ],
})
export class CalculaEstadiaComponent {
  emailForm!: FormGroup;
  form!: FormGroup;
  formCertidao!: FormGroup;
  valorCalculado: string = '';
  formattedValueMotorista: string = ''; // Valor formatado para exibição
  formattedValueLocalCarga: string = ''; // Valor formatado para exibição
  formattedValueLocalDescarga: string = ''; // Valor formatado para exibição
  formattedValueContratante: string = ''; // Valor formatado para exibição
  estados: Estado[];
  municipiosMotorista: Municipio[];
  municipiosLocalCarga: Municipio[];
  municipiosLocalDescarga: Municipio[];
  municipiosContratante: Municipio[];
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
  isBrowser: boolean;

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
    private localidadeService: LocalidadeService,
    private http: HttpClient,
    private emailService: EmailService,
    private accountService: AccountService,
    private motoristaService: MotoristaService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.localeService.use('pt-br');
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEstados();
  
    const preserveData = localStorage.getItem('preserveData') === 'true';
  
    if (!preserveData) {
      localStorage.removeItem('dadosEstadia');
      localStorage.removeItem('valorCalculado');
    } else {
      localStorage.removeItem('preserveData');
    }
  
    const savedData = localStorage.getItem('dadosEstadia');
    if (savedData) {
      const formData = JSON.parse(savedData);
      if (formData.dataChegada) {
        formData.dataChegada = new Date(formData.dataChegada);
      }
      if (formData.dataSaida) {
        formData.dataSaida = new Date(formData.dataSaida);
      }
      this.form.patchValue(formData);
      this.dadosCertidaoVisivel = true;
    }
  
    const savedValorCalculado = localStorage.getItem('valorCalculado');
    if (savedValorCalculado) {
      this.valorCalculado = savedValorCalculado;
    }
  
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user?.cpf) {
        this.motoristaService.getMotoristaByCpf(user.cpf).subscribe((motorista) => {
          if (motorista) {
            console.log('🚀 Dados do motorista retornados:', motorista);
  
            // Preenche os dados do motorista
            this.formCertidao.patchValue({
              nomeMotorista: motorista.nome || '',
              emailMotorista: motorista.email || '',
              telefoneMotorista: motorista.celular || '',
              placa: motorista.placaVeiculoPrincipal || '',
              cpfCnpjMotorista: motorista.cpf || '',
              cepMotorista: motorista.cep || '',
              estadoMotorista: motorista.estado || '',              
            });

            this.cepMotoristaInserido = motorista.cep;
            
            if (motorista.estado) {
              this.FiltrarPorEstado(motorista.estado, 'Motorista');
              setTimeout(() => {
                this.formCertidao.patchValue({
                  numeroMotorista: motorista.numero || '',
                  complementoMotorista: motorista.complemento || '',
                  cidadeMotorista: motorista.cidade || '',
                  bairroMotorista: motorista.bairro || '',
                  logradouroMotorista: motorista.logradouro || '',
                });
              }, 500); 
            }
          }
        });
      }
    });
  }
  

  public validation(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

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
      emailMotorista: [
        '',
        [
          Validators.required,
          Validators.email,
          CustomValidators.emailDomainValidator,
        ],
      ],
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
      emailLocalCarga: [
        '',
        [
          Validators.required,
          Validators.email,
          CustomValidators.emailDomainValidator,
        ],
      ],
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
      emailLocalDescarga: [
        '',
        [
          Validators.required,
          Validators.email,
          CustomValidators.emailDomainValidator,
        ],
      ],
      telefoneLocalDescarga: ['', Validators.required],
      cteCiotContratante: [''],
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

  public FiltrarPorEstado(estado: string, area: string) {
    this.localidadeService.getMunicipiosPorUF(estado).subscribe(
      (municipios: Municipio[]) => {
        switch (area) {
          case 'Motorista':
            this.municipiosMotorista = municipios;
            break;
          case 'LocalCarga':
            this.municipiosLocalCarga = municipios;
            break;
          case 'LocalDescarga':
            this.municipiosLocalDescarga = municipios;
            break;
          case 'Contratante':
            this.municipiosContratante = municipios;
            break;
        }
      },
      (error) => {
        console.error('Erro ao carregar municípios: ', error);
      }
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
    if (!value || value.length < 8) {
      console.warn('CEP inválido ou incompleto.');
      return;
    }
  
    this.localidadeService.getEnderecoPorCep(value).subscribe(
      (endereco: Endereco) => {
        console.log(`🏠 Endereço retornado para ${area}:`, endereco);
  
        switch (area) {
          case 'Motorista':
            this.formCertidao.patchValue({
              logradouroMotorista: endereco.logradouro || '',
              complementoMotorista: endereco.complemento || '', // Agora sempre será preenchido
              bairroMotorista: endereco.bairro || '',
              estadoMotorista: endereco.uf || ''
            });
  
            if (endereco.uf) {
              this.FiltrarPorEstado(endereco.uf, 'Motorista');
              setTimeout(() => {
                this.formCertidao.patchValue({
                  cidadeMotorista: endereco.localidade || ''
                });
              }, 500); // Garante que a cidade será preenchida após carregar os municípios
            }
            break;
  
          case 'LocalCarga':
            this.formCertidao.patchValue({
              logradouroLocalCarga: endereco.logradouro || '',
              complementoLocalCarga: endereco.complemento || '',
              bairroLocalCarga: endereco.bairro || '',
              estadoLocalCarga: endereco.uf || ''
            });
  
            if (endereco.uf) {
              this.FiltrarPorEstado(endereco.uf, 'LocalCarga');
              setTimeout(() => {
                this.formCertidao.patchValue({
                  cidadeLocalCarga: endereco.localidade || ''
                });
              }, 500);
            }
            break;
  
          case 'LocalDescarga':
            this.formCertidao.patchValue({
              logradouroLocalDescarga: endereco.logradouro || '',
              complementoLocalDescarga: endereco.complemento || '',
              bairroLocalDescarga: endereco.bairro || '',
              estadoLocalDescarga: endereco.uf || ''
            });
  
            if (endereco.uf) {
              this.FiltrarPorEstado(endereco.uf, 'LocalDescarga');
              setTimeout(() => {
                this.formCertidao.patchValue({
                  cidadeLocalDescarga: endereco.localidade || ''
                });
              }, 500);
            }
            break;
  
          case 'Contratante':
            this.formCertidao.patchValue({
              logradouroContratante: endereco.logradouro || '',
              complementoContratante: endereco.complemento || '',
              bairroContratante: endereco.bairro || '',
              estadoContratante: endereco.uf || ''
            });
  
            if (endereco.uf) {
              this.FiltrarPorEstado(endereco.uf, 'Contratante');
              setTimeout(() => {
                this.formCertidao.patchValue({
                  cidadeContratante: endereco.localidade || ''
                });
              }, 500);
            }
            break;
        }
      },
      (error: any) => {
        console.error('Erro ao buscar endereço pelo CEP:', error);
      }
    );
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
    localStorage.setItem('valorCalculado', this.valorCalculado);

    this.spinner.hide();
  }

  exibirCamposPreencherCertidao() {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.dadosCertidaoVisivel = true;
      } else {
        const formData = { ...this.form.value };
        formData.dataChegada = new Date(formData.dataChegada).toISOString();
        formData.dataSaida = new Date(formData.dataSaida).toISOString();

        localStorage.setItem('dadosEstadia', JSON.stringify(formData));
        localStorage.setItem('valorCalculado', this.valorCalculado);
        localStorage.setItem('preserveData', 'true'); // Define a flag
        localStorage.setItem('retornarParaCertidao', '/calcula-estadia'); // Define a rota de retorno
        this.router.navigate(['/user/login']);
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.valorCalculado = '';
    this.dataInvalida = false;
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  private atualizarMotorista(callback: () => void): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user?.cpf) {
        this.motoristaService
          .getMotoristaByCpf(user.cpf)
          .subscribe((motorista) => {
            if (motorista) {
              // Cria um objeto atualizado com os valores do formulário
              const motoristaAtualizado: Motorista = {
                ...motorista,
                nome: this.formCertidao.value.nomeMotorista,
                email: this.formCertidao.value.emailMotorista,
                celular: this.formCertidao.value.telefoneMotorista,
                placaVeiculoPrincipal: this.formCertidao.value.placa,
                cpf: this.formCertidao.value.cpfCnpjMotorista,
                cep: this.formCertidao.value.cepMotorista,
                logradouro: this.formCertidao.value.logradouroMotorista,
                bairro: this.formCertidao.value.bairroMotorista,
                numero: this.formCertidao.value.numeroMotorista,
                complemento: this.formCertidao.value.complementoMotorista,
                estado: this.formCertidao.value.estadoMotorista,
                cidade: this.formCertidao.value.cidadeMotorista,
              };

              // Atualiza os dados do motorista no banco de dados antes de prosseguir
              this.motoristaService.put(motoristaAtualizado).subscribe(
                () => {
                  console.log('Dados do motorista atualizados com sucesso.');
                  callback(); // Chama a função desejada (gerar PDF ou enviar e-mail) após a atualização
                },
                (error) => {
                  console.error('Erro ao atualizar motorista:', error);
                  this.toastr.error('Erro ao atualizar os dados do motorista.');
                }
              );
            }
          });
      }
    });
  }

  salvarCertidao(): void {
    this.atualizarMotorista(() => {
      const doc = this.gerarPdf();
      doc.save('certidao.pdf');
    });
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
      `devido ao Transportador TAC ou à ETC direito indenizatório no Valor de ${this.valorCalculado}`,
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

    return doc;
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

  enviarPdfPorEmail(): void {
    if (this.emailForm.valid) {
      this.atualizarMotorista(() => {
        const emailDestino = this.emailForm.get('email')?.value;
        const assunto = 'Certidão de Estadia';
        const corpo = 'Segue em anexo a certidão de estadia.';
        const copiaPara = '';

        // Gerar o PDF atualizado
        const doc = this.gerarPdf();
        const pdfBlob = doc.output('blob');

        // Enviar e-mail com os dados atualizados
        this.emailService
          .enviarEmail(emailDestino, assunto, corpo, copiaPara, pdfBlob)
          .subscribe(
            () => {
              this.toastr.success('E-mail enviado com sucesso!');
              this.fecharModal();
            },
            (error) => {
              this.toastr.error('Erro ao enviar o e-mail.');
              console.error('Erro ao enviar o e-mail', error);
            }
          );
      });
    }
  }

  ngAfterViewInit() {
    // Certifique-se de que o código só será executado no client-side
    if (this.isBrowser) {
      // Qualquer código que dependa do `document` pode ser colocado aqui
      console.log('Executando no navegador (client-side).');
    }
  }

  fecharModal() {
    // Somente manipule o DOM se estiver no navegador
    if (this.isBrowser) {
      const modal = document.getElementById('emailModal');
      if (modal) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(
          modal
        ); // Obter instância do modal
        modalInstance?.hide(); // Fechar o modal
      }
    }
  }
}
