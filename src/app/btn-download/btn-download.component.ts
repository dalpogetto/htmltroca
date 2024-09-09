import { booleanAttribute, Component, Input } from '@angular/core';
import { environment } from '../environments/environment';
import { NgIf } from '@angular/common';


@Component({
    selector: 'btnDownload',
    templateUrl: './btn-download.component.html',
    styleUrl: './btn-download.component.css',
    standalone: true,
    imports: [NgIf]
})
export class BtnDownloadComponent {
  @Input() nomeArquivo: string='';
  @Input({transform: booleanAttribute}) mostrarNomeArquivo: boolean=true;
  

  urlSpool:string=environment.totvs_spool
}
