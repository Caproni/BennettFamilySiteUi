import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { IngredientUsage } from 'src/app/_models/recipes/ingredient-usage';
import { Ingredient } from 'src/app/_models/recipes/ingredient';
import { LoginService } from 'src/app/_services/login/login.service';
import { IngredientUsageDeleteService } from 'src/app/_services/api/recipes/ingredient-usage/ingredient-usage-delete.service';
import { IngredientUsageUpdateService } from 'src/app/_services/api/recipes/ingredient-usage/ingredient-usage-update.service';

@Component({
  selector: 'fam-app-recipe-ingredient-usage',
  templateUrl: './ingredient-usage.component.html',
  styleUrls: ['./ingredient-usage.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('300ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('300ms ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class IngredientUsageComponent implements OnInit {

  isActive = true;

  @Input() usage!: IngredientUsage;
  @Input() ingredients!: Ingredient[];
  @Input() ingredient!: Ingredient;

  modalRef: BsModalRef = new BsModalRef();

  editIngredientUsageForm: FormGroup = new FormGroup({
    quantity: new FormControl('', [Validators.required]),
    quantity_units: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  constructor(
    private modalService: BsModalService,
    private loginService: LoginService,
    private toasterService: ToastrService,
    private ingredientUsageUpdateService: IngredientUsageUpdateService,
    private ingredientUsageDeleteService: IngredientUsageDeleteService,
  ) { }

  ngOnInit(): void {
    this.onInit();
  }

  onInit() {
    this.ingredient = this.ingredients.filter(x => x.id == this.usage.ingredient_id)[0];

    this.editIngredientUsageForm.controls['quantity'].setValue(this.usage.quantity);
    this.editIngredientUsageForm.controls['quantity_units'].setValue(this.usage.quantity_units);
    this.editIngredientUsageForm.controls['notes'].setValue(this.usage.notes);
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised();
  }

  updateIngredientUsage() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.usage.id) return;

    const payload = JSON.parse(JSON.stringify(this.editIngredientUsageForm.value));

    if (this.usage.id) {

      const patch: IngredientUsage = {
        id: this.usage.id,
        recipe_step_id: this.usage.recipe_step_id,
        ingredient_id: this.usage.ingredient_id,
        quantity: payload.quantity,
        quantity_units: payload.quantity_units,
        notes: payload.notes,
      };

      this.ingredientUsageUpdateService.updateIngredientUsage(this.usage.id, patch)
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (_) => {
            this.toasterService.info('Updating ' + payload.name, 'Info');
          },
          (_) => {
            this.toasterService.error('Could not update ' + payload.name, 'Error');
          },
          () => {
            this.toasterService.success('Updated ' + payload.name, 'Success');
            this.onInit();
          },
        );

    }

    this.modalRef.hide();

  }

  deleteIngredientUsage() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.usage.id) return;

    if (this.usage.id) {
      this.ingredientUsageDeleteService.deleteIngredientUsage(
        this.usage.id,
      )
        .pipe(takeWhile(_ => this.isActive))
        .subscribe(
          (_) => {
            this.toasterService.info('Deleting ingredient usage', 'Info');
          },
          (_) => {
            this.toasterService.error('Could not delete ingredient usage', 'Error');
          },
          () => {
            this.toasterService.success('Deleted ingredient usage', 'Success');
            this.onInit();
          }
        );
      this.modalRef.hide();
    }
  }

}
