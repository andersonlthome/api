import {
  Body,
  Controller,
  Get,
  // Path,
  Post,
  // Query,
  Route,
  SuccessResponse,
  // Exception
  Security,
} from "tsoa";
// import { ProjectParams } from "../interfaces/params";
import { ProjectService } from "../services/project.service";

@Route("project")
export class ProjectController extends Controller {
  @Get("all")
  public async getAllProjects(): Promise<any> {
    const { error, data } = await new ProjectService().getAll();

    if (!error) {
      this.setStatus(201);
      return data;
    } else {
      this.setStatus(500);
      console.error(error);
      return;
    }
  }

  @SuccessResponse("201", "Saved") // Custom success response
  @Security("jwt", ["user"])
  @Post()
  public async saveProject(@Body() requestBody: any): Promise<void> {
    const { error } = await new ProjectService().save(requestBody);

    !error ? this.setStatus(201) : this.setStatus(500);
    console.error(error);
    return;
  }
}
