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
  import { User } from "../interfaces/user";
  import { PoolPriceService } from "../services/poolPrice.service";
  
  @Route("price")
  export class PoolPriceController extends Controller {
    @Get("")
    public async getPoolPrice(): Promise<User> {
      return new PoolPriceService().get();
    }
  
    // @SuccessResponse("201", "Created") // Custom success response
    // @Post()
    // public async createUser(
    //   @Body() requestBody: UserCreationParams
    // ): Promise<void> {
    //   this.setStatus(201); // set return status 201
    //   new UsersService().create(requestBody);
    //   return;
    // }
  }