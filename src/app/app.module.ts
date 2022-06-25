import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertWindowComponent } from './alert/alert.component';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { FamilyTreeComponent } from './family-tree/family-tree.component';
import { RecipesComponent } from './recipes/recipes.component';
import { MediaComponent } from './media/media.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PhotosComponent } from './photos/photos.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
