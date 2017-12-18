import { Injectable } from '@angular/core';
import { BounceableComponent } from './bounceable.component';
import { Vector } from './vector.class';

@Injectable()
export class CollisionService {
	public doItemsCollide (item1: BounceableComponent, item2: BounceableComponent): boolean {
		return item1.left < item2.right
			&& item1.right > item2.left
			&& item1.top < item2.bottom
			&& item1.bottom > item2.top;
	}

	public getItemsOverlap (item1: BounceableComponent, item2: BounceableComponent): Vector {
		const overlapXside1 = Math.abs(item1.left - item2.right);
		const overlapXside2 = Math.abs(item1.right - item2.left);
		const overlapYside1 = Math.abs(item1.top - item2.bottom);
		const overlapYside2 = Math.abs(item1.bottom - item2.top);
		return new Vector(Math.min(overlapXside1, overlapXside2), Math.min(overlapYside1, overlapYside2));
	}
}
