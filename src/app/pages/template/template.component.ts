import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PaisService } from 'src/app/services/pais.service';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})


export class TemplateComponent {
  usuario = {
    nombre: 'Sebastian',
    apellido: 'Vallejo',
    correo:'alexb155@hotmail.com',
    pais: 'COL',
    genero: 'M'
  }

  paises: any[] = [];

  constructor(private paisService: PaisService){}

  ngOnInit(): void {
    //me subscribo a este observable que lo traigo desde el servicio
    this.paisService.getPaises().subscribe(paises=>{

      this.paises = paises;

      //me creare un valor por defecto | unshift para agregar un elemento a la primera posicion del arreglo
      this.paises.unshift({
        nombre: ['Seleccione Pais'],
        codigo: ''
      })

    });
  }

  guardar(forma: NgForm){

    if(forma.invalid){
    //voy a marcar como si todos los valores hubieran sido tocados ,, validacion para que aparezca error al enviar campos vacios
    //voy a extraer todos los valores de form.controls
    return Object.values(forma.controls).forEach(control =>{
        control.markAsTouched();
    })

    }

    console.log(forma.value);

  }
}
