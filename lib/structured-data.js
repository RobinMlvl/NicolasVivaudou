// Structured Data JSON-LD pour le SEO

export function getPersonStructuredData(locale = 'fr') {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nicolas Vivaudou",
    "jobTitle": locale === 'fr' ? "Photographe Professionnel" : "Professional Photographer",
    "description": locale === 'fr' 
      ? "Photographe professionnel spécialisé en portrait et photographie par drone basé à Montréal, Canada."
      : "Professional photographer specializing in portrait and drone photography based in Montreal, Canada.",
    "url": "https://nicolasvivaudou.com",
    "image": "https://nicolasvivaudou.com/nicolas-vivaudou-photo.jpg",
    "sameAs": [
      "https://instagram.com/nicolasvivaudou",
      "https://nicolasvivaudou.com"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Montréal",
      "addressRegion": "QC",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 45.5017,
      "longitude": -73.5673
    },
    "knowsAbout": [
      "Portrait Photography",
      "Drone Photography", 
      "Aerial Photography",
      "Professional Photography",
      "Creative Photography"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": locale === 'fr' ? "Photographe" : "Photographer",
      "occupationLocation": {
        "@type": "City",
        "name": "Montreal"
      }
    }
  }
}

export function getWebsiteStructuredData(locale = 'fr') {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nicolas Vivaudou Photography",
    "alternateName": "Portfolio Nicolas Vivaudou",
    "url": "https://nicolasvivaudou.com",
    "description": locale === 'fr' 
      ? "Portfolio professionnel de Nicolas Vivaudou, photographe spécialisé en portrait et photographie par drone."
      : "Professional portfolio of Nicolas Vivaudou, photographer specializing in portrait and drone photography.",
    "inLanguage": [locale === 'fr' ? "fr-CA" : "en-CA"],
    "isPartOf": {
      "@type": "WebSite",
      "url": "https://nicolasvivaudou.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nicolasvivaudou.com/portfolio?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Person",
      "name": "Nicolas Vivaudou"
    }
  }
}

export function getPhotographyServiceStructuredData(locale = 'fr') {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": locale === 'fr' ? "Services de Photographie Professionnelle" : "Professional Photography Services",
    "name": locale === 'fr' ? "Photographie Portrait & Drone" : "Portrait & Drone Photography",
    "description": locale === 'fr' 
      ? "Services de photographie professionnelle incluant portraits, photographie par drone et projets créatifs à Montréal."
      : "Professional photography services including portraits, drone photography and creative projects in Montreal.",
    "provider": {
      "@type": "Person",
      "name": "Nicolas Vivaudou",
      "url": "https://nicolasvivaudou.com"
    },
    "areaServed": {
      "@type": "City",
      "name": "Montreal",
      "containedInPlace": {
        "@type": "Province", 
        "name": "Quebec"
      }
    },
    "availableLanguage": ["French", "English"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": locale === 'fr' ? "Services Photo" : "Photo Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": locale === 'fr' ? "Photographie Portrait" : "Portrait Photography"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": locale === 'fr' ? "Photographie par Drone" : "Drone Photography"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": locale === 'fr' ? "Projets Créatifs" : "Creative Projects"
          }
        }
      ]
    }
  }
}

export function getBreadcrumbStructuredData(items, locale = 'fr') {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}