export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
}

export interface ProductDto {
  uuid: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  isActive: boolean;
}

export interface UpdateProductDto {
  uuid: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: string;
  isActive?: boolean;
}
