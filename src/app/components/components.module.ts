import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CompanyLogoComponent} from "./company-logo/company-logo.component";
import {LoadingComponent} from "./loading/loading.component";
import {SelectBoxComponent} from "./select-box/select-box.component";



@NgModule({
  declarations: [
    CompanyLogoComponent,
    LoadingComponent,
    SelectBoxComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CompanyLogoComponent,
    LoadingComponent,
    SelectBoxComponent
  ]
})
export class ComponentsModule { }
