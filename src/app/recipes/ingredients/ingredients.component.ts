import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style } from '@angular/animations';
import { NgxMasonryOptions } from 'ngx-masonry';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs/operators';

import { IngredientUpdateService } from 'src/app/_services/api/recipes/ingredient/ingredient-update.service';
import { IngredientDeleteService } from 'src/app/_services/api/recipes/ingredient/ingredient-delete.service';
import { IngredientCreateService } from 'src/app/_services/api/recipes/ingredient/ingredient-create.service';
import { IngredientImagePutService } from 'src/app/_services/api/recipes/ingredient/ingredient-image-put.service';
import { IngredientReadService } from 'src/app/_services/api/recipes/ingredient/ingredient-read.service';
import { LoginService } from 'src/app/_services/login/login.service';
import { Ingredient } from 'src/app/_models/recipes/ingredient';

@Component({
  selector: 'fam-app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css'],
})
export class IngredientsComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 0,
    fitWidth: false,
    animations: {
      show: [
        style({opacity: 0}),
        animate('400ms ease-in', style({opacity: 1})),
      ],
      hide: [
        style({opacity: '*'}),
        animate('400ms ease-in', style({opacity: 0})),
      ]
    }
  };

  loadedIngredients = false;

  ingredients!: Ingredient[];
  filteredIngredients!: Ingredient[];
  ingredient!: Ingredient;

  allowedMimeTypes = ['image/png', 'image/jpeg'];

  photoFile = new File([], '');

  modalRef: BsModalRef = new BsModalRef();

  addIngredientForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  ingredientImageForm: FormGroup = new FormGroup({
    image: new FormControl('', [Validators.required]),
  });

  isActive = true;

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private ingredientCreateService: IngredientCreateService,
    private ingredientReadService: IngredientReadService,
    private ingredientUpdateService: IngredientUpdateService,
    private ingredientDeleteService: IngredientDeleteService,
    private ingredientImagePutService: IngredientImagePutService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.ingredientReadService.readIngredients().subscribe((b) => {
      this.loadedIngredients = b;
      this.ingredients = this.ingredientReadService.getIngredients();
      this.filteredIngredients = this.ingredients;
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  openModal(template: TemplateRef<any>, modalOptions: any): void {
    this.modalRef = this.modalService.show(template, modalOptions);
  }

  populateIngredient(ingredient: Ingredient) {
    this.ingredient = ingredient;
  }

  ingredientsLoaded() {
    this.toasterService.success('Ingredients loaded.', 'Success');
  }

  onIngredientFormSubmit(): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.addIngredientForm.value));

    this.ingredientCreateService.createIngredient(
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
          this.ngOnInit();
          this.toasterService.info('Adding ' + payload.name, 'Info');
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
        () => {
          this.toasterService.success('Added ' + payload.name, 'Success');
        },
      );

    this.modalRef.hide();
  }

  onIngredientImageSelected(event: any) {
    const target = event.target as HTMLInputElement;

    if (!target.files) return;

    const file: File = target.files && target.files[0];

    if (!file) return;

    if (this.allowedMimeTypes.includes(file.type)) {
      this.photoFile = file;
      const image = new Image();
      image.src = URL.createObjectURL(file);
      this.ingredientImageForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }
  }

  onIngredientImageFormSubmit() {
    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    if (!this.ingredient.id) return;

    this.ingredientImagePutService.putIngredientImage(
      this.ingredient.id,
      this.photoFile,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.ngOnInit();
          this.toasterService.info('Adding image for ' + this.ingredient.name, 'Info');
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add image for ' + this.ingredient.name, 'Error');
        },
        () => {
          this.toasterService.success('Added image for ' + this.ingredient.name, 'Success');
        },
      );

    this.modalRef.hide();
  }

  deleteIngredient(modalRef: BsModalRef): void {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

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
