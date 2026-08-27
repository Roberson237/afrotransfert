'use client';

import { use } from 'react';

export default function AuthError({ searchParams }) {
  const params = use(searchParams);
  const error = params?.error;

  const getErrorMessage = (error) => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Accès refusé',
          message: 'Vous avez refusé l’autorisation Google. Pour continuer, veuillez accepter les permissions et réessayer.',
          action: 'Réessayer la connexion',
        };
      case 'Configuration':
        return {
          title: 'Erreur de configuration',
          message: 'La configuration OAuth est incomplète. Vérifiez les variables Google et les URL de callback de production.',
          action: 'Vérifier la configuration',
        };
      case 'OAuthCallback':
        return {
          title: 'Erreur de callback',
          message: 'Le retour depuis Google a échoué. Vérifiez l’URL de redirection et réessayez.',
          action: 'Réessayer',
        };
      default:
        return {
          title: 'Erreur d’authentification',
          message: 'Une erreur inconnue s’est produite lors de la connexion. Veuillez réessayer.',
          action: 'Réessayer',
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{errorInfo.title}</h1>
        <p className="text-gray-600 mb-8">{errorInfo.message}</p>

        <div className="space-y-3">
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {errorInfo.action}
          </button>

          <button
            onClick={() => {
              window.history.back();
            }}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>

        {error && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              Code d’erreur: <code className="font-mono">{error}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}