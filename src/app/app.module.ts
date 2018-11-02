import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PersonComponentComponent } from './person-component/person-component.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularPageVisibilityModule } from 'angular-page-visibility';
import { ReactisComponent } from './reactis/reactis.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonComponentComponent,
    ReactisComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularPageVisibilityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
