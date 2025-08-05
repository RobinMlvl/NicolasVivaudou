'use client';

import { useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations();
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
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <input
                type="text"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none pb-2 text-base"
                placeholder={t('contact.form.name')}
              />
            </div>
            
            {/* Email Field */}
            <div>
              <input
                type="email"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none pb-2 text-base"
                placeholder={t('contact.form.email')}
              />
            </div>
            
            {/* Message Field */}
            <div>
              <textarea
                rows="1"
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none pb-2 text-base resize-none overflow-hidden"
                placeholder={t('contact.form.message')}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="bg-yellow-500 text-black px-10 py-4 text-base font-semibold hover:bg-yellow-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {t('contact.form.submit')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}