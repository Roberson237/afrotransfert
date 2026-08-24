import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
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

        // CORRECTION : Utiliser directement l'URL Vercel Blob stockée
        const fileUrl = fichier.chemin;
        
        console.log('Redirection vers l\'URL Blob:', fileUrl);

        // Rediriger vers l'URL Blob publique
        return NextResponse.redirect(fileUrl, {
            status: 302,
            headers: {
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fichier.nom)}"`,
            }
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