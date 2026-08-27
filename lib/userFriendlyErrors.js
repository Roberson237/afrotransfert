export function getFriendlyErrorMessage(message, fallback = 'Une erreur est survenue. Réessayez dans quelques instants.') {
  if (!message || typeof message !== 'string') {
    return fallback;
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes('mot de passe') ||
    normalized.includes('password') ||
    normalized.includes('incorrect') ||
    normalized.includes('invalid password')
  ) {
    return 'Le mot de passe est incorrect ou manquant.';
  }

  if (
    normalized.includes('fichier non trouvé') ||
    normalized.includes('file not found') ||
    normalized.includes('lien expir') ||
    normalized.includes('expired') ||
    normalized.includes('not found')
  ) {
    return 'Ce fichier n’est plus disponible ou son lien a expiré.';
  }

  if (
    normalized.includes('blob') ||
    normalized.includes('storage') ||
    normalized.includes('database') ||
    normalized.includes('database server') ||
    normalized.includes('serveur') ||
    normalized.includes('internal server') ||
    normalized.includes('connection')
  ) {
    return 'Le service de stockage ou la base de données est temporairement indisponible. Réessayez dans quelques instants.';
  }

  if (
    normalized.includes('oauth') ||
    normalized.includes('google') ||
    normalized.includes('auth') ||
    normalized.includes('email') ||
    normalized.includes('connexion') ||
    normalized.includes('login')
  ) {
    return 'Connexion impossible. Vérifiez vos informations puis réessayez.';
  }

  if (
    normalized.includes('tous les champs') ||
    normalized.includes('requis') ||
    normalized.includes('valide') ||
    normalized.includes('obligatoire')
  ) {
    return 'Veuillez vérifier les informations saisies et réessayer.';
  }

  if (normalized.includes('network') || normalized.includes('réseau')) {
    return 'Problème de connexion réseau. Vérifiez votre connexion puis réessayez.';
  }

  return fallback;
}
