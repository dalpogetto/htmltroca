import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { PoModule, PoTableColumn, PoTableModule, PoButtonModule, PoMenuItem, PoMenuModule, PoModalModule, PoPageModule, PoToolbarModule, PoTableAction, PoModalAction, PoDialogService, PoNotificationService, PoFieldModule, PoDividerModule, PoTableLiterals, PoTableComponent,} from '@po-ui/ng-components';
import { ServerTotvsService } from '../services/server-totvs.service';
import { ExcelService } from '../services/excel-service.service';
import { escape } from 'querystring';
import { environment } from '../environments/environment'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    PoModalModule,
    PoTableModule,
    PoModule,
    PoFieldModule,
    PoDividerModule,
    PoButtonModule,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
  
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  @ViewChild('grid', { static: true }) grid: PoTableComponent | undefined;


  private srvTotvs = inject(ServerTotvsService);
  private srvDialog = inject(PoDialogService);
  private srvNotification = inject(PoNotificationService);
  private router = inject(Router)
  private formB = inject(FormBuilder);

  //Variaveis 
  labelLoadTela:string = ''
  loadTecnico:string=''
  loadTela: boolean = false
  loadExcel:boolean = false
  tituloTela!:string
  mudaCampos!:number | null
  pesquisa!:string
  nomeBotao: any;
  lBotao:boolean = false

  //lista: any;
  tipoAcao:string=''
  
  //---Grid
  colunas!: PoTableColumn[]
  lista!: any[]
  listaDados!:any[]
  listaEstabelecimentos!:any[]
  listaTecnicos!:any[]
   customLiterals: PoTableLiterals = {
    noData: 'Infome os filtros para Buscar os Dados'
  };
  
    codEstabel!: string
    codTecnicoOri!: string
    codTecnicoDest!:string

  ngOnInit(): void {

    this.loadTela=true
    this.colunas = this.srvTotvs.obterColunas()
    
    //Carregar combo de estabelecimentos
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
        this.listaEstabelecimentos = (response as any[]).sort(this.srvTotvs.ordenarCampos(['label']))
        this.loadTela=false
      },
      error: (e) => {this.loadTela=false},
    });

    
  }

  onEstabChange(obj: string) {
    
    //Limpar listas

    if (obj === undefined) return;

    //Popular o Combo do Emitente
   
    this.listaDados = [];
    this.loadTecnico = `Populando técnicos do estab ${obj} ...`;

    //Chamar servico
    this.srvTotvs.ObterEmitentesDoEstabelecimento(obj).subscribe({
      next: (response: any) => {
        this.listaTecnicos = response;
        this.loadTecnico = 'Selecione o técnico';
      },
      //error: (e) => this.srvNotification.error("Ocorreu um erro na requisição " ),
    });
  }

  onSelecionar(){
    this.loadTela=true
    let param:any={codEstabel:this.codEstabel, codTecnico:this.codTecnicoOri}
    
    //Chamar servico
    this.srvTotvs.ObterSaldoTerceiro(param).subscribe({
      next: (response: any) => {
        if (response === null)
          this.listaDados=[]
        else
          this.listaDados = response.items
        this.loadTela=false
      },
      error: (e) => { this.loadTela=false},
    });

  }

  onExecutar(){
    if (this.codEstabel === undefined) return
    if (this.codTecnicoOri === undefined) return

    if (this.codTecnicoDest === undefined){
      this.srvNotification.error('Selecione o técnico de destino !')
      return
    } 

    if (this.grid?.getSelectedRows().length === 0) {
      this.srvNotification.error('Selecione ao menos um item para a troca !')
      return
    }

    if (this.codTecnicoOri === this.codTecnicoDest){
      this.srvNotification.error('Técnicos de Origem e Destino devem ser diferentes !')
      return
    }

    //Obter o nome do tecnico
    let nomeTecnico = this.listaTecnicos.filter(item=> item.value === this.codTecnicoDest)[0].label

    this.srvDialog.confirm({
      title: 'CONFIRMAÇÃO',
      message: `<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> DESEJA REALIZAR O EMPRÉSTIMO AO TÉCNICO <b>${nomeTecnico}</b> ?</span></div>`,
      
      literals: { cancel: 'Não', confirm: 'Sim' },
      confirm: () => {
        this.loadTela = false;
        let params: any = { codEstabel: this.codEstabel, codTecnico:this.codTecnicoDest, items: this.grid?.getSelectedRows()};
        console.log(params)
        /* this.srvTotvs.ExecutarTroca(params).subscribe({
          next: (response: any) => {
            this.loadTela = false;
            this.srvNotification.success('Registro alterado com sucesso !');
          },
          error: (e) => {
            this.loadTela = false;
          },
        }); */
      },
      cancel: () => {},
    });

  }
}

  
    

  