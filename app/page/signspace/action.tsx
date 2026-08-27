'use server';

import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function New_User(formData: FormData) {
  try {
    const nom = String(formData.get('fn') ?? '').trim();
    const email = String(formData.get('en') ?? '').trim().toLowerCase();
    const prenom = String(formData.get('ln') ?? '').trim();
    const mot_de_passe = String(formData.get('pass') ?? '');

    if (!nom || !email || !prenom || !mot_de_passe) {
      return { success: false, error: 'Tous les champs sont requis.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Veuillez saisir une adresse email valide.' };
    }

    if (mot_de_passe.length < 8) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères.' };
    }

    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'Cette adresse email est déjà utilisée.' };
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    await prisma.utilisateur.create({
      data: {
        nom,
        email,
        prenom,
        mot_de_passe: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    return { success: false, error: 'Impossible de créer le compte pour le moment. Veuillez réessayer.' };
  }
}