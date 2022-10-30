import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { Recipe } from 'src/app/_models/recipes/recipe';
import { Equipment } from 'src/app/_models/recipes/equipment';
import { RecipeCreateService } from 'src/app/_services/api/recipes/recipe/recipe-create.service';
import { RecipeReadService } from 'src/app/_services/api/recipes/recipe/recipe-read.service';
import { RecipeUpdateService } from 'src/app/_services/api/recipes/recipe/recipe-update.service';
import { RecipeDeleteService } from 'src/app/_services/api/recipes/recipe/recipe-delete.service';
import { EquipmentDeleteService } from 'src/app/_services/api/recipes/equipment/equipment-delete.service';
import { EquipmentUpdateService } from 'src/app/_services/api/recipes/equipment/equipment-update.service';
import { EquipmentReadService } from 'src/app/_services/api/recipes/equipment/equipment-read.service';
import { EquipmentCreateService } from 'src/app/_services/api/recipes/equipment/equipment-create.service';
import { LoginService } from 'src/app/_services/login/login.service';

@Component({
  selector: 'fam-app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('400ms ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('400ms ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ],
})
export class RecipesComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;
  searchPhrase = '';

  recipes: Recipe[] = [];
  equipment: Equipment[] = [];

  filteredRecipes: Recipe[] = [];
  filteredEquipment: Equipment[] = [];

  recipeTags: string[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  modalRef: BsModalRef = new BsModalRef();
  private isActive = true;

  loadedRecipes = false;
  loadedEquipment = false;

  newRecipeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    duration_in_minutes: new FormControl('', [Validators.required]),
    source: new FormControl(''),
    ingredients: new FormControl(''),
    steps: new FormControl(''),
    equipment: new FormControl(''),
    tags: new FormControl(''),
  });

  newEquipmentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private toasterService: ToastrService,
    private recipeCreateService: RecipeCreateService,
    private recipeReadService: RecipeReadService,
    private recipeUpdateService: RecipeUpdateService,
    private recipeDeleteService: RecipeDeleteService,
    private equipmentCreateService: EquipmentCreateService,
    private equipmentReadService: EquipmentReadService,
    private equipmentUpdateService: EquipmentUpdateService,
    private equipmentDeleteService: EquipmentDeleteService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.onInit();
  }

  onInit() {

    this.recipeReadService.readRecipes().subscribe((b) => {
      this.loadedRecipes = b;
      this.recipes = this.recipeReadService.getRecipes();
      this.filteredRecipes = this.recipes;
    });

    this.equipmentReadService.readEquipments().subscribe((b) => {
      this.loadedEquipment = b;
      this.equipment = this.equipmentReadService.getEquipments();
      this.filteredEquipment = this.equipment;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised()
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  filterRecipes() {
    const searchTerms: string[] = [];
    const groups = this.searchPhrase.matchAll(this.searchRegex);
    let group = groups.next();
    while (!group.done) {
      for (let i = 1; i < group.value.length; i++) {
        if (group.value[i] !== undefined) {
          searchTerms.push(group.value[i].toLowerCase());
        }
      }
      group = groups.next();
    }

    this.filteredRecipes = this.recipes.filter(item => {

      const included: boolean[] = [];

      const name = item.name?.toLowerCase();
      const source = item.source?.toLowerCase();
      const tags = item.tags.join(" ").toLowerCase();

      for (const searchTerm of searchTerms) {
        const includedForThisTerm: boolean[] = [];

        if (name) {
          includedForThisTerm.push(name.includes(searchTerm));
        }

        if (source) {
          includedForThisTerm.push(source.includes(searchTerm));
        }

        if (tags) {
          includedForThisTerm.push(tags.includes(searchTerm));
        }

        included.push(includedForThisTerm.reduceRight(
          (accumulator, currentValue) => {
            return accumulator || currentValue;
          },
          false
        ));
      }
      return included.reduceRight(
        (accumulator, currentValue) => {
          return accumulator && currentValue;
        },
        true
      );
    });
  }

  addRecipeTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.recipeTags.push(value);
    }

    event.chipInput!.clear();
  }

  removeRecipeTag(tag: string) {
    const index = this.recipeTags.indexOf(tag);
    if (index >= 0) {
      this.recipeTags.splice(index, 1);
    }
  }

  onRecipeFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.newRecipeForm.value));

    this.recipeCreateService.createRecipe(
      {
        name: payload.name,
        description: payload.description ?? null,
        duration_in_minutes: payload.duration_in_minutes,
        source: payload.source ?? null,
        added_date: new Date(),
        blob_url: null,
        steps: [],
        equipment: [],
        tags: this.recipeTags,
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Adding ' + payload.name, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
        () => {
          this.toasterService.success('Added ' + payload.name, 'Success');
          this.onInit();
        },
      );

    this.modalRef.hide();
  }

  onEquipmentFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.newEquipmentForm.value));

    this.equipmentCreateService.createEquipment(
      {
        name: payload.name,
        description: payload.description ?? null,
        blob_url: null,
        id: null,
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Adding ' + payload.name, 'Info');
        },
        (_) => {
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
        () => {
          this.toasterService.success('Added ' + payload.name, 'Success');
          this.onInit();
        },
      );

    this.modalRef.hide();
  }

}
