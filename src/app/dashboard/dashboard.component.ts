import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoAccordionComponent, PoAccordionItemComponent, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn, PoLoadingModule, PoButtonModule, PoTooltipModule, PoAccordionModule, PoWidgetModule, PoTableModule, PoModalModule } from '@po-ui/ng-components';
import { Subscription, delay, interval } from 'rxjs';
import { environment } from '../environments/environment';
import { NgIf, UpperCasePipe } from '@angular/common';
import { ServerTotvsService } from '../services/server-totvs.service';
import { BtnDownloadComponent } from '../btn-download/btn-download.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: true,
    imports: [
        NgIf,
        BtnDownloadComponent,
        PoLoadingModule,
        PoButtonModule,
        PoTooltipModule,
        PoAccordionModule,
        PoWidgetModule,
        PoTableModule,
        PoModalModule,
        UpperCasePipe,
    ],
})
export class DashboardComponent {
  //---------- Acessar a DOM
  @ViewChild('loginModal', { static: true }) loginModal:
    | PoModalComponent
    | undefined;
  @ViewChild('abrirArquivo', { static: true }) abrirArquivo:
    | PoModalComponent
    | undefined;
    @ViewChild(PoAccordionComponent, { static: true }) principal!: PoAccordionComponent;
    @ViewChild(PoAccordionItemComponent, { static: true }) item1!: PoAccordionItemComponent;
    @ViewChild(PoAccordionItemComponent, { static: true }) item2!: PoAccordionItemComponent;

  //---Injection
  private srvTotvs = inject(ServerTotvsService);
  private srvNotification = inject(PoNotificationService);
  private srvDialog = inject(PoDialogService);
  private router = inject(Router)

  //---Variaveis
  tabNFE: boolean = true;
  codEstabel: string = '';
  codUsuario: string = '';

  //Progress Counter
  percNFE = 0
  percNFS = 0

  rpwStatus!: {
    mensagemTela: string,
    motivoExecucao: string,
    numPedExecucao: string,
    situacaoExecucao: string,
    mensagemRPW:string,
  };
  cRPW: string = '';
  cMensagemErroRPW=''
  infoTela: string = '';
  nrProcess: string = '';
  statusProcess: number = 0;
  tempoProcess: number = 0;
  senha: string = '';
  loadTela: boolean = false;
  usuarioLogado: boolean = false;
  loadTecnico: string = '';
  placeHolderEstabelecimento: string = '';
  conteudoArquivo: string = '';
  mostrarInfo: boolean = false;
  nomeArquivo: string = '';

  //ListasCombo
  listaEstabelecimentos!: any[];
  listaTecnicos!: any[];

  //---Grids de Notas
  colunasNFS!: PoTableColumn[];
  colunasNFE!: PoTableColumn[];
  colunasErro!: PoTableColumn[];
  listaNFS!: any[];
  listaNFE!: any[];
  listaErros!: any[];
  sub!: Subscription;
  urlSpool:string=''

  acaoLogin: PoModalAction = {
    action: () => {
      this.LogarUsuario();
    },
    label: 'Selecionar',
  };

  acaoImprimir: PoModalAction = {
    action: () => {
      
    },
    label: 'Gerar PDF',
  };

  acaoSair: PoModalAction = {
    action: () => {
      this.abrirArquivo?.close();
    },
    label: 'Sair',
  };

  readonly acoesGridErro: PoTableAction[] = [
    {
      label: '',
      icon: 'bi bi-folder2-open',
      type:'danger',
      
      
    },
  ];

