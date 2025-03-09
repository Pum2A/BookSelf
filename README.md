# 🚀 BookSelf - Platforma Rezerwacji Usług

![BookSelf Banner](https://via.placeholder.com/1200x400) <!-- Tutaj dodaj własny banner -->

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-000000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2.1-2D3748?logo=prisma)](https://prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://vercel.com)

**Platforma łącząca klientów z usługodawcami** - rezerwuj usługi w 3 krokach lub zarządzaj swoim biznesem!

👉 Demo: [https://bookingfullstack.vercel.app/](https://bookingfullstack.vercel.app/)

## 🌟 Dlaczego BookSelf?

| 👥 Dla Klientów | 🏢 Dla Biznesów |
|----------------|-----------------|
| 📌 Natychmiastowe rezerwacje | 🛠️ Kompleksowe zarządzanie |
| 🔍 Inteligentne wyszukiwanie | 📊 Analizy w czasie rzeczywistym |
| 🔔 Personalizowane powiadomienia | 🎯 Targetowanie klientów |

## ✨ Najważniejsze Funkcje

### 👤 Panel Klienta
- 🕵️♀️ **Inteligentne Wyszukiwanie**  
  Filtruj usługi po lokalizacji, kategorii i ocenach
- 📅 **Interaktywny Kalendarz**  
  Wybierz idealny termin z widokiem dnia/tygodnia/miesiąca
- 📱 **Mobilny Dostęp**  
  Optymalizacja pod smartfony i tablety
- ⭐ **System Oceny**  
  Wystaw opinię po skorzystaniu z usługi

### 💼 Panel Biznesowy
- 🏗️ **Kreator Profilu**  
  Stwórz profesjonalną wizytówkę w 5 minut
- 🕒 **Menadżer Czasu**  
  Automatyczne blokowanie terminów po rezerwacji
- 📈 **Statystyki**  
  Śledź popularność usług i frekwencję
- 📦 **Multi-usługi**  
  Dodawaj różne pakiety i promocje

## 🛠️ Tech Stack

### Frontend
| Technologia | Opis |
|------------|------|
| <img src="https://cdn.worldvectorlogo.com/logos/next-js.svg" width="20"/> **Next.js 15** | App Router + Server Actions |
| <img src="https://cdn.worldvectorlogo.com/logos/react-2.svg" width="20"/> **React 19** | React 19 |
| <img src="https://shadcn-ui.com/logo.svg" width="20"/> **Shadcn/NextUI** | Komponenty UI |
| <img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="20"/> **Tailwind** | Stylowanie |

### Backend
| Technologia | Opis |
|------------|------|
| <img src="https://prismalens.vercel.app/header-logo.svg" width="20"/> **Prisma** | ORM dla PostgreSQL |
| <img src="https://redis.io/images/redis-white.png" width="20"/> **Redis** | Rate Limiting |
| <img src="https://next-auth.js.org/img/logo/logo-sm.png" width="20"/> **NextAuth** | Autentykacja |

### Narzędzia
| Technologia | Status |
|------------|--------|
| 📧 Nodemailer (wysłka email) | 🚧 *W trakcie implementacji* |
| 🛡️ Google reCAPTCHA | ✅ Gotowe |
| 📤 Upload plików | ✅ Gotowe |

## 🚀 Jak Zacząć?

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/twoja-nazwa/bookself.git

# 2. Zainstaluj zależności
npm install

# 3. Skonfiguruj .env
cp .env.example .env

# 4. Uruchom!
npm run dev
