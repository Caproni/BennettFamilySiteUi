import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MediaComponent } from './media/media.component';
import { PhotosComponent } from './photos/photos.component';
import { HomeComponent } from './home/home.component';
import { NoPageComponent } from './no-page/no-page.component';
import { RecipeViewComponent } from './recipes/recipe-view/recipe-view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'family', component: FamilyTreeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipe-detail/:recipeId', component: RecipeViewComponent },
  { path: 'media', component: MediaComponent },
  { path: 'photos', component: PhotosComponent },
  { path: '**', component: NoPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
