import { prisma } from "../../../lib/prisma";
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

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
        
        // Génération d'un nom unique pour le fichier
        const originalFileName = file.name;
        const fileExt = originalFileName.split('.').pop();
        const fileBaseName = originalFileName.replace(/\.[^/.]+$/, '');
        
        // Créer un nom unique pour Vercel Blob
        const uniqueFileName = `${Date.now()}-${uuidv4().substring(0, 8)}-${fileBaseName}.${fileExt}`;
        const safeFileName = uniqueFileName.replace(/[\\/:*?"<>|]/g, '-');
        
        console.log('Upload vers Vercel Blob:', safeFileName);

        // Upload vers Vercel Blob
        const blob = await put(safeFileName, bytes, {
            access: 'public',
            contentType: file.type || 'application/octet-stream'
        });

        console.log('Blob uploadé:', blob.url);

        const password = formData.get('password') || '';
        const expirationDays = formData.get('expiration') 
            ? parseInt(formData.get('expiration')) 
            : 7;
        
        // Créer l'entrée fichier dans la base de données avec l'URL Vercel Blob
        const fichier = await prisma.fichier.create({
            data: {
                nom: originalFileName,
                chemin: blob.url, // Stocker l'URL Vercel Blob
                taille: file.size.toString(),
                type: file.type,
                date_upload: new Date(),
            }
        });
        
        console.log('Fichier enregistré en DB avec URL:', blob.url);
        
        // Générer l'URL de partage
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
        const shareUrl = `${baseUrl.replace(/\/$/, '')}/share/${fichier.id}`;
        
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