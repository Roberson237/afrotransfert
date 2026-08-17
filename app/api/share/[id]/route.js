import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

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
                { success: false, error: 'Fichier non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier si le lien est expiré
        // Note: liensPartage est un tableau, donc on vérifie le premier élément
        if (fichier.liensPartage && fichier.liensPartage.length > 0) {
            const lienPartage = fichier.liensPartage[0]; // Premier lien
            
            if (lienPartage.expiration < new Date()) {
                return NextResponse.json(
                    { success: false, error: 'Lien expiré' },
                    { status: 410 }
                );
            }

            // Retourner les données du fichier
            return NextResponse.json({
                success: true,
                fileName: fichier.nom,
                fileSize: parseInt(fichier.taille),
                type: fichier.type,
                hasPassword: !!lienPartage.code_access, // Utiliser le lien spécifique
                uploadedAt: fichier.date_upload,
                lienPartage: {
                    url: lienPartage.url,
                    expiration: lienPartage.expiration
                }
            });
        } else {
            // Aucun lien de partage trouvé
            return NextResponse.json(
                { success: false, error: 'Aucun lien de partage disponible' },
                { status: 404 }
            );
        }

    } catch (error) {
        console.error('Erreur API share:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}