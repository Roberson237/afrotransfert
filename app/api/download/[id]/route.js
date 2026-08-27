import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { getFriendlyErrorMessage } from '../../../../lib/userFriendlyErrors';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const password = searchParams.get('password')?.trim();

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
            return NextResponse.json(
                { success: false, error: getFriendlyErrorMessage('Fichier non trouvé', 'Ce fichier n’est plus disponible.') },
                { status: 404 }
            );
        }

        if (!fichier.liensPartage || fichier.liensPartage.length === 0) {
            return NextResponse.json(
                { success: false, error: getFriendlyErrorMessage('Aucun lien de partage disponible', 'Ce fichier n’est pas disponible pour le moment.') },
                { status: 404 }
            );
        }

        const lienPartage = fichier.liensPartage[0];

        if (lienPartage.expiration < new Date()) {
            return NextResponse.json(
                { success: false, error: getFriendlyErrorMessage('Lien expiré', 'Ce lien a expiré.') },
                { status: 410 }
            );
        }

        if (lienPartage.code_access) {
            if (!password) {
                return NextResponse.json(
                    { success: false, error: getFriendlyErrorMessage('Mot de passe requis', 'Veuillez saisir le mot de passe pour continuer.') },
                    { status: 401 }
                );
            }

            const isValidPassword = await bcrypt.compare(password, lienPartage.code_access);
            if (!isValidPassword) {
                return NextResponse.json(
                    { success: false, error: getFriendlyErrorMessage('Mot de passe incorrect', 'Le mot de passe est incorrect.') },
                    { status: 401 }
                );
            }
        }

        const fileUrl = fichier.chemin;
        return NextResponse.redirect(fileUrl, {
            status: 302,
            headers: {
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fichier.nom)}"`,
            }
        });

    } catch (error) {
        console.error('ERREUR COMPLÈTE:', error);
        return NextResponse.json(
            { success: false, error: getFriendlyErrorMessage(error?.message, 'Le téléchargement a échoué. Réessayez dans quelques instants.') },
            { status: 500 }
        );
    }
}