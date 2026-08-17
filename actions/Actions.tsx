'use server'
import { prisma } from "../lib/prisma"

export async function New_User(formData: FormData) {
    const nom = String(formData.get('fn') ?? '')
    const email = String(formData.get('en') ?? '')
    const prenom = String(formData.get('ln') ?? '')
    const mot_de_passe = String(formData.get('pass') ?? '')

    await prisma.utilisateur.create({
        data: {
            nom,
            email,
            prenom,
            mot_de_passe,
        }
    })
}