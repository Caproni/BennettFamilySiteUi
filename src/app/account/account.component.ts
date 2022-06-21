import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    ) {
    this.submitted = false;
    this.loading = false;
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
  }

  ngOnDestroy = (): void => {
    this._isActive = false;
  }

}
