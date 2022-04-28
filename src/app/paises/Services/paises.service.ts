import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { paisSmall } from '../Interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  constructor (private htttp:HttpClient) { }


  private _regiones : string[] = ['Africa', 'Americas', 'Asia', 'Europe', "Oceania"]
  private baseUrl :string ='https://restcountries.com/v3.1'

  get regiones():string[] {
    return [...this._regiones]
  }
  getPaisesPorRegion(region:string):Observable<paisSmall[]> {
    const url: string= `${this.baseUrl}/region/${region}?fields=cca3,name`
    return this.htttp.get<paisSmall[]>(url)
  }

  getPaisPorCodigo(codigo:string):Observable<paisSmall | null> {
    if (!codigo) {
      return of(null)
    }

    const url: string= `${this.baseUrl}/alpha/${codigo}?fields=cca3,name,borders`
    console.log(url);
    return this.htttp.get<paisSmall>(url)
  }

  getPaisPorCodigoSmall(codigo:string):Observable<paisSmall > {

    const url: string= `${this.baseUrl}/alpha/${codigo}?fields=cca3,name,borders`
    console.log(url);
    return this.htttp.get<paisSmall>(url)
  }

  getpaisesporCodigos(borders: string[]):Observable<paisSmall[]> {
    if (!borders) {
      return of([])
    }
    const peticiones:Observable<paisSmall>[] = []
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion)
    })
    return combineLatest(peticiones)
  }


}
