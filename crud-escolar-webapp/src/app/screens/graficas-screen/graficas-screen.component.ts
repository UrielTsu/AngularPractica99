import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  public total_user: any = {};

  lineChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [89, 34, 43, 54, 28, 74, 93],
        label: 'Registro de materias',
        backgroundColor: '#F88406',
      }
    ]
  }

  linechartOption = {
    responsive: false
   }

   lineChartPlugins = [ DatalabelsPlugin ];

   barChartData = {
    labels: ["Congreso", "Fepro", "Presentacion doctoral", "Feria matematicas", "T_Systems"],
    datasets: [
      {
        data: [34, 43, 54, 28, 74],
        label: 'Registro de materias',
        backgroundColor: [
        '#F88406',
        '#FCFF44',
        '#82D3FB',
        '#FB82F5',
        '#2AD84A'
        ]
      }
    ]
  }

  barChartOption = {
    responsive: false,
  }

  barChartPlugins = [ DatalabelsPlugin ];

  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [89, 34, 43],
        label: 'Registro de usuarios',
        backgroundColor: [
        '#FCFF44',
        '#F1C8F2',
        '#31E731'
        ]
      }
    ]
  }

  pieChartOption = {
    responsive: false,
  }

  pieChartPlugins = [ DatalabelsPlugin ];

  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [89, 34, 43], //tengo que saber como meter la funcion de obtener el total de cada rol para meter esos datos aqui a la data
        label: 'Registro de usuarios',
        backgroundColor: [
        '#FCFF44',
        '#F1C8F2',
        '#31E731'
        ]
      }
    ]
  }

  doughnutChartOption = {
    responsive: false,
  }

  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresService: AdministradoresService,
  ) {

   }

   ngOnInit(): void {
       this.obtenerTotalUsers();
       console.log("Data: ", this.doughnutChartData);
   }

    public obtenerTotalUsers(){
    this.administradoresService.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        console.log("Total de usuarios: ", this.total_user);
      }, (error)=>{
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    )
  }
}