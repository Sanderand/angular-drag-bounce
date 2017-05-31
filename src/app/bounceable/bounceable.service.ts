import 'rxjs/add/observable/interval';

import { BounceableComponent } from './bounceable.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Vector } from './vector.class';

const FRAMES_PER_SECOND = 50;
const INTERVAL_MS = 1000 / FRAMES_PER_SECOND;
const MOMENTUM_SLOW_DOWN_FACTOR = 0.1;

@Injectable()
export class BounceableService {
  public items: Array<BounceableComponent> = [];
  public dragStart: Vector = new Vector();

  constructor () {
    this.setupListeners();

    Observable
      .interval(INTERVAL_MS)
      .filter(() => this.items.length > 0)
      .subscribe(() => this.step());
  }

  public register (item: BounceableComponent): void {
    this.items.push(item);
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
        x: ($event.clientX - this.dragStart.x) * MOMENTUM_SLOW_DOWN_FACTOR,
        y: ($event.clientY - this.dragStart.y) * MOMENTUM_SLOW_DOWN_FACTOR
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
        const momentum = Object.assign({}, forItem.momentum);
        const weightRatio = forItem.weight / (forItem.weight + item.weight);

        forItem.momentum.x *= -(1 - weightRatio);
        forItem.momentum.y *= -(1 - weightRatio);
        forItem.isMoving = true;
        forItem.step(isColliding);

        item.momentum.x += momentum.x * weightRatio;
        item.momentum.y += momentum.y * weightRatio;
        item.isMoving = true;
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
