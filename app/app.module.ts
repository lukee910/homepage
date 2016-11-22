import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }         from './home/home.component';
import { M105Component }  from './m105/m105.component';
import { M307Component }    from './m307/m307.component';
import { McSimComponent } from './mcsim/mcsim.component';
import { McSimHelpComponent } from './mcsim/mcsim.help';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
    { path: 'm105', component: M105Component },
    { path: 'm307', component: M307Component },
    { path: 'mcsim', component: McSimComponent },
    { path: 'mcsim-help', component: McSimHelpComponent },

    // Home & Fallback. Use "" and "**" as routes if Home isn't the fallback anymore
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        HomeComponent,
        M105Component,
        M307Component,
        McSimComponent,
        McSimHelpComponent,
        AppComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
