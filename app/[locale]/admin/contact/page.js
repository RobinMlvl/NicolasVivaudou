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

      {/* Statistiques simplifiées */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{totalMessages}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{unreadMessages}</div>
            <div className="text-xs text-gray-600">Non lus</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{readMessages}</div>
            <div className="text-xs text-gray-600">Lus</div>
          </div>
        </div>
      </div>

      {/* Filtres simplifiés */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{fontFamily: 'var(--font-quicksand)'}}>
          Filtrer les messages
        </h3>
        <div className="space-y-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Actions rapides simplifiées */}
      <div className="mb-6 space-y-2">
        <button
          onClick={fetchMessages}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          🔄 Actualiser
        </button>
        <a
          href="/#contact-section"
          target="_blank"
          className="block w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-center text-sm"
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