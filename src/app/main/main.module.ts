import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './main/navbar/navbar.component';
import { AuthGuardGuard } from '../auth-guard.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MediaComponent } from './media/media.component';
import { LandingComponent } from './landing/landing.component';
import { PhotosComponent } from './photos/photos.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: 'family', component: FamilyTreeComponent, canActivate: [AuthGuardGuard] },
      { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuardGuard] },
      { path: 'media', component: MediaComponent, canActivate: [AuthGuardGuard] },
      { path: 'photos', component: PhotosComponent, canActivate: [AuthGuardGuard] },
    ],
  },
];

@NgModule({
  declarations: [
    MainComponent,
    FamilyTreeComponent,
    RecipesComponent,
    MediaComponent,
    NavbarComponent,
    LandingComponent,
    PhotosComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
  ]
})

export class MainModule { }
