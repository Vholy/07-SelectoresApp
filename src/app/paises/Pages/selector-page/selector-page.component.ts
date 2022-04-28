import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap,tap } from 'rxjs';
import { paisSmall } from '../../Interfaces/paises.interface';
import { PaisesService } from '../../Services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  constructor( private FormBuilder : FormBuilder,
               private  paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones= this.paisesService.regiones

    /* //Cuando cambie la region//
      this.miFormulario.get('region')?.valueChanges
      .subscribe(region => {
          this.paisesService.getPaisesPorRegion(region)
          .subscribe(paises=>{
            console.log(paises);
            this.miFormulario.controls['pais'].setValue('')
            this.paises= paises;
          })
      })
    */
   //Cuando cambie la region BUT BETTER//
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_)=> {this.miFormulario.get('pais')?.reset(''), this.cargando=true } ),
      switchMap(region => this.paisesService.getPaisesPorRegion(region) )
    ) .subscribe (paises => {this.paises= paises, this.cargando=false})


    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( (pais)=> {this.miFormulario.get('fronteras')?.reset(''), this.cargando=true }),
      switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo) ),
      switchMap(pais => this.paisesService.getpaisesporCodigos(pais?.borders!) ),
    ) .subscribe (paises => {console.log(paises) , this.cargando=false, this.fronteras = paises  })

  }


  miFormulario: FormGroup = this.FormBuilder.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    fronteras: ['', Validators.required],
  })
  regiones: string[] = []
  fronteras: paisSmall[] = []
  paises: paisSmall[] = []
  cargando: boolean = false







  guardar(){
    console.log(this.miFormulario.value);

  }


}
