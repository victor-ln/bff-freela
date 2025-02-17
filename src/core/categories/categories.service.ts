import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createCategoryDto: CreateCategoryDto): Observable<CategoryResponseDto> {
    this.logger.log(`Creating new category: ${createCategoryDto.tipo}`);
    return this.backendService.post<CategoryResponseDto>('/categories', createCategoryDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<CategoryResponseDto>> {
    this.logger.log(`Fetching categories with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<CategoryResponseDto>>(`/categories?${queryParams}`);
  }

  findAllActive(): Observable<CategoryResponseDto[]> {
    this.logger.log('Fetching all active categories');
    return this.backendService.get<CategoryResponseDto[]>('/categories/active');
  }

  findOne(id: number): Observable<CategoryResponseDto> {
    this.logger.log(`Fetching category with id: ${id}`);
    return this.backendService.get<CategoryResponseDto>(`/categories/${id}`);
  }

  findByTipo(tipo: string): Observable<CategoryResponseDto> {
    this.logger.log(`Finding category by tipo: ${tipo}`);
    return this.backendService.get<CategoryResponseDto>(`/categories/by-tipo/${tipo}`);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto): Observable<CategoryResponseDto> {
    this.logger.log(`Updating category with id: ${id}`);
    return this.backendService.put<CategoryResponseDto>(`/categories/${id}`, updateCategoryDto);
  }

  toggleStatus(id: number, status: boolean): Observable<CategoryResponseDto> {
    this.logger.log(`${status ? 'Activating' : 'Deactivating'} category with id: ${id}`);
    return this.backendService.patch<CategoryResponseDto>(`/categories/${id}/status`, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing category with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/categories/${id}`);
  }
}
