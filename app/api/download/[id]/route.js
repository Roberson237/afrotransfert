import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { readFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const password = searchParams.get('password')?.trim();

        console.log('=== DEBUG DOWNLOAD ===');
        console.log('ID:', id);
        console.log('Password reçu:', password || 'NULL');

        const fichier = await prisma.fichier.findUnique({
            where: { 
                id: parseInt(id) 
            },
            include: { 
                liensPartage: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!fichier) {
            console.log('Fichier non trouvé');
            return NextResponse.json(
                { success: false, error: 'Fichier non trouvé' },
                { status: 404 }
            );
        }

        console.log('Fichier trouvé:', fichier.nom);
        console.log('Chemin dans DB:', fichier.chemin);

        if (!fichier.liensPartage || fichier.liensPartage.length === 0) {
            console.log('Aucun lien de partage');
            return NextResponse.json(
                { success: false, error: 'Aucun lien de partage disponible' },
                { status: 404 }
            );
        }

        const lienPartage = fichier.liensPartage[0];
        
        console.log('Lien trouvé - ID:', lienPartage.id);
        console.log('Expiration:', lienPartage.expiration);
        console.log('Code_access existe:', !!lienPartage.code_access);
        
        // Vérification expiration
        if (lienPartage.expiration < new Date()) {
            console.log('Lien expiré');
            return NextResponse.json(
                { success: false, error: 'Lien expiré' },
                { status: 410 }
            );
        }

        // Vérification mot de passe
        if (lienPartage.code_access) {
            if (!password) {
                console.log('Mot de passe requis mais non fourni');
                return NextResponse.json(
                    { success: false, error: 'Mot de passe requis' },
                    { status: 401 }
                );
            }

            console.log('Comparaison avec bcrypt...');
            const isValidPassword = await bcrypt.compare(password, lienPartage.code_access);
            console.log('Résultat bcrypt.compare:', isValidPassword);
            
            if (!isValidPassword) {
                console.log('Mot de passe incorrect');
                return NextResponse.json(
                    { success: false, error: 'Mot de passe incorrect' },
                    { status: 401 }
                );
            }
            console.log('Mot de passe correct!');
        }

        // CORRECTION ICI : Gestion du chemin du fichier
        let filePath;
        
        // Si le chemin est absolu (commence par C:\ ou /)
        if (fichier.chemin.startsWith('C:\\') || fichier.chemin.startsWith('/')) {
            filePath = fichier.chemin; // Utiliser directement le chemin absolu
            console.log('Chemin absolu détecté, utilisation directe');
        } 
        // Si le chemin est relatif
        else if (fichier.chemin.startsWith('public/') || fichier.chemin.startsWith('./public/')) {
            filePath = path.join(process.cwd(), fichier.chemin);
            console.log('Chemin relatif détecté, ajout de process.cwd()');
        }
        // Par défaut (chemin relatif sans "public/")
        else {
            filePath = path.join(process.cwd(), 'public', fichier.chemin);
            console.log('Chemin par défaut, ajout de public/');
        }
        
        console.log('Chemin final du fichier:', filePath);

        // Lire le fichier depuis le système de fichiers
        const fileBuffer = await readFile(filePath);
        console.log('Taille du fichier:', fileBuffer.length, 'bytes');

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': fichier.type || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fichier.nom)}"`,
                'Content-Length': fileBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('ERREUR COMPLÈTE:', error);
        
        if (error.code === 'ENOENT') {
            console.error('Fichier introuvable au chemin spécifié');
            return NextResponse.json(
                { success: false, error: 'Fichier non trouvé sur le serveur' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}