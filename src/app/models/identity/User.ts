export class User {
  email: string;
  password: string;
  nomeCompleto: string;
  token: string;
  telefone: string;
  cpf?: string; // CPF como opcional
  sexo?: string; // Sexo como opcional (M/F)
  dataNascimento?: Date; // Data de nascimento como opcional
  userRoles?: string[]; // Roles do usuário, opcional
  placaVeiculoPrincipal: string;
}
