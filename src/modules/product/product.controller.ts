import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ProductService } from '@modules/product/product.service';
import { ProductDto } from '@dto/product';
import { JwtGuard } from '@modules/token/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller()
export class ProductController {
    constructor(private _ProductService: ProductService) {}

    @Get('find')
    findAllProduct() {
        return this._ProductService.findAllProduct();
    }

    @Post('create')
    createProduct(@Request() reg, @Body() product: ProductDto) {
        product.shop = reg.user.id;
        return this._ProductService.createProduct(product);
    }
}
