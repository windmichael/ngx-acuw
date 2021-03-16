import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectEditorComponent } from './object-editor.component';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  declarations: [ObjectEditorComponent],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [ObjectEditorComponent]
})
export class ObjectEditorModule { }
