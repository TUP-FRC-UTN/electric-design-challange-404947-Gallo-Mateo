import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget, ModuleType } from '../models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly http = inject(HttpClient);

  constructor() {}

  //   Endpoints:
  //API: /api/budgets (POST) 
  //API: /api/budgets/{{id}} (GET) 
  private readonly URL_Budgets: string = "http://localhost:3000/budgets";  
  private readonly URL_ModuleTypes: string = "http://localhost:3000/module-types";

// GetAll ModuleTypes
  getAllModuleTypes(): Observable<ModuleType[]> {
    return this.http.get<ModuleType[]>(this.URL_ModuleTypes);
  }
// API: /api/budgets/{{id}} (GET) Al guardar el presupuesto, se debe calcular y mostrar el resumen con:
  getBudgetById(id: number): Observable<Budget> {
  const url = this.URL_Budgets + '/' + id;
  return this.http.get<Budget>(url);
  }

// API: /api/budgets (POST) El formulario debe contener los siguientes campos:
  postOrder(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.URL_Budgets, budget)
  }
}
