import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BounceableComponent } from './bounceable.component';
import { BounceableConfig, DEFAULT_CONFIG } from './bounceable.config';
import { BounceableService } from './bounceable.service';

import { BOUNCEABLE_CFG } from './bounceable.tokens';
import { CollisionService } from './collision.service';

@NgModule({
	imports: [CommonModule],
	providers: [BounceableService, CollisionService],
	declarations: [BounceableComponent],
	exports: [BounceableComponent]
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
