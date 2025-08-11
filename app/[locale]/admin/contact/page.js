'use client';

import { useState, useEffect } from 'react';
import ContactList from '../../../../components/admin/ContactList';

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Charger les messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contact');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (messageId, currentReadStatus) => {
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: !currentReadStatus }),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setMessages(prev => prev.map(m => m.id === messageId ? updated : m));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        const response = await fetch(`/api/admin/contact/${messageId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setMessages(prev => prev.filter(m => m.id !== messageId));
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Calculer les statistiques
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.read).length;
  const readMessages = messages.filter(m => m.read).length;

  // Filtrer les messages selon le filtre sélectionné
  const filteredMessages = selectedFilter === 'all' 
    ? messages 
    : selectedFilter === 'unread'
    ? messages.filter(m => !m.read)
    : messages.filter(m => m.read);

  // Définir les filtres disponibles
  const filters = [
    { id: 'all', label: 'Tous', count: totalMessages },
    { id: 'unread', label: 'Non lus', count: unreadMessages },
    { id: 'read', label: 'Lus', count: readMessages }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-quicksand)'}}>
          Messages de Contact
        </h1>
        <p className="text-gray-600">
          Gérez les messages reçus via le formulaire de contact
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{totalMessages}</div>
              <div className="text-sm text-gray-600">Messages total</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{unreadMessages}</div>
              <div className="text-sm text-gray-600">Messages non lus</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{readMessages}</div>
              <div className="text-sm text-gray-600">Messages lus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'var(--font-quicksand)'}}>
          Filtrer les messages
        </h3>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-yellow-400 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              <span className="ml-2 bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs text-white">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔄 Actualiser
        </button>
        <a
          href="/#contact-section"
          target="_blank"
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          👁️ Voir le formulaire public
        </a>
      </div>

      {/* Liste des messages */}
      <ContactList
        messages={filteredMessages}
        onToggleRead={handleToggleRead}
        onDelete={handleDeleteMessage}
        title={`Messages ${filters.find(f => f.id === selectedFilter)?.label.toLowerCase()} (${filteredMessages.length})`}
      />
    </div>
  );
}