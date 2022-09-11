import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { NgxMasonryModule } from 'ngx-masonry';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertWindowComponent } from './alert/alert.component';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MediaComponent } from './media/media.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PhotosComponent } from './photos/photos.component';
import { RecipeDetailsComponent } from './recipes/recipe-details/recipe-details.component';
import { MediaDetailComponent } from './media/media-detail/media-detail.component';
import { LoadingTableComponent } from './loading-table/loading-table.component';
import { RecipeViewComponent } from './recipes/recipe-view/recipe-view.component';
import { NoPageComponent } from './no-page/no-page.component';
import { AccountComponent } from './account/account.component';
import { PhotoDetailsComponent } from './photos/photo-details/photo-details.component';
import { DatetimeSliderComponent } from './_shared/datetime-slider/datetime-slider.component';
import { RecipeStepComponent } from './recipes/recipe-view/recipe-step/recipe-step.component';
import { IngredientsComponent } from './recipes/ingredients/ingredients.component';
import { EquipmentComponent } from './recipes/equipment/equipment.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AlertWindowComponent,
    UnauthorisedComponent,
    FamilyTreeComponent,
    RecipesComponent,
    MediaComponent,
    NavbarComponent,
    HomeComponent,
    PhotosComponent,
    RecipeDetailsComponent,
    MediaDetailComponent,
    LoadingTableComponent,
    RecipeViewComponent,
    NoPageComponent,
    AccountComponent,
    PhotoDetailsComponent,
    DatetimeSliderComponent,
    RecipeStepComponent,
    IngredientsComponent,
    EquipmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    ToastrModule.forRoot(
      {
        timeOut: 2000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      }
    ),
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    BsDatepickerModule,
    MatGridListModule,
    NgxMasonryModule,
    MatChipsModule,
    MatIconModule,
    NgxSliderModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
