import { prisma } from "../../../lib/prisma";
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import { getFriendlyErrorMessage } from '../../../lib/userFriendlyErrors';

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
        
        const originalFileName = file.name;
        const fileExt = originalFileName.split('.').pop();
        const fileBaseName = originalFileName.replace(/\.[^/.]+$/, '');
        
        const uniqueFileName = `${Date.now()}-${uuidv4().substring(0, 8)}-${fileBaseName}.${fileExt}`;
        const safeFileName = uniqueFileName.replace(/[\\/:*?"<>|]/g, '-');

        const blob = await put(safeFileName, bytes, {
            access: 'public',
            contentType: file.type || 'application/octet-stream'
        });

        const password = formData.get('password') || '';
        const expirationDays = formData.get('expiration')
            ? parseInt(formData.get('expiration'), 10)
            : 3;

        const fichier = await prisma.fichier.create({
            data: {
                nom: originalFileName,
                chemin: blob.url,
                taille: file.size.toString(),
                type: file.type,
                date_upload: new Date(),
            }
        });

        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
        const shareUrl = `${baseUrl.replace(/\/$/, '')}/share/${fichier.id}`;

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

        return NextResponse.json(
            {
                success: false,
                error: getFriendlyErrorMessage(error?.message, 'Le téléchargement a échoué. Réessayez dans quelques instants.'),
                details: 'Service temporairement indisponible'
            },
            { status: 500 }
        );
    }
}