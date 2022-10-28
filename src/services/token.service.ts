// import { User } from "../interfaces/user";
import prisma from "../lib/prisma";

// A post request should not contain an id.
// export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class TokenService {  
  public async getAll(): Promise<any> {
    const results = await prisma.token.findMany({
      include: {
        project: true, // Return all fields
      },
    });

    return results;
  }

}