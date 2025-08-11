'use client';

import { useState } from 'react';

export default function ContactList({ messages, onToggleRead, onDelete, title }) {
  const [expandedMessage, setExpandedMessage] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    
    return formatDate(dateString);
  };

  const toggleMessage = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
        <p className="text-gray-600 mb-6">Les messages de contact apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'var(--font-quicksand)'}}>
          {title || `Messages de contact (${messages.length})`}
        </h3>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              message.read 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-blue-200 bg-blue-50'
            }`}
          >
            {/* Header du message */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {message.name}
                  </h4>
                  {!message.read && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Nouveau
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>📧 {message.email}</span>
                  <span>📅 {formatTimeAgo(message.createdAt)}</span>
                </div>
                {/* Aperçu du message */}
                <p className="text-sm text-gray-700 truncate">
                  {message.message.slice(0, 100)}{message.message.length > 100 ? '...' : ''}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleMessage(message.id)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title={expandedMessage === message.id ? 'Réduire' : 'Développer'}
                >
                  <svg 
                    className={`h-4 w-4 text-gray-600 transition-transform ${
                      expandedMessage === message.id ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onToggleRead(message.id, message.read)}
                  className={`p-2 rounded-lg transition-colors ${
                    message.read
                      ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                  title={message.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {message.read ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </button>
                
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Message complet développé */}
            {expandedMessage === message.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-white p-4 rounded-lg border">
                  <h5 className="font-medium text-gray-900 mb-2">Message complet :</h5>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {message.message}
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Reçu le {formatDate(message.createdAt)}
                  </div>
                </div>
                
                {/* Actions rapides */}
                <div className="mt-4 flex gap-3">
                  <a
                    href={`mailto:${message.email}?subject=Re: Message de contact&body=Bonjour ${message.name},%0A%0AMerci pour votre message :%0A"${message.message.slice(0, 100)}..."%0A%0A`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    📧 Répondre par email
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex">
          <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Gestion des messages :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Cliquez sur la flèche pour développer le message complet</li>
              <li>• Marquez les messages comme lus/non lus avec l'icône appropriée</li>
              <li>• Utilisez "Répondre par email" pour ouvrir votre client email</li>
              <li>• Les nouveaux messages apparaissent avec un badge bleu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}