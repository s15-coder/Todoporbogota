import { Router, Request, Response } from "express";
import { Iniciativa, IIniciativa } from "../models/Iniciativa";
import { AuthRequest, authenticate } from "../middleware/auth";

const router = Router();

/** Mapeo estado frontend (PENDIENTE/APROBADO/RECHAZADO) a backend (pending/approved/rejected) */
const statusToBackend: Record<string, "pending" | "approved" | "rejected"> = {
    PENDIENTE: "pending",
    pending: "pending",
    APROBADO: "approved",
    approved: "approved",
    RECHAZADO: "rejected",
    rejected: "rejected",
};

const statusToFrontend: Record<string, string> = {
    pending: "PENDIENTE",
    approved: "APROBADO",
    rejected: "RECHAZADO",
};

/** Formatea una iniciativa para la respuesta (incluye populated y estado en formato frontend) */
function toResponse(doc: IIniciativa | null) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    const anyDoc = doc as any;
    return {
        ...obj,
        id: anyDoc._id?.toString(),
        _id: anyDoc._id?.toString(),
        status: statusToFrontend[anyDoc.status] || anyDoc.status,
        submittedBy: anyDoc.submittedBy?.toString?.() ?? anyDoc.submittedBy,
        reviewedBy: anyDoc.reviewedBy?.toString?.() ?? anyDoc.reviewedBy,
    };
}

/**
 * GET /api/iniciativas
 * Lista iniciativas con filtros opcionales: category, locality, status, featured
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { category, locality, status, featured } = req.query;
        const filter: Record<string, unknown> = {};

        if (category && typeof category === "string") filter.category = category;
        if (locality && typeof locality === "string") filter.locality = locality;
        if (featured === "true") filter.featured = true;
        if (status && typeof status === "string") {
            const backendStatus = statusToBackend[status] ?? status;
            filter.status = backendStatus;
        }

        const list = await Iniciativa.find(filter)
            .sort({ createdAt: -1 })
            .populate("submittedBy", "name email avatar")
            .lean();

        const items = list.map((doc: any) => ({
            ...doc,
            id: doc._id?.toString(),
            _id: doc._id?.toString(),
            status: statusToFrontend[doc.status] || doc.status,
            submittedBy: doc.submittedBy,
        }));

        res.json({ iniciativas: items });
    } catch (error) {
        console.error("Error listing iniciativas:", error);
        res.status(500).json({ error: "Error al listar iniciativas." });
    }
});

/**
 * GET /api/iniciativas/featured
 * Iniciativas destacadas (para home)
 */
router.get("/featured", async (_req: Request, res: Response) => {
    try {
        const list = await Iniciativa.find({ featured: true, status: "approved" })
            .sort({ createdAt: -1 })
            .limit(6)
            .populate("submittedBy", "name avatar")
            .lean();

        const items = list.map((doc: any) => ({
            ...doc,
            id: doc._id?.toString(),
            _id: doc._id?.toString(),
            status: statusToFrontend[doc.status] || doc.status,
        }));

        res.json({ iniciativas: items });
    } catch (error) {
        console.error("Error listing featured:", error);
        res.status(500).json({ error: "Error al listar destacadas." });
    }
});

/**
 * GET /api/iniciativas/mis-propuestas
 * Iniciativas del usuario autenticado (requiere token)
 */
router.get("/mis-propuestas", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado." });
        }
        const list = await Iniciativa.find({ submittedBy: req.user._id })
            .sort({ createdAt: -1 })
            .populate("submittedBy", "name email avatar")
            .lean();

        const items = list.map((doc: any) => ({
            ...doc,
            id: doc._id?.toString(),
            _id: doc._id?.toString(),
            status: statusToFrontend[doc.status] || doc.status,
        }));

        res.json({ iniciativas: items });
    } catch (error) {
        console.error("Error listing mis propuestas:", error);
        res.status(500).json({ error: "Error al listar tus propuestas." });
    }
});

