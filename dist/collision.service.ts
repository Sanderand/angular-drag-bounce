import { Injectable } from '@angular/core';
import { BounceableComponent } from './bounceable.component';
import { Vector } from './vector.class';

@Injectable()
export class CollisionService {
	public doItemsCollide (item1: BounceableComponent, item2: BounceableComponent): boolean {
		return item1.position.x < item2.position.x + item2.width && item1.position.x + item1.width > item2.position.x
			&& item1.position.y < item2.position.y + item2.height && item1.position.y + item1.height > item2.position.y;
	}

	public getItemsOverlap (item1: BounceableComponent, item2: BounceableComponent): Vector {
		const overlapXside1 = Math.abs(item1.position.x - item2.position.x + item2.width);
		const overlapXside2 = Math.abs(item1.position.x + item1.width - item2.position.x);
		const overlapYside1 = Math.abs(item1.position.y - item2.position.y + item2.height);
		const overlapYside2 = Math.abs(item1.position.y + item1.height - item2.position.y);

		return {
			x: Math.min(overlapXside1, overlapXside2),
			y: Math.min(overlapYside1, overlapYside2)
		};
	}
}
