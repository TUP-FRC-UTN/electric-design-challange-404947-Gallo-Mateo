import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BudgetService } from '../services/budget.service';
import { Budget, ModuleType, ZoneModules } from '../models/budget';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Zone } from '../models/budget';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit{
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/forms/typed-forms#formarray-dynamic-homogenous-collections
    - https://dev.to/chintanonweb/angular-reactive-forms-mastering-dynamic-form-validation-and-user-interaction-32pe
  */
  ngOnInit(): void {
    const sub = this.budgetService.getAllModuleTypes().subscribe({
      next: (data) => {
        this.selectModuleTypesValues = data;
        console.log(this.selectModuleTypesValues);
      },
      error: (err) => {
        alert('Error al comunicarse con la API')
      }
    });
    this.subscriptions.add(sub);
  }

  private subscriptions = new Subscription();
  private readonly budgetService = inject(BudgetService);
  private readonly router = inject(Router);
  private readonly activatedRouter = inject(ActivatedRoute);

  selectModuleTypesValues: ModuleType[] = [];
  selectZones: Zone[] = [Zone.COMEDOR, Zone.KITCHEN, Zone.LIVING, Zone.ROOM];

  form: FormGroup = new FormGroup ({
    nombre: new FormControl('', 
      [Validators.required]// validaciones sincronicas
    ),

    fecha: new FormControl('', 
      [Validators.required], // validaciones sincronicas
      [] // las validaciones ASINCRONICAS van aparte de las sincronicas
    ),

    zonasFormArray: new FormArray([], 
      [] // validaciones sincronicas
    ),

  })

  //metodos para manejar formArray
  agregarZone() {
    const productoForm = new FormGroup({
      tipoModulo: new FormControl(0),
      ambiente: new FormControl(''), //esta es la famosa zona (de la casa/lugar/etc)
      precio: new FormControl(0),
      lugares: new FormControl(0) //los famosos slots (cuanto ocupa dicho modulo y/o objeto ModuleType)
    });

     productoForm.get('tipoModulo')?.valueChanges.subscribe(id => {
       const tipoModulo = this.selectModuleTypesValues.find(p => p.id == id)
       if(tipoModulo){

        productoForm.patchValue({
           precio: tipoModulo.price,
           lugares: tipoModulo.slots
         });

         this.calcularTotal();
       }
     });

    this.zonasFormArray.push(productoForm);
  }
  
  eliminarZone(index: number) {  
    this.zonasFormArray.removeAt(index);
    // this.actualizarProductosSeleccionados();
     this.calcularTotal();
  }

  total:number = 0;

  calcularTotal(){
    let cantTotal = 0;
    let subtotal = 0;

    this.zonasFormArray.controls.forEach(control => {
      const precio = control.get('precio')?.value | 0;

      subtotal += precio;
    });
 
    this.total = subtotal;
  }

  //submit
  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      console.log("formValue: ", formValue);
      const auxId = Math.random().toString();
      const id = auxId.substring(2, 11);
  
      // Cambiamos forEach por map
      const zoneModulesAux: ZoneModules[] = formValue.zonasFormArray.map(
        (formGroup: any) => {  // Cambiamos FormGroup por any ya que es un objeto plano
          console.log("formGroup: ", formGroup);
          let zoneAux = formGroup.ambiente;
          let moduleType = this.selectModuleTypesValues.find(type =>
            type.id === formGroup.tipoModulo) ??
            {id: 0, name: '', price: 0, slots: 0};
          
          return {
            zone: zoneAux,
            module: moduleType  // Asegúrate que sea 'module' y no 'type' según tu interface
          } as ZoneModules;
        }
      );
  
      console.log("zoneModulesAux: ", zoneModulesAux);
      const newBudget: Budget = {
        id: id,
        client: formValue.nombre,
        date: formValue.fecha,
        zoneModules: zoneModulesAux,
      }
      console.log("newBudget: ", newBudget);
  
      this.budgetService.postOrder(newBudget).subscribe({
        next: () => {
          this.router.navigate(['/budgets/' + newBudget.id]);
          alert("registro exitoso!")
        },
        error: (e) => {
          console.log("error: ", e);
          alert('Error al crear la orden');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  //get
  get nombre() { 
    return this.form.get('nombre'); 
  }
  get fecha() { 
    return this.form.get('fecha'); 
  }
  get zonasFormArray() {
    return this.form.controls['zonasFormArray'] as FormArray
  }
}
