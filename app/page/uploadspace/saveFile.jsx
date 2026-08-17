'use server'

import { prisma } from "../../../lib/prisma";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function Savefile(formData) {
    try {
        console.log('Savefile called');
       
       
        
        const file = formData.get('file');
        if (!file) {
            throw new Error('Aucun fichier fourni');
        }

        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);
        
        // Créer le dossier s'il n'existe pas
        const uploadDir = path.join(process.cwd(), 'public', 'file_saved');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
            // Le dossier existe peut-être déjà, on continue
        }
        
        const filepath = path.join(uploadDir, file.name);
        await writeFile(filepath, bytes);

        const password = formData.get('password') || '';
        const expirationDays = formData.get('expiration') 
            ? parseInt(formData.get('expiration')) 
            : 7;
        await prisma.fichiers.create({
            data:{
                nom:file.name,
                chemin:filepath,
                taille:file.size,
                type:file.type,
                date_upload:new Date(),
            }
        })
        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${fichiers.id}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const now = new Date();
        await prisma.lienPartage.create({
            data:{
                url:shareUrl,
                code_access:hashedPassword,
                expiration:expirationDays,
                fichier_id:fichiers.id,
                createdAt:now.toISOString().slice(0,19).replace('T',' '),
                updatedAt:new Date(now.getTime() + expiration *24*60*60*1000).toISOString().slice(0,19).replace('T',''),

            }
        })

        return {
            success: true,
            shareUrl: shareUrl,
            fileId: fichiers.id,
            message: 'Fichier sauvegardé avec succès'
        };
        
         

       
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du fichier:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}