/**
 * GET /api/iniciativas/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const doc = await Iniciativa.findById(req.params.id)
            .populate("submittedBy", "name email avatar")
            .populate("reviewedBy", "name email");

        if (!doc) {
            return res.status(404).json({ error: "Iniciativa no encontrada." });
        }

        res.json(toResponse(doc));
    } catch (error) {
        console.error("Error fetching iniciativa:", error);
        res.status(500).json({ error: "Error al obtener la iniciativa." });
    }
});

/**
 * POST /api/iniciativas
 * Crear iniciativa (requiere autenticación)
 */
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado." });
        }

        const body = req.body as any;
        // Aceptar nombres del frontend (titulo, descripcion, barrio, etc.)
        const title = body.title ?? body.titulo;
        const description = body.description ?? body.descripcion;
        const category = body.category ?? body.categoria;
        const locality = body.locality ?? body.barrio;
        const image = body.image ?? body.imagen;
        const participants = body.participants ?? body.participantes ?? 0;
        const startDate = body.startDate ? new Date(body.startDate) : undefined;
        const endDate = body.endDate ? new Date(body.endDate) : undefined;
        const contactEmail = body.contactEmail;
        const contactPhone = body.contactPhone;
        const address = body.address;
        const tags = Array.isArray(body.tags) ? body.tags : [];

        if (!title || !description || !category || !locality) {
            return res.status(400).json({
                error: "Faltan campos requeridos: title, description, category, locality.",
            });
        }

        const statusBackend = body.status
            ? statusToBackend[body.status] ?? "pending"
            : "pending";

        const iniciativa = new Iniciativa({
            title: String(title).trim(),
            description: String(description).trim(),
            category: String(category).trim(),
            locality: String(locality).trim(),
            image: image || undefined,
            images: Array.isArray(body.images) ? body.images : [],
            featured: !!body.featured,
            status: statusBackend,
            participants: Number(participants) || 0,
            startDate,
            endDate,
            contactEmail: contactEmail || undefined,
            contactPhone: contactPhone || undefined,
            address: address || undefined,
            tags,
            submittedBy: req.user._id,
            historial: [
                {
                    autor: "usuario",
                    fecha: new Date().toISOString(),
                    texto: "Propuesta enviada para revisión.",
                },
            ],
        });

        await iniciativa.save();
        await iniciativa.populate("submittedBy", "name email avatar");

        res.status(201).json(toResponse(iniciativa));
    } catch (error) {
        console.error("Error creating iniciativa:", error);
        res.status(500).json({ error: "Error al crear la iniciativa." });
    }
});

/**
 * PATCH /api/iniciativas/:id
 * Actualizar iniciativa (autor o admin)
 */
router.patch("/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado." });
        }

        const doc = await Iniciativa.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ error: "Iniciativa no encontrada." });
        }

        const isAuthor = doc.submittedBy?.toString() === req.user._id?.toString();
        const isAdmin = req.user.role === "admin" || req.user.role === "moderator";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ error: "No tienes permiso para editar esta iniciativa." });
        }

        const body = req.body as any;
        const allowed = [
            "title", "description", "category", "locality", "image", "images",
            "featured", "status", "participants", "startDate", "endDate",
            "contactEmail", "contactPhone", "address", "tags", "reviewNote",
            "reviewedBy", "reviewedAt", "historial",
        ];

        for (const key of allowed) {
            if (body[key] !== undefined) {
                if (key === "status") {
                    (doc as any).status = statusToBackend[body[key]] ?? body[key];
                } else if (key === "startDate" || key === "endDate" || key === "reviewedAt") {
                    (doc as any)[key] = body[key] ? new Date(body[key]) : undefined;
                } else {
                    (doc as any)[key] = body[key];
                }
            }
        }
        if (body.estado !== undefined) {
            (doc as any).status = statusToBackend[body.estado] ?? (doc as any).status;
        }

        if (isAdmin && (body.status !== undefined || body.estado !== undefined)) {
            (doc as any).reviewedBy = req.user._id;
            (doc as any).reviewedAt = new Date();
        }

        await doc.save();
        await doc.populate("submittedBy", "name email avatar");
        await doc.populate("reviewedBy", "name email");

        res.json(toResponse(doc));
    } catch (error) {
        console.error("Error updating iniciativa:", error);
        res.status(500).json({ error: "Error al actualizar la iniciativa." });
    }
});

/**
 * DELETE /api/iniciativas/:id
 * Solo autor o admin
 */
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado." });
        }

        const doc = await Iniciativa.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ error: "Iniciativa no encontrada." });
        }

        const isAuthor = doc.submittedBy?.toString() === req.user._id?.toString();
        const isAdmin = req.user.role === "admin" || req.user.role === "moderator";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta iniciativa." });
        }

        await Iniciativa.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting iniciativa:", error);
        res.status(500).json({ error: "Error al eliminar la iniciativa." });
    }
});

export default router;
