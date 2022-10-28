// import { Token } from "@prisma/client";
import { ProjectParams } from "../interfaces/params";
import prisma from "../lib/prisma";

// A post request should not contain an id.
// export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class ProjectService {
  public async getAll(): Promise<any> {
    const results = await prisma.project.findMany({
      include: {
        tokens: true, // Return all fields
      },
    });

    return results;
  }

  public async save(projectSaveParams: ProjectParams): Promise<any> {
    let error;
    let projectToSave = {
      name: projectSaveParams.name,
      description: projectSaveParams.description,
      url: projectSaveParams.url,
    }

    try {
      // TODO: fiX types
      const project: {
        id: any;
        createdAt?: Date;
        updatedAt?: Date;
        name?: string;
        description?: string | null;
        url?: string | null;
      } = await prisma.project.upsert({
        create: projectToSave,
        update: projectToSave,
        where: {
          id: projectSaveParams.id ?? 0,
          // ... the filter for the Project we want to update
        },
      });

      const tokens = projectSaveParams.tokens;

      if (tokens && tokens.length > 0) {
        tokens.forEach(async (token) => {
          let tokenToSave = {
            network: token.network,
            address: token.address,
            projectId: project.id,
          };
          if (token.id) {
            try {
              await prisma.token.update({
                where: { id: token.id },
                data: tokenToSave,
              });
            } catch (error) {
              console.error(`Token: ${JSON.stringify(tokenToSave)} \n${error}`);
            }
          } else {
            try {
              await prisma.token.upsert({
                where: {
                  Token_address_network_unique_key: {
                    network: token.network,
                    address: token.address,
                  },
                },
                update: tokenToSave,
                create: tokenToSave,
              });
            } catch (error) {
              console.error(`Token: ${JSON.stringify(tokenToSave)} \n${error}`);
            }
          }
        });
      }
      return { error, project };
    } catch (err) {
      console.error("Error: ", err);
      return { error: err };
    }
  }
}
