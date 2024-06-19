import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ValidadoresService } from 'src/app/services/validadores.service';
import { AbstractControlOptions } from '@angular/forms';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit{

  forma!: FormGroup;

  //usaremos un servicio, form builder para que sea mas sencillo trabajar con formularios reactivos

  constructor(private fb: FormBuilder,
              private validadores: ValidadoresService
    ){
    this.crearFormulario();
    this.cargarDataAlFormulario();
    //este metodo me permite subscribirme al formulario reactivo
    this.crearListeners();
  }

ngOnInit(): void { }

  get nombreNoValido(){
    return this.forma.get('nombre')?.invalid && this.forma.get('nombre')?.touched;
  }
  get apellidoNoValido(){
    return this.forma.get('apellido')?.invalid && this.forma.get('apellido')?.touched;
  }
  get correoNoValido(){
    return this.forma.get('correo')?.invalid && this.forma.get('correo')?.touched;
  }
  get distritoNoValido(){
    return this.forma.get('direccion.distrito')?.invalid && this.forma.get('direccion.distrito')?.touched;
  }
  get ciudadNoValido(){
    return this.forma.get('direccion.ciudad')?.invalid && this.forma.get('direccion.ciudad')?.touched;
  }
  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray; //le decimos que es un arreglo de elementos
  }
  get password1NoValido(){
    return this.forma.get('password1')!.invalid && this.forma.get('password1')!.touched;

  }

  get password2NoValido(){

        //obtenemos los valores del campo password1 y 2
        const pass1 = this.forma.get('password1')?.value;
        const pass2 = this.forma.get('password2')?.value;

        //operador terniario | si no es igual entonces false si es igual
        return(pass1 === pass2) ? false: true;

  }

  get usuarioNoValido(){
      return this.forma.get('usuario')!.invalid && this.forma.get('usuario')!.touched;
  }


  crearListeners(){
    //me intersa saber cuando la forma: formgroup sufra cualquier cambio usando valuechanges
    /*this.forma.valueChanges.subscribe(valor =>{
      console.log(valor);
    })*/

    /*this.forma.statusChanges.subscribe(status=>{
      console.log({status});
    })*/
    this.forma.get('nombre')?.valueChanges.subscribe(console.log);
  }
  //Aqui se definen los campos
    crearFormulario(){
      //necesita una configuracion de un objeto
      this.forma = this.fb.group({

        //primera posicion, el valor por defect que queremos darle y luego las validaciones sincronos y asincronos
        //validadores sincronos: se hacen inmediatamente como required
        //angular nos da un paquete de validadores llamado Validators
        nombre:      ['',[Validators.required, Validators.minLength(5)]],
        apellido:    ['',[Validators.required, Validators.minLength(5),this.validadores.noVallejo]],
        correo:      ['',[Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        //este es un validador asincrono
        usuario:      ['', ,[this.validadores.existeUsuario]],
        password1:   ['',[Validators.required]],
        password2:   ['',Validators.required],
        direccion: this.fb.group({
          distrito:  ['', Validators.required],
          ciudad:    ['', Validators.required],
        }),
        //para crearme un arreglo de controles se hace asi
        pasatiempos: this.fb.array([
          ])
      },
      {
        //Este validador es a nivel de formulario
        Validators: this.validadores.passwordsIguales('password1','password2')
      });
// Suscripción a cambios en el valor de password1
this.forma.get('password1')?.valueChanges.subscribe(() => {
  this.forma.get('password2')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
});

// Suscripción a cambios en el valor de password2
this.forma.get('password2')?.valueChanges.subscribe(() => {
  this.forma.get('password1')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
});

    }



  cargarDataAlFormulario(){
    this.forma.reset({
      nombre: "Sebastian",
      apellido: "Perez",
      correo: "juan@gmail.com",
      direccion: {
        distrito: "Ontario",
        ciudad: "Ottawa"
      },
      password1: "123",
      password2: "123"

    })
  }



  agregarPasatiempo(){
    //para agregar a un arreglo es .push
    this.pasatiempos.push(this.fb.control(''))
  }

  borrarPasatiempo(i: number){

    this.pasatiempos.removeAt(i);
  }

  guardar(){
    if(this.forma.invalid){
      //voy a marcar como si todos los valores hubieran sido tocados
      //voy a extraer todos los valores de form.controls
      return Object.values(this.forma.controls).forEach(control =>{
         //hay que validar si fueron tocados pero para el formgroup, y hago referencia a todos los inputs dentro del formgroup
         if(control instanceof FormGroup){
            Object.values(control.controls).forEach(control =>control.markAsTouched());
          }else{
            control.markAsTouched();
          }
      })
      }
      console.log(this.forma)
      //Reseteo de la informacion
      this.forma.reset();
  }


  passwordsIguales(pass1 : any, pass2: any){

    //este metodo debe retornar una funcion
    //como la validacion se hace a nivel de formulario entonces debo retornar un objeto de tipo form
    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];


      if(pass2Control.errors && !pass2Control.errors['passwordsIguales']){
        return;
      }

      if(pass1Control!.value !== pass2Control!.value){
        //si son iguales tengo que pasar la validacion y debo regresar null
        console.log("mustmatch = true");
        pass2Control.setErrors({MustMatch: true })
      }else{
        pass2Control.setErrors(null);
      }
    }}
}
