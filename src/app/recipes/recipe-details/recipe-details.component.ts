import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { RecipeDeleteService } from 'src/app/_services/api/recipes/recipe-delete.service';
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'fam-app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  @Input() recipe!: Recipe;
  isActive = true;

  modalRef: BsModalRef = new BsModalRef();

  constructor(
    private modalService: BsModalService,
    private recipeDeleteService: RecipeDeleteService,
  ) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  deleteRecipe(modalRef: BsModalRef): void {
    if (this.recipe.id) {
      this.recipeDeleteService.deleteRecipe(
        this.recipe.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => console.log(err),
        );
      modalRef.hide();
    }
  }

}
