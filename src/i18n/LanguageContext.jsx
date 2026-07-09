import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './languageContext'
import { supportedLanguages, translations } from './translations'

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'

  const saved = window.localStorage.getItem('Kinofedia-language')
  return supportedLanguages.includes(saved) ? saved : 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = 'ltr'
    document.title = translations[language].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', translations[language].meta.description)
    window.localStorage.setItem('Kinofedia-language', language)
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(current => current === 'en' ? 'nl' : 'en'),
    t: translations[language],
  }), [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
