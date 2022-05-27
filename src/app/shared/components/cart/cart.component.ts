import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  quantity$ = this.shoppingCartService.quantityAction$;
  total$ = this.shoppingCartService.totalActions$;
  cart$ = this.shoppingCartService.cartAction$;

  constructor(private shoppingCartService:ShoppingCartService) { }

  ngOnInit(): void {
  }

}
