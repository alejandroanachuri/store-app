import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProductsService } from './service/products.service';
import { tap } from 'rxjs/operators';
import { Product } from './interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  products!:Product[];
  constructor(private productsService:ProductsService, private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.productsService.getProducts().pipe(
      tap(res => console.log(res))
    ).subscribe((products:Product[]) => this.products = products);
  }

  addToCart(product:Product):void{
    console.log(product)
    this.shoppingCartService.updateCart(product);
  }

}
