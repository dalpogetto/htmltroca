import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, of, take, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { PoTableColumn } from '@po-ui/ng-components';
import { environment } from '../environments/environment'
import { IMonitor } from './imonitor';

//--- Header somente para DEV
const headersTotvs = new HttpHeaders(environment.totvs_header)

@Injectable({
  providedIn: 'root'
})
export class ServerTotvsService {
  private reg!:any;
  _url = environment.totvs_url;

  constructor(private http: HttpClient ) { }

  public monitorLogado!: IMonitor | undefined;

  //---------------------- Variaveis Globais
  public ObterVariaveisGlobais(params?: any){
    return this.http.get(`${this._url}/ObterVariaveisGlobais`, {params, headers:headersTotvs})
                   .pipe(take(1));
  }

  //Chama tela do TOTVS
  public AbrirTelaTOTVS(params?:any){
    return this.http.get('/totvs-menu/rest/exec', { params, headers: headersTotvs }).pipe(take(1));
  }
  
  //------------ Colunas Grid Prioridade
  obterColunas(): Array<PoTableColumn> {
    return [
      { property: 'situacao', label:'Situação', type:'template'},
      { property: 'nro-docto',    label: "Documento"},
      { property: 'serie',     label: "Série"},
      { property: 'it-codigo',    label: "Item"},
      { property: 'desc-item',      label: "Descrição"},
      { property: 'qtde-troca',    label: "Qtde Empréstimo", type: 'number', format: "1.0"},
      { property: 'opcao', label: 'Empréstimo', type: 'cellTemplate' },
      { property: 'qtde-nota', label: 'Qtde Nota', type:'number', format:'1.0'},
     
    
    ];
  }

  obterColunasMonitor(): Array<PoTableColumn> {
    return [
      {
        property: 'situacao',
        label: 'Situação',
        type: 'label',
        labels: [
          {
            value: 'I',
            color: 'color-08',
            label: 'Impresso',
            textColor: 'white',
          },
          {
            value: 'B',
            color: 'color-03',
            label: 'Embalagem',
            textColor: 'white',
          },
          {
            value: 'E',
            color: 'color-09',
            label: 'Entradas',
            textColor: 'white',
          },
          {
            value: 'S',
            color: 'color-10',
            label: 'Saídas',
            textColor: 'white',
          },
          {
            value: 'R',
            color: 'color-01',
            label: 'Reparo',
            textColor: 'white',
          },
          {
            value: 'L',
            color: 'color-07',
            label: 'Resumo Final',
            textColor: 'white',
          },
        ],
      },
      { property: 'nr-process', label: 'Processo' },
      { property: 'cod-emitente', label: 'Técnico' },
      { property: 'nome-abrev', label: 'Nome' },
      { property: 'opcoes', label: 'Ações Disponíveis', type: 'cellTemplate' },
    ];
  }

  
  obterColunasEntradas(): Array<PoTableColumn> {
    return [
      {
        property: 'idi-sit',
        label: 'Sefaz',
        type: 'label',
        labels: [
          {
            value: 1,
            color: 'color-08',
            label: 'NFe não autorizada',
            textColor: 'white',
          },
          {
            value: 2,
            color: 'color-08',
            label: 'Em Processamento',
            textColor: 'white',
          },
          {
            value: 3,
            color: 'color-10',
            label: 'Autorizada',
            textColor: 'white',
          },
          {
            value: 4,
            color: 'color-07',
            label: 'Uso denegado',
            textColor: 'white',
          },
          {
            value: 5,
            color: 'color-07',
            label: 'Docto Rejeitado',
            textColor: 'white',
          },
          {
            value: 6,
            color: 'color-07',
            label: 'Docto Cancelado',
            textColor: 'white',
          },
          {
            value: 7,
            color: 'color-07',
            label: 'Docto Inutilizado',
            textColor: 'white',
          },
          {
            value: 8,
            color: 'color-08',
            label: 'Em processamento no Aplicativo de Transmissão',
            textColor: 'white',
          },
          {
            value: 9,
            color: 'color-08',
            label: 'Em processamento na SEFAZ',
            textColor: 'white',
          },
          {
            value: 10,
            color: 'color-08',
            label: 'Em processamento no SCAN',
            textColor: 'white',
          },
          {
            value: 11,
            color: 'color-10',
            label: 'NF-e Gerada',
            textColor: 'white',
          },
          {
            value: 12,
            color: 'color-08',
            label: 'NF-e em Processo de Cancelamento',
            textColor: 'white',
          },
          {
            value: 13,
            color: 'color-08',
            label: 'NF-e em Processo de Inutilizacao',
            textColor: 'white',
          },
          {
            value: 14,
            color: 'color-08',
            label: 'NF-e Pendente de Retorno',
            textColor: 'white',
          },
          {
            value: 15,
            color: 'color-07',
            label: 'DPEC recebido pelo SCE',
            textColor: 'white',
          },
          {
            value: 98,
            color: 'color-08',
            label: 'Aguard.Proc reapi0190',
            textColor: 'white',
          },
          {
            value: 99,
            color: 'color-08',
            label: 'Aguard.Proc.re1005rp',
            textColor: 'white',
          },
          {
            value: 100,
            color: 'color-10',
            label: 'Nota Atualizada Estoque',
            textColor: 'white',
          },
          {
            value: 101,
            color: 'color-07',
            label: 'Situação desconhecida',
            textColor: 'white',
          },
          {
            value: 102,
            color: 'color-07',
            label: 'ERRO verificar pendências',
            textColor: 'white',
          },
          {
            value: 103,
            color: 'color-08',
            label: 'Aguardando Reprocessamento',
            textColor: 'white',
          },
        ],
      },
      { property: 'cod-emitente', label: 'Emitente' },
      { property: 'serie-docto', label: 'Serie' },
      { property: 'nro-docto', label: 'Docto' },
      { property: 'nat-operacao', label: 'Nat.Oper' },
    ];
  }

