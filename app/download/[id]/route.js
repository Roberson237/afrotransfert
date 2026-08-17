import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code d\'accès requis' }, { status: 400 });
    }

    // Vérifier le lien de partage
    const lienPartage = await prisma.lienPartage.findFirst({
      where: {
        fichier_id: parseInt(id),
        code_access: code,
        expiration: {
          gt: new Date(),
        },
      },
      include: {
        fichier: true,
      },
    });

    if (!lienPartage) {
      return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 404 });
    }

    // Lire le fichier
    const filePath = join(process.cwd(), lienPartage.fichier.chemin);
    const fileBuffer = await readFile(filePath);

    // Retourner le fichier
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': lienPartage.fichier.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${lienPartage.fichier.nom}"`,
      },
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}