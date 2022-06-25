import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MediaComponent } from './media/media.component';
import { PhotosComponent } from './photos/photos.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'family', component: FamilyTreeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'media', component: MediaComponent },
  { path: 'photos', component: PhotosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
