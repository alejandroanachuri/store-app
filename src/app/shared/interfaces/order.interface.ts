export interface Details {
  productId:number;
  productName:string;
  quantity:number;
}

export interface Order {
  name:string;
  shippongAddress:string;
  city:string;
  date:string;
  isDelivery:boolean;
  id:number;
}

export interface DetailsOrder {
  details: Details[];
  orderId: number;
  //id:number;
}