import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { PropietarioService } from '../shared/propietario/propietario.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: Array<any>;
  owners: Array<any>;

  constructor(private carService: CarService, 
    private giphyService: GiphyService, 
    private propietarioService: PropietarioService) { }

  ngOnInit() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const car of this.cars) {
        this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
      }
    });

    this.propietarioService.getAll().subscribe(data => {
      this.owners = data._embedded.owners
      console.log(this.owners[0].name);
      
    });
  }
}
