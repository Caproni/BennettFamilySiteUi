import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { IngredientUpdateService } from '../../_services/api/recipes/ingredient/ingredient-update.service';
import { IngredientDeleteService } from '../../_services/api/recipes/ingredient/ingredient-delete.service';
import { IngredientCreateService } from '../../_services/api/recipes/ingredient/ingredient-create.service';
import { LoginService } from '../../_services/login/login.service';
import { Ingredient } from '../../_models/recipes/ingredient';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {

  @Input() ingredient!: Ingredient;

  photoFile = new File([], '');

  modalRef: BsModalRef = new BsModalRef();

  addIngredientForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  isActive = true;

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private ingredientCreateService: IngredientCreateService,
    private ingredientUpdateService: IngredientUpdateService,
    private ingredientDeleteService: IngredientDeleteService,
  ) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onIngredientFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    this.modalRef.hide();

  }

  deleteIngredient(modalRef: BsModalRef): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    if (!this.ingredient.id) return;

    this.ingredientDeleteService.deleteIngredient(
      this.ingredient.id,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => console.log(err),
      );
    modalRef.hide();
    this.ngOnInit();
  }

}
