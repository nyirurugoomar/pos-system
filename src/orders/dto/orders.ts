export class CreateOrderDto {
    readonly user?: string;
    readonly items: { product: string; quantity: number; price: number }[];
    readonly status?: string;
    readonly total: number;
  }

  export class UpdateOrderDto {
    readonly status?: string;
    readonly total?: number;
  }