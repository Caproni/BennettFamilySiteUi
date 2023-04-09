import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  faCameraRetro,
  faTv,
  faScroll,
  faUtensils,
  faTree,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService } from 'src/app/_services/api/authentication/authentication.service';
import { LoginService } from 'src/app/_services/login/login.service';

@Component({
  selector: 'fam-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  mediaIcon = faTv;
  mediaPath = "/media"

  scholarIcon = faScroll;
  scholarPath = "/papers"

  mapIcon = faMapPin;
  mapPath = "/mapping"

  photosIcon = faCameraRetro;
  photosPath = "/photos"

  recipesIcon = faUtensils;
  recipesPath = "/recipes"

  familyTreeIcon = faTree;
  familyTreePath = "/family"

  authenticating = false;

  notSelectedColor = "#000000"
  selectedColor = "#55f"

  modalRef: BsModalRef = new BsModalRef();

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private loginService: LoginService,
    private toasterService: ToastrService,
  ) { }

  ngOnInit(): void { }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised();
  }

  getIconColor(checkPath: string) {
    return window.location.pathname == checkPath ? this.selectedColor : this.notSelectedColor;
  }

  onLoginFormSubmit() {

    const payload = JSON.parse(JSON.stringify(this.loginForm.value));

    this.authenticating = true;
    this.authenticationService.isAuth(payload).pipe(takeWhile(_ => this.authenticating))
      .subscribe(
        (x) => {
          if (x.success) {
            this.toasterService.success('Successfully authenticated as site admin.', 'Success');
            this.loginService.setAuthorised(true);
            this.authenticating = false;
          } else {
            this.toasterService.error('Could not authenticate user.', 'Error');
            this.authenticating = false;
          }
        },
        (_) => {
          this.toasterService.error('Could not authenticate user.', 'Error');
          this.authenticating = false;
        }
      );

    this.modalRef.hide();

  }

  logOut() {
    this.loginService.setAuthorised(false);
  }

}
