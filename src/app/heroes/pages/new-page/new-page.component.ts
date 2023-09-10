import { filter, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, Pipe, OnInit } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
    `#divImagen {
      heigth: 400px;
    }`
  ]
})
export class NewPageComponent implements OnInit{

  public heroForm = new FormGroup({
    id: new FormControl(''),
  superhero: new FormControl<string>('', { nonNullable: true }),
  publisher: new FormControl<Publisher>(Publisher.DCComics),
  alter_ego: new FormControl(''),
  first_appearance: new FormControl(''),
  characters: new FormControl(''),
  alt_image: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
     ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroeById(id) ),
      )
      .subscribe(hero => {
        if(!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset( hero );
        return;

      })
  }


  onSubmit(): void {

      if ( this.heroForm.invalid ) return;

      if( this.currentHero.id){
        this.heroesService.updateHero(this.currentHero)
          .subscribe(hero => {
              this.showSnackbar(`${hero.superhero} updated!`)
          });

          return;
      }

      this.heroesService.addHero(this.currentHero)
        .subscribe(hero => {
          this.router.navigate([ '/heroes/edit', hero.id ])
          this.showSnackbar(`${hero.superhero} created!`)
        })
  }

  onDeleteHero() {
      if(!this.currentHero.id) throw new Error("Hero Id is required");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value
      });

      dialogRef.afterClosed()
      .pipe(
        filter( result => result ),
        switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter( wasDeleted => wasDeleted ),
      )
      .subscribe( () => {
          this.router.navigate(['/heroes'])
      })
      /*
      dialogRef.afterClosed().subscribe(result => {
          this.heroesService.deleteHeroById(this.currentHero.id)
            .subscribe( wasDeleted => {
              if(wasDeleted)
              this.router.navigate(['/heroes'])
            })

      });
      */
  }
  showSnackbar( message: string ): void {
    this.snackBar.open( message, 'Done', {
      duration: 2500
    } )
  }
}
