import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toaster: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case HttpStatusCode.BadRequest:
              if (error.error.errors) {
                const modalStateErrors: any[] = [];
                Object.keys(error.error.errors)
                .map(key => {
                  modalStateErrors.push(error.error.errors[key]);  
                });
                throw modalStateErrors.flat();
              } else if (typeof(error.error) === 'object') {
                this.toaster.error(error.statusText, error.status);
              }
              else {
                this.toaster.error(error.error, error.status);
              }
              break;
            case HttpStatusCode.Unauthorized:
              this.toaster.error(error.statusText, error.status);
              break;
            case HttpStatusCode.NotFound:
              this.router.navigateByUrl('/not-found');
              break;
            case HttpStatusCode.InternalServerError:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error',navigationExtras);
              break;
            default:
              this.toaster.error('Something unexpected went terribly wrong.');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}
