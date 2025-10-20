# 🥗 Die Rezeptwelt

**Eine moderne Web-App für Rezepte mit Suche, Kategorien und Supabase-Backend.**  
(Современное веб-приложение для рецептов с поиском, категориями и Supabase-бэкендом.)

---

## 📋 Beschreibung 

**Die Rezeptwelt** ist eine Plattform, auf der Benutzer:  
(«Die Rezeptwelt» — это платформа, где пользователи могут:)

- Rezepte nach Namen, Kategorie oder Zutat suchen  
  (искать рецепты по названию, категории или ингредиенту)
- Eigene Rezepte hinzufügen (mit Bild und Zutaten)  
  (добавлять собственные рецепты с изображениями и ингредиентами)
- Rezepte nach Kategorien filtern  
  (фильтровать рецепты по категориям)
- Lieblingsrezepte speichern (Favoritenfunktion)  
  (сохранять избранные рецепты — функция «избранное»)

Die App ist vollständig responsiv und funktioniert auf Desktop, Tablet und Smartphone.  
(Приложение полностью адаптивное — работает на компьютере, планшете и телефоне.)

 Responsive-Design nutzt Breakpoints bei 1024 px und 768 px.
    (адаптив реализован для 1024 и 768 px)

---

## 🛠️ Technologien 

- ⚛️ **React + TypeScript (Vite)** – modernes Frontend-Framework  
  (современный фреймворк для фронтенда)
- 🗄️ **Supabase** – Datenbank & Authentifizierung  
  (база данных и аутентификация)
- 🎨 **Tailwind CSS / eigene Styles** – flexibles Styling-System  
  (гибкая система стилей)
- ☁️ **Deployment:** Vercel oder Netlify  
  (деплой: Vercel или Netlify)

---

## 📁 Projektstruktur (Структура проекта)

src/
│
├── assets/             → Bilder, Icons, Logos (изображения, иконки, логотипы)
│
├── components/         → Wiederverwendbare UI-Komponenten (повторно используемые UI-компоненты)
│   ├── Hero/           → Titelbild-Bereich (Hero-секция)
│   ├── Header/         → Navigation & Login/Logout (хедер и навигация)
│   ├── Footer/         → Seitenfuß mit Social Links (футер с соцсетями)
│   └── RecipeCard/     → Einzelne Rezeptkarte (карточка рецепта)
│
├── pages/              → Seiten des Projekts (страницы проекта)
│   ├── Home/           → Startseite mit Hero, Kategorien, beliebten Rezepten
│   ├── Rezepte/        → Rezeptliste mit Filter
│   ├── RezeptDetail/   → Detailansicht eines Rezepts
│   ├── UeberUns/       → Statische „Über uns“-Seite
│   └── Login/          → Authentifizierungsseite
│
├── supabase/           → Verbindung & Funktionen zur Datenbank (соединение и функции для БД Supabase)
│
├── types/              → TypeScript-Typdefinitionen (типы)
│
├── styles/             → Globale CSS-Dateien (глобальные CSS-файлы)
│
└── main.tsx            → Einstiegspunkt der App (точка входа приложения)

## 🧩 Hauptfunktionen (Основные функции)

    🔎 Suche nach Rezeptnamen oder Zutaten (поиск по названию или ингредиентам)

    🍽️ Filter nach Kategorien (фильтрация по категориям)

    🖋️ Rezepte hinzufügen & bearbeiten (добавление и редактирование рецептов)

    💾 Favoriten speichern (сохранение рецептов в избранное)

    🖼️ Upload von Rezeptbildern (загрузка изображений рецептов)

    🔐 Login via Supabase Auth (E-Mail-Link) (вход через Supabase Auth по email-ссылке)


## 👨‍💻 Autor (Автор)

Die Rezeptwelt – ein Lern- und Showcase-Projekt für moderne Webentwicklung mit React & Supabase.
(«Die Rezeptwelt» — учебный и демонстрационный проект по современной веб-разработке на React и Supabase.)

👤 Entwickler (разработчик): [Nataly Bova]
🌐 GitHub: https://github.com/NatalyBova111/M4_Projekt-Rezeptwelt

📅 Letzte Aktualisierung / Последнее обновление: Oktober 2025
