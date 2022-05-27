import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { Details } from 'src/app/shared/interfaces/order.interface';
import { Store } from 'src/app/shared/interfaces/store.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/interfaces/product.interface';
import { ProductsService } from '../products/service/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  model = {
    name:'',
    store:'',
    shippingAddress:'',
    city:''

  }

  isDelivery:boolean = true;
  stores:Store[] = []
  cart:Product[] = []

  constructor(private dataService:DataService, 
    private shoppingCartService:ShoppingCartService,
    private productsService:ProductsService,
    private router:Router
    ) {
      this.checkIfCartIsEmpty();
     }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
  }

  onPickupOrDelivery(value:boolean):void {
    this.isDelivery = value;
  }

  onSubmit({value: formData}: NgForm):void{
    const data = {
      ... formData,
      date: this.getCurrentDay(),
      isDelivery: this.isDelivery
    }

    this.dataService.saveOrder(data).
    pipe(
      tap(res => console.log(res)),
      switchMap(({id:orderId}) => {
        const details = this.prepareDetails();
        return this.dataService.saveDetaislOrder({details, orderId});
      }),
      tap(res => {this.router.navigate(['/checkout/thank-you-page'])}),
      delay(2000),
      tap(() => this.shoppingCartService.resetCart())
    ).subscribe();
  }

  private getStores():void {
    this.dataService.getStores().pipe(
      tap((stores:Store[]) => this.stores = stores )
    ).subscribe()
  }

  private getCurrentDay(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details:Details[]=[];
    this.cart.forEach((product:Product) => {
      const {id: productId, name: productName, qty: quantity, stock} = product;
      const updatedStock = stock - quantity;
      this.productsService.updateStock(productId, updatedStock)
        .pipe(
          tap(()=> details.push({productId, productName, quantity}))
        )
        .subscribe()
    })

    return details

  }

  private getDataCart():void {
    this.shoppingCartService.cartAction$
    .pipe(
      tap((products:Product[]) => this.cart=products)
    )
    .subscribe()
  }

  private checkIfCartIsEmpty():void {
    this.shoppingCartService.cartAction$
      .pipe(
        tap((products:Product[])=>{
          if(Array.isArray(products) && !products.length) {
            this.router.navigate(['/products'])
          }
        })
      )
      .subscribe()
  }

}
