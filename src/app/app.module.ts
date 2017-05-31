import { AppComponent } from './app.component';
import { BounceableModule } from './bounceable/bounceable.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    BounceableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
