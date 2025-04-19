import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadiaService {
  private baseURL = environment.apiURL + 'api/estadia';

  constructor(private http: HttpClient) {}

  /**
   * Registra um novo cálculo de estadia.
   * @param dados Dados do cálculo.
   * @returns Observable com o resultado do cálculo.
   */
  public registrarCalculo(dados: any): Observable<any> {
    return this.http
      .post(`${this.baseURL}/calcular`, dados)
      .pipe(take(1));
  }

  /**
   * Registra uma nova certidão de estadia.
   * @param dados Dados da certidão.
   * @returns Observable com a certidão gerada.
   */
  public registrarCertidao(dados: any): Observable<any> {
    return this.http
      .post(`${this.baseURL}/certidao`, dados)
      .pipe(take(1));
  }

  /**
   * Obtém os indicadores de estatísticas de estadia.
   * @returns Observable com os dados dos indicadores.
   */
  public obterIndicadores(): Observable<{ totalCalculos: number, totalCertidoes: number, taxaConversao: string }> {
    return this.http
      .get<{ totalCalculos: number, totalCertidoes: number, taxaConversao: string }>(`${this.baseURL}/indicadores`)
      .pipe(take(1));
  }
}
