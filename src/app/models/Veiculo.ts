import { Motorista } from "./Motorista";

export interface Veiculo {
    Id: number;
    Placa: string;
    Ano: number;
    Marca: string;
    Modelo: string;
    Categoria: string;
    TipoCarroceria: string;
    QtdEixos: number;
    MotoristaId: number;
    Motorista: Motorista;
}
