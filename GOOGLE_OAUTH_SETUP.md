# Configuration Google OAuth pour Sendsey

## Étapes pour configurer l'authentification Google

### 1. Créer un projet Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ API (si nécessaire)

### 2. Configurer les identifiants OAuth

1. Dans le menu de gauche, allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configurez l'écran de consentement OAuth :
   - **User Type**: External
   - **App name**: Sendsey
   - **User support email**: votre-email@gmail.com
   - **Developer contact information**: votre-email@gmail.com
4. Ajoutez les scopes suivants :
   - `openid`
   - `profile`
   - `email`
5. Configurez l'application :
   - **Application type**: Web application
   - **Name**: Sendsey Web App
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

### 3. Récupérer les clés

Après avoir créé les identifiants, vous obtiendrez :
- **Client ID**: Une longue chaîne de caractères
- **Client Secret**: Une chaîne plus courte

### 4. Configurer les variables d'environnement

Modifiez votre fichier `.env` :

```env
GOOGLE_CLIENT_ID=votre_vrai_client_id_ici
GOOGLE_CLIENT_SECRET=votre_vrai_client_secret_ici
NEXTAUTH_SECRET=votre_chaine_secrete_unique
NEXTAUTH_URL=http://localhost:3000
```

### 5. Tester l'authentification

1. Redémarrez votre serveur Next.js
2. Allez sur votre page de connexion
3. Cliquez sur "Continue with Google"
4. Vous devriez être redirigé vers Google, puis revenir sur `/page/uploadspace`

## Fonctionnalités implémentées

- ✅ Connexion avec Google OAuth
- ✅ Création automatique d'utilisateur dans la base de données
- ✅ Gestion des sessions avec NextAuth
- ✅ Redirection après connexion vers la page upload
- ✅ Interface utilisateur moderne avec animations

## Dépannage

### Erreur "Invalid client"
- Vérifiez que votre Client ID et Client Secret sont corrects
- Assurez-vous que l'URI de redirection correspond exactement

### Erreur de base de données
- Vérifiez que votre base de données MySQL est démarrée
- Assurez-vous que les migrations Prisma sont appliquées

### Problème de redirection
- Vérifiez que `NEXTAUTH_URL` correspond à votre URL locale

## Sécurité

- Les mots de passe ne sont pas stockés pour les comptes Google
- Les sessions sont sécurisées avec des cookies HTTP-only
- L'authentification utilise des tokens JWT