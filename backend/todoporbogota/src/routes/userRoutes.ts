import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  const { idToken } = req.body;

  try {
    // Validar el token con Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'Token inválido' });

    const { email, name, picture, sub: googleId } = payload;

    // Buscar o crear usuario
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, avatar: picture, googleId });
      await user.save();
    }

    // Generar Token propio (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.json({ user, token });
  } catch (error) {
    console.error('Error en Google Login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    return res.json({ user: req.user });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;