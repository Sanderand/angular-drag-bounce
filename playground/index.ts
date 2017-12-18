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
<div class="app">
  <div class="header"></div>
  <div class="body">
    <div class="side"></div>
    <div class="main"></div>
  </div>
</div>

<as-bounceable
  [position]="{ x: 20, y: 20 }"
  style="position: absolute; background: #fff;">
  <h1>Drag me, yo!</h1>
  <p>Lorem ispum dolor sit amet</p>
</as-bounceable>

<as-bounceable
  [position]="{ x: 50, y: 250 }"
  style="position: absolute; background: #fff;">
  You reckon?
  <hr>
  <button>Yeah</button>
  <button>Nah</button>
</as-bounceable>
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
