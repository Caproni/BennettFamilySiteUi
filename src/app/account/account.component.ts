import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AuthenticationService } from '../_services/api/authentication.service';
import { ClientInformationService } from '../_services/client-information.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  _isActive = true;
  submitted: boolean;
  loading: boolean;
  f = {
    username: {
      text: '',
      errors: {
        required: true,
      }
    },
    password: {
      text: '',
      errors: {
        required: true,
      }
    },
    unauthorised: false
  };

  passwordVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientInfo: ClientInformationService,
    private authenticationService: AuthenticationService) {
    this.submitted = false;
    this.loading = false;
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.loading = true;

    this.authenticationService.login(this.f.username.text, this.f.password.text)
      .pipe(takeWhile(_ => this._isActive))
      .subscribe(
        (client) => {
          if (client) {
            this.clientInfo.setClientId(Number(client.client_id));
            this.clientInfo.setClientName(client.client_name);
            this.clientInfo.setAccessLevel(client.access_level);
            this.clientInfo.setUsername(this.f.username.text);
            this.clientInfo.setClientLogo(client.client_logo);
            this.clientInfo.setPreferredDateFormat(client.date_format);
            this.clientInfo.setReportNameFormat(client.report_name_format);
            this.clientInfo.setClientSpecificParameters(client.client_specific_parameters);
            this.authenticationService.isAuthenticated = true;
            this.router.navigate(['/main/landing']);
          } else {
            this.f.unauthorised = true;
          }
          this.loading = false;
        },
        (err) => {
          console.log(err)
          this.f.unauthorised = true;
        },
        () => {
          this.loading = false;
        }
      );
  }

  getPasswordVisibility(): string {
    return this.passwordVisible ? 'text' : 'password';
  }

  ngOnDestroy = (): void => {
    this._isActive = false;
  }

}
