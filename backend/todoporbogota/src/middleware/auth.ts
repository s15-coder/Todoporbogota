import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

// Extiende Request para incluir el usuario autenticado
export interface AuthRequest extends Request {
    user?: IUser;
}

/**
 * Middleware que verifica el JWT del header Authorization.
 * Adjunta el usuario completo a req.user.
 */
export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        ) as { id: string };

        const user = await User.findById(decoded.id).select("-__v");
        if (!user) {
            res.status(401).json({ error: "Usuario no encontrado." });
            return;
        }

        req.user = user;
        next();
    } catch {
        res.status(401).json({ error: "Token inválido o expirado." });
    }
};

/**
 * Middleware factory que restringe acceso según roles.
 * Debe usarse DESPUÉS de authenticate.
 *
 * Ejemplo: authorize('admin', 'moderator')
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: "No autenticado." });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: "No tienes permisos para realizar esta acción.",
            });
            return;
        }

        next();
    };
};
