import { InjectionToken } from '@angular/core';
import { BounceableConfig } from './bounceable.config';

export const BOUNCEABLE_CFG = new InjectionToken<BounceableConfig>('as.bounceable.config');
