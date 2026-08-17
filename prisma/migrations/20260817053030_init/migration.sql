-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prenom" TEXT NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fichiers" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "chemin" TEXT NOT NULL,
    "taille" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "fichiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liens_partage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "code_access" TEXT,
    "expiration" TIMESTAMP(3) NOT NULL,
    "fichier_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "liens_partage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telechargements" (
    "id" SERIAL NOT NULL,
    "fichier_id" INTEGER NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telechargements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "liens_partage_url_key" ON "liens_partage"("url");

-- CreateIndex
CREATE INDEX "liens_partage_fichier_id_idx" ON "liens_partage"("fichier_id");

-- CreateIndex
CREATE INDEX "telechargements_utilisateur_id_idx" ON "telechargements"("utilisateur_id");

-- CreateIndex
CREATE UNIQUE INDEX "telechargements_fichier_id_utilisateur_id_key" ON "telechargements"("fichier_id", "utilisateur_id");

-- AddForeignKey
ALTER TABLE "liens_partage" ADD CONSTRAINT "fk_lien_partage_fichier" FOREIGN KEY ("fichier_id") REFERENCES "fichiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telechargements" ADD CONSTRAINT "fk_telechargement_fichier" FOREIGN KEY ("fichier_id") REFERENCES "fichiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telechargements" ADD CONSTRAINT "fk_telechargement_utilisateur" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
