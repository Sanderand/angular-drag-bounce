import 'rxjs/add/observable/interval';

import { Inject, Injectable } from '@angular/core';

import { BOUNCEABLE_CFG } from './bounceable.tokens';
import { BounceableComponent } from './bounceable.component';
import { BounceableConfig } from './bounceable.config';
import { Observable } from 'rxjs/Observable';
import { Vector } from './vector.class';

@Injectable()
export class BounceableService {
  public items: Array<BounceableComponent> = [];
  public dragStart: Vector = new Vector();

  constructor (
    @Inject(BOUNCEABLE_CFG) private _bounceableConfig: any
  ) {
    this.setupListeners();

    Observable
      .interval(1000 / this._bounceableConfig.framesPerSecond)
      .filter(() => this.items.length > 0)
      .subscribe(() => this.step());
  }

  public register (item: BounceableComponent): void {
    this.items.push(item);
  }

  public unregister (item: BounceableComponent): void {
    this.items = this.items.filter(i => i !== item);
  }

  private step (): void {
    this.items.forEach(item => item.step());

    if (this.hasStateChanged()) {
      this.items.forEach(item => this.applyCollisions(item));
    }
  }

  private setupListeners (): void {
    document.addEventListener('mousedown', $event => {
      this.dragStart = {
        x: $event.clientX,
        y: $event.clientY
      };

      this.items.forEach(i => i.onMouseDown($event));
    });

    document.addEventListener('mouseup', $event => {
      const momentum: Vector = {
        x: ($event.clientX - this.dragStart.x) * this._bounceableConfig.momentumSlowDownFactor,
        y: ($event.clientY - this.dragStart.y) * this._bounceableConfig.momentumSlowDownFactor
      };

      this.items.forEach(i => i.onMouseUp(momentum));
    });
  }

  private hasStateChanged (): boolean {
    return this.items.some(i => i.isMoving);
  }

  private applyCollisions (forItem: BounceableComponent): void {
    this.items
      .filter(item => item !== forItem)
      .filter(item => this.doItemsCollide(item, forItem))
      .forEach(item => {
        const isColliding = true;
        const forItemWeightRatio = forItem.weight / (forItem.weight + item.weight);
        const itemWeightRatio = 1 - forItemWeightRatio;
        const momentum: Vector = {
          x: forItem.momentum.x + item.momentum.x,
          y: forItem.momentum.y + item.momentum.y
        };

        // todo: reset forItem.position to point where forItem and item just touch

        forItem.momentum.x = -forItem.momentum.x * itemWeightRatio;
        forItem.momentum.y = -forItem.momentum.y * itemWeightRatio;

        item.momentum.x = item.momentum.x + momentum.x * forItemWeightRatio;
        item.momentum.y = item.momentum.y + momentum.y * forItemWeightRatio;

        forItem.isMoving = true;
        item.isMoving = true;

        forItem.step(isColliding);
        item.step(isColliding);
    });
  }

  private doItemsCollide (item1, item2): boolean {
    return (item1.position.x < item2.position.x + item2.width &&
      item1.position.x + item1.width > item2.position.x &&
      item1.position.y < item2.position.y + item2.height &&
      item1.height + item1.position.y > item2.position.y);
  }
}
