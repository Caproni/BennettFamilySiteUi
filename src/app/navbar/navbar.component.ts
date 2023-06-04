import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { takeWhile } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from 'src/app/_services/api/authentication/authentication.service';
import { LoginService } from 'src/app/_services/login/login.service';

@Component({
  selector: 'fam-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  mediaPath = '/media';
  scholarPath = '/papers';
  mapPath = '/mapping';
  weatherPath = '/weather';
  contentPath = '/content';
  recipesPath = '/recipes';
  familyTreePath = '/family';

  authenticating = false;
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  notSelectedColor = '#000000';
  selectedColor = '#55f';

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

  closeNavbar(): void {
    const navbarToggle = document.querySelector('.navbar-toggler');
    if (navbarToggle && this.navbarCollapse.nativeElement.classList.contains('show')) {
      navbarToggle.dispatchEvent(new Event('click'));
    }
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
