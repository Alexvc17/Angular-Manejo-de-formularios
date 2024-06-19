import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

//interfaz para el any
interface ErrorValidate{
  [s:string]:boolean
}


@Injectable({
  providedIn: 'root'
})

//este servicio tendra una coleccion de validadores, validaciones que me regresaran un objeto
export class ValidadoresService{

  constructor() {}

  //esta promesa me resuelve el objeto de ErrorValidate
  existeUsuario(control: FormControl): Promise<ErrorValidate | any> | Observable<ErrorValidate | any> {

    if(!control.value){
      //es valido
      return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
      // Reduje el tiempo del temporizador a 3.5 segundos para pruebas más rápidas
      setTimeout(() => {
        if (control.value === 'strider') {
          resolve({ existe: true });
        } else {
          resolve(null);
        }
      }, 3500);
    });
  }




                                  //voy a regresar un objeto por eso uso llaves { }
  noVallejo( control: FormControl): ErrorValidate{

    if(control.value?.toLowerCase() === 'vallejo'){
      return {
        noHerrera: true
      }
    }
    return {}

  }

  passwordsIguales(pass1 : any, pass2: any){
    //este metodo debe retornar una funcion
    //como la validacion se hace a nivel de formulario entonces debo retornar un objeto de tipo form
    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.controls[pass1]!.value;
      const pass2Control = formGroup.controls[pass2]!.value;


      if(pass2Control.errors && !pass2Control.errors['passwordsIguales']){
        return;
      }

      if(pass1Control !== pass2Control){
        //si son iguales tengo que pasar la validacion y debo regresar null
        console.log("mustmatch = true");
        pass2Control.setErrors({MustMatch: true })
      }else{
        pass2Control.setErrors(null);
      }
    }}

/*
  passwordsIguales(control: AbstractControl): ValidationErrors | null {
    const pass1Control = control.get('password1');
    const pass2Control = control.get('password2');

    if (pass1Control && pass2Control) {
      if (pass1Control.value === pass2Control.value) {
        return null; // La validación es exitosa
      } else {
        return { noEsIgual: true }; // La validación falla
      }
    }
    return null; // Si los controles no existen, se asume que la validación es exitosa
  }
  */







}
