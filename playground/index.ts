/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { BounceableModule }  from 'angular-drag-bounce';

@Component({
  selector: 'app',
  template: `
<div>
  <as-bounceable
    [position]="{ x: 20, y: 20 }"
    style="position: absolute; background: #fff;">
    <h1>My cool draggable and bounceable overlay</h1>
    <p>Lorem ispum dolor sit amet</p>
  </as-bounceable>
</div>
`
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, BounceableModule.initialize() ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
