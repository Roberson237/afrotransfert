import { prisma } from "../../../lib/prisma";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        console.log('POST /api/new_file called');
        
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return NextResponse.json(
                { success: false, error: 'Aucun fichier fourni' },
                { status: 400 }
            );
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
        
        // CORRECTION 1: Générer un nom de fichier unique
        const originalFileName = file.name;
        const fileExt = path.extname(originalFileName); // .sql, .jpg, etc.
        const fileBaseName = path.basename(originalFileName, fileExt);
        
        // Créer un nom unique pour éviter les collisions
        const uniqueFileName = `${Date.now()}-${uuidv4().substring(0, 8)}-${fileBaseName}${fileExt}`;
        
        // CORRECTION 2: Enlever les caractères problématiques
        const safeFileName = uniqueFileName.replace(/[\\/:*?"<>|]/g, '-');
        
        const filepath = path.join(uploadDir, safeFileName);
        await writeFile(filepath, bytes);

        console.log('Fichier sauvegardé à:', filepath);

        const password = formData.get('password') || '';
        const expirationDays = formData.get('expiration') 
            ? parseInt(formData.get('expiration')) 
            : 7;
        
        // CORRECTION 3: Stocker le chemin relatif dans la base de données
        const relativePath = `file_saved/${safeFileName}`;
        
        const fichier = await prisma.fichier.create({
            data: {
                nom: originalFileName, // Nom original avec chemin si nécessaire
                chemin: relativePath, // Chemin relatif au dossier public
                taille: file.size.toString(),
                type: file.type,
                date_upload: new Date(),
            }
        });
        
        console.log('Fichier enregistré en DB avec chemin:', relativePath);
        
        // Générer l'URL de partage
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;
        const shareUrl = `${baseUrl}/share/${fichier.id}`;
        
        // Hasher le mot de passe seulement s'il n'est pas vide
        let hashedPassword = null;
        if (password.trim()) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        
        const expirationDate = new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000);
        
        await prisma.lienPartage.create({
            data: {
                url: shareUrl,
                code_access: hashedPassword,
                expiration: expirationDate,
                fichier_id: fichier.id,
            }
        });

        return NextResponse.json(
            {
                success: true,
                shareUrl: shareUrl,
                fileId: fichier.id,
                message: 'Fichier sauvegardé avec succès'
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du fichier:', error);
        
        // Donner plus d'informations sur l'erreur
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                details: error.code || 'No error code'
            },
            { status: 500 }
        );
    }
}