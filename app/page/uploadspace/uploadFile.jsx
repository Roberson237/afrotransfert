// app/actions/uploadFile.js
'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

import { prisma } from '../../../lib/prisma';
import { hash as bcryptHash } from 'bcryptjs';

export async function uploadFile(formData) {
  try {
    const file = formData.get('file')
    const password = formData.get('password') || null
    const utilisateur_id = formData.get('utilisateur_id')
    const customExpiration = formData.get('expiration') // Si vous ajoutez cette option
    
    if (!file) {
      return {
        success: false,
        error: 'Fichier requis'
      }
    }

    // Si aucun utilisateur fourni, créer un utilisateur invité temporaire
    let utilisateurIdNum = utilisateur_id ? parseInt(utilisateur_id) : null;
    if (!utilisateurIdNum) {
      try {
        const guest = await prisma.utilisateur.create({
          data: {
            nom: 'Invité',
            prenom: 'Invité',
            email: `guest_${uuidv4()}@local`
          }
        });
        utilisateurIdNum = guest.id;
      } catch (e) {
        console.error('Erreur création utilisateur invité:', e);
        return {
          success: false,
          error: 'Impossible de créer un utilisateur invité'
        };
      }
    }

    // Validation du type de fichier
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Type de fichier non autorisé'
      }
    }

    // Validation de la taille (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Fichier trop volumineux (max 100MB)'
      }
    }

    // Création du dossier filesave s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'filesave')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.error('Erreur création dossier:', error)
    }

    // Génération d'un nom unique pour le fichier
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadDir, uniqueFileName)
    const publicPath = `/filesave/${uniqueFileName}`

    // Conversion du buffer et écriture du fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Création de l'entrée fichier dans la BDD
    const fichier = await prisma.fichier.create({
      data: {
        nom: file.name,
        chemin: publicPath,
        taille: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        utilisateur_id: utilisateurIdNum,
        date_upload: new Date()
      }
    })

    // Calcul de la date d'expiration (7 jours par défaut)
    const expirationDate = customExpiration 
      ? new Date(customExpiration)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 jours

    // Génération du code d'accès (mot de passe hashé)
    let hashedPassword = null
    if (password) {
      try {
        hashedPassword = await bcryptHash(password, 10)
      } catch (e) {
        console.error('Erreur hash password:', e)
        hashedPassword = null
      }
    }

    // Génération d'une URL unique
    const uniqueUrl = uuidv4()

    // Création du lien de partage
    const lienPartage = await prisma.lienPartage.create({
      data: {
        url: uniqueUrl,
        code_access: hashedPassword,
        expiration: expirationDate,
        fichier_id: fichier.id
      }
    })

    // Construction du lien complet pour l'affichage
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${uniqueUrl}`

    return {
      success: true,
      data: {
        fichier,
        lienPartage,
        shareUrl,
        expiresAt: expirationDate,
        hasPassword: !!password
      }
    }

  } catch (error) {
    console.error('Erreur upload:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'upload'
    }
  }
}