import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'user',
        loadChildren: () => import('./modules/user/user-routing.module').then((m) => m.UserRoutingModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
