import { Routes } from '@angular/router';
import { BudgetFormComponent } from './budget-form/budget-form.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetViewComponent } from './budget-view/budget-view.component';

export const routes: Routes = [
    {
        path: 'create-budget', component: BudgetFormComponent
    },
    {
        path: 'budgets', component: BudgetListComponent
    },
    {
        path: 'budgets/:id', component: BudgetViewComponent
    },
    {
        path: '', component: BudgetListComponent
    },
    // {
    //     //ruta "comodin" (si se pone una url no especificada, se redirige al component especificado)
    //     path: '**', component: OrdersComponent
    // },
];
