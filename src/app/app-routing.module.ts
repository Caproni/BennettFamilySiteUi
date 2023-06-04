import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { MediaComponent } from './media/media.component';
import { ContentsComponent } from './contents/contents.component';
import { PapersComponent } from './papers/papers.component';
import { MappingComponent } from './mapping/mapping.component';
import { WeatherComponent } from './weather/weather.component';
import { RecipesComponent } from './recipes/recipes.component';
import { IngredientsComponent } from './recipes/ingredients/ingredients.component';
import { EquipmentComponent } from './recipes/equipment/equipment.component';
import { RecipeViewComponent } from './recipes/recipe-view/recipe-view.component';
import { NoPageComponent } from './no-page/no-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'family', component: FamilyTreeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'cooking-ingredients', component: IngredientsComponent },
  { path: 'cooking-equipment', component: EquipmentComponent },
  { path: 'recipe-detail/:recipeId', component: RecipeViewComponent },
  { path: 'media', component: MediaComponent },
  { path: 'papers', component: PapersComponent },
  { path: 'content', component: ContentsComponent },
  { path: 'mapping', component: MappingComponent },
  { path: 'weather', component: WeatherComponent },
  { path: '**', component: NoPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
