'use server';

import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function authenticateUser(formData: FormData) {
  try {
    const email = String(formData.get('emc') ?? '').trim().toLowerCase();
    const password = String(formData.get('passc') ?? '');

    if (!email || !password) {
      return { success: false, error: 'Adresse email et mot de passe requis.' };
    }

    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!user || !user.mot_de_passe) {
      return { success: false, error: 'Adresse email ou mot de passe incorrect.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return { success: false, error: 'Adresse email ou mot de passe incorrect.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return { success: false, error: 'Connexion impossible pour le moment. Veuillez réessayer.' };
  }
}
