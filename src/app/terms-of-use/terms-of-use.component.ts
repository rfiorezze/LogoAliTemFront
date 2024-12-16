import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  template: `
    <div class="terms-container">
      <h1>Termos de Uso da LOGO ALI TEM</h1>

      <section>
        <h2>1. Termos</h2>
        <p>
          Ao acessar ao site LOGO ALI TEM, concorda em cumprir estes termos de serviço,
          todas as leis e regulamentos aplicáveis e concorda que é responsável pelo
          cumprimento de todas as leis locais aplicáveis. Se você não concordar com
          algum desses termos, está proibido de usar ou acessar este site. Os materiais
          contidos neste site são protegidos pelas leis de direitos autorais e marcas
          comerciais aplicáveis.
        </p>
      </section>

      <section>
        <h2>2. Uso de Licença</h2>
        <p>
          É concedida permissão para baixar temporariamente uma cópia dos materiais
          (informações ou software) no site LOGO ALI TEM, apenas para visualização
          transitória pessoal e não comercial. Esta é a concessão de uma licença, não
          uma transferência de título e, sob esta licença, você não pode:
        </p>
        <ul>
          <li>Modificar ou copiar os materiais;</li>
          <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
          <li>Tentar descompilar ou fazer engenharia reversa de qualquer software;</li>
          <li>Remover quaisquer direitos autorais ou outras notações de propriedade;</li>
          <li>Transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer servidor.</li>
        </ul>
        <p>
          Esta licença será automaticamente rescindida se você violar alguma dessas
          restrições e poderá ser rescindida por LOGO ALI TEM a qualquer momento. Ao
          encerrar a visualização desses materiais ou após o término desta licença,
          você deve apagar todos os materiais baixados em sua posse, seja em formato
          eletrônico ou impresso.
        </p>
      </section>

      <section>
        <h2>3. Isenção de responsabilidade</h2>
        <p>
          Os materiais no site da LOGO ALI TEM são fornecidos "como estão". LOGO ALI TEM
          não oferece garantias, expressas ou implícitas, e, por este meio, isenta e
          nega todas as outras garantias, incluindo, sem limitação, garantias implícitas
          ou condições de comercialização, adequação a um fim específico ou não violação
          de propriedade intelectual.
        </p>
      </section>

      <section>
        <h2>4. Limitações</h2>
        <p>
          Em nenhum caso o LOGO ALI TEM ou seus fornecedores serão responsáveis por
          quaisquer danos (incluindo perda de dados ou lucros) decorrentes do uso dos
          materiais em LOGO ALI TEM.
        </p>
      </section>

      <section>
        <h2>5. Precisão dos materiais</h2>
        <p>
          Os materiais exibidos no site da LOGO ALI TEM podem incluir erros técnicos,
          tipográficos ou fotográficos. LOGO ALI TEM pode fazer alterações nos materiais
          contidos em seu site a qualquer momento, sem aviso prévio.
        </p>
      </section>

      <section>
        <h2>6. Links</h2>
        <p>
          O LOGO ALI TEM não analisou todos os sites vinculados ao seu site e não é
          responsável pelo conteúdo de nenhum site vinculado.
        </p>
      </section>

      <section>
        <h2>Modificações</h2>
        <p>
          O LOGO ALI TEM pode revisar estes termos de serviço do site a qualquer
          momento, sem aviso prévio.
        </p>
      </section>

      <section>
        <h2>Lei aplicável</h2>
        <p>
          Estes termos e condições são regidos e interpretados de acordo com as leis do
          LOGO ALI TEM e você se submete à jurisdição exclusiva dos tribunais locais.
        </p>
      </section>
    </div>
  `,
  styles: [`
    .terms-container {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 20px;
    }
    h1, h2 {
      color: #333;
    }
    h2 {
      margin-top: 20px;
    }
    p, ul {
      margin: 10px 0;
    }
    ul {
      list-style-type: disc;
      padding-left: 20px;
    }
    .terms-footer {
      margin-top: 30px;
      font-weight: bold;
    }
  `]
})
export class TermsOfUseComponent {}