  obterColunasSaidas(): Array<PoTableColumn> {
    return [
      {
        property: 'idi-sit',
        label: 'Sefaz',
        type: 'label',
        labels: [
          {
            value: 1,
            color: 'color-08',
            label: 'NFe não autorizada',
            textColor: 'white',
          },
          {
            value: 2,
            color: 'color-08',
            label: 'Em Processamento',
            textColor: 'white',
          },
          {
            value: 3,
            color: 'color-09',
            label: 'Autorizada',
            textColor: 'white',
          },
          {
            value: 4,
            color: 'color-07',
            label: 'Uso denegado',
            textColor: 'white',
          },
          {
            value: 5,
            color: 'color-07',
            label: 'Docto Rejeitado',
            textColor: 'white',
          },
          {
            value: 6,
            color: 'color-07',
            label: 'Docto Cancelado',
            textColor: 'white',
          },
          {
            value: 7,
            color: 'color-07',
            label: 'Docto Inutilizado',
            textColor: 'white',
          },
          {
            value: 8,
            color: 'color-08',
            label: 'Em processamento no Aplicativo de Transmissão',
            textColor: 'white',
          },
          {
            value: 9,
            color: 'color-08',
            label: 'Em processamento na SEFAZ',
            textColor: 'white',
          },
          {
            value: 10,
            color: 'color-08',
            label: 'Em processamento no SCAN',
            textColor: 'white',
          },
          {
            value: 11,
            color: 'color-10',
            label: 'NF-e Gerada',
            textColor: 'white',
          },
          {
            value: 12,
            color: 'color-08',
            label: 'NF-e em Processo de Cancelamento',
            textColor: 'white',
          },
          {
            value: 13,
            color: 'color-08',
            label: 'NF-e em Processo de Inutilizacao',
            textColor: 'white',
          },
          {
            value: 14,
            color: 'color-08',
            label: 'NF-e Pendente de Retorno',
            textColor: 'white',
          },
          {
            value: 15,
            color: 'color-07',
            label: 'DPEC recebido pelo SCE',
            textColor: 'white',
          },
          {
            value: 99,
            color: 'color-08',
            label: 'Aguardando NFE',
            textColor: 'white',
          },
          {
            value: 100,
            color: 'color-10',
            label: 'Nota Atualizada Estoque',
            textColor: 'white',
          },
          {
            value: 102,
            color: 'color-07',
            label: 'ERRO verificar pendências',
            textColor: 'white',
          },
          {
            value: 103,
            color: 'color-08',
            label: 'Aguardando Reprocessamento',
            textColor: 'white',
          },
        ],
      },
      { property: 'cod-estabel', label: 'Estab' },
      { property: 'serie', label: 'Série' },
      { property: 'nr-nota-fis', label: 'Nr Nota' },
      { property: 'nome-ab-cli', label: 'Emitente' },
      { property: 'nat-operacao', label: 'Nat.Oper' },
    ];
  }

