import 'dotenv/config';
import * as express from "express";
import * as jwt from "jsonwebtoken";
import {
  // UserViewModel,
  UserAuthenticated,
} from "./interfaces/user";

export const jwtSecret = process.env.JWT_SECRET || "secret";

// ? ideia com destroy jwt - redis https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const token = request?.headers?.authorization?.split(" ")[1] as string;

    return new Promise<UserAuthenticated>((resolve, reject) => {
      if (!token) {
        return reject(new Error("No token provided"));
      }
      jwt.verify(token, jwtSecret, function (err: any, decoded: any) {
        if (err) {
          return reject(err);
        } else {
          if (scopes != undefined) {
            for (let scope of scopes) {
              if (!decoded.scopes.includes(scope)) {
                reject(new Error("JWT does not contain required scope."));
              }
            }
          }
          return resolve(decoded as UserAuthenticated);
        }
      });
    });
  } else {
    return Promise.reject(new Error("Unknown security type name"));
  }
}
