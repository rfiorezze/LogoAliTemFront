export class UserUpdate {
    nomeCompleto: string;
    email: string;
    telefone: string;
    password: string;
    token: string;
    cpf?: string; // CPF como opcional
    sexo?: string; // Sexo como opcional (M/F)
    dataNascimento?: Date; // Data de nascimento como opcional
    userRoles?: string[]; // Roles do usuário, opcional
    placaVeiculoPrincipal: string;
  }