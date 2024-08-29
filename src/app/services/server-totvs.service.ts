import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, of, take, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { PoTableColumn } from '@po-ui/ng-components';
import { environment } from '../environments/environment'

//--- Header somente para DEV
const headersTotvs = new HttpHeaders(environment.totvs_header)

@Injectable({
  providedIn: 'root'
})
export class ServerTotvsService {
  private reg!:any;
  _url = environment.totvs_url;

  constructor(private http: HttpClient ) { }

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
      { property: 'nro-docto',    label: "Documento"},
      { property: 'serie',     label: "Série"},
      { property: 'it-codigo',    label: "Item"},
      { property: 'desc-item',      label: "Descrição"},
      { property: 'quantidade',    label: "Quantidade", type: 'number', format: "1.0"},
    
    ];
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
