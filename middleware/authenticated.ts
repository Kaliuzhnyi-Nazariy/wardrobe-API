import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces";
import { errorHandler } from "../utils";
import { jwtVerify } from "jose";
import { User } from "../models/user";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw errorHandler(404, "JWT is not found");
}

const secret = new TextEncoder().encode(JWT_SECRET);

const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.authToken || req.signedCookies?.authToken;

  if (!token) return next(errorHandler(401, "No token"));

  try {
    const { payload } = (await jwtVerify(token, secret)) as {
      payload: { id: string; iat: number; exp: number };
    };

    const isExpired = payload.exp <= Math.floor(Date.now() / 1000);

    if (isExpired) {
      await User.findByIdAndUpdate(payload.id, { token: null });
      return next(errorHandler(401, "Token expired"));
    }

    req.user = { id: payload.id };
    return next();
  } catch (error: any) {
    console.log({ error });

    if (error.code === "ERR_JWT_EXPIRED") {
      return next(errorHandler(403, "Token is expired"));
    }

    return next(errorHandler(401, "Invalid token"));
  }
};

export default isAuthenticated;

// import { NextFunction, Response } from "express";
// import { CustomRequest } from "../interfaces";
// import { errorHandler } from "../utils";
// import { jwtVerify } from "jose";

// const { JWT_SECRET } = process.env;

// if (!JWT_SECRET) {
//   throw errorHandler(500, "JWT_SECRET is not defined in environment variables");
// }

// const secret = new TextEncoder().encode(JWT_SECRET);

// const isAuthenticated = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   // 1. Pobranie surowego tokenu z ciasteczek zwykłych lub podpisanych
//   const rawToken = req.cookies?.token || req.signedCookies?.token;

//   // LOG DIAGNOSTYCZNY - Sprawdź w konsoli co dokładnie przesyła Twoje Expo
//   console.log("=== DIAGNOSTYKA TOKENU ===");
//   console.log("Typ rawToken:", typeof rawToken);
//   console.log("Surowa wartość:", rawToken);
//   console.log("==========================");

//   if (!rawToken) {
//     return next(errorHandler(401, "No token provided"));
//   }

//   try {
//     // 2. Dekodowanie znaków specjalnych URL (%2E itp.)
//     let cleanToken = decodeURIComponent(rawToken);

//     // 3. Usunięcie prefiksu Bearer, jeśli został doklejony
//     if (cleanToken.startsWith("Bearer ")) {
//       cleanToken = cleanToken.slice(7);
//     }

//     // 4. Usunięcie zbędnych cudzysłowów na początku i końcu (częsty problem przy JSON.stringify)
//     if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
//       cleanToken = cleanToken.slice(1, -1);
//     }

//     // 5. Weryfikacja tokenu za pomocą biblioteki jose
//     const { payload } = (await jwtVerify(cleanToken, secret)) as {
//       payload: { id: string; iat: number; exp: number };
//     };

//     // 6. Przypisanie id użytkownika do obiektu żądania (Request)
//     req.user = { id: payload.id };

//     return next();
//   } catch (error: any) {
//     console.error("=== BŁĄD WERYFIKACJI JWT ===");
//     console.error(error);

//     // Jeśli token wygasł (jose rzuca ten kod automatycznie)
//     if (error.code === "ERR_JWT_EXPIRED") {
//       return next(errorHandler(403, "Token is expired"));
//     }

//     // Jeśli struktura nagłówka lub sygnatura jest niepoprawna (np. Twój dotychczasowy ERR_JWS_INVALID)
//     if (
//       error.code === "ERR_JWS_INVALID" ||
//       error.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"
//     ) {
//       return next(errorHandler(401, "Invalid token structure or signature"));
//     }

//     return next(errorHandler(401, "Authentication failed"));
//   }
// };

// export default isAuthenticated;
