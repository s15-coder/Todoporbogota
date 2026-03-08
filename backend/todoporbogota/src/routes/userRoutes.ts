import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createJwt = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

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
    const token = createJwt(String(user._id));

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/facebook-login', async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: 'accessToken es requerido' });
  }

  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.status(500).json({ error: 'Facebook auth no configurado en servidor' });
  }

  try {
    const appSecretProof = crypto
      .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
      .update(accessToken)
      .digest('hex');

    const profileResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}&appsecret_proof=${appSecretProof}`
    );

    if (!profileResponse.ok) {
      return res.status(401).json({ error: 'Token de Facebook inválido' });
    }

    const profile = await profileResponse.json();

    if (!profile?.id) {
      return res.status(400).json({ error: 'No se pudo obtener el usuario de Facebook' });
    }

    if (!profile?.email) {
      return res.status(400).json({ error: 'Facebook no retornó email. Autoriza el permiso de correo.' });
    }

    const avatar = `https://graph.facebook.com/${profile.id}/picture?type=large`;
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        avatar,
        facebookId: profile.id,
      });
      await user.save();
    } else {
      user.facebookId = profile.id;
      // Keep a stable avatar URL and prioritize Facebook photo on Facebook login.
      user.avatar = avatar;
      await user.save();
    }

    const token = createJwt(String(user._id));
    return res.json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: 'Error en autenticación con Facebook' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    return res.json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;