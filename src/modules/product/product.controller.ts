import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from '@modules/product/product.service';
import { ProductDto } from '@dto/product';

@Controller()
export class ProductController {
    constructor(private _ProductService: ProductService) {}

    @Get('find')
    findAllProduct() {
        return this._ProductService.findAllProduct();
    }

    @Post('create')
    createProduct(@Body() product: ProductDto) {
        return this._ProductService.createProduct(product);
    }
}
