'use server';

import { redirect } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function New_User(formData: FormData ){
  try {
    // Récupérer les données du formulaire
    const nom = formData.get('fn') as string;
    const email = formData.get('en') as string;
    const prenom = formData.get('ln') as string;
    const mot_de_passe = formData.get('pass') as string;

    // Validation des données
    if (!nom || !email || !prenom || !mot_de_passe) {
      throw new Error('Tous les champs sont requis');
    }

    if (mot_de_passe.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }

 
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
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


    redirect('/page/uploadspace/');

  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    
    // Vous pouvez gérer l'erreur différemment
    // Par exemple, rediriger vers une page d'erreur
    // Ou retourner un message d'erreur
    throw error; // L'erreur sera affichée dans le composant
  }
}