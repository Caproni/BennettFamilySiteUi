import { Component, OnInit, TemplateRef } from '@angular/core';
// import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';
import { RecipeReadService } from 'src/app/_services/api/recipes/recipe-read.service';
import { RecipeCreateService } from 'src/app/_services/api/recipes/recipe-create.service';
import { Recipe } from '../_models/recipes/recipe';

@Component({
  selector: 'fam-app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  searchRegex = /["']([a-z0-9:,\-\.\s^\/+]+)["']|([a-z0-9:,\-\.^\/+]+)/gm;

  recipes: Recipe[] = [];
  // modalRef: BsModalRef = new BsModalRef();
  uploadErrors = {
    name: false,
  };
  private _isActive = true;
  _isLoading = true;

  constructor(
    private recipeUploadService: RecipeCreateService,
    private recipeDownloadService: RecipeReadService,
    // private modalService: BsModalService,
  ) { }

  ngOnInit(): void {

    // this.recipeDownloadService.downloadRecipes()
    //   .pipe(takeWhile(_ => this._isActive))
    //   .subscribe(
    //     (data: Recipe[]) => {
    //       this.recipes = data;
    //     });
  }

  ngOnDestroy(): void {
    this._isActive = false;
  }

  openModal(template: TemplateRef<any>): void {
    // this.modalRef = this.modalService.show(template);
  }

}
