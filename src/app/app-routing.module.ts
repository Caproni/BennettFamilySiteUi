import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountComponent } from "./account/account.component";

const routes: Routes = [
    { path: 'account', component: AccountComponent},
    { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule)},
    { path: 'unauthorised', component: AccountComponent},
    { path: '', component: AccountComponent},
    { path: '**', component: PageNotFoundComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
