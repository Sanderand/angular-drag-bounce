import { BounceableComponent } from './bounceable.component';
import { BounceableService } from './bounceable.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    BounceableComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    BounceableService
  ],
  exports: [
    BounceableComponent
  ]
})
export class BounceableModule {}
