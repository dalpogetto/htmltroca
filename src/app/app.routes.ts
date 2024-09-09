import { Routes } from '@angular/router';


export const routes: Routes = [

    {path: '', redirectTo: '/list', pathMatch: 'full'},
    {path:'list', loadComponent:()=> import('../app/list/list.component').then(c=>c.ListComponent)},
    {path:'monitor', loadComponent:()=> import('../app/monitor/monitor.component').then(c=>c.MonitorProcessosComponent)}

];

