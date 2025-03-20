import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReboqueService {
  private baseURL = environment.apiURL + 'api/reboque';

  constructor(private http: HttpClient) {}

  /**
   * Calcula o valor estimado do reboque com base na distância entre retirada e destino.
   * @param localRetirada Endereço de retirada do veículo.
   * @param localDestino Endereço de destino do veículo.
   * @returns Observable com o valor estimado do reboque.
   */
  public calcularValor(localRetirada: string, localDestino: string, tipoVeiculo: string): Observable<{ valor: number }> {
    return this.http
      .post<{ valor: number }>(`${this.baseURL}/calcular`, { localRetirada, localDestino, tipoVeiculo })
      .pipe(take(1));
  }

  /**
   * Solicita um reboque com base nos dados informados.
   * @param localRetirada Endereço de retirada do veículo.
   * @param localDestino Endereço de destino do veículo.
   * @param tipoVeiculo Tipo do veículo a ser rebocado.
   * @returns Observable indicando sucesso ou falha da solicitação.
   */
  public contratarReboque(localRetirada: string, localDestino: string, tipoVeiculo: string, valorEstimado: number): Observable<{ mensagem: string, valor: number }> {
    return this.http
      .post<{ mensagem: string, valor: number }>(`${this.baseURL}/contratar`, { localRetirada, localDestino, tipoVeiculo, valorEstimado })
      .pipe(take(1));
  }  
}
