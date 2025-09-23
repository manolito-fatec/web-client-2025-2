import type { PaginatedResponse } from '@/types/PaginatedInterfaces/PaginatedResponse'
import type { Product } from '@/types/Product'
import type { Company } from '@/types/Company'

export interface ApiResponse {
  products: PaginatedResponse<Product>;
  companies: PaginatedResponse<Company>;
}
