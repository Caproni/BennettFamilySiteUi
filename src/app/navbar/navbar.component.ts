import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  faCameraRetro,
  faTv,
  faUtensils,
  faTree,
} from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService } from 'src/app/_services/api/authentication/authentication.service';
import { LoginService } from 'src/app/_services/login/login.service';
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'fam-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mediaIcon = faTv;
  photosIcon = faCameraRetro;
  recipesIcon = faUtensils;
  familyTreeIcon = faTree;

  modalRef: BsModalRef = new BsModalRef();

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void { }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised();
  }

  onLoginFormSubmit() {

    const payload = JSON.parse(JSON.stringify(this.loginForm.value));

    this.authenticationService.isAuth();
    this.loginService.setAuthorised(true);

    this.modalRef.hide();

  }

  logOut() {
    this.loginService.setAuthorised(false);
  }

}
