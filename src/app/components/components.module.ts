import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CompanyLogoComponent} from "./company-logo/company-logo.component";
import {LoadingComponent} from "./loading/loading.component";
import {SelectBoxComponent} from "./select-box/select-box.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {RouterLink, RouterLinkActive} from "@angular/router";



@NgModule({
  declarations: [
    CompanyLogoComponent,
    LoadingComponent,
    SelectBoxComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  exports: [
    CompanyLogoComponent,
    LoadingComponent,
    SelectBoxComponent,
    NavbarComponent
  ]
})
export class ComponentsModule { }
