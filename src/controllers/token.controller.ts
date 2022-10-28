import { Controller, Get, Route } from "tsoa";
import { TokenService } from "../services/token.service";

// ERC20 Token and possibly other tokens
@Route("token")
export class TokenController extends Controller {
  @Get("all")
  public async getAllTokens(): Promise<any> {
    return new TokenService().getAll();
  }
}