  ngOnInit(): void {

    this.esconderPainel();
    //--- Informacoes iniciais tela
    this.urlSpool = environment.totvs_spool

    //Colunas grids
    this.colunasNFE = this.srvTotvs.obterColunasEntradas();
    this.colunasNFS = this.srvTotvs.obterColunasSaidas();
    this.colunasErro = this.srvTotvs.obterColunasErrosProcessamento();

    this.verificarNotas()

  }

onForcarEfetivarProcesso(){
  this.srvDialog.confirm({
    title: 'EFETIVAR PROCESSO',
    message:
    "<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> CONFIRMA EFETIVAÇÃO ?</span></div><p>O processamento será encerrado e o processo enviado para o próximo passo.</p>",

    confirm: () => {
      this.loadTela = true;
      let params: any = {
          codEstabel: this.codEstabel,
          nrProcess: this.nrProcess
      };

      this.srvTotvs.ForcarEfetivacaoSaida(params).subscribe({
        next: (response: any) => {
          this.router.navigate(['monitor']) 
        },
        error: (e) => {
         
          this.loadTela = false;
        },
      });
    },
    cancel: () => this.srvNotification.error('Cancelada pelo usuário'),
  });
}


LogarUsuario() {
   this.router.navigate(['seletor'], {queryParams:{redirectTo:'dashboard'}}) 
}
  
verificarNotas() {
    
    if (!this.usuarioLogado) {
      this.loginModal?.open();
    } else {
      this.loadTela = true;


      let paramsNota: any = {CodEstab: this.codEstabel,CodTecnico: this.codUsuario, NrProcess: this.nrProcess};
      this.srvTotvs.ObterNotas(paramsNota).subscribe({
        next: (response: any) => {
          
          this.listaNFE = response.nfe;
          this.listaNFS = response.nfs;

          //Atualizar tela
          this.principal.poAccordionItems.forEach(x=> {
            if (x.label.startsWith('Notas Fiscais de ENTRADA'))
              x.label = `Notas Fiscais de ENTRADA (${this.listaNFE.filter(x => x["idi-sit"] === 100).length} de ${response.nfe.length})`
            else if (x.label.startsWith('Notas Fiscais de SAÍDA'))
              x.label = `Notas Fiscais de SAÍDA (${this.listaNFS.filter(x => x["idi-sit"] === 100).length} de ${response.nfs.length})`
            else
              x.label = `Logs do Processo (${response.erros.length})`
          })

          this.rpwStatus = response.rpw;
          this.listaErros = response.erros;
          this.cMensagemErroRPW = response.rpw[0].mensagemRPW
          this.cRPW = `RPW: ${response.rpw[0].numPedExecucao} (${response.rpw[0].situacaoExecucao} / ${response.rpw[0].motivoExecucao})`;
          //this.infoTela = response.rpw[0].mensagemTela;

          //Aplicar cor a tag de informacoes na tela
          
          if (response.rpw[0].situacaoExecucao === '')
            this.esconderPainel()
          else{
            this.aplicarCorPainel(response.rpw[0].mensagemTela)
          }
          //this.loadTela = false;
        },
        error: (e) => {
          //this.srvNotification.error('Ocorreu um erro na requisição');
          return;
        },
      });

      //Obter as informacoes do Processo
      let paramsTec:any = {codEstabel: this.codEstabel, codTecnico: this.codUsuario}
      this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
        next: (response: any) => {
          //Atualizar Informacoes Tela
          //this.srvTotvs.EmitirParametros({processoSituacao: response.situacaoProcesso})

          this.loadTela=false
        },
       error: (e) => { }
      })

    }
  }

  onReprocessarNotas() {
    console.log(this.cRPW)

    if (this.cRPW.toUpperCase().includes('EXECUTANDO / EXECUTANDO PEDIDO') || this.cRPW.toUpperCase().includes('NÃO EXECUTADO')){
      this.srvNotification.error('Não é permitido o reprocessamento com RPW em execução !')
      return
    }

    this.srvDialog.confirm({
      title: 'REPROCESSAR NOTAS',
      message:
         "<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> CONFIRMA REPROCESSAMENTO ?</span></div><p>O reprocessamento só deve ser usado com a certeza da parada do processamento normal.</p>",
        

      confirm: () => {
        this.loadTela = true;
        let params: any = {
          paramsTela: {
            codEstab: this.codEstabel,
            codEmitente: this.codUsuario,
            nrProcess: this.nrProcess,
          },
        };

        this.srvTotvs.ReprocessarCalculo(params).subscribe({
          next: (response: any) => {
            this.srvNotification.success('Execução do cálculo realizada com sucesso ! Processo RPW: ' + response.rpw)

            setTimeout(() => {
              //Atualizar tela logo apos enviar o processamento
              this.verificarNotas()
            }, 1000);
          },
          error: (e) => {
           // this.srvNotification.error('Ocorreu um erro na requisição')
            this.loadTela = false;
          },
        });
      },
      cancel: () => this.srvNotification.error('Cancelada pelo usuário'),
    });
  }

 

  aplicarCorPainel(cor: string) {
    const elemento: HTMLInputElement | null = document.querySelector(
      '.rpwInfo'
    ) as HTMLInputElement;

    if (elemento === null) return;
    elemento?.classList.remove('ok');
    elemento?.classList.remove('info');
    elemento?.classList.remove('erro');
    elemento?.classList.add(cor);
    elemento.style.display = 'block';
  }

  esconderPainel() {
    const elemento: HTMLInputElement | null = document.querySelector(
      '.rpwInfo'
    ) as HTMLInputElement;
    if (elemento === null) return;
    elemento.style.display = 'none';
  }

}
