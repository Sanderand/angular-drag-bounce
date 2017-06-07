import { BounceableConfig, DEFAULT_CONFIG } from './bounceable.config';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { BOUNCEABLE_CFG } from './bounceable.tokens';
import { BounceableComponent } from './bounceable.component';
import { BounceableService } from './bounceable.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [ CommonModule ],
  providers: [ BounceableService ],
  declarations: [ BounceableComponent ],
  exports: [ BounceableComponent ]
})
export class BounceableModule {
  static initialize (config?: BounceableConfig): ModuleWithProviders {
    return {
      ngModule: BounceableModule,
      providers: [{
        provide: BOUNCEABLE_CFG,
        useValue: Object.assign(Object.assign({}, DEFAULT_CONFIG), config || {})
      }]
    };
  }
}
