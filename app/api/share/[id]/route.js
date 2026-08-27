import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getFriendlyErrorMessage } from '../../../../lib/userFriendlyErrors';

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        // Récupérer le fichier depuis la DB
        const fichier = await prisma.fichier.findUnique({
            where: { 
                id: parseInt(id) 
            },
            include: { 
                liensPartage: true  // ← camelCase, pas de underscore
            }
        });

        if (!fichier) {
            return NextResponse.json(
                { success: false, error: getFriendlyErrorMessage('Fichier non trouvé', 'Ce fichier n’est plus disponible.') },
                { status: 404 }
            );
        }

        if (fichier.liensPartage && fichier.liensPartage.length > 0) {
            const lienPartage = fichier.liensPartage[0];
            
            if (lienPartage.expiration < new Date()) {
                return NextResponse.json(
                    { success: false, error: getFriendlyErrorMessage('Lien expiré', 'Ce lien a expiré.') },
                    { status: 410 }
                );
            }

            return NextResponse.json({
                success: true,
                fileName: fichier.nom,
                fileSize: parseInt(fichier.taille),
                type: fichier.type,
                hasPassword: !!lienPartage.code_access,
                uploadedAt: fichier.date_upload,
                lienPartage: {
                    url: lienPartage.url,
                    expiration: lienPartage.expiration
                }
            });
        } else {
            return NextResponse.json(
                { success: false, error: getFriendlyErrorMessage('Aucun lien de partage disponible', 'Ce fichier n’est pas disponible pour le moment.') },
                { status: 404 }
            );
        }

    } catch (error) {
        console.error('Erreur API share:', error);
        return NextResponse.json(
            { success: false, error: getFriendlyErrorMessage(error?.message, 'Le service de partage est temporairement indisponible.') },
            { status: 500 }
        );
    }
}