export interface Motorista {
    id: number;
    nome: string;
    cpf: string;
    sexo: string;
    dataNascimento: Date;
    numeroCNH: string;
    categoriaCNH: string;
    dataVencimentoCNH?: Date;
    email: string;
    celular: string;
    cep: string;
    logradouro: string;
    bairro: string;
    numero: string;
    complemento: string;
    estado: string;
    cidade: string;
}
