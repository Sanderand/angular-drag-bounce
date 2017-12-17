import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BounceableService } from './bounceable.service';
import { CollisionService } from './collision.service';
import { BounceableComponent } from './bounceable.component';
import { BounceableConfig, DEFAULT_CONFIG } from './bounceable.config';
import { BOUNCEABLE_CFG } from './bounceable.tokens';

export * from './bounceable.component';
export * from './bounceable.config';
export * from './bounceable.tokens';
export * from './bounceable.service';
export * from './collision.service';
export * from './vector.class';

@NgModule({
    imports: [ CommonModule ],
    providers: [ BounceableService, CollisionService ],
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
