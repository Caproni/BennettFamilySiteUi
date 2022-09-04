import {Component, OnInit, Input, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { RecipeStep } from 'src/app/_models/recipes/recipe-step';
import { LoginService } from 'src/app/_services/login/login.service';
import { RecipeStepUpdateService } from 'src/app/_services/api/recipes/recipe-step/recipe-step-update.service';
import { RecipeStepDeleteService } from 'src/app/_services/api/recipes/recipe-step/recipe-step-delete.service';

@Component({
  selector: 'fam-app-recipe-step',
  templateUrl: './recipe-step.component.html',
  styleUrls: ['./recipe-step.component.css']
})
export class RecipeStepComponent implements OnInit {

  @Input() step!: RecipeStep;

  modalRef: BsModalRef = new BsModalRef();

  editRecipeStepForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  isActive = true;

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private recipeStepUpdateService: RecipeStepUpdateService,
    private recipeStepDeleteService: RecipeStepDeleteService,
  ) { }

  ngOnInit(): void {
    console.log('Step: ', this.step)
    this.editRecipeStepForm.controls['name'].setValue(this.step.name);
    this.editRecipeStepForm.controls['description'].setValue(this.step.description);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  updateRecipeStep() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    const payload = JSON.parse(JSON.stringify(this.editRecipeStepForm.value));

    if (this.step.id) {

      const patch: RecipeStep = {
        name: payload.name,
        description: payload.description ?? null,
        image: null,
        ingredients_used: [],
        equipment_used: [],
        recipe_id: this.step.recipe_id,
        blob_url: this.step.blob_url,
        index: this.step.index,
        id: this.step.id,
      };

      this.recipeStepUpdateService.updateRecipeStep(this.step.id, patch)
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (_) => {
            this.ngOnInit();
            this.toasterService.info('Updating ' + payload.name, 'Info');
          },
          (err) => {
            console.log(err);
            this.toasterService.error('Could not update ' + payload.name, 'Error');
          },
          () => {
            this.toasterService.success('Updated ' + payload.name, 'Success');
          },
        );

    }

    this.modalRef.hide();
  }

  deleteRecipeStep(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) {
      return;
    }

    if (this.step.id) {
      this.recipeStepDeleteService.deleteRecipeStep(
        this.step.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => console.log(err),
        );
      this.modalRef.hide();
      this.ngOnInit();
    }
  }

}
