'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitType, setSubmitType] = useState(''); // 'success' ou 'error'
  
  // Gestion des changements d'input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validation côté client
  const validateForm = () => {
    if (!formData.name.trim()) {
      setSubmitMessage('Le nom est requis');
      setSubmitType('error');
      return false;
    }
    
    if (!formData.email.trim()) {
      setSubmitMessage('L\'email est requis');
      setSubmitType('error');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage('Format d\'email invalide');
      setSubmitType('error');
      return false;
    }
    
    if (!formData.message.trim()) {
      setSubmitMessage('Le message est requis');
      setSubmitType('error');
      return false;
    }
    
    if (formData.message.length < 10) {
      setSubmitMessage('Le message doit contenir au moins 10 caractères');
      setSubmitType('error');
      return false;
    }
    
    return true;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitMessage('Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.');
        setSubmitType('success');
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        setSubmitMessage(result.error || 'Erreur lors de l\'envoi du message');
        setSubmitType('error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitMessage('Erreur de connexion. Veuillez réessayer.');
      setSubmitType('error');
    } finally {
      setIsSubmitting(false);
      // Effacer le message après 5 secondes
      setTimeout(() => {
        setSubmitMessage('');
        setSubmitType('');
      }, 5000);
    }
  };
  return (
    <section id="contact-section" className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Title, Subtitle, HR, Contact Info */}
          <div className="space-y-8">
            {/* Title */}
            <h2 className="section-title text-left mb-4 text-black">
              {t('contact.title')}
            </h2>
            
            {/* Subtitle */}
            <p className="text-left text-yellow-500 text-base font-medium mb-6">
              {t('contact.subtitle')}
            </p>
            
            {/* HR Line */}
            <hr className="border-gray-300 border-t-1 w-24 mb-8" />
            
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t('contact.email')}</h3>
                <a 
                  href="mailto:contact@nicolasvivaudou.com" 
                  className="text-base text-yellow-500 hover:text-black transition-colors duration-200"
                >
                  contact@nicolasvivaudou.com
                </a>
              </div>
              
              {/* Location */}
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t('contact.location')}</h3>
                <p className="text-base text-gray-700">{t('contact.locationValue')}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message de feedback */}
            {submitMessage && (
              <div className={`p-4 rounded-lg ${
                submitType === 'success' 
                  ? 'bg-green-100 border border-green-200 text-green-800' 
                  : 'bg-red-100 border border-red-200 text-red-800'
              }`}>
                {submitMessage}
              </div>
            )}
            
            {/* Name Field */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none pb-2 text-base disabled:opacity-50"
                placeholder={t('contact.form.name')}
                required
              />
            </div>
            
            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none pb-2 text-base disabled:opacity-50"
                placeholder={t('contact.form.email')}
                required
              />
            </div>
            
            {/* Message Field */}
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                rows="1"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none pb-2 text-base resize-none overflow-hidden disabled:opacity-50"
                placeholder={t('contact.form.message')}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                required
              />
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="backdrop-blur-md rounded-full px-8 py-3 text-white font-medium hover:text-yellow-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-400"
                style={{backgroundColor: 'rgb(251, 191, 36)'}}
              >
                {isSubmitting ? 'Envoi en cours...' : t('contact.form.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}