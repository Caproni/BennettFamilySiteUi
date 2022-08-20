import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
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
import { PhotoCardComponent } from './photos/photo-card/photo-card.component';
import { MediumDetailComponent } from './media/medium-detail/medium-detail.component';
import { LoadingTableComponent } from './loading-table/loading-table.component';
import { RecipeViewComponent } from './recipes/recipe-view/recipe-view.component';
import { NoPageComponent } from './no-page/no-page.component';

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
    PhotoCardComponent,
    MediumDetailComponent,
    LoadingTableComponent,
    RecipeViewComponent,
    NoPageComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ModalModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        FontAwesomeModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        BsDatepickerModule,
        MatGridListModule,
    ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
