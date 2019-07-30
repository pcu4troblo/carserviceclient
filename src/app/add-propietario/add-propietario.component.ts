import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { PropietarioService } from '../shared/propietario/propietario.service';
import { CarService } from '../shared/car/car.service';

@Component({
  selector: 'app-add-propietario',
  templateUrl: './add-propietario.component.html',
  styleUrls: ['./add-propietario.component.css']
})
export class AddPropietarioComponent implements OnInit {

  owner: any = {};
  dni = '';
  sub: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private propietarioService: PropietarioService,
    private carService: CarService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.dni = params['dni'];
      if (this.dni) {
        this.propietarioService.get(this.dni).subscribe((owner: any) => {
          if (owner) {
            this.owner = owner._embedded.owners[0];
            this.owner.href = this.owner._links.self.href;
          } else {
            console.log(`Owner with dni '${this.dni}' not found, returning to list`);
            this.gotoList();
          }
        });
      }
    });
  }

  gotoList() {
    this.router.navigate(['/propietarios-list']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save(form: NgForm) {
    this.propietarioService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  remove(href) {
    this.propietarioService.remove(href).subscribe(result => {
      this.carService.getAll().subscribe(cars => {
        cars.map(car => {
          if (car.ownerDni === this.dni) {
            this.carService.get(car.id).subscribe((carInfo: any) => {
              const updateInfo = {
                name: carInfo.name,
                ownerDni: null,
                href: carInfo._links.self.href
              };
              this.carService.save(updateInfo).subscribe();
            });
          }
        })
      })
      this.gotoList();
    }, error => console.error(error));
  }

}