  obterColunasErrosProcessamento(): Array<PoTableColumn> {
    return [
      { property: 'nomeArquivo', label: 'Arquivo', type: 'columnTemplate' },
      { property: 'mensagem', label: 'Mensagem' },
      {
        property: 'dataHora',
        label: 'Data',
        type: 'date',
        format: 'dd/MM/yyyy hh:mm:ss',
      },
    ];
  }


  

  public ObterMonitor(monitor?: IMonitor) {
    return this.monitorLogado!;
  }

  //Retorno transformado no formato {label: xxx, value: yyyy}
  public ObterEstabelecimentos(params?: any){
    return this.http.get<any>(`${this._url}/ObterEstab`, {params: params, headers:headersTotvs})
                 .pipe(
                  ///tap(data => {console.log("Retorno API TOTVS => ", data)}),
                  map(item => { return item.items.map((item:any) =>  { return { label:item.codEstab + ' ' + item.nome, value: item.codEstab, codFilial: item.codFilial } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  public ObterEmitentesDoEstabelecimento(id:string){
    return this.http.get<any>(`${this._url}/ObterTecEstab?codEstabel=${id}`, {headers:headersTotvs})
                 .pipe(
                  map(item => { return item.items.map((item:any) =>  { return { label: item.codTec + ' ' + item.nomeAbrev, value: item.codTec  } }) }),
                  ///tap(data => {console.log("Data Transformada pelo Map =>", data)}),
                  take(1));
  }

  public ObterSaldoTerceiro(params?: any){
    return this.http.get(`${this._url}/ObterSaldoTerceiro`, {params:params, headers:headersTotvs})
                   .pipe(take(1));
  }

  public ExecutarTroca(params?: any){
    return this.http.post(`${this._url}/ExecutarTroca`, params, { headers:headersTotvs})
                   .pipe(take(1));
  }

   //Parametros do Estabelecimento
   public ObterProcessosEstab(params?: any) {
    return this.http
      .get(`${this._url}/ObterProcessosEstab`, {
        params: params,
        headers: headersTotvs,
      })
      .pipe(take(1));
  }

  //---------------------- Processo
  public ObterNrProcesso(params?: any) {
    return this.http
      .get(`${this._url}/ObterNrProcesso`, { params, headers: headersTotvs })
      .pipe(take(1));
  }

  public ForcarEfetivacaoSaida(params?: any) {
    return this.http
      .get(`${this._url}/ForcarEfetivacaoSaida`, {
        params,
        headers: headersTotvs,
      })
      .pipe(take(1));
  }

  public ObterNotas(params?: any) {
    return this.http
      .post(`${this._url}/ObterNotas`, params, { headers: headersTotvs })
      .pipe(take(1));
  }

  public ReprocessarCalculo(params?: any) {
    return this.http
      .post(`${this._url}/ReprocessarCalculo`, params, {
        headers: headersTotvs,
      })
      .pipe(take(1));
  }


   



  
  //Ordenacao campos num array
  public ordenarCampos = (fields: any[]) =>
    (a: { [x: string]: number }, b: { [x: string]: number }) =>
      fields
        .map((o) => {
          let dir = 1;
          if (o[0] === '-') {
            dir = -1;
            o = o.substring(1);
          }
          return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
        })
        .reduce((p, n) => (p ? p : n), 0);

}
