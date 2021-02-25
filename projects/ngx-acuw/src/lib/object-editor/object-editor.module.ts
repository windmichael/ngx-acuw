import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectEditorComponent } from './object-editor.component';



@NgModule({
  declarations: [ObjectEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [ObjectEditorComponent]
})
export class ObjectEditorModule { }
