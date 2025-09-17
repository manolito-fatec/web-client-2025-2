import type { PaginatedResponse } from '@/components/types/PaginatedInterfaces/PaginatedResponse.ts'
import type { Product } from '@/components/types/Product.ts'
import type { Company } from '@/components/types/Company.ts'

export interface ApiResponse {
  products: PaginatedResponse<Product>;
  companies: PaginatedResponse<Company>;
}
