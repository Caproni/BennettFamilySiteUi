import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private authorised = false;
  private role = 'guest';

  constructor(
    private toasterService: ToastrService,
  ) { }

  getAuthorised(): boolean {
    return this.authorised;
  }

  setAuthorised(authorised: boolean): void {
    this.authorised = authorised;
  }

  checkModalAuthorised(modalRef: BsModalRef): boolean {
    if (!this.getAuthorised()) {
      this.toasterService.error('Not authenticated. Please login.', 'Error');
      modalRef.hide();
      return false;
    }
    return true;
  }

  getRole(): string {
    return this.role;
  }

  setRole(role: string): void {
    this.role = role;
  }
}
