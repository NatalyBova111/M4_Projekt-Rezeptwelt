# 🥗 Die Rezeptwelt

**Eine moderne Web-App für Rezepte mit Suche, Kategorien und Supabase-Backend.**  


---

## 📋 Beschreibung 

**Die Rezeptwelt** ist eine Plattform, auf der Benutzer:  

- Rezepte nach Namen, Kategorie oder Zutat suchen  
  
- Eigene Rezepte hinzufügen (mit Bild und Zutaten)  
 
- Rezepte nach Kategorien filtern  
  
- Lieblingsrezepte speichern (Favoritenfunktion)  
 

Die App ist vollständig responsiv und funktioniert auf Desktop, Tablet und Smartphone.  


 Responsive-Design nutzt Breakpoints bei 1024 px und 768 px.
   

---

## 🛠️ Technologien 

- ⚛️ **React + TypeScript (Vite)** – modernes Frontend-Framework  

- 🗄️ **Supabase** – Datenbank & Authentifizierung  
  
- 🎨 **Tailwind CSS / eigene Styles** – flexibles Styling-System  
  
- ☁️ **Deployment:** Vercel oder Netlify  


---

## 📁 Projektstruktur 

src/
│
├── assets/             → Bilder, Icons, Logos 
│
├── components/         → Wiederverwendbare UI-Komponenten 
│   ├── Hero/           → Titelbild-Bereich 
│   ├── Header/         → Navigation & Login/Logout 
│   ├── Footer/         → Seitenfuß mit Social Links 
│   └── RecipeCard/     → Einzelne Rezeptkarte 
│
├── pages/              → Seiten des Projekts 
│   ├── Home/           → Startseite mit Hero, Kategorien, beliebten Rezepten
│   ├── Rezepte/        → Rezeptliste mit Filter
│   ├── RezeptDetail/   → Detailansicht eines Rezepts
│   ├── UeberUns/       → Statische „Über uns“-Seite
│   └── Login/          → Authentifizierungsseite
│
├── supabase/           → Verbindung & Funktionen zur Datenbank 
│
├── types/              → TypeScript-Typdefinitionen 
│
├── styles/             → Globale CSS-Dateien 
│
└── main.tsx            → Einstiegspunkt der App 

## 🧩 Hauptfunktionen 

    🔎 Suche nach Rezeptnamen oder Zutaten 

    🍽️ Filter nach Kategorien 

    🖋️ Rezepte hinzufügen & bearbeiten 

    💾 Favoriten speichern 

    🖼️ Upload von Rezeptbildern 

    🔐 Login via Supabase Auth (E-Mail-Link) 


## 👨‍💻 Autor 

Die Rezeptwelt – ein Lern- und Showcase-Projekt für moderne Webentwicklung mit React & Supabase.


👤 Entwickler: [Nataly Bova]
🌐 GitHub: https://github.com/NatalyBova111/M4_Projekt-Rezeptwelt

📅 Letzte Aktualisierung  Oktober 2025
