import {
    // Body,
    Controller,
    Get,
    // Path,
    // Post,
    // Query,
    Route,
    // SuccessResponse,
  } from "tsoa";
  // import { User } from "../interfaces/user";
  import { PoolPriceService } from "../services/poolPrice.service";
  
  @Route("price")
  export class PoolPriceController extends Controller {
    @Get("")
    public async getPoolPrice(): Promise<any> {
      return new PoolPriceService().get();
    }
  
  }