import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(private http: HttpClient) { }

  getPaises(){

    //hago uso del pipe para transformar la respuesta haciendo uso del map
    return this.http.get('https://restcountries.com/v3.1/lang/spanish')
    .pipe(
      map((resp:any) =>{

        //este es el map de los arreglos, que transforma cada uno de los elementos para solamente traer el nombre y el codigo
        return resp.map((pais:any) =>{
          return{
            nombre: pais.name.common,
            codigo: pais.cca3
          }
        });
      })
    );
  }
}
