/* =========================================================
   Mon Cahier de Budget — logique de l'application
   Toutes les données sont stockées localement (localStorage),
   sur cet appareil uniquement.
   ========================================================= */

const STORAGE_KEY = "cahierBudget_v1";
const USER_NAME = "Alice";

/* ---------------- Profils multiples ---------------- */
const PROFILES_KEY = "oseille_profiles";
const ACTIVE_PROFILE_KEY = "oseille_activeProfile";
const DEFAULT_PROFILES = [
  { id: "alice", name: "Alice" },
  { id: "lucie", name: "Lucie" },
];

function getProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
  return DEFAULT_PROFILES;
}

function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || "alice";
}

function setActiveProfileId(id) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

function storageKeyFor(profileId) {
  return profileId === "alice" ? STORAGE_KEY : `cahierBudget_v1__${profileId}`;
}

function cloneDefaultCategories() {
  return DEFAULT_CATEGORIES.map(c => ({ ...c }));
}

let activeProfileId = getActiveProfileId();

const DEFAULT_CATEGORIES = [
  { id: "salaire", name: "Salaire", type: "income", budget: 0 },
  { id: "primes", name: "Primes / Dons", type: "income", budget: 0 },
  { id: "remboursements", name: "Remboursements", type: "income", budget: 0 },
  { id: "charges", name: "Charges fixes", type: "expense", budget: 1200 },
  { id: "courses", name: "Courses", type: "expense", budget: 250 },
  { id: "restaurants", name: "Restaurants", type: "expense", budget: 50 },
  { id: "plaisirs", name: "Plaisirs / Sorties", type: "expense", budget: 100 },
  { id: "vacances", name: "Vacances", type: "expense", budget: 250 },
  { id: "vetements", name: "Vêtements", type: "expense", budget: 50 },
  { id: "sante", name: "Santé", type: "expense", budget: 40 },
  { id: "voiture", name: "Voiture / Transport", type: "expense", budget: 250 },
  { id: "owen", name: "Owen", type: "expense", budget: 10 },
  { id: "cadeaux", name: "Cadeaux", type: "expense", budget: 0 },
  { id: "amenagement", name: "Aménagement appartement", type: "expense", budget: 100 },
  { id: "epargne", name: "Épargne", type: "expense", budget: 150 },
  { id: "epargne_tf", name: "Épargne Taxe Foncière", type: "expense", budget: 125 },
];

/* Historique importé depuis Comptes_Alicette.xlsx (2024-2026), chargé une seule
   fois au tout premier lancement si aucune donnée n'existe encore. */
const SEED_TRANSACTIONS = [{"date": "2024-01-01", "amount": 2325.83, "categoryId": "salaire", "note": "Salaire reçu fin décembre"}, {"date": "2024-01-01", "amount": -728.34, "categoryId": "charges", "note": "Loyer"}, {"date": "2024-01-01", "amount": -20.0, "categoryId": "plaisirs", "note": "Expo Mutti"}, {"date": "2024-01-01", "amount": -32.0, "categoryId": "vetements", "note": "Zalando"}, {"date": "2024-01-01", "amount": -72.0, "categoryId": "restaurants", "note": "Guingette Thomas"}, {"date": "2024-01-01", "amount": -11.48, "categoryId": "courses", "note": "Carrefour Market"}, {"date": "2024-01-01", "amount": -43.2, "categoryId": "restaurants", "note": "Uber eat"}, {"date": "2024-01-01", "amount": -9.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-01-01", "amount": -29.51, "categoryId": "courses", "note": "Marché"}, {"date": "2024-01-01", "amount": -5.8, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-01-01", "amount": -3.9, "categoryId": "plaisirs", "note": "Lab de l'endo"}, {"date": "2024-01-01", "amount": -12.95, "categoryId": "courses", "note": "Marché"}, {"date": "2024-01-01", "amount": -15.03, "categoryId": "charges", "note": "AXA"}, {"date": "2024-01-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-01-01", "amount": -103.0, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-01-01", "amount": -16.12, "categoryId": "charges", "note": "Veolia"}, {"date": "2024-01-01", "amount": -75.09, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-01-01", "amount": -90.0, "categoryId": "voiture", "note": "Amende"}, {"date": "2024-01-01", "amount": -6.99, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-01-01", "amount": -5.99, "categoryId": "courses", "note": "Manoprix"}, {"date": "2024-01-01", "amount": -27.32, "categoryId": "courses", "note": "Marché"}, {"date": "2024-01-01", "amount": -10.0, "categoryId": "plaisirs", "note": "Fleurs"}, {"date": "2024-01-01", "amount": -21.5, "categoryId": "restaurants", "note": "Chinois"}, {"date": "2024-01-01", "amount": -5.99, "categoryId": "courses", "note": "Café"}, {"date": "2024-01-01", "amount": -21.5, "categoryId": "restaurants", "note": "Resto Chinois"}, {"date": "2024-01-01", "amount": -2.25, "categoryId": "charges", "note": "Assu LCL"}, {"date": "2024-01-01", "amount": -72.12, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-01-01", "amount": -10.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-01-01", "amount": -74.6, "categoryId": "vetements", "note": "Uniqlo"}, {"date": "2024-01-01", "amount": -10.09, "categoryId": "courses", "note": "Carrefour"}, {"date": "2024-01-01", "amount": -73.6, "categoryId": "amenagement", "note": "Leroy merlin"}, {"date": "2024-01-01", "amount": -32.07, "categoryId": "courses", "note": "Courses"}, {"date": "2024-01-01", "amount": -3.99, "categoryId": "courses", "note": "Action"}, {"date": "2024-01-01", "amount": -10.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-01-01", "amount": -15.68, "categoryId": "charges", "note": "LCL Appart"}, {"date": "2024-01-01", "amount": -108.63, "categoryId": "charges", "note": "EDF"}, {"date": "2024-01-01", "amount": -24.47, "categoryId": "charges", "note": "SFR"}, {"date": "2024-01-01", "amount": -1.05, "categoryId": "charges", "note": "LCL Appart - BNP"}, {"date": "2024-01-01", "amount": -7.8, "categoryId": "plaisirs", "note": "Ciné"}, {"date": "2024-01-01", "amount": -6.5, "categoryId": "plaisirs", "note": "Ciné"}, {"date": "2024-01-01", "amount": -12.0, "categoryId": "courses", "note": "Avocat"}, {"date": "2024-01-01", "amount": -4.7, "categoryId": "courses", "note": "Gauffre"}, {"date": "2024-01-01", "amount": -17.0, "categoryId": "plaisirs", "note": "Soirée Camp rock"}, {"date": "2024-01-01", "amount": -77.12, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-01-01", "amount": -4.2, "categoryId": "charges", "note": "LCL"}, {"date": "2024-01-01", "amount": -24.88, "categoryId": "plaisirs", "note": "Vinyle GCM"}, {"date": "2024-01-01", "amount": -96.3, "categoryId": "courses", "note": "Courses"}, {"date": "2024-01-01", "amount": -3.2, "categoryId": "restaurants", "note": "resto Nantes"}, {"date": "2024-02-01", "amount": 2293.62, "categoryId": "salaire", "note": "Docaposte reçu fin janvier"}, {"date": "2024-02-01", "amount": -502.3, "categoryId": "charges", "note": "Loyer"}, {"date": "2024-02-01", "amount": -26.0, "categoryId": "charges", "note": "Red by SFR"}, {"date": "2024-02-01", "amount": -100.0, "categoryId": "vacances", "note": "Cours de ski"}, {"date": "2024-02-01", "amount": -103.0, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-02-01", "amount": -16.12, "categoryId": "charges", "note": "Veolia"}, {"date": "2024-02-01", "amount": -4.5, "categoryId": "vacances", "note": "Vin chaud"}, {"date": "2024-02-01", "amount": -35.8, "categoryId": "vacances", "note": "Apéro ski"}, {"date": "2024-02-01", "amount": -80.22, "categoryId": "vacances", "note": "ski"}, {"date": "2024-02-01", "amount": -11.8, "categoryId": "courses", "note": "Boutique Bastille"}, {"date": "2024-02-01", "amount": -12.0, "categoryId": "vetements", "note": "Calzedonia"}, {"date": "2024-02-01", "amount": -5.0, "categoryId": "voiture", "note": "Métro"}, {"date": "2024-02-01", "amount": -11.96, "categoryId": "courses", "note": "Bastille"}, {"date": "2024-02-01", "amount": -58.2, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2024-02-01", "amount": -33.98, "categoryId": "courses", "note": "Marché"}, {"date": "2024-02-01", "amount": -7.97, "categoryId": "courses", "note": "Stokomani"}, {"date": "2024-02-01", "amount": -12.0, "categoryId": "voiture", "note": "Lavage voiture"}, {"date": "2024-02-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-02-01", "amount": -54.99, "categoryId": "owen", "note": "Owen sac à dos"}, {"date": "2024-02-01", "amount": -2.25, "categoryId": "charges", "note": "Assu LCL"}, {"date": "2024-02-01", "amount": -26.03, "categoryId": "sante", "note": "RDV Dentiste"}, {"date": "2024-02-01", "amount": -15.68, "categoryId": "charges", "note": "Prêt"}, {"date": "2024-02-01", "amount": -13.1, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-02-01", "amount": -28.0, "categoryId": "plaisirs", "note": "Fleuriste"}, {"date": "2024-02-01", "amount": -10.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-02-01", "amount": -76.02, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-02-01", "amount": -3.0, "categoryId": "plaisirs", "note": "Photomaton"}, {"date": "2024-02-01", "amount": -22.4, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-02-01", "amount": -108.63, "categoryId": "charges", "note": "EDF"}, {"date": "2024-02-01", "amount": -15.0, "categoryId": "cadeaux", "note": "Cadeau Clara"}, {"date": "2024-02-01", "amount": -16.8, "categoryId": "voiture", "note": "Parking soirée Camp Rock"}, {"date": "2024-02-01", "amount": -5.0, "categoryId": "plaisirs", "note": "Vestiaire"}, {"date": "2024-02-01", "amount": -24.47, "categoryId": "charges", "note": "SFR"}, {"date": "2024-02-01", "amount": -21.45, "categoryId": "courses", "note": "Fouirefouille"}, {"date": "2024-02-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-02-01", "amount": -80.15, "categoryId": "courses", "note": "Courses"}, {"date": "2024-02-01", "amount": -81.8, "categoryId": "owen", "note": "Croquettes + Pâté Owen"}, {"date": "2024-02-01", "amount": -60.91, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-02-01", "amount": -4.2, "categoryId": "charges", "note": "Cotisation mensuelle CB"}, {"date": "2024-02-01", "amount": -6.0, "categoryId": "courses", "note": "Frittes Robby"}, {"date": "2024-02-01", "amount": -14.6, "categoryId": "voiture", "note": "Parking soirée Robby"}, {"date": "2024-02-01", "amount": -5.0, "categoryId": "voiture", "note": "Parking Expo Paris"}, {"date": "2024-02-01", "amount": -39.95, "categoryId": "plaisirs", "note": "Ears loop"}, {"date": "2024-02-01", "amount": -68.9, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2024-02-01", "amount": -153.22, "categoryId": "courses", "note": "Courses"}, {"date": "2024-02-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-02-01", "amount": -3.59, "categoryId": "charges", "note": "AXA"}, {"date": "2024-03-01", "amount": 2293.62, "categoryId": "salaire", "note": "Docaposte reçu fin février"}, {"date": "2024-03-01", "amount": -10.4, "categoryId": "cadeaux", "note": "Mieux que des fleurs"}, {"date": "2024-03-01", "amount": -68.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-03-01", "amount": -25.99, "categoryId": "charges", "note": "RED"}, {"date": "2024-03-01", "amount": -19.7, "categoryId": "plaisirs", "note": "ciné"}, {"date": "2024-03-01", "amount": -123.8, "categoryId": "amenagement", "note": "IKEA"}, {"date": "2024-03-01", "amount": -41.0, "categoryId": "plaisirs", "note": "Coiffeur"}, {"date": "2024-03-01", "amount": -22.08, "categoryId": "courses", "note": "Marché"}, {"date": "2024-03-01", "amount": -6.41, "categoryId": "courses", "note": "Courses"}, {"date": "2024-03-01", "amount": -101.0, "categoryId": "charges", "note": "matmut"}, {"date": "2024-03-01", "amount": -15.03, "categoryId": "charges", "note": "AXA"}, {"date": "2024-03-01", "amount": -3.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-03-01", "amount": -1.7, "categoryId": "voiture", "note": "Café"}, {"date": "2024-03-01", "amount": -10.0, "categoryId": "plaisirs", "note": "Cocktail"}, {"date": "2024-03-01", "amount": -0.5, "categoryId": "voiture", "note": "Parking"}, {"date": "2024-03-01", "amount": -3.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-03-01", "amount": -40.66, "categoryId": "restaurants", "note": "Uber eat"}, {"date": "2024-03-01", "amount": -81.59, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-03-01", "amount": -12.0, "categoryId": "courses", "note": "Marché"}, {"date": "2024-03-01", "amount": -7.9, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-03-01", "amount": -2.25, "categoryId": "charges", "note": "Assu LCL"}, {"date": "2024-03-01", "amount": -142.99, "categoryId": "amenagement", "note": "IKEA"}, {"date": "2024-03-01", "amount": -103.85, "categoryId": "amenagement", "note": "IKEA"}, {"date": "2024-03-01", "amount": -12.5, "categoryId": "plaisirs", "note": "Miam concert"}, {"date": "2024-03-01", "amount": -5.0, "categoryId": "voiture", "note": "Parking concert"}, {"date": "2024-03-01", "amount": -658.8, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2024-03-01", "amount": -15.68, "categoryId": "charges", "note": "Assu Prêt Immo"}, {"date": "2024-03-01", "amount": -7.17, "categoryId": "courses", "note": "Courses"}, {"date": "2024-03-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2024-03-01", "amount": -5.42, "categoryId": "courses", "note": "Courses"}, {"date": "2024-03-01", "amount": -25.0, "categoryId": "plaisirs", "note": "Vinyle Zaho"}, {"date": "2024-03-01", "amount": -10.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-03-01", "amount": -20.0, "categoryId": "restaurants", "note": "Miam pizza"}, {"date": "2024-03-01", "amount": -41.12, "categoryId": "amenagement", "note": "La foire fouille"}, {"date": "2024-03-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-03-01", "amount": -28.13, "categoryId": "restaurants", "note": "Resto"}, {"date": "2024-03-01", "amount": -8.17, "categoryId": "courses", "note": "Gouter"}, {"date": "2024-03-01", "amount": -76.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-03-01", "amount": -5.9, "categoryId": "owen", "note": "Owen Caats"}, {"date": "2024-03-01", "amount": -20.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-03-01", "amount": -8.6, "categoryId": "voiture", "note": "RATP"}, {"date": "2024-03-01", "amount": -27.0, "categoryId": "plaisirs", "note": "T7"}, {"date": "2024-03-01", "amount": -39.0, "categoryId": "voiture", "note": "Stationnement Paris"}, {"date": "2024-03-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Lydia"}, {"date": "2024-03-01", "amount": -15.9, "categoryId": "restaurants", "note": "Mc donald"}, {"date": "2024-03-01", "amount": -128.97, "categoryId": "voiture", "note": "Speedy"}, {"date": "2024-03-01", "amount": -62.05, "categoryId": "courses", "note": "Courses"}, {"date": "2024-03-01", "amount": -23.5, "categoryId": "restaurants", "note": "Jap"}, {"date": "2024-03-01", "amount": -80.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-03-01", "amount": -1.96, "categoryId": "voiture", "note": "Parking Hopital"}, {"date": "2024-03-01", "amount": -3.0, "categoryId": "voiture", "note": "Parking Hopital"}, {"date": "2024-03-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2024-03-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-03-01", "amount": -19.8, "categoryId": "restaurants", "note": "L'adresse"}, {"date": "2024-04-01", "amount": 2293.62, "categoryId": "salaire", "note": "Docaposte reçu fin mars"}, {"date": "2024-04-01", "amount": -116.2, "categoryId": "courses", "note": "Courses"}, {"date": "2024-04-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-04-01", "amount": -40.45, "categoryId": "plaisirs", "note": "Concert Zaho"}, {"date": "2024-04-01", "amount": -30.0, "categoryId": "cadeaux", "note": "Cadeau Cyril"}, {"date": "2024-04-01", "amount": -16.1, "categoryId": "courses", "note": "Marché"}, {"date": "2024-04-01", "amount": -116.2, "categoryId": "courses", "note": "Auchan"}, {"date": "2024-04-01", "amount": -40.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-04-01", "amount": -8.95, "categoryId": "charges", "note": "EDF"}, {"date": "2024-04-01", "amount": -140.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-04-01", "amount": -17.45, "categoryId": "charges", "note": "AXA"}, {"date": "2024-04-01", "amount": -101.0, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-04-01", "amount": -185.88, "categoryId": "vetements", "note": "Zalando"}, {"date": "2024-04-01", "amount": -14.0, "categoryId": "sante", "note": "RDV Gasto"}, {"date": "2024-04-01", "amount": -14.9, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-04-01", "amount": -35.95, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-04-01", "amount": -50.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-04-01", "amount": -13.5, "categoryId": "courses", "note": "Miam concert"}, {"date": "2024-04-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-04-01", "amount": -14.3, "categoryId": "plaisirs", "note": "Ciné"}, {"date": "2024-04-01", "amount": -4.0, "categoryId": "restaurants", "note": "Resto"}, {"date": "2024-04-01", "amount": -4.0, "categoryId": "courses", "note": "Coca"}, {"date": "2024-04-01", "amount": -30.7, "categoryId": "voiture", "note": "Parking"}, {"date": "2024-04-01", "amount": -5.0, "categoryId": "plaisirs", "note": "FDJ"}, {"date": "2024-04-01", "amount": -72.32, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-04-01", "amount": -17.47, "categoryId": "courses", "note": "Courses"}, {"date": "2024-04-01", "amount": -47.0, "categoryId": "restaurants", "note": "Restaurant"}, {"date": "2024-04-01", "amount": -16.3, "categoryId": "plaisirs", "note": "Ciné"}, {"date": "2024-04-01", "amount": -5.95, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-04-01", "amount": -10.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-04-01", "amount": -14.86, "categoryId": "courses", "note": "Courses"}, {"date": "2024-04-01", "amount": -15.68, "categoryId": "charges", "note": "Assu Prêt Immo"}, {"date": "2024-04-01", "amount": -5.5, "categoryId": "sante", "note": "Piscine"}, {"date": "2024-04-01", "amount": -22.1, "categoryId": "restaurants", "note": "Resto"}, {"date": "2024-04-01", "amount": -9.0, "categoryId": "amenagement", "note": "Livraison Table Jardin"}, {"date": "2024-04-01", "amount": -18.0, "categoryId": "courses", "note": "Marché"}, {"date": "2024-04-01", "amount": -21.92, "categoryId": "courses", "note": "Traiteur"}, {"date": "2024-04-01", "amount": -27.5, "categoryId": "plaisirs", "note": "Sortie concert"}, {"date": "2024-04-01", "amount": -81.79, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-04-01", "amount": -24.81, "categoryId": "cadeaux", "note": "Mieux que des fleurs Auriane"}, {"date": "2024-04-01", "amount": -8.5, "categoryId": "vetements", "note": "Chaussettes"}, {"date": "2024-04-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage piscine"}, {"date": "2024-04-01", "amount": -4.2, "categoryId": "charges", "note": "LCL"}, {"date": "2024-04-01", "amount": -23.55, "categoryId": "courses", "note": "Auchan Drive"}, {"date": "2024-04-01", "amount": -20.18, "categoryId": "courses", "note": "Courses"}, {"date": "2024-04-01", "amount": -85.0, "categoryId": "cadeaux", "note": "Kdo Paps"}, {"date": "2024-04-01", "amount": -23.0, "categoryId": "cadeaux", "note": "Kdo Lucette"}, {"date": "2024-04-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2024-04-01", "amount": -8.0, "categoryId": "cadeaux", "note": "muguet"}, {"date": "2024-04-01", "amount": -6.0, "categoryId": "sante", "note": "Péage piscine"}, {"date": "2024-04-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-04-01", "amount": 2000.0, "categoryId": "primes", "note": "Prime annuelle variable"}, {"date": "2024-04-01", "amount": -2000.0, "categoryId": "epargne", "note": "Prime annuelle variable"}, {"date": "2024-05-01", "amount": 2273.96, "categoryId": "salaire", "note": "Docaposte reçu fin avril"}, {"date": "2024-05-01", "amount": -72.0, "categoryId": "plaisirs", "note": "Massage"}, {"date": "2024-05-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2024-05-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2024-05-01", "amount": -68.0, "categoryId": "vetements", "note": "Darjeling"}, {"date": "2024-05-01", "amount": -20.0, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2024-05-01", "amount": -99.3, "categoryId": "owen", "note": "Vétérinaire"}, {"date": "2024-05-01", "amount": -6.0, "categoryId": "courses", "note": "Marché"}, {"date": "2024-05-01", "amount": -140.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-05-01", "amount": -18.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-05-01", "amount": -5.0, "categoryId": "sante", "note": "Radio"}, {"date": "2024-05-01", "amount": -31.0, "categoryId": "cadeaux", "note": "Kdo Lucie"}, {"date": "2024-05-01", "amount": -17.45, "categoryId": "charges", "note": "AXA"}, {"date": "2024-05-01", "amount": -102.82, "categoryId": "courses", "note": "auchan"}, {"date": "2024-05-01", "amount": -14.9, "categoryId": "charges", "note": "BNP Paribas"}, {"date": "2024-05-01", "amount": -53.94, "categoryId": "courses", "note": "Foire Fouille"}, {"date": "2024-05-01", "amount": -101.0, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-05-01", "amount": -10.9, "categoryId": "sante", "note": "Aquasport"}, {"date": "2024-05-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-05-01", "amount": -19.33, "categoryId": "courses", "note": "Picard"}, {"date": "2024-05-01", "amount": -76.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-05-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-05-01", "amount": -10.25, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-05-01", "amount": -15.8, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-05-01", "amount": -8.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-05-01", "amount": -16.5, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2024-05-01", "amount": -15.73, "categoryId": "amenagement", "note": "Stokomani"}, {"date": "2024-05-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-05-01", "amount": -42.0, "categoryId": "amenagement", "note": "Leroy merlin"}, {"date": "2024-05-01", "amount": -16.5, "categoryId": "amenagement", "note": "Leroy merlin"}, {"date": "2024-05-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-05-01", "amount": -5.45, "categoryId": "sante", "note": "Piscine"}, {"date": "2024-05-01", "amount": -29.8, "categoryId": "amenagement", "note": "Leroy merlin"}, {"date": "2024-05-01", "amount": -41.31, "categoryId": "courses", "note": "Marché"}, {"date": "2024-05-01", "amount": -29.09, "categoryId": "restaurants", "note": "Mc do"}, {"date": "2024-05-01", "amount": -40.0, "categoryId": "voiture", "note": "SNCF"}, {"date": "2024-05-01", "amount": -50.0, "categoryId": "voiture", "note": "SNCF Amende"}, {"date": "2024-05-01", "amount": -15.68, "categoryId": "charges", "note": "Près"}, {"date": "2024-05-01", "amount": -10.55, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-05-01", "amount": -30.0, "categoryId": "courses", "note": "sodexo"}, {"date": "2024-05-01", "amount": -30.0, "categoryId": "voiture", "note": "SNCF"}, {"date": "2024-05-01", "amount": -28.7, "categoryId": "restaurants", "note": "Mc Do"}, {"date": "2024-05-01", "amount": -32.1, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2024-05-01", "amount": -31.37, "categoryId": "courses", "note": "Marché"}, {"date": "2024-05-01", "amount": -37.9, "categoryId": "plaisirs", "note": "Livre"}, {"date": "2024-05-01", "amount": -6.55, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-05-01", "amount": -3.65, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-05-01", "amount": -1.88, "categoryId": "courses", "note": "Courses"}, {"date": "2024-05-01", "amount": -16.1, "categoryId": "courses", "note": "Action"}, {"date": "2024-05-01", "amount": -12.9, "categoryId": "voiture", "note": "SNCF"}, {"date": "2024-05-01", "amount": -7.0, "categoryId": "courses", "note": "Starbucks"}, {"date": "2024-05-01", "amount": -50.84, "categoryId": "vetements", "note": "Zalando"}, {"date": "2024-05-01", "amount": -8.5, "categoryId": "courses", "note": "Cockies"}, {"date": "2024-05-01", "amount": -2.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-05-01", "amount": -3.0, "categoryId": "courses", "note": "Gauffre st lazare"}, {"date": "2024-05-01", "amount": -44.0, "categoryId": "courses", "note": "Marché"}, {"date": "2024-05-01", "amount": -215.68, "categoryId": "courses", "note": "Courses"}, {"date": "2024-05-01", "amount": -24.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-05-01", "amount": -3.14, "categoryId": "courses", "note": "Courses"}, {"date": "2024-05-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2024-05-01", "amount": -4.2, "categoryId": "charges", "note": "LCL"}, {"date": "2024-05-01", "amount": -10.0, "categoryId": "voiture", "note": "SNCF"}, {"date": "2024-05-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-05-01", "amount": 227.0, "categoryId": "cadeaux", "note": "Cagnotte copain Anniversaire"}, {"date": "2024-05-01", "amount": 1000.0, "categoryId": "primes", "note": "Cadeau Parents"}, {"date": "2024-05-01", "amount": -1000.0, "categoryId": "epargne", "note": "Cadeau Parents"}, {"date": "2024-06-01", "amount": 2413.45, "categoryId": "salaire", "note": "Docaposte reçu fin mai"}, {"date": "2024-06-01", "amount": -20.0, "categoryId": "voiture", "note": "SNCF"}, {"date": "2024-06-01", "amount": -50.0, "categoryId": "cadeaux", "note": "Cadeau Minous"}, {"date": "2024-06-01", "amount": -10.9, "categoryId": "sante", "note": "Piscine"}, {"date": "2024-06-01", "amount": -7.0, "categoryId": "courses", "note": "Starbucks"}, {"date": "2024-06-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-06-01", "amount": -26.0, "categoryId": "charges", "note": "SFR"}, {"date": "2024-06-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-06-01", "amount": -15.95, "categoryId": "courses", "note": "Courses"}, {"date": "2024-06-01", "amount": -17.6, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-06-01", "amount": -140.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-06-01", "amount": -3.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-06-01", "amount": -21.2, "categoryId": "restaurants", "note": "L'adresse ivry"}, {"date": "2024-06-01", "amount": -17.45, "categoryId": "charges", "note": "AXA"}, {"date": "2024-06-01", "amount": -86.4, "categoryId": "voiture", "note": "Navigo"}, {"date": "2024-06-01", "amount": -3.39, "categoryId": "plaisirs", "note": "Hema carnet"}, {"date": "2024-06-01", "amount": -101.0, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-06-01", "amount": -26.83, "categoryId": "plaisirs", "note": "Bar Paris"}, {"date": "2024-06-01", "amount": -7.0, "categoryId": "plaisirs", "note": "FDJ"}, {"date": "2024-06-01", "amount": -10.9, "categoryId": "sante", "note": "Piscine"}, {"date": "2024-06-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-06-01", "amount": -72.82, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-06-01", "amount": -74.99, "categoryId": "amenagement", "note": "IKEA"}, {"date": "2024-06-01", "amount": -14.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-06-01", "amount": -3.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-06-01", "amount": -145.3, "categoryId": "vetements", "note": "Zalando"}, {"date": "2024-06-01", "amount": -40.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-06-01", "amount": -38.0, "categoryId": "cadeaux", "note": "Fleurs fête des mère"}, {"date": "2024-06-01", "amount": -11.22, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-06-01", "amount": -10.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-06-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Fleurs fête des père"}, {"date": "2024-06-01", "amount": -10.6, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-06-01", "amount": -14.5, "categoryId": "restaurants", "note": "Mc do"}, {"date": "2024-06-01", "amount": -7.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-06-01", "amount": -21.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-06-01", "amount": -9.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-06-01", "amount": -28.33, "categoryId": "restaurants", "note": "Soprano"}, {"date": "2024-06-01", "amount": -6.5, "categoryId": "courses", "note": "Cinéma"}, {"date": "2024-06-01", "amount": -15.68, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-06-01", "amount": -4.5, "categoryId": "amenagement", "note": "Ampoule four"}, {"date": "2024-06-01", "amount": -6.9, "categoryId": "amenagement", "note": "Range couvert"}, {"date": "2024-06-01", "amount": -10.6, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-06-01", "amount": 0.0, "categoryId": "sante", "note": "RDV Gyneco"}, {"date": "2024-06-01", "amount": -13.9, "categoryId": "courses", "note": "Bagel"}, {"date": "2024-06-01", "amount": -59.95, "categoryId": "vetements", "note": "Zalando"}, {"date": "2024-06-01", "amount": -23.12, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-06-01", "amount": -11.17, "categoryId": "courses", "note": "Monop"}, {"date": "2024-06-01", "amount": -26.8, "categoryId": "courses", "note": "Crèpe Lyon"}, {"date": "2024-06-01", "amount": -2.58, "categoryId": "sante", "note": "Envoi echantillon"}, {"date": "2024-06-01", "amount": -2.5, "categoryId": "sante", "note": "Bonnet piscine"}, {"date": "2024-06-01", "amount": -5.0, "categoryId": "courses", "note": "Comptoire de mathilde"}, {"date": "2024-06-01", "amount": -11.0, "categoryId": "sante", "note": "Piscine"}, {"date": "2024-06-01", "amount": -34.4, "categoryId": "cadeaux", "note": "Plante Lyon"}, {"date": "2024-06-01", "amount": -6.9, "categoryId": "voiture", "note": "TCL Métro Lyon"}, {"date": "2024-06-01", "amount": -20.0, "categoryId": "plaisirs", "note": "Bougie de charoux"}, {"date": "2024-06-01", "amount": -4.2, "categoryId": "charges", "note": "LCL"}, {"date": "2024-06-01", "amount": -19.39, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-06-01", "amount": -12.9, "categoryId": "courses", "note": "Miam air autoroute"}, {"date": "2024-06-01", "amount": -22.0, "categoryId": "restaurants", "note": "miam la défense"}, {"date": "2024-06-01", "amount": -33.0, "categoryId": "restaurants", "note": "Date Igor sushis"}, {"date": "2024-06-01", "amount": -9.6, "categoryId": "restaurants", "note": "Date Igor glace"}, {"date": "2024-06-01", "amount": -21.5, "categoryId": "plaisirs", "note": "Fleurs"}, {"date": "2024-06-01", "amount": -51.6, "categoryId": "restaurants", "note": "Jap avec Lucie"}, {"date": "2024-06-01", "amount": -10.9, "categoryId": "sante", "note": "Piscine"}, {"date": "2024-06-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2024-06-01", "amount": -11.0, "categoryId": "plaisirs", "note": "Bol Vinted Eloise Dubois"}, {"date": "2024-06-01", "amount": -4.99, "categoryId": "amenagement", "note": "Pot truffaut"}, {"date": "2024-06-01", "amount": 42.56, "categoryId": "courses", "note": "Marché"}, {"date": "2024-06-01", "amount": -3.96, "categoryId": "courses", "note": "Pâté"}, {"date": "2024-06-01", "amount": -7.15, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-06-01", "amount": -22.51, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-06-01", "amount": -2.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-06-01", "amount": -8.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-06-01", "amount": -5.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-06-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-07-01", "amount": 2413.4, "categoryId": "salaire", "note": "Docaposte reçu fin juin"}, {"date": "2024-07-01", "amount": 608.1, "categoryId": "primes", "note": "Prime de transport + Prime de vacances"}, {"date": "2024-07-01", "amount": -86.4, "categoryId": "voiture", "note": "Navigo payé en juin pour juillet"}, {"date": "2024-07-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Cadeau Zélia"}, {"date": "2024-07-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-07-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-07-01", "amount": -140.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-07-01", "amount": -649.0, "categoryId": "plaisirs", "note": "Achat téléphone Pixel 8"}, {"date": "2024-07-01", "amount": -17.98, "categoryId": "plaisirs", "note": "Coque téléphone Pixel 8"}, {"date": "2024-07-01", "amount": -6.95, "categoryId": "plaisirs", "note": "Verres trempés pixel 8"}, {"date": "2024-07-01", "amount": -101.0, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-07-01", "amount": -17.5, "categoryId": "charges", "note": "AXA"}, {"date": "2024-07-01", "amount": -13.9, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-07-01", "amount": -49.35, "categoryId": "sante", "note": "Piscine carte 10 places"}, {"date": "2024-07-01", "amount": -29.65, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-07-01", "amount": -21.8, "categoryId": "courses", "note": "Marché"}, {"date": "2024-07-01", "amount": -8.0, "categoryId": "voiture", "note": "Parking"}, {"date": "2024-07-01", "amount": -16.0, "categoryId": "plaisirs", "note": "Date Maxence Bar"}, {"date": "2024-07-01", "amount": -20.35, "categoryId": "plaisirs", "note": "Date Maxence Resto Thai"}, {"date": "2024-07-01", "amount": -5.3, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-07-01", "amount": -34.9, "categoryId": "restaurants", "note": "Pizza avec Lucette"}, {"date": "2024-07-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-07-01", "amount": -1.4, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-07-01", "amount": -4.0, "categoryId": "restaurants", "note": "Gauffre st lazare"}, {"date": "2024-07-01", "amount": -10.87, "categoryId": "plaisirs", "note": "Hema"}, {"date": "2024-07-01", "amount": -58.0, "categoryId": "plaisirs", "note": "Date Maxence Thomas Angelvy"}, {"date": "2024-07-01", "amount": 275.0, "categoryId": "remboursements", "note": "Remboursement Franchise accident 10/2023"}, {"date": "2024-07-01", "amount": -20.0, "categoryId": "charges", "note": "Red by SFR - Forfait téléphone"}, {"date": "2024-07-01", "amount": -48.8, "categoryId": "owen", "note": "Croquettes"}, {"date": "2024-07-01", "amount": -19.0, "categoryId": "sante", "note": "Lunette piscine Decathlon"}, {"date": "2024-07-01", "amount": -51.13, "categoryId": "courses", "note": "Auchan moi"}, {"date": "2024-07-01", "amount": -9.13, "categoryId": "courses", "note": "Action"}, {"date": "2024-07-01", "amount": -10.95, "categoryId": "courses", "note": "Addopt"}, {"date": "2024-07-01", "amount": -76.46, "categoryId": "courses", "note": "Auchan"}, {"date": "2024-07-01", "amount": -3.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-07-01", "amount": -21.5, "categoryId": "restaurants", "note": "Japonais"}, {"date": "2024-07-01", "amount": -11.01, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-07-01", "amount": -2.0, "categoryId": "voiture", "note": "Parking"}, {"date": "2024-07-01", "amount": -10.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-07-01", "amount": -27.9, "categoryId": "cadeaux", "note": "Rituals Victor"}, {"date": "2024-07-01", "amount": -2.9, "categoryId": "restaurants", "note": "Chouquettes Ivry"}, {"date": "2024-07-01", "amount": -3.0, "categoryId": "restaurants", "note": "Gauffre st lazare"}, {"date": "2024-07-01", "amount": -15.68, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-07-01", "amount": -78.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-07-01", "amount": 35.49, "categoryId": "courses", "note": "Marché"}, {"date": "2024-07-01", "amount": -18.0, "categoryId": "cadeaux", "note": "Moulin paps"}, {"date": "2024-07-01", "amount": -10.0, "categoryId": "amenagement", "note": "Tabouret bois terasse"}, {"date": "2024-07-01", "amount": -95.2, "categoryId": "amenagement", "note": "Parasol avec Argent Mutti"}, {"date": "2024-07-01", "amount": -44.5, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-07-01", "amount": -4.2, "categoryId": "charges", "note": "LCL"}, {"date": "2024-07-01", "amount": -100.0, "categoryId": "amenagement", "note": "Argent de poche mutti dans TV"}, {"date": "2024-07-01", "amount": 200.0, "categoryId": "primes", "note": "Carte cadeau concours Docaposte"}, {"date": "2024-07-01", "amount": -200.0, "categoryId": "amenagement", "note": "Carte cadeau concours Docaposte dans TV"}, {"date": "2024-07-01", "amount": -199.0, "categoryId": "amenagement", "note": "Achat télé 199 de la cagnotte copains"}, {"date": "2024-07-01", "amount": -15.14, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-07-01", "amount": -26.61, "categoryId": "courses", "note": "Marché"}, {"date": "2024-07-01", "amount": -4.9, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-07-01", "amount": -79.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-07-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-07-01", "amount": -4.4, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-07-01", "amount": -6.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-07-01", "amount": -11.99, "categoryId": "amenagement", "note": "Guirlande Amazon"}, {"date": "2024-07-01", "amount": -25.99, "categoryId": "charges", "note": "SFR BOX"}, {"date": "2024-07-01", "amount": -3.0, "categoryId": "plaisirs", "note": "Pinces Kiabi"}, {"date": "2024-07-01", "amount": -200.0, "categoryId": "epargne", "note": "Reste du fin de mois de Juillet"}, {"date": "2024-07-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-08-01", "amount": 2478.31, "categoryId": "salaire", "note": "Salaire fin juillet dont 57,89 de frais transport"}, {"date": "2024-08-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-08-01", "amount": -12.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-08-01", "amount": -10.5, "categoryId": "plaisirs", "note": "Mac Do"}, {"date": "2024-08-01", "amount": -80.5, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-08-01", "amount": -7.5, "categoryId": "vetements", "note": "T-Shirt Visionnaire (frais restants après remboursement)"}, {"date": "2024-08-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-08-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-08-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-08-01", "amount": -6.0, "categoryId": "plaisirs", "note": "Fleurs marché"}, {"date": "2024-08-01", "amount": -20.0, "categoryId": "charges", "note": "Red by SFR - Forfait téléphone"}, {"date": "2024-08-01", "amount": -40.68, "categoryId": "courses", "note": "Marché"}, {"date": "2024-08-01", "amount": -140.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-08-01", "amount": -5.0, "categoryId": "sante", "note": "Piscine"}, {"date": "2024-08-01", "amount": -29.09, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-08-01", "amount": -3.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-08-01", "amount": -10.0, "categoryId": "plaisirs", "note": "Churros Lille JO"}, {"date": "2024-08-01", "amount": -24.3, "categoryId": "plaisirs", "note": "Goûter Lille JO"}, {"date": "2024-08-01", "amount": -23.0, "categoryId": "plaisirs", "note": "Miam Lille JO"}, {"date": "2024-08-01", "amount": -3.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2024-08-01", "amount": -51.6, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-08-01", "amount": 17.5, "categoryId": "charges", "note": "AXA"}, {"date": "2024-08-01", "amount": -19.8, "categoryId": "courses", "note": "Marché"}, {"date": "2024-08-01", "amount": -77.9, "categoryId": "plaisirs", "note": "Hema Lille"}, {"date": "2024-08-01", "amount": -15.6, "categoryId": "amenagement", "note": "Toto pour housses parasols"}, {"date": "2024-08-01", "amount": -21.23, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-08-01", "amount": -8.5, "categoryId": "restaurants", "note": "Sandwich"}, {"date": "2024-08-01", "amount": -44.0, "categoryId": "plaisirs", "note": "Coiffeur"}, {"date": "2024-08-01", "amount": -1030.2, "categoryId": "charges", "note": "Charges S2 et S3 2024"}, {"date": "2024-08-01", "amount": -37.79, "categoryId": "courses", "note": "Marché"}, {"date": "2024-08-01", "amount": -35.9, "categoryId": "courses", "note": "La divette (avance cloppe Justine)"}, {"date": "2024-08-01", "amount": -15.43, "categoryId": "courses", "note": "Chocolat volés"}, {"date": "2024-08-01", "amount": -72.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-08-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-08-01", "amount": -22.0, "categoryId": "cadeaux", "note": "149,95 Cadeau Pauline (22e remb par personne)"}, {"date": "2024-08-01", "amount": -10.0, "categoryId": "plaisirs", "note": "Timbre vasque LP"}, {"date": "2024-08-01", "amount": -46.5, "categoryId": "vetements", "note": "T-Shirt Visionnaire"}, {"date": "2024-08-01", "amount": -193.54, "categoryId": "plaisirs", "note": "Commande Cheerz"}, {"date": "2024-08-01", "amount": -10.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-08-01", "amount": -15.68, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-08-01", "amount": -8.27, "categoryId": "plaisirs", "note": "Truffaut pigeons"}, {"date": "2024-08-01", "amount": 150.0, "categoryId": "epargne", "note": "Pris sur Livret A"}, {"date": "2024-08-01", "amount": -15.0, "categoryId": "vetements", "note": "Short nike"}, {"date": "2024-08-01", "amount": -84.3, "categoryId": "cadeaux", "note": "City Rock Mutti"}, {"date": "2024-08-01", "amount": -17.8, "categoryId": "courses", "note": "Marché"}, {"date": "2024-08-01", "amount": -4.99, "categoryId": "vetements", "note": "Frais de port renvoi t-shirt visionnaire"}, {"date": "2024-08-01", "amount": -37.87, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-08-01", "amount": 300.0, "categoryId": "epargne", "note": "Pris sur Livret A"}, {"date": "2024-08-01", "amount": -16.92, "categoryId": "courses", "note": "Lidl"}, {"date": "2024-08-01", "amount": -16.97, "categoryId": "cadeaux", "note": "Plante Maxence"}, {"date": "2024-08-01", "amount": -379.49, "categoryId": "voiture", "note": "Speedy batterie vidange et entretien"}, {"date": "2024-08-01", "amount": -10.77, "categoryId": "plaisirs", "note": "Bureau vallée"}, {"date": "2024-08-01", "amount": -60.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-08-01", "amount": -15.48, "categoryId": "cadeaux", "note": "Timbres"}, {"date": "2024-08-01", "amount": -20.6, "categoryId": "vacances", "note": "Péages"}, {"date": "2024-08-01", "amount": -45.5, "categoryId": "vacances", "note": "Gavotte"}, {"date": "2024-08-01", "amount": -20.0, "categoryId": "vacances", "note": "Crêpes Perros Girec"}, {"date": "2024-08-01", "amount": 200.0, "categoryId": "epargne", "note": "Pris sur Livret A"}, {"date": "2024-08-01", "amount": 350.0, "categoryId": "epargne", "note": "Pris sur Livret A"}, {"date": "2024-08-01", "amount": -29.7, "categoryId": "vacances", "note": "Bloulangerie Tregastel"}, {"date": "2024-08-01", "amount": -0.8, "categoryId": "vacances", "note": "Parking Perros Girec"}, {"date": "2024-08-01", "amount": -20.0, "categoryId": "vacances", "note": "Le Retro"}, {"date": "2024-08-01", "amount": -45.5, "categoryId": "vacances", "note": "Gavotte"}, {"date": "2024-08-01", "amount": -2.0, "categoryId": "vacances", "note": "Parking Dinan"}, {"date": "2024-08-01", "amount": -8.2, "categoryId": "vacances", "note": "Boulangerie Trégastel"}, {"date": "2024-08-01", "amount": -17.6, "categoryId": "vacances", "note": "Péage"}, {"date": "2024-08-01", "amount": -4.2, "categoryId": "charges", "note": "LCL"}, {"date": "2024-08-01", "amount": -4.32, "categoryId": "vacances", "note": "Courses Carrefour Trégastel"}, {"date": "2024-08-01", "amount": -25.99, "categoryId": "charges", "note": "SFR BOX"}, {"date": "2024-08-01", "amount": -17.6, "categoryId": "vacances", "note": "Aquarium"}, {"date": "2024-08-01", "amount": 3.0, "categoryId": "remboursements", "note": "Magnum suite plainte web"}, {"date": "2024-09-01", "amount": 2471.34, "categoryId": "salaire", "note": "Salaire fin août dont 57,89 de frais transport"}, {"date": "2024-09-01", "amount": -200.0, "categoryId": "epargne", "note": "Pour charges copro et taxe foncière"}, {"date": "2024-09-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-09-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-09-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-09-01", "amount": -20.8, "categoryId": "vacances", "note": "Souvenirs"}, {"date": "2024-09-01", "amount": -11.09, "categoryId": "vacances", "note": ""}, {"date": "2024-09-01", "amount": -90.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-09-01", "amount": -12.0, "categoryId": "vacances", "note": "Les Brisants"}, {"date": "2024-09-01", "amount": -26.72, "categoryId": "vacances", "note": "Hennaf"}, {"date": "2024-09-01", "amount": -41.82, "categoryId": "vacances", "note": "Jacky l'andouille"}, {"date": "2024-09-01", "amount": -44.35, "categoryId": "vacances", "note": "Courses"}, {"date": "2024-09-01", "amount": -26.94, "categoryId": "vacances", "note": "Chemise cadeaux papa"}, {"date": "2024-09-01", "amount": -29.94, "categoryId": "sante", "note": "Courses 10km de octobre"}, {"date": "2024-09-01", "amount": -15.24, "categoryId": "vacances", "note": "Super U"}, {"date": "2024-09-01", "amount": -21.4, "categoryId": "vacances", "note": "Boulangerie"}, {"date": "2024-09-01", "amount": -1.0, "categoryId": "voiture", "note": "Frais bip péage"}, {"date": "2024-09-01", "amount": -17.5, "categoryId": "charges", "note": "AXA"}, {"date": "2024-09-01", "amount": -17.55, "categoryId": "vacances", "note": "Sardine la belle iloise"}, {"date": "2024-09-01", "amount": -51.6, "categoryId": "charges", "note": "Matmut"}, {"date": "2024-09-01", "amount": -43.0, "categoryId": "vacances", "note": "Restaurant Pont-Aven (MAMAN)"}, {"date": "2024-09-01", "amount": -26.3, "categoryId": "vacances", "note": "Boulangerie"}, {"date": "2024-09-01", "amount": -15.5, "categoryId": "vacances", "note": "Biscuits"}, {"date": "2024-09-01", "amount": -40.35, "categoryId": "plaisirs", "note": "Aromazone"}, {"date": "2024-09-01", "amount": -93.61, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-09-01", "amount": -50.0, "categoryId": "plaisirs", "note": "Concert Meute"}, {"date": "2024-09-01", "amount": -71.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-09-01", "amount": -86.4, "categoryId": "voiture", "note": "Navigo"}, {"date": "2024-09-01", "amount": -13.0, "categoryId": "voiture", "note": "Micro SD pour caméra voiture"}, {"date": "2024-09-01", "amount": -22.99, "categoryId": "restaurants", "note": "Pizza Uber Eat"}, {"date": "2024-09-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-09-01", "amount": -12.0, "categoryId": "restaurants", "note": "Gauffre saint lazare"}, {"date": "2024-09-01", "amount": -25.0, "categoryId": "courses", "note": "Marché"}, {"date": "2024-09-01", "amount": -9.06, "categoryId": "courses", "note": "Marché"}, {"date": "2024-09-01", "amount": -9.8, "categoryId": "courses", "note": "Cote de Nacre 14/09 Poissonnier"}, {"date": "2024-09-01", "amount": -111.96, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2024-09-01", "amount": -26.39, "categoryId": "courses", "note": "Picard"}, {"date": "2024-09-01", "amount": -43.46, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-09-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-09-01", "amount": -30.0, "categoryId": "cadeaux", "note": "Cadeaux Lucas"}, {"date": "2024-09-01", "amount": -29.73, "categoryId": "cadeaux", "note": "Vase HM"}, {"date": "2024-09-01", "amount": 150.0, "categoryId": "primes", "note": "Cadeaux Parents"}, {"date": "2024-09-01", "amount": -5.59, "categoryId": "voiture", "note": "amazon"}, {"date": "2024-09-01", "amount": -15.68, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-09-01", "amount": -4.97, "categoryId": "charges", "note": "BNP"}, {"date": "2024-09-01", "amount": -35.0, "categoryId": "vetements", "note": "Hyper"}, {"date": "2024-09-01", "amount": -45.0, "categoryId": "restaurants", "note": "HM Paris"}, {"date": "2024-09-01", "amount": -55.0, "categoryId": "plaisirs", "note": "Concert Indochine remb Lucie"}, {"date": "2024-09-01", "amount": -76.65, "categoryId": "cadeaux", "note": "Indochine mam's"}, {"date": "2024-09-01", "amount": -9.95, "categoryId": "plaisirs", "note": "Aromazone"}, {"date": "2024-09-01", "amount": -4.64, "categoryId": "courses", "note": "Fromage mam's"}, {"date": "2024-09-01", "amount": -17.68, "categoryId": "courses", "note": "Mam's"}, {"date": "2024-09-01", "amount": -17.18, "categoryId": "courses", "note": "Mam's"}, {"date": "2024-09-01", "amount": -18.11, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-09-01", "amount": -1.4, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-09-01", "amount": -9.7, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-09-01", "amount": -20.0, "categoryId": "vetements", "note": "Kiabi"}, {"date": "2024-09-01", "amount": -20.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-09-01", "amount": -54.99, "categoryId": "vetements", "note": "ASOS veste"}, {"date": "2024-09-01", "amount": -72.0, "categoryId": "charges", "note": "Impôts régulation"}, {"date": "2024-09-01", "amount": -10.18, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-09-01", "amount": -10.0, "categoryId": "vetements", "note": "Chaussettes"}, {"date": "2024-09-01", "amount": -9.75, "categoryId": "courses", "note": "Marché"}, {"date": "2024-09-01", "amount": -17.99, "categoryId": "courses", "note": "Chargeur aspirateur"}, {"date": "2024-09-01", "amount": -25.99, "categoryId": "charges", "note": "SFR BOX"}, {"date": "2024-09-01", "amount": -24.6, "categoryId": "restaurants", "note": "Bar Versailles"}, {"date": "2024-09-01", "amount": -21.5, "categoryId": "restaurants", "note": "Date avec Rémy au Jap"}, {"date": "2024-09-01", "amount": -18.0, "categoryId": "courses", "note": "Fleurs marché"}, {"date": "2024-09-01", "amount": -57.5, "categoryId": "vetements", "note": "Calzedonia"}, {"date": "2024-09-01", "amount": -18.4, "categoryId": "courses", "note": "Picard"}, {"date": "2024-10-01", "amount": 2371.34, "categoryId": "salaire", "note": "Salaire fin septembre dont 57,89 de frais transport"}, {"date": "2024-10-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-10-01", "amount": -475.49, "categoryId": "charges", "note": "Charges S4 2024"}, {"date": "2024-10-01", "amount": -50.0, "categoryId": "plaisirs", "note": "Concert"}, {"date": "2024-10-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-10-01", "amount": -20.0, "categoryId": "charges", "note": "SFR"}, {"date": "2024-10-01", "amount": 73.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-10-01", "amount": -7.99, "categoryId": "sante", "note": "Baume lèvres"}, {"date": "2024-10-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-10-01", "amount": -69.95, "categoryId": "vetements", "note": "Veste Zara"}, {"date": "2024-10-01", "amount": -23.9, "categoryId": "restaurants", "note": "Apéro course Victor"}, {"date": "2024-10-01", "amount": -90.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-10-01", "amount": -20.6, "categoryId": "cadeaux", "note": "Fleurs Annick"}, {"date": "2024-10-01", "amount": -86.4, "categoryId": "voiture", "note": "Navigo"}, {"date": "2024-10-01", "amount": -5.9, "categoryId": "sante", "note": "Picscine"}, {"date": "2024-10-01", "amount": -40.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-10-01", "amount": -27.0, "categoryId": "vetements", "note": "Decathlon"}, {"date": "2024-10-01", "amount": -96.97, "categoryId": "amenagement", "note": "Housse meuble terasse"}, {"date": "2024-10-01", "amount": 10.0, "categoryId": "vetements", "note": "Vinted"}, {"date": "2024-10-01", "amount": -25.01, "categoryId": "charges", "note": "AXA"}, {"date": "2024-10-01", "amount": -51.6, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2024-10-01", "amount": -16.22, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-10-01", "amount": -4.79, "categoryId": "amenagement", "note": "Truffaut pigeons"}, {"date": "2024-10-01", "amount": -139.8, "categoryId": "vetements", "note": "Uniqlo"}, {"date": "2024-10-01", "amount": -33.93, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-10-01", "amount": -13.2, "categoryId": "courses", "note": "Lindt"}, {"date": "2024-10-01", "amount": -44.99, "categoryId": "vetements", "note": "Jeans ONLY"}, {"date": "2024-10-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-10-01", "amount": -2.5, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-10-01", "amount": -17.39, "categoryId": "courses", "note": "Marché"}, {"date": "2024-10-01", "amount": -17.67, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-10-01", "amount": -4.5, "categoryId": "plaisirs", "note": "eau concert"}, {"date": "2024-10-01", "amount": -74.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-10-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-10-01", "amount": -15.68, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-10-01", "amount": -10.0, "categoryId": "sante", "note": "Ostéo"}, {"date": "2024-10-01", "amount": -0.4, "categoryId": "restaurants", "note": "Mc do"}, {"date": "2024-10-01", "amount": -6.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-10-01", "amount": -85.05, "categoryId": "courses", "note": "Auchan"}, {"date": "2024-10-01", "amount": 8.1, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2024-10-01", "amount": -12.5, "categoryId": "vetements", "note": "Calzedonia"}, {"date": "2024-10-01", "amount": -19.69, "categoryId": "courses", "note": "Marché"}, {"date": "2024-10-01", "amount": -25.82, "categoryId": "courses", "note": ""}, {"date": "2024-09-01", "amount": 34.8, "categoryId": "voiture", "note": "Péages septembre"}, {"date": "2024-10-01", "amount": -5.59, "categoryId": "courses", "note": "hema"}, {"date": "2024-10-01", "amount": -25.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-10-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffre st lazare"}, {"date": "2024-10-01", "amount": -15.9, "categoryId": "restaurants", "note": "Burger Ivry"}, {"date": "2024-10-01", "amount": -3.3, "categoryId": "courses", "note": "boulangerie Ivry"}, {"date": "2024-10-01", "amount": -7.8, "categoryId": "restaurants", "note": "Starbucks"}, {"date": "2024-10-01", "amount": 120.0, "categoryId": "primes", "note": "Parents"}, {"date": "2024-10-01", "amount": -30.09, "categoryId": "courses", "note": "Traiteur"}, {"date": "2024-10-01", "amount": -8.19, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-10-01", "amount": -8.2, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-10-01", "amount": -6.0, "categoryId": "plaisirs", "note": "FDJ"}, {"date": "2024-10-01", "amount": -10.2, "categoryId": "courses", "note": "Marché"}, {"date": "2024-10-01", "amount": -25.99, "categoryId": "charges", "note": "SFR BOX"}, {"date": "2024-10-01", "amount": -50.0, "categoryId": "plaisirs", "note": "Remboursement concert lucie"}, {"date": "2024-10-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffre st lazare"}, {"date": "2024-10-01", "amount": -10.0, "categoryId": "sante", "note": "Chèque Ostéopathe"}, {"date": "2024-10-01", "amount": -86.4, "categoryId": "voiture", "note": "Navigo"}, {"date": "2024-11-01", "amount": 2455.31, "categoryId": "salaire", "note": "Salaire fin octobre dont 57,89 de frais transport"}, {"date": "2024-11-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2024-11-01", "amount": -50.0, "categoryId": "plaisirs", "note": "Remboursement concert lucie"}, {"date": "2024-11-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-11-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-11-01", "amount": -6.25, "categoryId": "voiture", "note": "parking"}, {"date": "2024-11-01", "amount": -68.0, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-11-01", "amount": -86.4, "categoryId": "voiture", "note": "Navigo"}, {"date": "2024-11-01", "amount": -90.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-11-01", "amount": -51.6, "categoryId": "charges", "note": "MATMUT"}, {"date": "2024-11-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2024-11-01", "amount": -25.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-11-01", "amount": -9.99, "categoryId": "sante", "note": "Endorun"}, {"date": "2024-11-01", "amount": -535.64, "categoryId": "vacances", "note": "Airbnb Amsterdam"}, {"date": "2024-11-01", "amount": -166.0, "categoryId": "vacances", "note": "Eurostar Amsterdam"}, {"date": "2024-11-01", "amount": -304.9, "categoryId": "vacances", "note": "Voiture de location Amsterdam"}, {"date": "2024-11-01", "amount": -10.79, "categoryId": "courses", "note": "Picard"}, {"date": "2024-11-01", "amount": -50.44, "categoryId": "courses", "note": "Auchan"}, {"date": "2024-11-01", "amount": -88.51, "categoryId": "amenagement", "note": "Action"}, {"date": "2024-11-01", "amount": -6.0, "categoryId": "plaisirs", "note": "Fleurs"}, {"date": "2024-11-01", "amount": -18.02, "categoryId": "courses", "note": "La terrine"}, {"date": "2024-11-01", "amount": -26.39, "categoryId": "courses", "note": "Marché"}, {"date": "2024-11-01", "amount": -16.63, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-11-01", "amount": -12.92, "categoryId": "amenagement", "note": "Action"}, {"date": "2024-11-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2024-11-01", "amount": -10.79, "categoryId": "courses", "note": "Picard"}, {"date": "2024-11-01", "amount": -54.0, "categoryId": "plaisirs", "note": "Billet Master de feux 2025"}, {"date": "2024-11-01", "amount": -3.88, "categoryId": "amenagement", "note": "Action"}, {"date": "2024-11-01", "amount": -83.02, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-11-01", "amount": -50.0, "categoryId": "courses", "note": "Auchan"}, {"date": "2024-11-01", "amount": 1006.54, "categoryId": "vacances", "note": "Chèque Mutti Amsterdam"}, {"date": "2024-11-01", "amount": -15.68, "categoryId": "charges", "note": "Prêt LCL"}, {"date": "2024-11-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffres Saint Lazare"}, {"date": "2024-11-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-11-01", "amount": -29.0, "categoryId": "courses", "note": "La terrine"}, {"date": "2024-11-01", "amount": -41.21, "categoryId": "amenagement", "note": "Action"}, {"date": "2024-11-01", "amount": -7.99, "categoryId": "courses", "note": "Marché"}, {"date": "2024-11-01", "amount": -31.7, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-11-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffres Saint Lazare"}, {"date": "2024-11-01", "amount": -13.4, "categoryId": "voiture", "note": "péage"}, {"date": "2024-11-01", "amount": -7.9, "categoryId": "restaurants", "note": "Starbucks"}, {"date": "2024-11-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffres Saint Lazare"}, {"date": "2024-11-01", "amount": -28.0, "categoryId": "vacances", "note": "Train pour Arras"}, {"date": "2024-11-01", "amount": -25.5, "categoryId": "vacances", "note": "Train pour Arras"}, {"date": "2024-11-01", "amount": -7.7, "categoryId": "courses", "note": "La terrine"}, {"date": "2024-11-01", "amount": -17.98, "categoryId": "plaisirs", "note": "Mondial Tissus"}, {"date": "2024-11-01", "amount": -14.9, "categoryId": "restaurants", "note": "Au bureau avec Lucie"}, {"date": "2024-11-01", "amount": -20.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-11-01", "amount": -43.28, "categoryId": "restaurants", "note": "Uber eat"}, {"date": "2024-11-01", "amount": -30.0, "categoryId": "charges", "note": "SFR tel"}, {"date": "2024-11-01", "amount": -15.95, "categoryId": "sante", "note": "RDV Brigitte"}, {"date": "2024-11-01", "amount": -4.2, "categoryId": "charges", "note": "LCL"}, {"date": "2024-11-01", "amount": -6.0, "categoryId": "restaurants", "note": "gauffre"}, {"date": "2024-11-01", "amount": -47.5, "categoryId": "plaisirs", "note": "Gamelles Owen"}, {"date": "2024-11-01", "amount": -14.43, "categoryId": "plaisirs", "note": "HEMA"}, {"date": "2024-11-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2024-11-01", "amount": -27.33, "categoryId": "cadeaux", "note": "Maison du monde"}, {"date": "2024-11-01", "amount": -36.24, "categoryId": "courses", "note": "intermarché"}, {"date": "2024-11-01", "amount": -14.96, "categoryId": "plaisirs", "note": "action"}, {"date": "2024-11-01", "amount": -8.65, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-11-01", "amount": -10.55, "categoryId": "courses", "note": "Marché"}, {"date": "2024-11-01", "amount": -12.78, "categoryId": "courses", "note": "Picard"}, {"date": "2024-11-01", "amount": -86.4, "categoryId": "voiture", "note": "navigo"}, {"date": "2024-12-01", "amount": 2434.77, "categoryId": "salaire", "note": "Salaire fin novembre dont 57,89 de frais transport"}, {"date": "2024-12-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-12-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2024-12-01", "amount": -20.0, "categoryId": "charges", "note": "Forfait SFR"}, {"date": "2024-12-01", "amount": -90.0, "categoryId": "charges", "note": "EDF"}, {"date": "2024-12-01", "amount": -1.4, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-12-01", "amount": -41.24, "categoryId": "courses", "note": "Auchan"}, {"date": "2024-12-01", "amount": -30.0, "categoryId": "cadeaux", "note": "Banane Marion"}, {"date": "2024-12-01", "amount": -24.0, "categoryId": "cadeaux", "note": "Bracelets 4 pour Lucile et Lucie Marché de Noël Doca"}, {"date": "2024-12-01", "amount": -24.0, "categoryId": "plaisirs", "note": "2 bracelets et 1 collier marché de Noël Doca"}, {"date": "2024-12-01", "amount": -6.95, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-12-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffres Saint-Lazare"}, {"date": "2024-12-01", "amount": 100.0, "categoryId": "primes", "note": "Virement parents"}, {"date": "2024-12-01", "amount": -2.9, "categoryId": "restaurants", "note": "Boulangerie"}, {"date": "2024-12-01", "amount": -51.64, "categoryId": "charges", "note": "MATMUT"}, {"date": "2024-12-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2024-12-01", "amount": -24.99, "categoryId": "cadeaux", "note": "Vynile Lucie"}, {"date": "2024-12-01", "amount": -39.99, "categoryId": "cadeaux", "note": "DVD Mylène Farmer"}, {"date": "2024-12-01", "amount": -9.0, "categoryId": "vacances", "note": "Bar Arras"}, {"date": "2024-12-01", "amount": -6.0, "categoryId": "vacances", "note": "Chichi Arras"}, {"date": "2024-12-01", "amount": -8.58, "categoryId": "courses", "note": "Leroy Merlin"}, {"date": "2024-12-01", "amount": -21.0, "categoryId": "vacances", "note": "Arras"}, {"date": "2024-12-01", "amount": -5.0, "categoryId": "vacances", "note": "Arras"}, {"date": "2024-12-01", "amount": -30.0, "categoryId": "vacances", "note": "SPA avec Héléna Arras"}, {"date": "2024-12-01", "amount": -20.0, "categoryId": "vacances", "note": "Vin chaud Arras"}, {"date": "2024-12-01", "amount": -13.56, "categoryId": "vacances", "note": "Courses Arras"}, {"date": "2024-12-01", "amount": -73.24, "categoryId": "voiture", "note": "Essence"}, {"date": "2024-12-01", "amount": -24.3, "categoryId": "vacances", "note": "Train retour"}, {"date": "2024-12-01", "amount": -21.5, "categoryId": "vacances", "note": "Train retour"}, {"date": "2024-12-01", "amount": -19.3, "categoryId": "vacances", "note": "Baggel retour"}, {"date": "2024-12-01", "amount": -25.0, "categoryId": "courses", "note": "RIE"}, {"date": "2024-12-01", "amount": -60.0, "categoryId": "cadeaux", "note": "Comptoire de mathilde"}, {"date": "2024-12-01", "amount": -107.6, "categoryId": "owen", "note": "Croquettes"}, {"date": "2024-12-01", "amount": -26.5, "categoryId": "sante", "note": "RDV Brigitte"}, {"date": "2024-12-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffre saint lazare"}, {"date": "2024-12-01", "amount": -84.75, "categoryId": "cadeaux", "note": "Ours en guimauve"}, {"date": "2024-12-01", "amount": -55.84, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2024-12-01", "amount": -41.48, "categoryId": "plaisirs", "note": "Truffaut"}, {"date": "2024-12-01", "amount": -7.5, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2024-12-01", "amount": -1.4, "categoryId": "restaurants", "note": "Boulangerie"}, {"date": "2024-12-01", "amount": -77.0, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2024-12-01", "amount": -29.0, "categoryId": "cadeaux", "note": "Kiabi"}, {"date": "2024-12-01", "amount": -19.11, "categoryId": "amenagement", "note": "B&M"}, {"date": "2024-12-01", "amount": -3.3, "categoryId": "courses", "note": "Marie Blachère"}, {"date": "2024-12-01", "amount": -51.05, "categoryId": "courses", "note": "Intermarché"}, {"date": "2024-12-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2024-12-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt LCL"}, {"date": "2024-12-01", "amount": -7.9, "categoryId": "restaurants", "note": "Starbucks"}, {"date": "2024-12-01", "amount": -17.8, "categoryId": "voiture", "note": "Péage de novembre"}, {"date": "2024-12-01", "amount": -30.0, "categoryId": "restaurants", "note": "Jap' après piscine"}, {"date": "2024-12-01", "amount": -10.0, "categoryId": "restaurants", "note": "Baggelstein payé en espèces"}, {"date": "2024-12-01", "amount": -52.35, "categoryId": "plaisirs", "note": "Aromazone"}, {"date": "2024-01-01", "amount": -75.0, "categoryId": "plaisirs", "note": "Concert Ben Mazué 2026"}, {"date": "2024-12-01", "amount": -12.46, "categoryId": "courses", "note": "Stokomani"}, {"date": "2024-12-01", "amount": -19.14, "categoryId": "cadeaux", "note": "Stokomani"}, {"date": "2024-12-01", "amount": -49.74, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2024-12-01", "amount": -6.47, "categoryId": "cadeaux", "note": "Foire Fouille"}, {"date": "2024-12-01", "amount": -54.0, "categoryId": "plaisirs", "note": "Coiffeur"}, {"date": "2024-12-01", "amount": -7.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2024-12-01", "amount": -20.18, "categoryId": "vacances", "note": "Dessus de casque violet"}, {"date": "2024-12-01", "amount": -9.0, "categoryId": "vacances", "note": "Chaussettes de ski"}, {"date": "2024-12-01", "amount": -34.34, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2024-12-01", "amount": -283.97, "categoryId": "amenagement", "note": "IKEA"}, {"date": "2024-12-01", "amount": -49.99, "categoryId": "amenagement", "note": "Boulanger support fixation TV (dont 28e de la cagnotte TV anniversaire)"}, {"date": "2024-12-01", "amount": -29.99, "categoryId": "amenagement", "note": "Ampoule Amazon"}, {"date": "2024-12-01", "amount": -19.99, "categoryId": "amenagement", "note": "Etagère Vinyle Amazon"}, {"date": "2024-12-01", "amount": -4.99, "categoryId": "amenagement", "note": "Rouleau canaé Amazon"}, {"date": "2024-12-01", "amount": -63.98, "categoryId": "vacances", "note": "Equipement snow"}, {"date": "2024-12-01", "amount": -70.26, "categoryId": "vacances", "note": "Location snow et skis"}, {"date": "2024-12-01", "amount": -8.18, "categoryId": "courses", "note": "intermarché"}, {"date": "2024-12-01", "amount": -65.35, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2024-12-01", "amount": -31.82, "categoryId": "courses", "note": "Courses Nouvel an"}, {"date": "2024-12-01", "amount": -15.21, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2024-12-01", "amount": -26.79, "categoryId": "cadeaux", "note": "Noel"}, {"date": "2024-12-01", "amount": -29.64, "categoryId": "amenagement", "note": "B&M"}, {"date": "2024-12-01", "amount": -7.5, "categoryId": "restaurants", "note": "Churros"}, {"date": "2024-12-01", "amount": -200.0, "categoryId": "epargne", "note": "Virement pour équilibre en début d'année"}, {"date": "2025-01-01", "amount": 2427.91, "categoryId": "salaire", "note": "Salaire reçu fin décembre"}, {"date": "2025-01-01", "amount": -100.0, "categoryId": "epargne_tf", "note": "Mensualité taxe foncière"}, {"date": "2025-01-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-01-01", "amount": -60.0, "categoryId": "charges", "note": "EDF"}, {"date": "2025-01-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-01-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-01-01", "amount": -71.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-01-01", "amount": 21.94, "categoryId": "cadeaux", "note": "Virement I Graal"}, {"date": "2025-01-01", "amount": -6.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-01-01", "amount": -52.9, "categoryId": "cadeaux", "note": "Cadeaux Chloé Mellipou"}, {"date": "2025-01-01", "amount": -82.31, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-01-01", "amount": -6.66, "categoryId": "amenagement", "note": "Action"}, {"date": "2025-01-01", "amount": -17.15, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-01-01", "amount": -6.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-01-01", "amount": -9.7, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-01-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2025-01-01", "amount": -9.98, "categoryId": "amenagement", "note": "FoireFouille"}, {"date": "2025-01-01", "amount": -9.7, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-01-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-01-01", "amount": -157.38, "categoryId": "amenagement", "note": "LA REDOUTE"}, {"date": "2025-01-01", "amount": 247.71, "categoryId": "primes", "note": "Intérêts 2024 LA"}, {"date": "2025-01-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-01-01", "amount": -7.65, "categoryId": "vacances", "note": "Location casque"}, {"date": "2025-01-01", "amount": -38.56, "categoryId": "vacances", "note": "Location ski"}, {"date": "2025-01-01", "amount": 35.13, "categoryId": "vacances", "note": "Remboursement Location"}, {"date": "2025-01-01", "amount": 35.13, "categoryId": "vacances", "note": "Remboursement Location"}, {"date": "2025-01-01", "amount": -19.76, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-01-01", "amount": -6.0, "categoryId": "restaurants", "note": "Gauffres"}, {"date": "2025-01-01", "amount": -113.09, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-01-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-01-01", "amount": -7.9, "categoryId": "restaurants", "note": "Starbucks"}, {"date": "2025-01-01", "amount": -51.0, "categoryId": "restaurants", "note": "Japonais Lucette"}, {"date": "2025-01-01", "amount": -6.1, "categoryId": "restaurants", "note": "Starbucks"}, {"date": "2025-01-01", "amount": -30.0, "categoryId": "vacances", "note": "SPA Arras"}, {"date": "2025-01-01", "amount": -8.54, "categoryId": "cadeaux", "note": "Appareil Louis"}, {"date": "2025-01-01", "amount": -61.77, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-01-01", "amount": -12.26, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-01-01", "amount": -8.4, "categoryId": "vacances", "note": "Bar Arras"}, {"date": "2025-01-01", "amount": -11.9, "categoryId": "restaurants", "note": "McDo Gaillon"}, {"date": "2025-01-01", "amount": -5.9, "categoryId": "sante", "note": "Piscine"}, {"date": "2025-01-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-01-01", "amount": -15.0, "categoryId": "charges", "note": "Impôts"}, {"date": "2025-01-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-01-01", "amount": -24.1, "categoryId": "sante", "note": "Course Run for Girl Octobre"}, {"date": "2025-01-01", "amount": -6.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-01-01", "amount": 50.0, "categoryId": "primes", "note": "Mois Mutti"}, {"date": "2025-01-01", "amount": -77.89, "categoryId": "amenagement", "note": "Luminaire salon"}, {"date": "2025-01-01", "amount": -7.71, "categoryId": "amenagement", "note": "Action"}, {"date": "2025-01-01", "amount": -120.85, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-01-01", "amount": -14.2, "categoryId": "cadeaux", "note": "Cadeaux Ballons Maman"}, {"date": "2025-01-01", "amount": -9.6, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-01-01", "amount": -41.0, "categoryId": "plaisirs", "note": "Panayotis"}, {"date": "2025-01-01", "amount": -12.0, "categoryId": "restaurants", "note": "Pizza soirée Alex"}, {"date": "2025-01-01", "amount": 1500.0, "categoryId": "primes", "note": "Etraines 2024 de Mutti"}, {"date": "2025-01-01", "amount": -1500.0, "categoryId": "epargne", "note": "Etraines mutti courant > LA"}, {"date": "2025-01-01", "amount": -5.9, "categoryId": "plaisirs", "note": "Date chocolat chaud"}, {"date": "2025-01-01", "amount": -38.5, "categoryId": "restaurants", "note": "Date Simon"}, {"date": "2025-01-01", "amount": -12.09, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-01-01", "amount": -3.8, "categoryId": "cadeaux", "note": "Chloé"}, {"date": "2025-01-01", "amount": -34.99, "categoryId": "amenagement", "note": "Ampoule pour salon"}, {"date": "2025-01-01", "amount": -3.41, "categoryId": "plaisirs", "note": "Livres Fnac avec carte cadeau Noël"}, {"date": "2025-01-01", "amount": -0.14, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2025-01-01", "amount": -15.89, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-01-01", "amount": -15.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2025-01-01", "amount": -23.98, "categoryId": "courses", "note": "Truffaut paps"}, {"date": "2025-01-01", "amount": -74.0, "categoryId": "restaurants", "note": "Soprano Mutti"}, {"date": "2025-01-01", "amount": -6.1, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-01-01", "amount": -9.0, "categoryId": "cadeaux", "note": "Auriane"}, {"date": "2025-01-01", "amount": -50.0, "categoryId": "courses", "note": "Retrait"}, {"date": "2025-01-01", "amount": -54.36, "categoryId": "vacances", "note": "Intermarché"}, {"date": "2025-01-01", "amount": -9.96, "categoryId": "courses", "note": "Action"}, {"date": "2025-01-01", "amount": 250.0, "categoryId": "epargne", "note": "Pioche dans LA pour Train Mariage HM"}, {"date": "2025-01-01", "amount": -256.0, "categoryId": "vacances", "note": "Train Mariage HM"}, {"date": "2025-01-01", "amount": -7.2, "categoryId": "restaurants", "note": "Starbucks"}, {"date": "2025-01-01", "amount": -10.55, "categoryId": "cadeaux", "note": "HEMA"}, {"date": "2025-01-01", "amount": -7.0, "categoryId": "restaurants", "note": "Mama ben mazué"}, {"date": "2025-01-01", "amount": 5.0, "categoryId": "restaurants", "note": "Chocolat chaud Pollux"}, {"date": "2025-01-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-02-01", "amount": 2460.71, "categoryId": "salaire", "note": "Salaire reçu fin janvier"}, {"date": "2025-02-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2025-02-01", "amount": -100.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-02-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-02-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-02-01", "amount": -20.0, "categoryId": "charges", "note": "RED by SFR"}, {"date": "2025-02-01", "amount": -97.27, "categoryId": "vacances", "note": "Courses NORMA"}, {"date": "2025-02-01", "amount": -60.0, "categoryId": "charges", "note": "EDF"}, {"date": "2025-02-01", "amount": -7.5, "categoryId": "vacances", "note": "Vin chaud"}, {"date": "2025-02-01", "amount": -75.0, "categoryId": "vacances", "note": "ESF"}, {"date": "2025-02-01", "amount": -11.4, "categoryId": "vacances", "note": "Vin chaud"}, {"date": "2025-02-01", "amount": -10.0, "categoryId": "vacances", "note": "Fartage snow"}, {"date": "2025-02-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-02-01", "amount": -82.31, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-02-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-02-01", "amount": -5.99, "categoryId": "restaurants", "note": "Uber eat one"}, {"date": "2025-02-01", "amount": -35.15, "categoryId": "vacances", "note": "Courses NORMA"}, {"date": "2025-02-01", "amount": 233.65, "categoryId": "remboursements", "note": "EDF"}, {"date": "2025-02-01", "amount": -22.2, "categoryId": "vacances", "note": "Grizzly"}, {"date": "2025-02-01", "amount": -65.0, "categoryId": "vacances", "note": "Massage"}, {"date": "2025-02-01", "amount": -20.2, "categoryId": "vacances", "note": "Souvenirs"}, {"date": "2025-02-01", "amount": -98.49, "categoryId": "vacances", "note": "Location ski et casque"}, {"date": "2025-02-01", "amount": -26.63, "categoryId": "cadeaux", "note": "Fûts Marion"}, {"date": "2025-02-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-02-01", "amount": -48.92, "categoryId": "courses", "note": "Auchan"}, {"date": "2025-02-01", "amount": -90.81, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-02-01", "amount": -113.09, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-02-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2025-02-01", "amount": -147.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-02-01", "amount": -29.0, "categoryId": "plaisirs", "note": "Lush"}, {"date": "2025-02-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-02-01", "amount": -17.85, "categoryId": "vacances", "note": "Legacy sport 07/02"}, {"date": "2025-02-01", "amount": -28.0, "categoryId": "plaisirs", "note": "Bouquet Marion Chèque"}, {"date": "2025-02-01", "amount": -19.73, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-02-01", "amount": -75.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-02-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-02-01", "amount": -16.48, "categoryId": "courses", "note": "La terrine"}, {"date": "2025-02-01", "amount": -28.25, "categoryId": "amenagement", "note": "Meuble Facturier"}, {"date": "2025-02-01", "amount": -8.95, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-02-01", "amount": -35.59, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-02-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Bouquet Robby"}, {"date": "2025-02-01", "amount": -1.2, "categoryId": "courses", "note": "Date Tom"}, {"date": "2025-02-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-02-01", "amount": -128.25, "categoryId": "cadeaux", "note": "Vitrail Robby"}, {"date": "2025-02-01", "amount": -9.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2025-02-01", "amount": -46.8, "categoryId": "plaisirs", "note": "Date Tom"}, {"date": "2025-02-01", "amount": -33.12, "categoryId": "amenagement", "note": "Bureau Vallée"}, {"date": "2025-02-01", "amount": -7.95, "categoryId": "amenagement", "note": "Action"}, {"date": "2025-02-01", "amount": -83.18, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-02-01", "amount": -15.0, "categoryId": "sante", "note": "Séance d'essai Victor"}, {"date": "2025-02-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-02-01", "amount": -12.9, "categoryId": "restaurants", "note": "Bagelstein"}, {"date": "2025-02-01", "amount": -200.0, "categoryId": "epargne", "note": "198,30e de différence entre restant fin mois et salaire"}, {"date": "2025-03-01", "amount": 2460.71, "categoryId": "salaire", "note": "Salaire reçu fin février"}, {"date": "2025-03-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-03-01", "amount": -31.18, "categoryId": "courses", "note": "Amazon"}, {"date": "2025-03-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2025-03-01", "amount": -21.5, "categoryId": "restaurants", "note": "Japonais Lucette"}, {"date": "2025-03-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2025-03-01", "amount": -100.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-03-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-03-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-03-01", "amount": -1.95, "categoryId": "sante", "note": "Aromazone"}, {"date": "2025-03-01", "amount": -452.14, "categoryId": "vacances", "note": "Logement vacances cet été"}, {"date": "2025-03-01", "amount": -24.5, "categoryId": "restaurants", "note": "Restorant Saint Lazare - Le Printanier"}, {"date": "2025-03-01", "amount": -6.6, "categoryId": "sante", "note": "Normal lime ongle"}, {"date": "2025-03-01", "amount": -27.69, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-03-01", "amount": -29.99, "categoryId": "plaisirs", "note": "Vinyle Ben Mazué"}, {"date": "2025-03-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-03-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-03-01", "amount": -36.96, "categoryId": "plaisirs", "note": "Sephora"}, {"date": "2025-03-01", "amount": -37.0, "categoryId": "voiture", "note": "Réparation pneu"}, {"date": "2025-03-01", "amount": -105.77, "categoryId": "sante", "note": "Dentiste"}, {"date": "2025-03-01", "amount": -82.31, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-03-01", "amount": -5.29, "categoryId": "voiture", "note": "Parking"}, {"date": "2025-03-01", "amount": -48.7, "categoryId": "owen", "note": "Ultrapremium Direct - Antiparasite et Pâtés"}, {"date": "2025-03-01", "amount": -3.49, "categoryId": "amenagement", "note": "Maisons du monde"}, {"date": "2025-03-01", "amount": -11.99, "categoryId": "sante", "note": "Balance Décathlon"}, {"date": "2025-03-01", "amount": 61.46, "categoryId": "sante", "note": "Remboursement Dentiste"}, {"date": "2025-03-01", "amount": 42.31, "categoryId": "sante", "note": "Remboursement Dentiste"}, {"date": "2025-03-01", "amount": -73.88, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-03-01", "amount": -10.7, "categoryId": "courses", "note": "Action"}, {"date": "2025-03-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-03-01", "amount": -19.75, "categoryId": "plaisirs", "note": "Date Thibault"}, {"date": "2025-03-01", "amount": -53.6, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-03-01", "amount": -10.1, "categoryId": "courses", "note": "Stokomani"}, {"date": "2025-03-01", "amount": -6.99, "categoryId": "amenagement", "note": "Amazon"}, {"date": "2025-03-01", "amount": -23.23, "categoryId": "amenagement", "note": "FoireFouille"}, {"date": "2025-03-01", "amount": -113.09, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-03-01", "amount": -5.2, "categoryId": "sante", "note": "Piscine"}, {"date": "2025-03-01", "amount": -13.9, "categoryId": "restaurants", "note": "Taï MDF"}, {"date": "2025-03-01", "amount": -5.0, "categoryId": "restaurants", "note": "Chocolat Chaud MDF"}, {"date": "2025-03-01", "amount": -13.5, "categoryId": "plaisirs", "note": "Rituals"}, {"date": "2025-03-01", "amount": -21.75, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-03-01", "amount": -22.97, "categoryId": "amenagement", "note": "HEMA"}, {"date": "2025-03-01", "amount": 400.0, "categoryId": "epargne", "note": ""}, {"date": "2025-03-01", "amount": -53.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-03-01", "amount": -60.93, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-03-01", "amount": -9.2, "categoryId": "restaurants", "note": "Boulangerie"}, {"date": "2025-03-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-03-01", "amount": -15.0, "categoryId": "charges", "note": "Impôts"}, {"date": "2025-03-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-03-01", "amount": 100.0, "categoryId": "primes", "note": "Cadeau mam's"}, {"date": "2025-03-01", "amount": -56.5, "categoryId": "plaisirs", "note": "Date Thibault"}, {"date": "2025-03-01", "amount": -25.65, "categoryId": "amenagement", "note": "Maisons du monde"}, {"date": "2025-03-01", "amount": -21.75, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-03-01", "amount": -62.51, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2025-03-01", "amount": -1.4, "categoryId": "restaurants", "note": "Boulangerie"}, {"date": "2025-03-01", "amount": -3.5, "categoryId": "restaurants", "note": "Bagelstein"}, {"date": "2025-03-01", "amount": -10.0, "categoryId": "amenagement", "note": "cpartout affiche"}, {"date": "2025-03-01", "amount": -6.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2025-03-01", "amount": -7.9, "categoryId": "restaurants", "note": "Bagelstein"}, {"date": "2025-03-01", "amount": -149.94, "categoryId": "vetements", "note": "Zalando"}, {"date": "2025-03-01", "amount": -46.93, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2025-03-01", "amount": -58.57, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-03-01", "amount": -23.45, "categoryId": "amenagement", "note": "CASA"}, {"date": "2025-03-01", "amount": -51.95, "categoryId": "amenagement", "note": "IKEA"}, {"date": "2025-03-01", "amount": -27.0, "categoryId": "restaurants", "note": "Indien Lucie"}, {"date": "2025-03-01", "amount": -7.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-03-01", "amount": 100.0, "categoryId": "epargne", "note": ""}, {"date": "2025-03-01", "amount": -5.0, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-03-01", "amount": -149.98, "categoryId": "vetements", "note": "ZALANDO"}, {"date": "2025-03-01", "amount": 100.0, "categoryId": "epargne", "note": ""}, {"date": "2025-03-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-03-01", "amount": -1.0, "categoryId": "sante", "note": "Toilettes saint-lazare"}, {"date": "2025-04-01", "amount": 2489.92, "categoryId": "salaire", "note": "Salaire reçu fin mars"}, {"date": "2025-04-01", "amount": -65.0, "categoryId": "voiture", "note": "Contrôle technique voiture"}, {"date": "2025-04-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-04-01", "amount": -57.9, "categoryId": "vetements", "note": "Zalando"}, {"date": "2025-04-01", "amount": -67.98, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-04-01", "amount": -7.6, "categoryId": "vetements", "note": "ASOS"}, {"date": "2025-04-01", "amount": -18.49, "categoryId": "vetements", "note": "ASOS"}, {"date": "2025-04-01", "amount": -6.45, "categoryId": "voiture", "note": "Parking Courbevoie"}, {"date": "2025-04-01", "amount": -109.98, "categoryId": "vetements", "note": "Zalando robe verte"}, {"date": "2025-04-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Cagnotte Cyril"}, {"date": "2025-04-01", "amount": -13.38, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-04-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-04-01", "amount": -2.5, "categoryId": "restaurants", "note": "Boulangerie"}, {"date": "2025-04-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2025-04-01", "amount": -0.25, "categoryId": "voiture", "note": "parking"}, {"date": "2025-04-01", "amount": -680.0, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-04-01", "amount": -50.0, "categoryId": "courses", "note": "RIE"}, {"date": "2025-04-01", "amount": -20.0, "categoryId": "charges", "note": "RED by SFR"}, {"date": "2025-04-01", "amount": -13.38, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-04-01", "amount": -100.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-04-01", "amount": -2.5, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-04-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-04-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-04-01", "amount": -11.0, "categoryId": "restaurants", "note": "Pollux"}, {"date": "2025-04-01", "amount": -14.4, "categoryId": "courses", "note": "Kusmi tea"}, {"date": "2025-04-01", "amount": 720.56, "categoryId": "primes", "note": "Bijoux"}, {"date": "2025-04-01", "amount": -36.51, "categoryId": "vetements", "note": "ASOS"}, {"date": "2025-04-01", "amount": -82.31, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-04-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-04-01", "amount": -57.48, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-04-01", "amount": 150.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2025-04-01", "amount": -443.75, "categoryId": "vacances", "note": "Logement AMS"}, {"date": "2025-04-01", "amount": 9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-04-01", "amount": -12.8, "categoryId": "restaurants", "note": ""}, {"date": "2025-04-01", "amount": -68.01, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-04-01", "amount": -27.0, "categoryId": "vacances", "note": "Jardin botanique AMS"}, {"date": "2025-04-01", "amount": -69.0, "categoryId": "vacances", "note": "Tulipes"}, {"date": "2025-04-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-04-01", "amount": -159.07, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-04-01", "amount": -40.0, "categoryId": "sante", "note": "Danse robby"}, {"date": "2025-04-01", "amount": -35.8, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2025-04-01", "amount": -63.6, "categoryId": "vacances", "note": "Bâteau mouche AMS"}, {"date": "2025-04-01", "amount": -50.0, "categoryId": "vacances", "note": "Musée AMS"}, {"date": "2025-04-01", "amount": -19.02, "categoryId": "amenagement", "note": "Action"}, {"date": "2025-04-01", "amount": -6.5, "categoryId": "plaisirs", "note": "Cidre"}, {"date": "2025-04-01", "amount": -43.85, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-04-01", "amount": -3.49, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2025-04-01", "amount": -13.85, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-04-01", "amount": -5.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-04-01", "amount": -21.5, "categoryId": "restaurants", "note": "Japonais Lucette"}, {"date": "2025-04-01", "amount": -15.0, "categoryId": "charges", "note": "Impots"}, {"date": "2025-04-01", "amount": -6.6, "categoryId": "restaurants", "note": "Gauffres"}, {"date": "2025-04-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-04-01", "amount": 150.0, "categoryId": "primes", "note": "Cadeau Annick"}, {"date": "2025-04-01", "amount": -20.0, "categoryId": "courses", "note": "RIE"}, {"date": "2025-04-01", "amount": -3.95, "categoryId": "vacances", "note": "Musée AMS"}, {"date": "2025-04-01", "amount": -14.78, "categoryId": "restaurants", "note": "Uber eat"}, {"date": "2025-04-01", "amount": -6.06, "categoryId": "vacances", "note": "Parking"}, {"date": "2025-04-01", "amount": -6.0, "categoryId": "voiture", "note": "Péages"}, {"date": "2025-04-01", "amount": -16.0, "categoryId": "vacances", "note": "Jardin botanique Leiden"}, {"date": "2025-04-01", "amount": -16.83, "categoryId": "vacances", "note": "Parking"}, {"date": "2025-04-01", "amount": -12.6, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -15.0, "categoryId": "vacances", "note": "Parking Moulins"}, {"date": "2025-04-01", "amount": -30.44, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-04-01", "amount": -4.0, "categoryId": "vacances", "note": "Hoorns"}, {"date": "2025-04-01", "amount": -42.11, "categoryId": "vacances", "note": "Courses"}, {"date": "2025-04-01", "amount": -7.3, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -1.8, "categoryId": "vacances", "note": "Parking"}, {"date": "2025-04-01", "amount": -14.0, "categoryId": "vacances", "note": "Boulangerie aller"}, {"date": "2025-04-01", "amount": -7.1, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -6.32, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -8.95, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -44.1, "categoryId": "vetements", "note": "KOUKA"}, {"date": "2025-04-01", "amount": -7.0, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -18.45, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -3.9, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -22.0, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -2.95, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-04-01", "amount": -40.38, "categoryId": "vacances", "note": "Parking"}, {"date": "2025-04-01", "amount": -32.1, "categoryId": "vacances", "note": "Tulipes"}, {"date": "2025-04-01", "amount": -7.0, "categoryId": "vacances", "note": "Tulipes"}, {"date": "2025-04-01", "amount": -41.85, "categoryId": "vacances", "note": "Colliers"}, {"date": "2025-04-01", "amount": -8.1, "categoryId": "vacances", "note": "Parking"}, {"date": "2025-04-01", "amount": -4.8, "categoryId": "vacances", "note": "Parking"}, {"date": "2025-04-01", "amount": -14.5, "categoryId": "vacances", "note": "Tulipes"}, {"date": "2025-04-01", "amount": -24.24, "categoryId": "vacances", "note": "Gouda"}, {"date": "2025-04-01", "amount": -10.31, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -25.98, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -5.95, "categoryId": "vacances", "note": ""}, {"date": "2025-04-01", "amount": -32.37, "categoryId": "plaisirs", "note": "Soirée boumboum"}, {"date": "2025-04-01", "amount": -63.33, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-04-01", "amount": -153.31, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2025-04-01", "amount": -5.0, "categoryId": "restaurants", "note": "Pizza soirée minous"}, {"date": "2025-04-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-04-01", "amount": 6.0, "categoryId": "sante", "note": "CPAM BRIGITE"}, {"date": "2025-05-01", "amount": 3760.77, "categoryId": "salaire", "note": "Salaire reçu fin mars"}, {"date": "2025-05-01", "amount": -100.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-05-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-05-01", "amount": -1300.0, "categoryId": "voiture", "note": "Virement Papa"}, {"date": "2025-04-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-05-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-05-01", "amount": -15.0, "categoryId": "courses", "note": "RIE"}, {"date": "2025-05-01", "amount": -5.0, "categoryId": "plaisirs", "note": "Chèque fleurs 30 avec 15 papa et 10 victor"}, {"date": "2025-05-01", "amount": -15.0, "categoryId": "voiture", "note": "Péage"}, {"date": "2025-05-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-05-01", "amount": -2.55, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-05-01", "amount": -7.7, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-05-01", "amount": -90.0, "categoryId": "owen", "note": "Vétérinaire"}, {"date": "2025-05-01", "amount": -82.31, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-05-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-05-01", "amount": -20.97, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2025-05-01", "amount": -11.68, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-05-01", "amount": -9.46, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-05-01", "amount": -15.0, "categoryId": "plaisirs", "note": "Muguet"}, {"date": "2025-05-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-05-01", "amount": -14.9, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-05-01", "amount": -14.94, "categoryId": "amenagement", "note": "B&M"}, {"date": "2025-05-01", "amount": -3.49, "categoryId": "amenagement", "note": "stokomani"}, {"date": "2025-05-01", "amount": -9.97, "categoryId": "courses", "note": "Truffault"}, {"date": "2025-05-01", "amount": -25.99, "categoryId": "courses", "note": "Picard"}, {"date": "2025-05-01", "amount": -47.04, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-05-01", "amount": -20.0, "categoryId": "plaisirs", "note": "Uber"}, {"date": "2025-05-01", "amount": -18.08, "categoryId": "amenagement", "note": "Action"}, {"date": "2025-05-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-05-01", "amount": -159.08, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-05-01", "amount": -2.59, "categoryId": "amenagement", "note": "FoireFouille"}, {"date": "2025-05-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-05-01", "amount": -13.0, "categoryId": "restaurants", "note": "Burger La Vilette"}, {"date": "2025-05-01", "amount": -15.0, "categoryId": "plaisirs", "note": "Cabaret sauvage"}, {"date": "2025-05-01", "amount": -3.85, "categoryId": "voiture", "note": "Parking Houilles"}, {"date": "2025-05-01", "amount": -60.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-05-01", "amount": -103.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-05-01", "amount": -10.7, "categoryId": "vetements", "note": "Colis retour robes"}, {"date": "2025-05-01", "amount": -2.49, "categoryId": "cadeaux", "note": "HEMA"}, {"date": "2025-05-01", "amount": -25.89, "categoryId": "restaurants", "note": "POLLUX"}, {"date": "2025-05-01", "amount": -5.99, "categoryId": "charges", "note": "netflix"}, {"date": "2025-05-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-05-01", "amount": -15.0, "categoryId": "charges", "note": "impôts"}, {"date": "2025-05-01", "amount": -29.0, "categoryId": "owen", "note": "Vétérinaire"}, {"date": "2025-05-01", "amount": -109.54, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-05-01", "amount": 8.9, "categoryId": "sante", "note": "pharmacie"}, {"date": "2025-05-01", "amount": -26.92, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-05-01", "amount": -50.0, "categoryId": "vetements", "note": "Zalendo Jupe"}, {"date": "2025-05-01", "amount": -34.4, "categoryId": "restaurants", "note": "Boulangerie Pot Départ"}, {"date": "2025-05-01", "amount": -21.97, "categoryId": "restaurants", "note": "Courses Pot Départ"}, {"date": "2025-05-01", "amount": -11.4, "categoryId": "restaurants", "note": "Bagelstein"}, {"date": "2025-05-01", "amount": -7.47, "categoryId": "courses", "note": "HEMA"}, {"date": "2025-05-01", "amount": 15.85, "categoryId": "sante", "note": "Remboursement Brigitte"}, {"date": "2025-05-01", "amount": -15.4, "categoryId": "restaurants", "note": "Bagelstein"}, {"date": "2025-05-01", "amount": -6.7, "categoryId": "restaurants", "note": "starbucks"}, {"date": "2025-05-01", "amount": -16.0, "categoryId": "charges", "note": "Photomaton"}, {"date": "2025-05-01", "amount": 1000.0, "categoryId": "primes", "note": "Cadeau anniversaire maman"}, {"date": "2025-05-01", "amount": -500.0, "categoryId": "epargne", "note": "Epargne de la moité de maman"}, {"date": "2025-05-01", "amount": 10.0, "categoryId": "cadeaux", "note": "Remboursement Bouquet Victor"}, {"date": "2025-05-01", "amount": 15.0, "categoryId": "cadeaux", "note": "Remboursement Bouquet Paps"}, {"date": "2025-05-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-05-01", "amount": -13.3, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-05-01", "amount": -17.08, "categoryId": "courses", "note": "Action"}, {"date": "2025-05-01", "amount": -25.78, "categoryId": "courses", "note": "Boucherie"}, {"date": "2025-05-01", "amount": -16.95, "categoryId": "sante", "note": "Aromazone"}, {"date": "2025-05-01", "amount": -28.2, "categoryId": "owen", "note": "Vétérinaire"}, {"date": "2025-05-01", "amount": -7.22, "categoryId": "courses", "note": "RIE"}, {"date": "2025-05-01", "amount": -32.31, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-05-01", "amount": -155.0, "categoryId": "vetements", "note": "Chaussures Jonak"}, {"date": "2025-05-01", "amount": -15.21, "categoryId": "vetements", "note": "Cordon téléphone"}, {"date": "2025-05-01", "amount": -29.0, "categoryId": "owen", "note": "Vétérinaire"}, {"date": "2025-05-01", "amount": -10.5, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-05-01", "amount": -35.98, "categoryId": "vetements", "note": "Camaïeu"}, {"date": "2025-05-01", "amount": 9.0, "categoryId": "sante", "note": "Remboursement Brigitte"}, {"date": "2025-05-01", "amount": -4.0, "categoryId": "courses", "note": "vinaigre"}, {"date": "2025-05-01", "amount": 200.0, "categoryId": "primes", "note": "Cagnotte copains"}, {"date": "2025-05-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-05-01", "amount": -13.85, "categoryId": "voiture", "note": "Parking Houilles"}, {"date": "2025-05-01", "amount": -15.9, "categoryId": "restaurants", "note": "Houilles"}, {"date": "2025-05-01", "amount": -18.0, "categoryId": "plaisirs", "note": "Ateliers des lumières"}, {"date": "2025-05-01", "amount": -5.0, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-05-01", "amount": -8.9, "categoryId": "sante", "note": "pharmacie"}, {"date": "2025-05-01", "amount": -133.2, "categoryId": "plaisirs", "note": "Typologie"}, {"date": "2025-05-01", "amount": -22.01, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-05-01", "amount": 0.99, "categoryId": "vetements", "note": "ETAM"}, {"date": "2025-05-01", "amount": -61.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-05-01", "amount": 500.0, "categoryId": "primes", "note": "Cadeau Mutti"}, {"date": "2025-05-01", "amount": -250.0, "categoryId": "epargne", "note": "Epargne du chèque de mutti"}, {"date": "2025-05-01", "amount": 50.0, "categoryId": "primes", "note": "Mois Mutti"}, {"date": "2025-05-01", "amount": -110.0, "categoryId": "amenagement", "note": "Tapis avec cagnotte copains"}, {"date": "2025-05-01", "amount": -9.99, "categoryId": "plaisirs", "note": "Sephora"}, {"date": "2025-06-01", "amount": 3150.57, "categoryId": "salaire", "note": "Salaire reçu fin mai"}, {"date": "2025-06-01", "amount": -600.0, "categoryId": "voiture", "note": "Fin remboursement nouvelle voiture"}, {"date": "2025-05-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-06-01", "amount": -66.7, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-06-01", "amount": -20.0, "categoryId": "charges", "note": "Forfait telephone paps"}, {"date": "2025-06-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-06-01", "amount": -100.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-06-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-06-01", "amount": -42.22, "categoryId": "owen", "note": "Croquette"}, {"date": "2025-06-01", "amount": -47.5, "categoryId": "restaurants", "note": "Restaurant Mariage HM"}, {"date": "2025-06-01", "amount": -15.7, "categoryId": "cadeaux", "note": "Tabac Antibes"}, {"date": "2025-06-01", "amount": -13.5, "categoryId": "vetements", "note": "ETAM"}, {"date": "2025-06-01", "amount": -5.0, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-06-01", "amount": -6.4, "categoryId": "restaurants", "note": "starbucks"}, {"date": "2025-06-01", "amount": -1.13, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-06-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-06-01", "amount": -72.0, "categoryId": "voiture", "note": "Train retour"}, {"date": "2025-06-01", "amount": -8.98, "categoryId": "sante", "note": "pharmacie"}, {"date": "2025-06-01", "amount": -12.99, "categoryId": "courses", "note": "Sécateur HM"}, {"date": "2025-06-01", "amount": -72.0, "categoryId": "voiture", "note": "Summer Flex"}, {"date": "2025-06-01", "amount": -46.0, "categoryId": "voiture", "note": "Summer Flex"}, {"date": "2025-06-01", "amount": -6.9, "categoryId": "sante", "note": "pharmacie"}, {"date": "2025-06-01", "amount": -39.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-06-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-06-01", "amount": -38.34, "categoryId": "courses", "note": ""}, {"date": "2025-06-01", "amount": -67.58, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-06-01", "amount": -51.0, "categoryId": "cadeaux", "note": "Robby atelier feutrine"}, {"date": "2025-06-01", "amount": -3.8, "categoryId": "restaurants", "note": ""}, {"date": "2025-06-01", "amount": -2.08, "categoryId": "plaisirs", "note": "Fnac"}, {"date": "2025-06-01", "amount": -4.0, "categoryId": "restaurants", "note": "IKEA"}, {"date": "2025-06-01", "amount": -288.0, "categoryId": "amenagement", "note": "IKEA"}, {"date": "2025-06-01", "amount": -21.5, "categoryId": "restaurants", "note": ""}, {"date": "2025-06-01", "amount": -5.72, "categoryId": "voiture", "note": "Parking"}, {"date": "2025-06-01", "amount": -3.99, "categoryId": "amenagement", "note": ""}, {"date": "2025-06-01", "amount": -233.76, "categoryId": "voiture", "note": "Carte grise"}, {"date": "2025-06-01", "amount": -18.6, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-05-01", "amount": -89.9, "categoryId": "plaisirs", "note": "Ecran PC"}, {"date": "2025-06-01", "amount": -159.08, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-06-01", "amount": -5.26, "categoryId": "voiture", "note": "Parking"}, {"date": "2025-06-01", "amount": -16.94, "categoryId": "restaurants", "note": ""}, {"date": "2025-06-01", "amount": -21.98, "categoryId": "courses", "note": ""}, {"date": "2025-06-01", "amount": -14.5, "categoryId": "restaurants", "note": "Season square"}, {"date": "2025-06-01", "amount": -29.95, "categoryId": "plaisirs", "note": "Gourde"}, {"date": "2025-06-01", "amount": -4.0, "categoryId": "restaurants", "note": "Glace"}, {"date": "2025-06-01", "amount": -27.0, "categoryId": "restaurants", "note": "Restaurant journée PIP"}, {"date": "2025-06-01", "amount": -6.0, "categoryId": "plaisirs", "note": "FDJ"}, {"date": "2025-06-01", "amount": -105.89, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2025-06-01", "amount": -2.77, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-06-01", "amount": -60.29, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-06-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-06-01", "amount": -22.9, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2025-06-01", "amount": -136.0, "categoryId": "vacances", "note": "Logement EVJF Zélia (remboursé en septembre)"}, {"date": "2025-06-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-06-01", "amount": -69.88, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2025-06-01", "amount": -7.35, "categoryId": "vacances", "note": "Colis HM"}, {"date": "2025-06-01", "amount": -39.99, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2025-06-01", "amount": 50.0, "categoryId": "primes", "note": "Mois Mam's"}, {"date": "2025-06-01", "amount": -15.0, "categoryId": "cadeaux", "note": "Cagnotte Chloé"}, {"date": "2025-06-01", "amount": -39.12, "categoryId": "amenagement", "note": "Amazon"}, {"date": "2025-06-01", "amount": -6.0, "categoryId": "voiture", "note": "Péages"}, {"date": "2025-06-01", "amount": -95.02, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-06-01", "amount": -49.96, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2025-06-01", "amount": -19.8, "categoryId": "plaisirs", "note": "Glaces"}, {"date": "2025-06-01", "amount": -13.1, "categoryId": "restaurants", "note": "Pollux"}, {"date": "2025-06-01", "amount": -5.74, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-06-01", "amount": -29.15, "categoryId": "restaurants", "note": "McDo Lucette"}, {"date": "2025-06-01", "amount": -13.65, "categoryId": "cadeaux", "note": "Boulangerie"}, {"date": "2025-06-01", "amount": -5.8, "categoryId": "sante", "note": "pharmacie"}, {"date": "2025-06-01", "amount": -59.99, "categoryId": "vetements", "note": "Zalando chamise lin"}, {"date": "2025-06-01", "amount": -6.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-06-01", "amount": -6.09, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-06-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-06-01", "amount": 3647.87, "categoryId": "primes", "note": "Argent de Sophie"}, {"date": "2025-06-01", "amount": -3600.0, "categoryId": "epargne", "note": "Argent de Sophie"}, {"date": "2025-06-01", "amount": -7.3, "categoryId": "restaurants", "note": ""}, {"date": "2025-06-01", "amount": -9.9, "categoryId": "plaisirs", "note": "Quarts"}, {"date": "2025-06-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-06-01", "amount": -43.28, "categoryId": "restaurants", "note": "Uber eat pizza lucie"}, {"date": "2025-06-01", "amount": -21.0, "categoryId": "cadeaux", "note": "Bouquet zélia"}, {"date": "2025-07-01", "amount": 3058.0, "categoryId": "salaire", "note": "Salaire reçu fin juin"}, {"date": "2025-07-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-07-01", "amount": -12.4, "categoryId": "restaurants", "note": "Bagelstein"}, {"date": "2025-07-01", "amount": -7.0, "categoryId": "vacances", "note": "Summer flex"}, {"date": "2025-07-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-07-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-07-01", "amount": -100.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-07-01", "amount": 79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-07-01", "amount": -11.8, "categoryId": "sante", "note": "pharmacie"}, {"date": "2025-07-01", "amount": -6.35, "categoryId": "courses", "note": "Franprix"}, {"date": "2025-07-01", "amount": -45.0, "categoryId": "vacances", "note": "Remboursement tricount summer flex"}, {"date": "2025-07-01", "amount": -60.0, "categoryId": "sante", "note": "Ostéo"}, {"date": "2025-07-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-07-01", "amount": -96.07, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-07-01", "amount": -83.5, "categoryId": "restaurants", "note": "Soprano mutti"}, {"date": "2025-07-01", "amount": -3.5, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2025-07-01", "amount": -9.15, "categoryId": "courses", "note": "auchan"}, {"date": "2025-07-01", "amount": -28.0, "categoryId": "plaisirs", "note": "Concert"}, {"date": "2025-07-01", "amount": -11.0, "categoryId": "plaisirs", "note": "Concert"}, {"date": "2025-07-01", "amount": -65.01, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-07-01", "amount": -67.58, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-07-01", "amount": -39.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-07-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-07-01", "amount": -159.07, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-07-01", "amount": -2.79, "categoryId": "plaisirs", "note": "HEMA"}, {"date": "2025-07-01", "amount": -13.0, "categoryId": "restaurants", "note": "CB financière"}, {"date": "2025-07-01", "amount": -65.98, "categoryId": "vetements", "note": "Zalando tenue de sport marron"}, {"date": "2025-07-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Zélia anniversaire"}, {"date": "2025-07-01", "amount": -65.01, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-07-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-07-01", "amount": -1.2, "categoryId": "vacances", "note": "parking"}, {"date": "2025-07-01", "amount": -30.61, "categoryId": "vacances", "note": "Marché"}, {"date": "2025-07-01", "amount": -32.7, "categoryId": "vacances", "note": "glaces"}, {"date": "2025-07-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-07-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-07-01", "amount": -26.8, "categoryId": "vacances", "note": "Courses"}, {"date": "2025-07-01", "amount": -18.53, "categoryId": "vacances", "note": "Intermarché"}, {"date": "2025-07-01", "amount": -40.0, "categoryId": "vacances", "note": "Courses"}, {"date": "2025-07-01", "amount": -24.0, "categoryId": "vacances", "note": "Souvenirs"}, {"date": "2025-07-01", "amount": -255.0, "categoryId": "vacances", "note": "Restaurant"}, {"date": "2025-07-01", "amount": -15.0, "categoryId": "voiture", "note": "Péages"}, {"date": "2025-07-01", "amount": -33.0, "categoryId": "cadeaux", "note": ""}, {"date": "2025-07-01", "amount": -30.94, "categoryId": "vetements", "note": "Zalando"}, {"date": "2025-07-01", "amount": -20.0, "categoryId": "restaurants", "note": "Soprano avec Anthony et Victor"}, {"date": "2025-07-01", "amount": -16.0, "categoryId": "vacances", "note": "Virement auriane tricount"}, {"date": "2025-07-01", "amount": -30.39, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-07-01", "amount": -13.77, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-07-01", "amount": -50.32, "categoryId": "amenagement", "note": "Amazon"}, {"date": "2025-07-01", "amount": -43.0, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-07-01", "amount": -18.9, "categoryId": "courses", "note": "Marché"}, {"date": "2025-07-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-07-01", "amount": -10.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-07-01", "amount": -13.26, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-07-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2025-07-01", "amount": -71.0, "categoryId": "restaurants", "note": "Oxymore Paris"}, {"date": "2025-07-01", "amount": -9.6, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-07-01", "amount": -200.0, "categoryId": "epargne", "note": "Reste de fin de mois vers LA"}, {"date": "2025-08-01", "amount": 2540.6, "categoryId": "salaire", "note": "Salaire reçu fin juin"}, {"date": "2025-08-01", "amount": -24.95, "categoryId": "cadeaux", "note": "Bracelet Maman"}, {"date": "2025-08-01", "amount": -41.5, "categoryId": "plaisirs", "note": "Verre avec Chloé"}, {"date": "2025-08-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-08-01", "amount": -10.68, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-08-01", "amount": -100.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-08-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-08-01", "amount": -20.0, "categoryId": "charges", "note": "RED by SFR"}, {"date": "2025-08-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-08-01", "amount": -2.3, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-08-01", "amount": -13.99, "categoryId": "courses", "note": "Marché"}, {"date": "2025-08-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-08-01", "amount": -159.08, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-08-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-08-01", "amount": -39.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-08-01", "amount": -9.9, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-08-01", "amount": -34.97, "categoryId": "plaisirs", "note": "Aromazone"}, {"date": "2025-08-01", "amount": -67.58, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-08-01", "amount": -1.78, "categoryId": "courses", "note": "Picard"}, {"date": "2025-08-01", "amount": -19.8, "categoryId": "cadeaux", "note": "Cocholed victor"}, {"date": "2025-08-01", "amount": -5.45, "categoryId": "sante", "note": "Piscine"}, {"date": "2025-08-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Bouquet Sylvie"}, {"date": "2025-08-01", "amount": -9.58, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-08-01", "amount": -12.25, "categoryId": "courses", "note": "Marché"}, {"date": "2025-08-01", "amount": -76.63, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-08-01", "amount": -19.27, "categoryId": "courses", "note": "Action"}, {"date": "2025-08-01", "amount": -15.0, "categoryId": "plaisirs", "note": "Pince à linge broderie"}, {"date": "2025-08-01", "amount": -200.0, "categoryId": "epargne", "note": "comme ça"}, {"date": "2025-08-01", "amount": -18.82, "categoryId": "plaisirs", "note": "Aromazone"}, {"date": "2025-08-01", "amount": -19.1, "categoryId": "vacances", "note": "Accompte camping"}, {"date": "2025-08-01", "amount": -1.49, "categoryId": "courses", "note": "Gifi"}, {"date": "2025-08-01", "amount": -2.5, "categoryId": "plaisirs", "note": "Fil nylon"}, {"date": "2025-08-01", "amount": -11.99, "categoryId": "cadeaux", "note": "Valise mutti avec 20e de Lionel et 40e de maman"}, {"date": "2025-08-01", "amount": -2.8, "categoryId": "courses", "note": "bouffe pour chat errant"}, {"date": "2025-08-01", "amount": 149.99, "categoryId": "primes", "note": "Virement parents"}, {"date": "2025-08-01", "amount": 8.5, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-08-01", "amount": -49.35, "categoryId": "sante", "note": "Piscine"}, {"date": "2025-08-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-08-01", "amount": -21.8, "categoryId": "voiture", "note": "Bombes anti creuvaison"}, {"date": "2025-08-01", "amount": -68.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-08-01", "amount": -20.0, "categoryId": "voiture", "note": "pneu vis"}, {"date": "2025-08-01", "amount": -10.52, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-08-01", "amount": -11.86, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-08-01", "amount": -25.19, "categoryId": "restaurants", "note": "Uber eat"}, {"date": "2025-08-01", "amount": -29.97, "categoryId": "vetements", "note": "Undiz"}, {"date": "2025-08-01", "amount": -38.97, "categoryId": "vetements", "note": "HM"}, {"date": "2025-08-01", "amount": -44.99, "categoryId": "vetements", "note": "Jean Only"}, {"date": "2025-08-01", "amount": -5.0, "categoryId": "amenagement", "note": "Emmaüs"}, {"date": "2025-08-01", "amount": 400.0, "categoryId": "primes", "note": "Mutti pour les vacances"}, {"date": "2025-08-01", "amount": -41.98, "categoryId": "vetements", "note": "Camaïeu"}, {"date": "2025-08-01", "amount": -5.1, "categoryId": "amenagement", "note": "Gravure vinted gémeaux"}, {"date": "2025-08-01", "amount": -4.13, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-08-01", "amount": -79.98, "categoryId": "amenagement", "note": "H&M Draps"}, {"date": "2025-08-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-08-01", "amount": -47.98, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-08-01", "amount": -20.0, "categoryId": "vetements", "note": "Jupe C&A"}, {"date": "2025-08-01", "amount": -16.2, "categoryId": "plaisirs", "note": "Ateliers des lumières"}, {"date": "2025-08-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-08-01", "amount": -5.0, "categoryId": "cadeaux", "note": "Magnet mutti"}, {"date": "2025-08-01", "amount": -15.3, "categoryId": "cadeaux", "note": "Starbucks mutti"}, {"date": "2025-08-01", "amount": -19.06, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-08-01", "amount": -500.0, "categoryId": "epargne", "note": "Reste de fin de mois vers LA"}, {"date": "2025-09-01", "amount": 2565.81, "categoryId": "salaire", "note": "Salaire reçu fin août"}, {"date": "2025-09-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2025-09-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2025-09-01", "amount": -100.0, "categoryId": "epargne_tf", "note": "Epargne taxe foncière"}, {"date": "2025-09-01", "amount": -32.11, "categoryId": "vacances", "note": "Vrac"}, {"date": "2025-09-01", "amount": -22.2, "categoryId": "vacances", "note": "Boulangerie"}, {"date": "2025-09-01", "amount": -8.1, "categoryId": "vacances", "note": "Boulangerie"}, {"date": "2025-09-01", "amount": -50.01, "categoryId": "vacances", "note": "Essence"}, {"date": "2025-09-01", "amount": -7.96, "categoryId": "vacances", "note": "Super U"}, {"date": "2025-09-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-09-01", "amount": -45.35, "categoryId": "vacances", "note": "Cidre et jus de pomme pétillant"}, {"date": "2025-09-01", "amount": -30.0, "categoryId": "cadeaux", "note": "Thèse Zélia"}, {"date": "2025-09-01", "amount": -5.5, "categoryId": "vacances", "note": "L'escale"}, {"date": "2025-09-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Fleurs"}, {"date": "2025-09-01", "amount": -39.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-09-01", "amount": -9.9, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-09-01", "amount": -7.0, "categoryId": "sante", "note": "RDV Brigitte"}, {"date": "2025-09-01", "amount": -22.05, "categoryId": "vacances", "note": ""}, {"date": "2025-09-01", "amount": -18.51, "categoryId": "charges", "note": "AXA"}, {"date": "2025-09-01", "amount": 67.58, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-09-01", "amount": -34.5, "categoryId": "vacances", "note": "Mendual"}, {"date": "2025-09-01", "amount": -6.6, "categoryId": "vacances", "note": "Cap au large"}, {"date": "2025-09-01", "amount": -6.85, "categoryId": "vacances", "note": "Nicaukib"}, {"date": "2025-09-01", "amount": -7.2, "categoryId": "vacances", "note": "Parking quiberon"}, {"date": "2025-09-01", "amount": -27.3, "categoryId": "vacances", "note": "Reste camping Saint Pierre Quiberon"}, {"date": "2025-09-01", "amount": -18.8, "categoryId": "vacances", "note": "Bigorn'eau"}, {"date": "2025-09-01", "amount": -20.0, "categoryId": "vacances", "note": "Batterie sans fil portable"}, {"date": "2025-09-01", "amount": -42.55, "categoryId": "vacances", "note": "La Belle iloise"}, {"date": "2025-09-01", "amount": -15.9, "categoryId": "vacances", "note": "Riguidel"}, {"date": "2025-09-01", "amount": -4.0, "categoryId": "vacances", "note": "Chocolat chaud colobri"}, {"date": "2025-09-01", "amount": -17.5, "categoryId": "vacances", "note": "Poulet marché"}, {"date": "2025-09-01", "amount": -9.95, "categoryId": "vacances", "note": "Andouille"}, {"date": "2025-09-01", "amount": -24.5, "categoryId": "vacances", "note": "Les mouettes resto quiberon"}, {"date": "2025-09-01", "amount": -44.0, "categoryId": "vacances", "note": "Suspensions marché"}, {"date": "2025-09-01", "amount": -20.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-09-01", "amount": -11.07, "categoryId": "courses", "note": "Courses"}, {"date": "2025-09-01", "amount": -56.63, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-09-01", "amount": -84.8, "categoryId": "owen", "note": "Croquettes et pâtés"}, {"date": "2025-09-01", "amount": -87.98, "categoryId": "vetements", "note": "Zalando (debardeur gris, sweat gris, pull marron)"}, {"date": "2025-09-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-09-01", "amount": -159.08, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-09-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-09-01", "amount": -31.47, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-09-01", "amount": 57.0, "categoryId": "remboursements", "note": "Remboursement parents lesconil"}, {"date": "2025-09-01", "amount": -22.0, "categoryId": "plaisirs", "note": "Ateliers des lumières"}, {"date": "2025-09-01", "amount": -151.0, "categoryId": "plaisirs", "note": "Concert The Weekend 2026"}, {"date": "2025-09-01", "amount": -35.79, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-09-01", "amount": -22.42, "categoryId": "courses", "note": "La terrine"}, {"date": "2025-09-01", "amount": -7.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-09-01", "amount": -38.5, "categoryId": "plaisirs", "note": "Vente plantes"}, {"date": "2025-09-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2025-09-01", "amount": 1500.0, "categoryId": "primes", "note": "Virement partie 1 mam's"}, {"date": "2025-09-01", "amount": -1500.0, "categoryId": "epargne", "note": "Virement partie 1 mam's"}, {"date": "2025-09-01", "amount": -19.5, "categoryId": "restaurants", "note": "PIP Pollux"}, {"date": "2025-09-01", "amount": -0.98, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2025-09-01", "amount": -24.9, "categoryId": "vacances", "note": "Péages"}, {"date": "2025-09-01", "amount": -84.57, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-09-01", "amount": -30.0, "categoryId": "sante", "note": "Brigitte"}, {"date": "2025-09-01", "amount": -5.1, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-09-01", "amount": -29.06, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-09-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-09-01", "amount": -116.0, "categoryId": "charges", "note": "Impôts"}, {"date": "2025-09-01", "amount": -24.1, "categoryId": "restaurants", "note": "McDo Paps"}, {"date": "2025-09-01", "amount": -5.0, "categoryId": "vetements", "note": "chaussettes marron"}, {"date": "2025-09-01", "amount": -12.5, "categoryId": "courses", "note": "Resto Pollux"}, {"date": "2025-09-01", "amount": -30.0, "categoryId": "plaisirs", "note": "Fleurs"}, {"date": "2025-09-01", "amount": -30.3, "categoryId": "restaurants", "note": "Restaurant Paris"}, {"date": "2025-09-01", "amount": -62.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-09-01", "amount": -25.0, "categoryId": "plaisirs", "note": "Vean twisto velolib"}, {"date": "2025-09-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-10-01", "amount": 2533.82, "categoryId": "salaire", "note": "Salaire reçu fin sept"}, {"date": "2025-10-01", "amount": -18.4, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-10-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2025-10-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2025-10-01", "amount": -125.0, "categoryId": "epargne_tf", "note": "Taxe foncière"}, {"date": "2025-10-01", "amount": -4.0, "categoryId": "sante", "note": "Ophtalmo De Luca (avec rembousement génération)"}, {"date": "2025-10-01", "amount": -39.9, "categoryId": "cadeaux", "note": "Bouquet Alex"}, {"date": "2025-10-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-10-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-10-01", "amount": -10.4, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-10-01", "amount": -55.65, "categoryId": "plaisirs", "note": "Amazon"}, {"date": "2025-10-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-10-01", "amount": -67.58, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-10-01", "amount": -27.27, "categoryId": "charges", "note": "AXA"}, {"date": "2025-10-01", "amount": -39.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-10-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-10-01", "amount": -39.0, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-10-01", "amount": -20.76, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-10-01", "amount": -295.0, "categoryId": "primes", "note": "Sac Sézanne avec argent bijoux mutti"}, {"date": "2025-10-01", "amount": -53.05, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-10-01", "amount": -24.4, "categoryId": "restaurants", "note": "Date Nassime"}, {"date": "2025-10-01", "amount": -8.0, "categoryId": "restaurants", "note": "Date Nassime"}, {"date": "2025-10-01", "amount": -85.65, "categoryId": "plaisirs", "note": "Concert Charly Winston"}, {"date": "2025-10-01", "amount": -25.0, "categoryId": "cadeaux", "note": "Cadeau Lucas"}, {"date": "2025-10-01", "amount": -1.0, "categoryId": "voiture", "note": "Vélo Caen"}, {"date": "2025-10-01", "amount": 13.0, "categoryId": "restaurants", "note": "Remboursement Josépha"}, {"date": "2025-10-01", "amount": -2.3, "categoryId": "restaurants", "note": "Oh my saj"}, {"date": "2025-10-01", "amount": -9.2, "categoryId": "voiture", "note": "Bolt"}, {"date": "2025-10-01", "amount": -154.47, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-10-01", "amount": -57.29, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-10-01", "amount": 136.0, "categoryId": "vacances", "note": "Rembousement EVJF Zélia"}, {"date": "2025-10-01", "amount": -26.5, "categoryId": "cadeaux", "note": "Porte bébé minous"}, {"date": "2025-10-01", "amount": -15.24, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2025-10-01", "amount": -54.24, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-10-01", "amount": -4.99, "categoryId": "cadeaux", "note": "Chausse pied Lucie"}, {"date": "2025-10-01", "amount": -2.79, "categoryId": "plaisirs", "note": "Accessoire téléphone"}, {"date": "2025-10-01", "amount": 15.89, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-10-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-10-01", "amount": 1380.0, "categoryId": "primes", "note": "Mutti argent bijoux #1"}, {"date": "2025-10-01", "amount": -1000.0, "categoryId": "epargne", "note": "Virement de l'argent de mutti (moins le sac, reste 85e)"}, {"date": "2025-10-01", "amount": -19.6, "categoryId": "restaurants", "note": "Resto Pollux"}, {"date": "2025-10-01", "amount": -46.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-10-01", "amount": -88.06, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-10-01", "amount": -53.6, "categoryId": "voiture", "note": "Péages"}, {"date": "2025-10-01", "amount": -21.5, "categoryId": "restaurants", "note": "Japonais Lucette"}, {"date": "2025-10-01", "amount": -26.0, "categoryId": "restaurants", "note": "Soprano Lucie"}, {"date": "2025-10-01", "amount": -104.0, "categoryId": "plaisirs", "note": "Coiffeur"}, {"date": "2025-10-01", "amount": -66.48, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-10-01", "amount": -12.7, "categoryId": "plaisirs", "note": "Cinéma"}, {"date": "2025-10-01", "amount": -15.8, "categoryId": "restaurants", "note": "McDo Caen"}, {"date": "2025-10-01", "amount": -16.9, "categoryId": "restaurants", "note": "Coréen BNF"}, {"date": "2025-10-01", "amount": 1025.0, "categoryId": "epargne_tf", "note": "Prise de cette somme sur le Livret A"}, {"date": "2025-10-01", "amount": -34.0, "categoryId": "plaisirs", "note": "Bar Le Certa"}, {"date": "2025-10-01", "amount": -48.56, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-10-01", "amount": -31.86, "categoryId": "courses", "note": "Truffaut"}, {"date": "2025-10-01", "amount": -4.3, "categoryId": "restaurants", "note": "Boulangerie Yassine Saint Germain en Laye"}, {"date": "2025-10-01", "amount": -4.9, "categoryId": "voiture", "note": "Parking Saint Germain en Laye"}, {"date": "2025-10-01", "amount": -54.15, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-10-01", "amount": -28.0, "categoryId": "restaurants", "note": "Restaurant Coréen"}, {"date": "2025-10-01", "amount": -21.7, "categoryId": "plaisirs", "note": "Cinéma UGC"}, {"date": "2025-10-01", "amount": -2.7, "categoryId": "courses", "note": "Solishop complément cadeaux Docaposte"}, {"date": "2025-10-01", "amount": 475.0, "categoryId": "epargne", "note": "Prise de cette somme sur le Livret A pour compléter TF"}, {"date": "2025-10-01", "amount": 125.0, "categoryId": "epargne", "note": "Prise de cette somme sur le Livret A pour compléter TF"}, {"date": "2025-10-01", "amount": -1468.0, "categoryId": "charges", "note": "Taxe foncière"}, {"date": "2025-10-01", "amount": -116.0, "categoryId": "charges", "note": "Impôts"}, {"date": "2025-10-01", "amount": 1500.0, "categoryId": "primes", "note": "Virement partie 2 mam's"}, {"date": "2025-10-01", "amount": -1000.0, "categoryId": "epargne", "note": "Virement partie 2 mam's"}, {"date": "2025-10-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-10-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-11-01", "amount": 2533.82, "categoryId": "salaire", "note": "Salaire reçu fin oct"}, {"date": "2025-11-01", "amount": -16.9, "categoryId": "restaurants", "note": "Restaurant Coréen"}, {"date": "2025-11-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-11-01", "amount": -125.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-11-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-11-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-11-01", "amount": -1.99, "categoryId": "cadeaux", "note": "Action"}, {"date": "2025-11-01", "amount": -34.58, "categoryId": "cadeaux", "note": "B&M"}, {"date": "2025-11-01", "amount": -10.0, "categoryId": "cadeaux", "note": "Kiabi"}, {"date": "2025-11-01", "amount": -34.48, "categoryId": "courses", "note": "Picard"}, {"date": "2025-11-01", "amount": -37.77, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-11-01", "amount": -58.0, "categoryId": "plaisirs", "note": "Masters de feux"}, {"date": "2025-11-01", "amount": -70.18, "categoryId": "vetements", "note": "Camaïeu"}, {"date": "2025-11-01", "amount": -39.9, "categoryId": "vetements", "note": "Uniqlo"}, {"date": "2025-11-01", "amount": -15.95, "categoryId": "vetements", "note": "Calzedonia"}, {"date": "2025-11-01", "amount": -15.0, "categoryId": "plaisirs", "note": "Lush"}, {"date": "2025-11-01", "amount": -14.9, "categoryId": "restaurants", "note": "Miam Parly 2"}, {"date": "2025-11-01", "amount": -7.99, "categoryId": "vetements", "note": "HM"}, {"date": "2025-11-01", "amount": -9.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-11-01", "amount": -8.56, "categoryId": "sante", "note": "Pillule lendemain"}, {"date": "2025-11-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-11-01", "amount": -67.58, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-11-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2025-11-01", "amount": -50.47, "categoryId": "vetements", "note": "Tezenis"}, {"date": "2025-11-01", "amount": -39.0, "categoryId": "sante", "note": "Abonnement salle de sport"}, {"date": "2025-11-01", "amount": -13.55, "categoryId": "cadeaux", "note": "Boulangerie Thoiry"}, {"date": "2025-11-01", "amount": -17.0, "categoryId": "vacances", "note": "Petit dej Honfleur"}, {"date": "2025-11-01", "amount": -3.8, "categoryId": "vacances", "note": ""}, {"date": "2025-11-01", "amount": -1.5, "categoryId": "vacances", "note": "carte postale"}, {"date": "2025-11-01", "amount": -22.85, "categoryId": "sante", "note": "Aromazone"}, {"date": "2025-11-01", "amount": -40.7, "categoryId": "vacances", "note": "Crêperie Honfleur"}, {"date": "2025-11-01", "amount": -9.2, "categoryId": "plaisirs", "note": "FDJ"}, {"date": "2025-11-01", "amount": -9.8, "categoryId": "vacances", "note": "Bar honfleur"}, {"date": "2025-11-01", "amount": -14.0, "categoryId": "sante", "note": "Orthoptiste"}, {"date": "2025-11-01", "amount": -11.0, "categoryId": "vacances", "note": "Honfleur"}, {"date": "2025-11-01", "amount": -60.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-11-01", "amount": -26.2, "categoryId": "restaurants", "note": "Japonais Starac"}, {"date": "2025-11-01", "amount": -154.47, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-11-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-11-01", "amount": -7.05, "categoryId": "restaurants", "note": ""}, {"date": "2025-11-01", "amount": -69.99, "categoryId": "vetements", "note": "Decathlon"}, {"date": "2025-11-01", "amount": -8.73, "categoryId": "courses", "note": "B&M"}, {"date": "2025-11-01", "amount": -57.07, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-11-01", "amount": -1.1, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-11-01", "amount": -70.83, "categoryId": "plaisirs", "note": "Ticketmaster one republic (lucie remboursé le 24/12)"}, {"date": "2025-11-01", "amount": -50.3, "categoryId": "cadeaux", "note": "West Rider boutique mantes"}, {"date": "2025-11-01", "amount": -10.0, "categoryId": "sante", "note": "Endorun"}, {"date": "2025-11-01", "amount": -53.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-11-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-11-01", "amount": -23.7, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-11-01", "amount": -4.8, "categoryId": "courses", "note": "La ruche"}, {"date": "2025-11-01", "amount": -15.49, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-11-01", "amount": -5.0, "categoryId": "plaisirs", "note": "Ber Pollux"}, {"date": "2025-11-01", "amount": -33.98, "categoryId": "vetements", "note": "Zalando"}, {"date": "2025-11-01", "amount": -14.44, "categoryId": "cadeaux", "note": "Léonidas"}, {"date": "2025-11-01", "amount": -70.9, "categoryId": "voiture", "note": "Péages"}, {"date": "2025-11-01", "amount": -13.8, "categoryId": "sante", "note": "Dentiste"}, {"date": "2025-11-01", "amount": -22.0, "categoryId": "restaurants", "note": "Shayan palace"}, {"date": "2025-11-01", "amount": 1200.0, "categoryId": "primes", "note": "Mutti argent bijoux #2"}, {"date": "2025-11-01", "amount": -1200.0, "categoryId": "epargne", "note": ""}, {"date": "2025-11-01", "amount": -35.37, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-11-01", "amount": -58.0, "categoryId": "cadeaux", "note": "Calendrier de l'avent Thé"}, {"date": "2025-11-01", "amount": -4.59, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2025-11-01", "amount": 13.8, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-11-01", "amount": -49.95, "categoryId": "vetements", "note": "Veste Levis Rouge"}, {"date": "2025-11-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-11-01", "amount": -2.64, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2025-11-01", "amount": 16.02, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-11-01", "amount": 22.02, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-11-01", "amount": 34.14, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-11-01", "amount": -116.0, "categoryId": "charges", "note": "Impôts"}, {"date": "2025-11-01", "amount": 9.2, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-11-01", "amount": -42.21, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-11-01", "amount": -13.4, "categoryId": "restaurants", "note": "Pâtes Pollux"}, {"date": "2025-11-01", "amount": -4.99, "categoryId": "vetements", "note": "Tezenis"}, {"date": "2025-11-01", "amount": -9.0, "categoryId": "plaisirs", "note": "Jacq catherine (salon DIY)"}, {"date": "2025-11-01", "amount": -22.5, "categoryId": "plaisirs", "note": "Salon DIY"}, {"date": "2025-11-01", "amount": -58.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-11-01", "amount": -15.0, "categoryId": "sante", "note": "Salle Victor Anthony"}, {"date": "2025-11-01", "amount": -70.0, "categoryId": "plaisirs", "note": "WE Caen remboursement Yassine"}, {"date": "2025-12-01", "amount": 2526.62, "categoryId": "salaire", "note": "Salaire reçu fin nov"}, {"date": "2025-12-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2025-12-01", "amount": 32.03, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-12-01", "amount": -14.21, "categoryId": "cadeaux", "note": "Action"}, {"date": "2025-12-01", "amount": -16.11, "categoryId": "cadeaux", "note": "Stokomani"}, {"date": "2025-12-01", "amount": -90.37, "categoryId": "cadeaux", "note": "Nespresso"}, {"date": "2025-12-01", "amount": -16.9, "categoryId": "cadeaux", "note": "Aromazone"}, {"date": "2025-12-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-12-01", "amount": -125.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2025-12-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-12-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2025-12-01", "amount": -60.06, "categoryId": "sante", "note": "Orthoptiste"}, {"date": "2025-12-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2025-12-01", "amount": -59.83, "categoryId": "cadeaux", "note": "Boku"}, {"date": "2025-12-01", "amount": -88.8, "categoryId": "voiture", "note": "Forfait Navigo"}, {"date": "2025-12-01", "amount": -365.0, "categoryId": "vacances", "note": "EVJF HM - Avion"}, {"date": "2025-12-01", "amount": -120.0, "categoryId": "amenagement", "note": "Plombier entretien chaudière"}, {"date": "2025-12-01", "amount": 24.03, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-12-01", "amount": -13.25, "categoryId": "courses", "note": "Courses PIP Nice"}, {"date": "2025-12-01", "amount": -24.0, "categoryId": "restaurants", "note": "Restaurant PIP Nice"}, {"date": "2025-12-01", "amount": -67.58, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2025-12-01", "amount": -10.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2025-12-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2025-12-01", "amount": -76.69, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-12-01", "amount": -23.8, "categoryId": "cadeaux", "note": "Thé"}, {"date": "2025-12-01", "amount": -1.95, "categoryId": "cadeaux", "note": "Carte de voeux"}, {"date": "2025-12-01", "amount": -4.99, "categoryId": "cadeaux", "note": "Cadeaux chiens"}, {"date": "2025-12-01", "amount": -52.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2025-12-01", "amount": -10.99, "categoryId": "cadeaux", "note": "Mango mutti"}, {"date": "2025-12-01", "amount": -8.56, "categoryId": "cadeaux", "note": "Colis Séverine"}, {"date": "2025-12-01", "amount": -41.33, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-12-01", "amount": -2.99, "categoryId": "cadeaux", "note": "Kiko"}, {"date": "2025-12-01", "amount": -17.09, "categoryId": "courses", "note": "Auchan"}, {"date": "2025-12-01", "amount": -5.0, "categoryId": "cadeaux", "note": "Cagnotte Daria"}, {"date": "2025-12-01", "amount": -45.0, "categoryId": "voiture", "note": "Amende excès de vitesse"}, {"date": "2025-12-01", "amount": 1500.0, "categoryId": "primes", "note": "Virement partie 3 mam's"}, {"date": "2025-12-01", "amount": -0.5, "categoryId": "courses", "note": "Donut pollux"}, {"date": "2025-12-01", "amount": -24.7, "categoryId": "plaisirs", "note": "Sortie filles"}, {"date": "2025-12-01", "amount": -16.9, "categoryId": "restaurants", "note": "Coréen Pollux avec chloé"}, {"date": "2025-12-01", "amount": -112.0, "categoryId": "plaisirs", "note": "Madame loyal mars"}, {"date": "2025-12-01", "amount": 154.47, "categoryId": "charges", "note": "Charges mensuelles"}, {"date": "2025-12-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2025-12-01", "amount": -10.0, "categoryId": "cadeaux", "note": "Cagnotte Honorine"}, {"date": "2025-12-01", "amount": -10.0, "categoryId": "cadeaux", "note": "Cagnotte Liana"}, {"date": "2025-12-01", "amount": 30.03, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-12-01", "amount": -60.06, "categoryId": "sante", "note": "Orthoptiste"}, {"date": "2025-12-01", "amount": -4.7, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-12-01", "amount": -16.9, "categoryId": "restaurants", "note": "pacific"}, {"date": "2025-12-01", "amount": -57.59, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-12-01", "amount": -15.0, "categoryId": "restaurants", "note": ""}, {"date": "2025-12-01", "amount": -40.49, "categoryId": "voiture", "note": "essence"}, {"date": "2025-12-01", "amount": -1.99, "categoryId": "courses", "note": "G20"}, {"date": "2025-12-01", "amount": -24.0, "categoryId": "cadeaux", "note": "Nespresso"}, {"date": "2025-12-01", "amount": -75.4, "categoryId": "vetements", "note": "Darjeling"}, {"date": "2025-12-01", "amount": -175.0, "categoryId": "sante", "note": "Echo pelvienne"}, {"date": "2025-12-01", "amount": 24.03, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-12-01", "amount": -15.27, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2025-12-01", "amount": -13.85, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-12-01", "amount": -60.15, "categoryId": "voiture", "note": "essence"}, {"date": "2025-12-01", "amount": 64.8, "categoryId": "sante", "note": ""}, {"date": "2025-12-01", "amount": -82.2, "categoryId": "voiture", "note": "péage"}, {"date": "2025-12-01", "amount": -4.3, "categoryId": "courses", "note": "thé"}, {"date": "2025-12-01", "amount": 0.2, "categoryId": "voiture", "note": "Uber Yassine"}, {"date": "2025-12-01", "amount": -13.85, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-12-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2025-12-01", "amount": -6.0, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2025-12-01", "amount": -28.62, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-12-01", "amount": -40.0, "categoryId": "cadeaux", "note": "Retrait"}, {"date": "2025-12-01", "amount": -21.5, "categoryId": "restaurants", "note": "Japonais Lucette"}, {"date": "2025-12-01", "amount": -29.48, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-12-01", "amount": -15.0, "categoryId": "voiture", "note": "lavage voiture"}, {"date": "2025-12-01", "amount": -7.9, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2025-12-01", "amount": -32.05, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-12-01", "amount": -4.52, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2025-12-01", "amount": -60.06, "categoryId": "sante", "note": "Orthoptiste"}, {"date": "2025-12-01", "amount": -7.9, "categoryId": "sante", "note": "pharmacie"}, {"date": "2025-12-01", "amount": -47.87, "categoryId": "vetements", "note": "NA-KD"}, {"date": "2025-12-01", "amount": 90.91, "categoryId": "sante", "note": "Remboursement Santé"}, {"date": "2025-12-01", "amount": -31.97, "categoryId": "cadeaux", "note": "Monceaux fleurs"}, {"date": "2025-12-01", "amount": -66.17, "categoryId": "plaisirs", "note": "Vinyle SIA"}, {"date": "2025-12-01", "amount": 150.0, "categoryId": "vacances", "note": "Vente cadre tufting"}, {"date": "2025-12-01", "amount": -150.0, "categoryId": "vacances", "note": "Retrait pour Achat snow Cyril"}, {"date": "2025-12-01", "amount": -29.79, "categoryId": "cadeaux", "note": "Léonidas pour Maman et Soeur Yassine"}, {"date": "2025-12-01", "amount": 115.0, "categoryId": "cadeaux", "note": "Remboursement cadeau nespresso maman"}, {"date": "2025-12-01", "amount": -50.04, "categoryId": "courses", "note": "Achat timbres Pauline et Lucas"}, {"date": "2025-12-01", "amount": 50.0, "categoryId": "courses", "note": "Remboursement achat timbes Pauline et Lucas"}, {"date": "2025-12-01", "amount": 32.0, "categoryId": "cadeaux", "note": "Remboursement Fleurs"}, {"date": "2025-12-01", "amount": -33.36, "categoryId": "courses", "note": "Carnet de timbre Alice + Mams"}, {"date": "2025-12-01", "amount": -5.9, "categoryId": "restaurants", "note": "Starbuks"}, {"date": "2025-12-01", "amount": -1.0, "categoryId": "courses", "note": "WC"}, {"date": "2025-12-01", "amount": -6.37, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-12-01", "amount": 99.41, "categoryId": "sante", "note": "Remboursement Echo pelvienne"}, {"date": "2025-12-01", "amount": -117.0, "categoryId": "charges", "note": "Impôts"}, {"date": "2025-12-01", "amount": 150.0, "categoryId": "vacances", "note": "Vente cadre tufting (dans vacances pour compenser achat snow Cyril)"}, {"date": "2025-12-01", "amount": -600.0, "categoryId": "primes", "note": "Retrait pour achat vélo janvier avec argent bijoux mutti"}, {"date": "2025-12-01", "amount": 28.03, "categoryId": "sante", "note": "Remboursement"}, {"date": "2025-12-01", "amount": -4.3, "categoryId": "charges", "note": "LCL"}, {"date": "2025-12-01", "amount": 24.03, "categoryId": "sante", "note": "Remboursement"}, {"date": "2025-12-01", "amount": -27.78, "categoryId": "courses", "note": "Fromager"}, {"date": "2025-12-01", "amount": -10.36, "categoryId": "courses", "note": "Intermarché"}, {"date": "2025-12-01", "amount": 17.0, "categoryId": "sante", "note": "Remboursement"}, {"date": "2025-12-01", "amount": 9.0, "categoryId": "sante", "note": "Remboursement"}, {"date": "2025-12-01", "amount": -75.0, "categoryId": "voiture", "note": "Amende stationnement"}, {"date": "2025-12-01", "amount": -30.0, "categoryId": "sante", "note": "Brigitte"}, {"date": "2025-12-01", "amount": -18.0, "categoryId": "sante", "note": "RDV AMP"}, {"date": "2026-01-01", "amount": 2523.02, "categoryId": "salaire", "note": "Salaire reçu fin décembre"}, {"date": "2026-01-01", "amount": 200.0, "categoryId": "primes", "note": "INTERETS 2025"}, {"date": "2026-01-01", "amount": -200.0, "categoryId": "epargne", "note": "INTERETS 2025"}, {"date": "2026-01-01", "amount": 9.51, "categoryId": "courses", "note": "Petit + Epargne"}, {"date": "2026-01-01", "amount": -125.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2026-01-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-01-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-01-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2026-01-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2026-01-01", "amount": -81.69, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-01-01", "amount": -8.5, "categoryId": "restaurants", "note": "Cinéma"}, {"date": "2026-01-01", "amount": -10.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2026-01-01", "amount": -58.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2026-01-01", "amount": -90.8, "categoryId": "voiture", "note": "Abonnement Navigo"}, {"date": "2026-01-01", "amount": -69.02, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2026-01-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2026-01-01", "amount": -15.1, "categoryId": "restaurants", "note": "Allegria Pollux"}, {"date": "2026-01-01", "amount": -50.0, "categoryId": "restaurants", "note": "Pizzeria Montrouge Yassine"}, {"date": "2026-01-01", "amount": -50.0, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-01-01", "amount": 50.0, "categoryId": "primes", "note": "Espèce mutti"}, {"date": "2026-01-01", "amount": -50.0, "categoryId": "plaisirs", "note": "Bracelet Mutti"}, {"date": "2026-01-01", "amount": -25.0, "categoryId": "plaisirs", "note": "Bracelet Mutti"}, {"date": "2026-01-01", "amount": 50.0, "categoryId": "plaisirs", "note": "Rembourcement Bracelet Mutti"}, {"date": "2026-01-01", "amount": 25.0, "categoryId": "plaisirs", "note": "Remboursement Bracelet Mutti"}, {"date": "2026-01-01", "amount": -48.57, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-01-01", "amount": -7.98, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2026-01-01", "amount": -19.6, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-01-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2026-01-01", "amount": -9.63, "categoryId": "courses", "note": "Fromagerie"}, {"date": "2026-01-01", "amount": 500.0, "categoryId": "primes", "note": "Parents"}, {"date": "2026-01-01", "amount": -500.0, "categoryId": "epargne", "note": "Parents"}, {"date": "2026-01-01", "amount": -169.14, "categoryId": "charges", "note": "Charges"}, {"date": "2026-01-01", "amount": -36.03, "categoryId": "courses", "note": "Pollux"}, {"date": "2026-01-01", "amount": 36.03, "categoryId": "courses", "note": "Remboursement Pollux"}, {"date": "2026-01-01", "amount": -9.99, "categoryId": "charges", "note": "RED by SFR"}, {"date": "2026-01-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2026-01-01", "amount": -15.27, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-01-01", "amount": -1.1, "categoryId": "courses", "note": "Marie Blanchère"}, {"date": "2026-01-01", "amount": -8.84, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-01-01", "amount": -9.78, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-01-01", "amount": -40.6, "categoryId": "voiture", "note": "Péages Décembre"}, {"date": "2026-01-01", "amount": -39.8, "categoryId": "owen", "note": "Ultra Premium Direct"}, {"date": "2026-01-01", "amount": -13.6, "categoryId": "vacances", "note": "Norma"}, {"date": "2026-01-01", "amount": -26.5, "categoryId": "vacances", "note": "Le Grizzly"}, {"date": "2026-01-01", "amount": -70.0, "categoryId": "vacances", "note": "Massage"}, {"date": "2026-01-01", "amount": 3.8, "categoryId": "vacances", "note": "Vin chaud"}, {"date": "2026-01-01", "amount": -29.32, "categoryId": "vacances", "note": "Souvenirs"}, {"date": "2026-01-01", "amount": -34.45, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-01-01", "amount": -12.59, "categoryId": "courses", "note": "Auchan"}, {"date": "2026-01-01", "amount": -22.04, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-01-01", "amount": -27.92, "categoryId": "cadeaux", "note": "Monceau Fleurs"}, {"date": "2026-01-01", "amount": -9.99, "categoryId": "vetements", "note": "Amazon - Bandeau"}, {"date": "2026-01-01", "amount": -36.13, "categoryId": "amenagement", "note": "Amazon - Pommeau douche"}, {"date": "2026-01-01", "amount": -5.22, "categoryId": "sante", "note": "Amazon - Lunette vélo"}, {"date": "2026-01-01", "amount": -16.99, "categoryId": "plaisirs", "note": "Amazon - Pochettes vinyles transparentes"}, {"date": "2026-01-01", "amount": -9.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-01-01", "amount": -4.35, "categoryId": "charges", "note": "LCL"}, {"date": "2026-01-01", "amount": -39.99, "categoryId": "vetements", "note": "Mango"}, {"date": "2026-01-01", "amount": -400.0, "categoryId": "epargne", "note": "Epargne fin janvier"}, {"date": "2026-02-01", "amount": 2490.54, "categoryId": "salaire", "note": "Salaire reçu fin janvier"}, {"date": "2026-02-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2026-02-01", "amount": -12.5, "categoryId": "vetements", "note": "Calzedonia"}, {"date": "2026-02-01", "amount": -21.0, "categoryId": "restaurants", "note": "Pollux N+1"}, {"date": "2026-02-01", "amount": -13.9, "categoryId": "restaurants", "note": "Bar"}, {"date": "2026-02-01", "amount": -90.8, "categoryId": "voiture", "note": "Abonnement Navigo"}, {"date": "2026-02-01", "amount": -2.38, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -24.0, "categoryId": "plaisirs", "note": "Pochette vinyles"}, {"date": "2026-02-01", "amount": -5.85, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -51.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2026-02-01", "amount": -11.9, "categoryId": "restaurants", "note": "Pizza"}, {"date": "2026-02-01", "amount": -43.0, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2026-02-01", "amount": -79.14, "categoryId": "charges", "note": "EDF"}, {"date": "2026-02-01", "amount": -13.5, "categoryId": "sante", "note": "Course - Les foulées Mantaises"}, {"date": "2026-02-01", "amount": -5.0, "categoryId": "sante", "note": "Course - Les foulées Mantaises"}, {"date": "2026-02-01", "amount": -125.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2026-02-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-02-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-02-01", "amount": -4.08, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -14.75, "categoryId": "cadeaux", "note": "Auriane"}, {"date": "2026-02-01", "amount": -9.95, "categoryId": "cadeaux", "note": "Auriane"}, {"date": "2026-02-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2026-02-01", "amount": -69.02, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2026-02-01", "amount": -34.2, "categoryId": "plaisirs", "note": "Parfum Fragonnard"}, {"date": "2026-02-01", "amount": 17.01, "categoryId": "vetements", "note": "Remboursement NAKD 2025"}, {"date": "2026-02-01", "amount": -10.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2026-02-01", "amount": 50.0, "categoryId": "cadeaux", "note": "Zélia et Cyril pour Auriane"}, {"date": "2026-02-01", "amount": 30.0, "categoryId": "cadeaux", "note": "Lucie pour Auriane"}, {"date": "2026-02-01", "amount": 25.0, "categoryId": "cadeaux", "note": "Maxence pour Auriane"}, {"date": "2026-02-01", "amount": -100.0, "categoryId": "cadeaux", "note": "Retrait Auriane"}, {"date": "2026-02-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Retrait Auriane"}, {"date": "2026-02-01", "amount": 50.0, "categoryId": "cadeaux", "note": "Pauline et Lucas pour Auriane"}, {"date": "2026-02-01", "amount": -170.0, "categoryId": "vacances", "note": "Avion Croatie"}, {"date": "2026-02-01", "amount": -170.0, "categoryId": "vacances", "note": "Avion Croatie Marion"}, {"date": "2026-02-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2026-02-01", "amount": -1.77, "categoryId": "owen", "note": "Tom and co"}, {"date": "2026-02-01", "amount": -6.82, "categoryId": "courses", "note": "Action"}, {"date": "2026-02-01", "amount": -26.08, "categoryId": "courses", "note": "Protéines"}, {"date": "2026-02-01", "amount": -207.57, "categoryId": "vacances", "note": "EVJF HM - Logement"}, {"date": "2026-02-01", "amount": -10.7, "categoryId": "courses", "note": "Infusions"}, {"date": "2026-02-01", "amount": -3.99, "categoryId": "cadeaux", "note": "Hema Auriette"}, {"date": "2026-02-01", "amount": -118.68, "categoryId": "vacances", "note": "Location voiture Croatie"}, {"date": "2026-02-01", "amount": 20.96, "categoryId": "vetements", "note": "Remboursement NAKD 2025"}, {"date": "2026-02-01", "amount": 210.0, "categoryId": "vacances", "note": "Avion + Voiture Croatie Marion"}, {"date": "2026-02-01", "amount": -169.12, "categoryId": "charges", "note": "Charges"}, {"date": "2026-02-01", "amount": 40.0, "categoryId": "vacances", "note": "Voiture Croatie Robby"}, {"date": "2026-02-01", "amount": -54.97, "categoryId": "sante", "note": "Basic Fit"}, {"date": "2026-02-01", "amount": -9.0, "categoryId": "vetements", "note": "KIABI"}, {"date": "2026-02-01", "amount": -10.0, "categoryId": "courses", "note": "Intermarché (espèces)"}, {"date": "2026-02-01", "amount": -5.99, "categoryId": "courses", "note": "Decathlon"}, {"date": "2026-02-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2026-02-01", "amount": -25.0, "categoryId": "vetements", "note": "KIABI"}, {"date": "2026-02-01", "amount": -15.27, "categoryId": "courses", "note": "Auchan"}, {"date": "2026-02-01", "amount": -31.94, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -35.0, "categoryId": "vetements", "note": "KIABI (espèces)"}, {"date": "2026-02-01", "amount": 79.99, "categoryId": "vetements", "note": "Remboursement baskets Decathlon"}, {"date": "2026-02-01", "amount": -10.74, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -17.78, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-02-01", "amount": -15.0, "categoryId": "plaisirs", "note": "Retrait Fleuriste"}, {"date": "2026-02-01", "amount": -15.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-02-01", "amount": -2.5, "categoryId": "plaisirs", "note": "Noz"}, {"date": "2026-02-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2026-02-01", "amount": -11.3, "categoryId": "restaurants", "note": "Mc do"}, {"date": "2026-02-01", "amount": -9.99, "categoryId": "charges", "note": "RED by SFR"}, {"date": "2026-02-01", "amount": -18.98, "categoryId": "vetements", "note": "T-shirt Owen"}, {"date": "2026-02-01", "amount": -10.66, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -30.96, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-02-01", "amount": 500.0, "categoryId": "primes", "note": "Parents"}, {"date": "2026-02-01", "amount": -500.0, "categoryId": "epargne", "note": "Parents"}, {"date": "2026-02-01", "amount": -15.27, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-02-01", "amount": -55.0, "categoryId": "vacances", "note": "Train WE Arras"}, {"date": "2026-02-01", "amount": -10.0, "categoryId": "cadeaux", "note": "Chèque Fleuriste Mutti"}, {"date": "2026-02-01", "amount": -32.0, "categoryId": "cadeaux", "note": "Chèque Fleuriste Auriane"}, {"date": "2026-02-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-02-01", "amount": -9.99, "categoryId": "plaisirs", "note": "HEMA"}, {"date": "2026-02-01", "amount": -34.0, "categoryId": "restaurants", "note": "Docaprout"}, {"date": "2026-02-01", "amount": -3.0, "categoryId": "plaisirs", "note": "Normal"}, {"date": "2026-02-01", "amount": -24.1, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-02-01", "amount": -37.45, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -10.08, "categoryId": "amenagement", "note": "B&M"}, {"date": "2026-02-01", "amount": -10.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-02-01", "amount": -25.93, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -17.48, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-02-01", "amount": -4.35, "categoryId": "charges", "note": "LCL"}, {"date": "2026-02-01", "amount": 2.12, "categoryId": "courses", "note": "Régulation because y'a un décalage"}, {"date": "2026-02-01", "amount": -14.0, "categoryId": "restaurants", "note": "Pollux Huguette"}, {"date": "2026-03-01", "amount": 2491.25, "categoryId": "salaire", "note": "Salaire reçu fin mars"}, {"date": "2026-03-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-03-01", "amount": -25.0, "categoryId": "cadeaux", "note": "Cyril et Zélia"}, {"date": "2026-03-01", "amount": -142.2, "categoryId": "vetements", "note": "COS"}, {"date": "2026-03-01", "amount": -65.0, "categoryId": "voiture", "note": "essence"}, {"date": "2026-03-01", "amount": -90.8, "categoryId": "voiture", "note": "Abonnement Navigo"}, {"date": "2026-03-01", "amount": -18.84, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-03-01", "amount": -18.78, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-03-01", "amount": -33.63, "categoryId": "vacances", "note": "BAO"}, {"date": "2026-03-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-03-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-03-01", "amount": -125.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2026-03-01", "amount": -63.2, "categoryId": "charges", "note": "EDF"}, {"date": "2026-03-01", "amount": -25.99, "categoryId": "charges", "note": "BOX SFR"}, {"date": "2026-03-01", "amount": -112.0, "categoryId": "vacances", "note": "Train Bordeaux"}, {"date": "2026-03-01", "amount": -13.71, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-03-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2026-03-01", "amount": -69.02, "categoryId": "voiture", "note": "Matmut"}, {"date": "2026-03-01", "amount": -8.99, "categoryId": "courses", "note": "Carrefour"}, {"date": "2026-03-01", "amount": -10.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-03-01", "amount": -13.5, "categoryId": "cadeaux", "note": "Cyril"}, {"date": "2026-03-01", "amount": -10.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2026-03-01", "amount": -39.95, "categoryId": "plaisirs", "note": "Loop"}, {"date": "2026-03-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-03-01", "amount": -18.99, "categoryId": "courses", "note": "Protéines"}, {"date": "2026-03-01", "amount": -2.99, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2026-03-01", "amount": -51.8, "categoryId": "owen", "note": "Ultra Premium Direct"}, {"date": "2026-03-01", "amount": -14.35, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-03-01", "amount": -2.38, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-03-01", "amount": -9.99, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2026-03-01", "amount": -5.13, "categoryId": "courses", "note": "Action"}, {"date": "2026-03-01", "amount": -2.5, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-03-01", "amount": 18.0, "categoryId": "sante", "note": "Remboursement RDV AMP"}, {"date": "2026-03-01", "amount": -8.37, "categoryId": "amenagement", "note": "Action"}, {"date": "2026-03-01", "amount": -169.12, "categoryId": "charges", "note": "Charges"}, {"date": "2026-03-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2026-03-01", "amount": -34.98, "categoryId": "sante", "note": "Abonnement Basic Fit"}, {"date": "2026-03-01", "amount": -10.0, "categoryId": "plaisirs", "note": "Fleurs"}, {"date": "2026-03-01", "amount": -13.0, "categoryId": "voiture", "note": "Parking Olympia"}, {"date": "2026-03-01", "amount": -10.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-03-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-03-01", "amount": -41.01, "categoryId": "voiture", "note": "essence"}, {"date": "2026-03-01", "amount": -9.14, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2026-03-01", "amount": -12.77, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-03-01", "amount": -14.23, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-03-01", "amount": -21.0, "categoryId": "plaisirs", "note": "Cashless Madame loyale"}, {"date": "2026-03-01", "amount": -16.2, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-03-01", "amount": -48.2, "categoryId": "plaisirs", "note": "Bolt"}, {"date": "2026-03-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2026-03-01", "amount": -90.0, "categoryId": "plaisirs", "note": "Retrait Bolt"}, {"date": "2026-03-01", "amount": -9.99, "categoryId": "charges", "note": "SFR"}, {"date": "2026-03-01", "amount": -31.66, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-03-01", "amount": -15.27, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-03-01", "amount": -40.0, "categoryId": "plaisirs", "note": "Tricount Madame Loyale + Concert Hightlight Tribes"}, {"date": "2026-03-01", "amount": 10.0, "categoryId": "sante", "note": "Remboursement"}, {"date": "2026-03-01", "amount": -16.0, "categoryId": "plaisirs", "note": "Bar Evreux"}, {"date": "2026-03-01", "amount": -10.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-03-01", "amount": 500.0, "categoryId": "primes", "note": "Parents"}, {"date": "2026-03-01", "amount": -400.0, "categoryId": "epargne", "note": "Parents"}, {"date": "2026-03-01", "amount": -36.03, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-03-01", "amount": -8.2, "categoryId": "voiture", "note": "Péage Février"}, {"date": "2026-03-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-03-01", "amount": -6.96, "categoryId": "courses", "note": "Courses"}, {"date": "2026-03-01", "amount": -24.0, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-03-01", "amount": -24.88, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-03-01", "amount": -20.0, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-03-01", "amount": -12.0, "categoryId": "cadeaux", "note": "cinéma"}, {"date": "2026-03-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Auvers sur oise Mutti"}, {"date": "2026-03-01", "amount": -8.0, "categoryId": "cadeaux", "note": "Magnet Auvers sur oise Mutti"}, {"date": "2026-03-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti espèces"}, {"date": "2026-03-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti espèces"}, {"date": "2026-03-01", "amount": 5.0, "categoryId": "plaisirs", "note": "Madame Loyale"}, {"date": "2026-03-01", "amount": -19.83, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-03-01", "amount": -3.99, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2026-03-01", "amount": -37.66, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-03-01", "amount": -15.0, "categoryId": "cadeaux", "note": "Chloé B."}, {"date": "2026-03-01", "amount": -6.6, "categoryId": "restaurants", "note": "Saint Lazare"}, {"date": "2026-03-01", "amount": -5.0, "categoryId": "plaisirs", "note": "Ginger beer Paris"}, {"date": "2026-03-01", "amount": -12.88, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-03-01", "amount": 37.0, "categoryId": "sante", "note": "CPAM"}, {"date": "2026-03-01", "amount": -15.2, "categoryId": "plaisirs", "note": "Bar Chloe B"}, {"date": "2026-03-01", "amount": -60.0, "categoryId": "sante", "note": "RDV Dermatologue"}, {"date": "2026-03-01", "amount": -4.35, "categoryId": "charges", "note": "LCL"}, {"date": "2026-04-01", "amount": 2484.05, "categoryId": "salaire", "note": "Salaire reçu fin mars"}, {"date": "2026-04-01", "amount": -63.96, "categoryId": "vetements", "note": "Zalando Chaussures"}, {"date": "2026-04-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti espèces"}, {"date": "2026-04-01", "amount": -80.01, "categoryId": "cadeaux", "note": "Wecando Robby Kombucha"}, {"date": "2026-04-01", "amount": -30.99, "categoryId": "plaisirs", "note": "Vinyle Heroes"}, {"date": "2026-04-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-04-01", "amount": -4.98, "categoryId": "cadeaux", "note": "Truffaut"}, {"date": "2026-04-01", "amount": -6.99, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2026-04-01", "amount": -16.63, "categoryId": "courses", "note": "Auchan"}, {"date": "2026-04-01", "amount": -10.82, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-04-01", "amount": -3.45, "categoryId": "voiture", "note": "Parking"}, {"date": "2026-04-01", "amount": -5.0, "categoryId": "plaisirs", "note": "cinéma"}, {"date": "2026-04-01", "amount": -29.12, "categoryId": "restaurants", "note": "Les gens heureux"}, {"date": "2026-04-01", "amount": -20.08, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-04-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2026-04-01", "amount": -15.0, "categoryId": "cadeaux", "note": "La Poste"}, {"date": "2026-04-01", "amount": -31.72, "categoryId": "courses", "note": ""}, {"date": "2026-04-01", "amount": -3.09, "categoryId": "cadeaux", "note": "HEMA"}, {"date": "2026-04-01", "amount": -10.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-04-01", "amount": 18.0, "categoryId": "sante", "note": "Remboursement"}, {"date": "2026-04-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-04-01", "amount": -125.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2026-04-01", "amount": -90.8, "categoryId": "voiture", "note": "Navigo"}, {"date": "2026-04-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-04-01", "amount": -75.06, "categoryId": "charges", "note": "EDF"}, {"date": "2026-04-01", "amount": -70.0, "categoryId": "voiture", "note": "RATP"}, {"date": "2026-04-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-04-01", "amount": -66.01, "categoryId": "voiture", "note": "Essence"}, {"date": "2026-04-01", "amount": -20.5, "categoryId": "cadeaux", "note": "Fleurs"}, {"date": "2026-04-01", "amount": -3.0, "categoryId": "restaurants", "note": "Restaurant"}, {"date": "2026-04-01", "amount": -10.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2026-04-01", "amount": -124.0, "categoryId": "cadeaux", "note": "KODAC"}, {"date": "2026-04-01", "amount": 100.0, "categoryId": "cadeaux", "note": "Participation maman"}, {"date": "2026-04-01", "amount": -12.8, "categoryId": "voiture", "note": "Lavage auto"}, {"date": "2026-04-01", "amount": -32.86, "categoryId": "courses", "note": "Picard"}, {"date": "2026-04-01", "amount": -69.02, "categoryId": "voiture", "note": "matmut"}, {"date": "2026-04-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2026-04-01", "amount": -25.33, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-04-01", "amount": -47.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2026-04-01", "amount": -24.0, "categoryId": "restaurants", "note": "Restaurant Paris"}, {"date": "2026-04-01", "amount": -0.42, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-04-01", "amount": -34.98, "categoryId": "sante", "note": "Abonnement Basic Fit"}, {"date": "2026-04-01", "amount": -171.82, "categoryId": "charges", "note": "Charges"}, {"date": "2026-04-01", "amount": -21.27, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-04-01", "amount": -21.78, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-04-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2026-04-01", "amount": -0.79, "categoryId": "cadeaux", "note": "Action"}, {"date": "2026-04-01", "amount": -6.99, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2026-04-01", "amount": -109.0, "categoryId": "vetements", "note": "Robe Azazie"}, {"date": "2026-04-01", "amount": -15.27, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-04-01", "amount": -9.99, "categoryId": "charges", "note": "SFR"}, {"date": "2026-04-01", "amount": 500.0, "categoryId": "primes", "note": "Parents"}, {"date": "2026-04-01", "amount": -500.0, "categoryId": "epargne", "note": "Parents"}, {"date": "2026-04-01", "amount": 45.0, "categoryId": "amenagement", "note": "Mams"}, {"date": "2026-04-01", "amount": 45.0, "categoryId": "voiture", "note": "Mams"}, {"date": "2026-04-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2026-04-01", "amount": -5.7, "categoryId": "plaisirs", "note": "FDJ"}, {"date": "2026-04-01", "amount": -15.0, "categoryId": "sante", "note": "Sport midi et soir Julien"}, {"date": "2026-04-01", "amount": -32.84, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-04-01", "amount": -10.0, "categoryId": "voiture", "note": "Parking concert"}, {"date": "2026-04-01", "amount": -14.71, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-04-01", "amount": -50.5, "categoryId": "voiture", "note": "Péage Mars"}, {"date": "2026-04-01", "amount": -2.2, "categoryId": "courses", "note": "Mrie Blachère"}, {"date": "2026-04-01", "amount": -3.99, "categoryId": "sante", "note": "Pharmacie"}, {"date": "2026-04-01", "amount": -11.8, "categoryId": "restaurants", "note": "Miam concert"}, {"date": "2026-04-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-04-01", "amount": -91.0, "categoryId": "owen", "note": "Vétérinaire"}, {"date": "2026-04-01", "amount": -27.91, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-04-01", "amount": -29.5, "categoryId": "plaisirs", "note": "Soirée boumboum Victor"}, {"date": "2026-04-01", "amount": -41.0, "categoryId": "plaisirs", "note": "Concert Heroes"}, {"date": "2026-04-01", "amount": -47.15, "categoryId": "sante", "note": "Decathlon"}, {"date": "2026-04-01", "amount": -3.6, "categoryId": "vacances", "note": "Bordeaux - Boulangerie"}, {"date": "2026-04-01", "amount": -44.8, "categoryId": "vacances", "note": "Bordeaux - Macarons"}, {"date": "2026-04-01", "amount": -3.8, "categoryId": "vacances", "note": "Bordeaux - Tram"}, {"date": "2026-04-01", "amount": -5.0, "categoryId": "vacances", "note": "Bordeaux - Cartes postales"}, {"date": "2026-04-01", "amount": -0.29, "categoryId": "vacances", "note": "Vélo"}, {"date": "2026-04-01", "amount": -26.0, "categoryId": "vacances", "note": "Bordeaux - Restaurant"}, {"date": "2026-04-01", "amount": -4.0, "categoryId": "vacances", "note": "Bordeaux - Canelés"}, {"date": "2026-04-01", "amount": -60.0, "categoryId": "vacances", "note": "Bordeaux - Brocante"}, {"date": "2026-04-01", "amount": -9.3, "categoryId": "vacances", "note": "Bordeaux - Boulangerie"}, {"date": "2026-04-01", "amount": -25.5, "categoryId": "vacances", "note": "Bordeaux - Restaurant"}, {"date": "2026-04-01", "amount": -17.7, "categoryId": "vacances", "note": "Bordeaux - Restaurant"}, {"date": "2026-04-01", "amount": -4.35, "categoryId": "charges", "note": "LCL"}, {"date": "2026-04-01", "amount": -17.8, "categoryId": "vacances", "note": "Bordeaux - Bar"}, {"date": "2026-04-01", "amount": -14.9, "categoryId": "plaisirs", "note": "Bordeaux - Aromazon"}, {"date": "2026-04-01", "amount": -16.9, "categoryId": "vacances", "note": "Bordeaux - Bar"}, {"date": "2026-04-01", "amount": -3.7, "categoryId": "vacances", "note": "Bordeaux - Bato"}, {"date": "2026-04-01", "amount": -14.2, "categoryId": "vacances", "note": ""}, {"date": "2026-04-01", "amount": -35.0, "categoryId": "vacances", "note": "Bordeaux - Affiche"}, {"date": "2026-04-01", "amount": -33.5, "categoryId": "vacances", "note": "Bordeaux - Fleurs"}, {"date": "2026-04-01", "amount": -2.25, "categoryId": "vacances", "note": "Bordeaux - Canelés"}, {"date": "2026-04-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-05-01", "amount": 2735.67, "categoryId": "salaire", "note": "Salaire"}, {"date": "2026-05-01", "amount": 750.0, "categoryId": "primes", "note": "PO"}, {"date": "2026-05-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2026-05-01", "amount": -90.0, "categoryId": "plaisirs", "note": "Pollux TeamBulding"}, {"date": "2026-05-01", "amount": 90.0, "categoryId": "plaisirs", "note": "Pollux TeamBulding"}, {"date": "2026-05-01", "amount": -48.07, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-05-01", "amount": -19.11, "categoryId": "courses", "note": "Auchan"}, {"date": "2026-05-01", "amount": -90.8, "categoryId": "voiture", "note": "Navigo"}, {"date": "2026-05-01", "amount": -12.0, "categoryId": "plaisirs", "note": "Fleurs"}, {"date": "2026-05-01", "amount": -66.67, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-05-01", "amount": -680.69, "categoryId": "charges", "note": "Prêt immo"}, {"date": "2026-05-01", "amount": -125.0, "categoryId": "epargne_tf", "note": "TF"}, {"date": "2026-05-01", "amount": -11.44, "categoryId": "courses", "note": "Carrefour"}, {"date": "2026-05-01", "amount": 10.0, "categoryId": "restaurants", "note": "Claudia"}, {"date": "2026-05-01", "amount": -40.18, "categoryId": "courses", "note": "Picard"}, {"date": "2026-05-01", "amount": -39.86, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2026-05-01", "amount": -75.06, "categoryId": "charges", "note": "EDF"}, {"date": "2026-05-01", "amount": -10.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2026-05-01", "amount": -17.99, "categoryId": "courses", "note": "Clear Prot"}, {"date": "2026-05-01", "amount": -13.4, "categoryId": "restaurants", "note": "UTOROA"}, {"date": "2026-05-01", "amount": -6.7, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-05-01", "amount": -69.02, "categoryId": "voiture", "note": "Matmut"}, {"date": "2026-05-01", "amount": -17.75, "categoryId": "amenagement", "note": "Action"}, {"date": "2026-05-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2026-05-01", "amount": -63.0, "categoryId": "voiture", "note": "Essence"}, {"date": "2026-05-01", "amount": -186.38, "categoryId": "amenagement", "note": "Truffaut"}, {"date": "2026-05-01", "amount": -22.22, "categoryId": "courses", "note": "Jardiland"}, {"date": "2026-05-01", "amount": -78.6, "categoryId": "plaisirs", "note": "Pollux TeamBulding"}, {"date": "2026-05-01", "amount": 78.6, "categoryId": "plaisirs", "note": "Pollux TeamBulding"}, {"date": "2026-05-01", "amount": -35.0, "categoryId": "sante", "note": "Dr Mutti"}, {"date": "2026-05-01", "amount": 35.0, "categoryId": "sante", "note": "Dr Mutti"}, {"date": "2026-05-01", "amount": -34.98, "categoryId": "sante", "note": "Abonnement Basic Fit"}, {"date": "2026-05-01", "amount": -14.9, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2026-05-01", "amount": 50.0, "categoryId": "cadeaux", "note": "Zélia et Cyril pour Lucie"}, {"date": "2026-05-01", "amount": 30.0, "categoryId": "cadeaux", "note": "Auriane pour Lucie"}, {"date": "2026-05-01", "amount": 10.0, "categoryId": "cadeaux", "note": "Maxence pour Lucie"}, {"date": "2026-05-01", "amount": -42.97, "categoryId": "sante", "note": "Decathlon"}, {"date": "2026-05-01", "amount": -3.12, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-05-01", "amount": -69.47, "categoryId": "cadeaux", "note": "EVJF HM - Tatouages"}, {"date": "2026-05-01", "amount": -20.0, "categoryId": "cadeaux", "note": "Alice pour Lucie"}, {"date": "2026-05-01", "amount": -40.0, "categoryId": "cadeaux", "note": "Minous pour Lucie"}, {"date": "2026-05-01", "amount": -6.3, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-05-01", "amount": -7.99, "categoryId": "sante", "note": "Decathlon"}, {"date": "2026-05-01", "amount": 50.0, "categoryId": "primes", "note": "Mutti"}, {"date": "2026-05-01", "amount": -50.0, "categoryId": "cadeaux", "note": "Zélia et Cyril pour Lucie"}, {"date": "2026-05-01", "amount": -30.0, "categoryId": "cadeaux", "note": "Auriane pour Lucie"}, {"date": "2026-05-01", "amount": -5.0, "categoryId": "cadeaux", "note": "Maxence pour Lucie (J'avais déjà 5euros en espèces)"}, {"date": "2026-05-01", "amount": 40.0, "categoryId": "cadeaux", "note": "Minous pour Lucie"}, {"date": "2026-05-01", "amount": -34.74, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-05-01", "amount": -129.6, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2026-05-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2026-05-01", "amount": -1.98, "categoryId": "courses", "note": "Auchan"}, {"date": "2026-05-01", "amount": -171.81, "categoryId": "charges", "note": "Charges"}, {"date": "2026-05-01", "amount": -119.7, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2026-05-01", "amount": -23.0, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-05-01", "amount": -19.12, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-05-01", "amount": 500.0, "categoryId": "primes", "note": "Parents"}, {"date": "2026-05-01", "amount": -500.0, "categoryId": "epargne", "note": "Parents"}, {"date": "2026-05-01", "amount": 209.4, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2026-05-01", "amount": -79.8, "categoryId": "amenagement", "note": "Leroy Merlin"}, {"date": "2026-05-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-05-01", "amount": -24.5, "categoryId": "restaurants", "note": "Resto M&R"}, {"date": "2026-05-01", "amount": -15.27, "categoryId": "charges", "note": "Prêt Immo"}, {"date": "2026-05-01", "amount": -10.0, "categoryId": "cadeaux", "note": ""}, {"date": "2026-05-01", "amount": -33.56, "categoryId": "owen", "note": "Ultrapremium Direct"}, {"date": "2026-05-01", "amount": -9.99, "categoryId": "charges", "note": "RED by SFR"}, {"date": "2026-05-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2026-05-01", "amount": -1.91, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-05-01", "amount": -19.13, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-05-01", "amount": -1.89, "categoryId": "courses", "note": "HEMA"}, {"date": "2026-05-01", "amount": -74.02, "categoryId": "voiture", "note": "Essence"}, {"date": "2026-05-01", "amount": -8.94, "categoryId": "cadeaux", "note": "Gifi"}, {"date": "2026-05-01", "amount": -3.98, "categoryId": "courses", "note": "Stokomani"}, {"date": "2026-05-01", "amount": -6.6, "categoryId": "plaisirs", "note": "CGR"}, {"date": "2026-05-01", "amount": -3.2, "categoryId": "voiture", "note": "Péage Avril"}, {"date": "2026-05-01", "amount": -319.51, "categoryId": "voiture", "note": "Entretien voiture peugeot"}, {"date": "2026-05-01", "amount": -34.23, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-05-01", "amount": -17.0, "categoryId": "courses", "note": "Bar"}, {"date": "2026-05-01", "amount": -8.0, "categoryId": "courses", "note": "Jeux à gratter"}, {"date": "2026-05-01", "amount": -4.3, "categoryId": "plaisirs", "note": "Glace"}, {"date": "2026-05-01", "amount": 150.0, "categoryId": "cadeaux", "note": "Cadeaux anniversaire"}, {"date": "2026-05-01", "amount": -98.0, "categoryId": "voiture", "note": "Train Paris-Quimper Juin"}, {"date": "2026-05-01", "amount": -18.67, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-05-01", "amount": -9.99, "categoryId": "courses", "note": "Leroy Merlin"}, {"date": "2026-05-01", "amount": -43.76, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-05-01", "amount": 160.0, "categoryId": "epargne", "note": "Pioche dans épargne pour shoes"}, {"date": "2026-05-01", "amount": -160.0, "categoryId": "cadeaux", "note": "Chaussure running"}, {"date": "2026-05-01", "amount": -160.0, "categoryId": "epargne", "note": "Pioche dans épargne pour shoes"}, {"date": "2026-05-01", "amount": -4.35, "categoryId": "charges", "note": "LCL"}, {"date": "2026-05-01", "amount": -8.1, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-05-01", "amount": -13.35, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-05-01", "amount": -124.99, "categoryId": "sante", "note": "Intersport"}, {"date": "2026-05-01", "amount": -7.0, "categoryId": "cadeaux", "note": "EVJF - Impression"}, {"date": "2026-05-01", "amount": -16.0, "categoryId": "restaurants", "note": "Restaurant Paris"}, {"date": "2026-05-01", "amount": -5.0, "categoryId": "sante", "note": "Cours Julien"}, {"date": "2026-05-01", "amount": -5.0, "categoryId": "courses", "note": "Comptoire de Mathilde"}, {"date": "2026-05-01", "amount": -5.9, "categoryId": "plaisirs", "note": "Rituals"}, {"date": "2026-05-01", "amount": -11.96, "categoryId": "cadeaux", "note": "Cartes de voeux"}, {"date": "2026-05-01", "amount": -11.32, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-05-01", "amount": -5.16, "categoryId": "courses", "note": "Action"}, {"date": "2026-06-01", "amount": 2556.45, "categoryId": "salaire", "note": "Salaire reçu fin mai"}, {"date": "2026-06-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2026-06-01", "amount": -29.95, "categoryId": "vetements", "note": "ZARA"}, {"date": "2026-06-01", "amount": 50.0, "categoryId": "cadeaux", "note": "Maman pour bouquet Mutti"}, {"date": "2026-06-01", "amount": -74.04, "categoryId": "voiture", "note": "Essence"}, {"date": "2026-06-01", "amount": -8.0, "categoryId": "plaisirs", "note": "Photos BADABOUM"}, {"date": "2026-06-01", "amount": -680.69, "categoryId": "charges", "note": "prêt immo"}, {"date": "2026-06-01", "amount": -9.0, "categoryId": "voiture", "note": "Parking Paris"}, {"date": "2026-06-01", "amount": -125.0, "categoryId": "epargne_tf", "note": ""}, {"date": "2026-06-01", "amount": -17.5, "categoryId": "restaurants", "note": "Oxymore"}, {"date": "2026-06-01", "amount": -66.67, "categoryId": "charges", "note": "prêt immo"}, {"date": "2026-06-01", "amount": -32.0, "categoryId": "vetements", "note": "Kiabi"}, {"date": "2026-06-01", "amount": -9.0, "categoryId": "cadeaux", "note": "Kiabi"}, {"date": "2026-06-01", "amount": 9.88, "categoryId": "cadeaux", "note": "Remboursement Lucie Fleurs"}, {"date": "2026-06-01", "amount": 10.0, "categoryId": "cadeaux", "note": "Remboursement Auriane Fleurs"}, {"date": "2026-06-01", "amount": -75.06, "categoryId": "charges", "note": "EDF"}, {"date": "2026-06-01", "amount": -54.36, "categoryId": "vetements", "note": "Décathlon"}, {"date": "2026-06-01", "amount": 63.96, "categoryId": "vetements", "note": "Remboursment"}, {"date": "2026-06-01", "amount": -34.98, "categoryId": "sante", "note": "Abonnement Basic Fit"}, {"date": "2026-06-01", "amount": -404.0, "categoryId": "vetements", "note": "LE REDOUTE"}, {"date": "2026-06-01", "amount": -477.9, "categoryId": "vetements", "note": "ASOS"}, {"date": "2026-06-01", "amount": -16.11, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-06-01", "amount": -1.1, "categoryId": "courses", "note": "Boulangerie"}, {"date": "2026-06-01", "amount": -28.95, "categoryId": "courses", "note": "Grand Frais"}, {"date": "2026-06-01", "amount": -80.0, "categoryId": "cadeaux", "note": "Flauriste"}, {"date": "2026-06-01", "amount": -20.77, "categoryId": "charges", "note": "AXA"}, {"date": "2026-06-01", "amount": -335.88, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-06-01", "amount": -10.99, "categoryId": "charges", "note": "Disney+"}, {"date": "2026-06-01", "amount": 120.0, "categoryId": "cadeaux", "note": "Cadeaux anniversaire Annick"}, {"date": "2026-06-01", "amount": -69.02, "categoryId": "voiture", "note": "MATMUT"}, {"date": "2026-06-01", "amount": 9.88, "categoryId": "cadeaux", "note": "Remboursement Maxence"}, {"date": "2026-06-01", "amount": -27.0, "categoryId": "plaisirs", "note": "Jus de pomme pétillant SummerFlex"}, {"date": "2026-06-01", "amount": -42.9, "categoryId": "restaurants", "note": "Restaurant SummerFlex"}, {"date": "2026-06-01", "amount": 33.88, "categoryId": "courses", "note": "Remboursement Courses Karim"}, {"date": "2026-06-01", "amount": -90.8, "categoryId": "voiture", "note": "Navigo"}, {"date": "2026-06-01", "amount": 1.74, "categoryId": "courses", "note": "Karim"}, {"date": "2026-06-01", "amount": 53.0, "categoryId": "courses", "note": "Elsa"}, {"date": "2026-06-01", "amount": 13.25, "categoryId": "courses", "note": "Kate"}, {"date": "2026-06-01", "amount": 33.91, "categoryId": "courses", "note": "Elodie"}, {"date": "2026-06-01", "amount": 16.79, "categoryId": "courses", "note": "Emilie"}, {"date": "2026-06-01", "amount": 24.0, "categoryId": "courses", "note": "Elodie CB"}, {"date": "2026-06-01", "amount": 25.08, "categoryId": "courses", "note": "Claudie"}, {"date": "2026-06-01", "amount": 35.56, "categoryId": "courses", "note": "Elsa O"}, {"date": "2026-06-01", "amount": 14.78, "categoryId": "courses", "note": "Elodie"}, {"date": "2026-06-01", "amount": -171.81, "categoryId": "charges", "note": "Charges"}, {"date": "2026-06-01", "amount": -89.91, "categoryId": "cadeaux", "note": "Cadeaux anniversaire Annick"}, {"date": "2026-06-01", "amount": 36.07, "categoryId": "courses", "note": ""}, {"date": "2026-06-01", "amount": -39.5, "categoryId": "restaurants", "note": "Restaurant"}, {"date": "2026-06-01", "amount": -30.0, "categoryId": "plaisirs", "note": "Vinyle MALTER"}, {"date": "2026-06-01", "amount": -2.25, "categoryId": "charges", "note": "LCL"}, {"date": "2026-06-01", "amount": -19.0, "categoryId": "plaisirs", "note": "Musée Juillet Auriane Lucie"}, {"date": "2026-06-01", "amount": -23.47, "categoryId": "courses", "note": "Lesconil"}, {"date": "2026-06-01", "amount": -1.3, "categoryId": "courses", "note": "Lesconil"}, {"date": "2026-06-01", "amount": -7.02, "categoryId": "courses", "note": "Lesconil"}, {"date": "2026-06-01", "amount": -7.99, "categoryId": "charges", "note": "Netflix"}, {"date": "2026-06-01", "amount": -9.99, "categoryId": "charges", "note": "RED by SFR"}, {"date": "2026-06-01", "amount": -15.27, "categoryId": "charges", "note": "prêt immo"}, {"date": "2026-06-01", "amount": -13.12, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-06-01", "amount": -6.99, "categoryId": "vacances", "note": "Pharmacie"}, {"date": "2026-06-01", "amount": -38.2, "categoryId": "voiture", "note": "Autoroute Mai"}, {"date": "2026-06-01", "amount": 500.0, "categoryId": "primes", "note": "Parents"}, {"date": "2026-06-01", "amount": -5.0, "categoryId": "vacances", "note": "Perrier bécon"}, {"date": "2026-06-01", "amount": -10.7, "categoryId": "vacances", "note": "Starbucks"}, {"date": "2026-06-01", "amount": -24.6, "categoryId": "vacances", "note": "Bolt"}, {"date": "2026-06-01", "amount": -7.5, "categoryId": "vacances", "note": "Glace"}, {"date": "2026-06-01", "amount": -5.0, "categoryId": "vacances", "note": ""}, {"date": "2026-06-01", "amount": -565.88, "categoryId": "vetements", "note": "Zalando"}, {"date": "2026-06-01", "amount": -63.0, "categoryId": "vacances", "note": "Giros le soir"}, {"date": "2026-06-01", "amount": -31.3, "categoryId": "vacances", "note": "Saoulmates"}, {"date": "2026-06-01", "amount": -29.0, "categoryId": "vacances", "note": "Souvenirs"}, {"date": "2026-06-01", "amount": -6.0, "categoryId": "vacances", "note": "Souvenirs"}, {"date": "2026-06-01", "amount": -13.2, "categoryId": "vacances", "note": ""}, {"date": "2026-06-01", "amount": -135.45, "categoryId": "vacances", "note": "Virement Céline EVJF"}, {"date": "2026-06-01", "amount": -54.03, "categoryId": "vacances", "note": "Virement Juliette EVJF"}, {"date": "2026-06-01", "amount": -7.4, "categoryId": "courses", "note": "grand frais"}, {"date": "2026-06-01", "amount": -12.9, "categoryId": "courses", "note": "leroy merlin"}, {"date": "2026-06-01", "amount": -0.63, "categoryId": "courses", "note": "action"}, {"date": "2026-06-01", "amount": 42.0, "categoryId": "remboursements", "note": "Remboursement Char à voil"}, {"date": "2026-06-01", "amount": -11.6, "categoryId": "courses", "note": "picard"}, {"date": "2026-06-01", "amount": -9.98, "categoryId": "plaisirs", "note": "Bijoux"}, {"date": "2026-06-01", "amount": -27.96, "categoryId": "vetements", "note": "Parfois"}, {"date": "2026-06-01", "amount": -40.37, "categoryId": "courses", "note": "Intermarché"}, {"date": "2026-06-01", "amount": -4.35, "categoryId": "charges", "note": "LCL"}, {"date": "2026-06-01", "amount": 565.88, "categoryId": "vetements", "note": "Zalando"}, {"date": "2026-06-01", "amount": 27.96, "categoryId": "vetements", "note": "Parfois"}, {"date": "2026-06-01", "amount": 9.25, "categoryId": "cadeaux", "note": "Fleurs Victor"}, {"date": "2026-06-01", "amount": -5.0, "categoryId": "sante", "note": "Julien"}, {"date": "2026-06-01", "amount": -100.0, "categoryId": "sante", "note": "Virement Révolut pour dépanner"}, {"date": "2026-06-01", "amount": 100.0, "categoryId": "sante", "note": "Virement Révolut pour dépanner"}, {"date": "2026-06-01", "amount": -500.0, "categoryId": "epargne", "note": "Parents"}, {"date": "2026-06-01", "amount": -15.65, "categoryId": "restaurants", "note": "Mac do"}, {"date": "2026-07-01", "amount": 2556.45, "categoryId": "salaire", "note": "Salaire reçu fin mai"}, {"date": "2026-07-01", "amount": 365.54, "categoryId": "primes", "note": "Prime de vacances d'été"}, {"date": "2026-07-01", "amount": -14.0, "categoryId": "plaisirs", "note": "Spectacle Robby"}, {"date": "2026-07-01", "amount": -25.99, "categoryId": "charges", "note": "SFR"}, {"date": "2026-07-01", "amount": -34.98, "categoryId": "sante", "note": "Abonnement Basic Fit"}, {"date": "2026-05-01", "amount": -300.0, "categoryId": "epargne", "note": "Epargne mois de mai"}, {"date": "2026-07-01", "amount": -16.45, "categoryId": "plaisirs", "note": "RDV Ongle 1/2"}, {"date": "2026-07-01", "amount": -32.7, "categoryId": "plaisirs", "note": "Ongle"}, {"date": "2026-07-01", "amount": -176.58, "categoryId": "voiture", "note": "Culture vélo Réparation"}, {"date": "2026-07-01", "amount": -10.0, "categoryId": "sante", "note": "Julien"}, {"date": "2026-07-01", "amount": -10.0, "categoryId": "cadeaux", "note": "Départ Marie"}, {"date": "2026-07-01", "amount": -14.18, "categoryId": "cadeaux", "note": "Vinted"}, {"date": "2026-06-01", "amount": 425.96, "categoryId": "vetements", "note": "Remboursement ASOS"}, {"date": "2026-06-01", "amount": 404.0, "categoryId": "vetements", "note": "Remboursement La Redoute"}, {"date": "2026-04-01", "amount": -33.11, "categoryId": "plaisirs", "note": "Vinyle Marx Ambor"}, {"date": "2026-07-01", "amount": -14.18, "categoryId": "cadeaux", "note": "Vinted"}, {"date": "2026-07-01", "amount": -38.94, "categoryId": "cadeaux", "note": "Cadeaux Pollux Marie"}, {"date": "2026-07-01", "amount": -44.0, "categoryId": "cadeaux", "note": "Cadeaux Pollux Marie"}, {"date": "2026-07-01", "amount": -18.0, "categoryId": "sante", "note": "RDV AMP"}, {"date": "2026-07-01", "amount": -0.99, "categoryId": "charges", "note": "Disney +"}, {"date": "2026-07-01", "amount": -9.8, "categoryId": "courses", "note": ""}, {"date": "2026-07-01", "amount": -90.8, "categoryId": "voiture", "note": "Navigo"}];


const SEED_SAVINGS = [
  { date: "2026-01-01", la: 14995, vie: 20296, doca: 10346 },
  { date: "2026-02-01", la: 15895, vie: 20296, doca: 10269 },
  { date: "2026-03-01", la: 16720, vie: 20296, doca: 10533 },
  { date: "2026-04-01", la: 17245, vie: 20296, doca: 10231 },
  { date: "2026-05-01", la: 17870, vie: 20296, doca: 13411 },
  { date: "2026-06-01", la: 18495, vie: 20296, doca: 14101 },
  { date: "2026-07-01", la: 18620, vie: 20296, doca: 14014 },
];

let state = loadState(activeProfileId);
let currentMonth = new Date();
currentMonth.setDate(1);

/* Profil de démonstration "Lucie" — données entièrement fictives, générées
   pour illustrer le multi-profil (revenu stable et identique chaque mois). */
const LUCIE_SEED_TRANSACTIONS = [
  // Avril
  { date: "2026-04-01", amount: 1900, categoryId: "salaire", note: "Salaire" },
  { date: "2026-04-02", amount: -650, categoryId: "charges", note: "Loyer" },
  { date: "2026-04-03", amount: -35.5, categoryId: "charges", note: "Assurance habitation" },
  { date: "2026-04-04", amount: -13.99, categoryId: "charges", note: "Abonnement streaming" },
  { date: "2026-04-06", amount: -62.4, categoryId: "courses", note: "Courses" },
  { date: "2026-04-13", amount: -58.1, categoryId: "courses", note: "Courses" },
  { date: "2026-04-20", amount: -49.9, categoryId: "courses", note: "Courses" },
  { date: "2026-04-11", amount: -32.0, categoryId: "restaurants", note: "Restaurant" },
  { date: "2026-04-18", amount: -70.0, categoryId: "voiture", note: "Essence" },
  { date: "2026-04-22", amount: -25.0, categoryId: "sante", note: "Pharmacie" },
  { date: "2026-04-25", amount: -45.0, categoryId: "plaisirs", note: "Sorties" },
  // Mai
  { date: "2026-05-01", amount: 1900, categoryId: "salaire", note: "Salaire" },
  { date: "2026-05-02", amount: -650, categoryId: "charges", note: "Loyer" },
  { date: "2026-05-03", amount: -35.5, categoryId: "charges", note: "Assurance habitation" },
  { date: "2026-05-04", amount: -13.99, categoryId: "charges", note: "Abonnement streaming" },
  { date: "2026-05-07", amount: -64.2, categoryId: "courses", note: "Courses" },
  { date: "2026-05-14", amount: -55.8, categoryId: "courses", note: "Courses" },
  { date: "2026-05-21", amount: -60.3, categoryId: "courses", note: "Courses" },
  { date: "2026-05-16", amount: -28.5, categoryId: "restaurants", note: "Restaurant" },
  { date: "2026-05-19", amount: -68.0, categoryId: "voiture", note: "Essence" },
  { date: "2026-05-28", amount: -55.0, categoryId: "plaisirs", note: "Sorties" },
  // Juin
  { date: "2026-06-01", amount: 1900, categoryId: "salaire", note: "Salaire" },
  { date: "2026-06-02", amount: -650, categoryId: "charges", note: "Loyer" },
  { date: "2026-06-03", amount: -35.5, categoryId: "charges", note: "Assurance habitation" },
  { date: "2026-06-04", amount: -13.99, categoryId: "charges", note: "Abonnement streaming" },
  { date: "2026-06-08", amount: -59.9, categoryId: "courses", note: "Courses" },
  { date: "2026-06-15", amount: -63.4, categoryId: "courses", note: "Courses" },
  { date: "2026-06-22", amount: -57.2, categoryId: "courses", note: "Courses" },
  { date: "2026-06-12", amount: -36.0, categoryId: "restaurants", note: "Restaurant" },
  { date: "2026-06-20", amount: -72.0, categoryId: "voiture", note: "Essence" },
  { date: "2026-06-25", amount: -30.0, categoryId: "sante", note: "Pharmacie" },
  // Juillet
  { date: "2026-07-01", amount: 1900, categoryId: "salaire", note: "Salaire" },
  { date: "2026-07-02", amount: -650, categoryId: "charges", note: "Loyer" },
  { date: "2026-07-03", amount: -35.5, categoryId: "charges", note: "Assurance habitation" },
  { date: "2026-07-04", amount: -13.99, categoryId: "charges", note: "Abonnement streaming" },
  { date: "2026-07-05", amount: -61.0, categoryId: "courses", note: "Courses" },
];

function loadState(profileId) {
  const key = storageKeyFor(profileId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.projects) parsed.projects = [];
      if (!parsed.savings) parsed.savings = SEED_SAVINGS.map(s => ({ ...s, id: uid() }));
      return parsed;
    }
  } catch (e) {
    console.warn("Lecture des données impossible, redémarrage propre.", e);
  }

  if (profileId === "alice") {
    // Premier lancement du profil Alice : historique importé du fichier Excel.
    const seeded = SEED_TRANSACTIONS.map(t => ({ ...t, id: uid() }));
    return {
      categories: cloneDefaultCategories(),
      transactions: seeded,
      projects: [],
      savings: SEED_SAVINGS.map(s => ({ ...s, id: uid() })),
    };
  }

  // Autre profil (ex. Lucie) : jeu de données fictif de démonstration.
  const seeded = LUCIE_SEED_TRANSACTIONS.map(t => ({ ...t, id: uid() }));
  return {
    categories: cloneDefaultCategories(),
    transactions: seeded,
    projects: [],
    savings: [],
  };
}

function saveState() {
  localStorage.setItem(storageKeyFor(activeProfileId), JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

let hideAmounts = sessionStorage.getItem("paeonia_hideAmounts") === "1";

function money(n) {
  if (hideAmounts) return "•••• €";
  return Math.abs(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function moneySigned(n) {
  if (hideAmounts) return "•••• €";
  return (n >= 0 ? "+" : "−") + money(n);
}

function animateKpi(elId, targetValue, formatFn) {
  const el = document.getElementById(elId);
  const start = parseFloat(el.dataset.rawValue || "0");
  const duration = 450;
  const t0 = performance.now();
  function step(now) {
    const progress = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (targetValue - start) * eased;
    el.textContent = formatFn(current);
    if (progress < 1) requestAnimationFrame(step);
    else el.dataset.rawValue = targetValue;
  }
  requestAnimationFrame(step);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function catById(id) {
  return state.categories.find(c => c.id === id);
}

function sortedCategories() {
  return [...state.categories].sort((a, b) => {
    if (a.id === "salaire") return -1;
    if (b.id === "salaire") return 1;
    return a.name.localeCompare(b.name, "fr");
  });
}

const CATEGORY_EMOJI = {
  salaire: "💼", primes: "🎁", remboursements: "💸",
  charges: "🏠", courses: "🛒", restaurants: "🍽️",
  plaisirs: "🎉", vacances: "🌴", vetements: "👗",
  sante: "💊", voiture: "🚗", owen: "🐾",
  cadeaux: "🎀", amenagement: "🛋️", epargne: "🌱", epargne_tf: "🏛️",
};
function catEmoji(id) {
  return CATEGORY_EMOJI[id] || "🔸";
}
function catLabel(cat) {
  return `${catEmoji(cat.id)} ${cat.name}`;
}

const PIE_COLORS = ["#8EA58B", "#A3B860", "#F3C78A", "#D97A6C", "#A9C4A5", "#8FAF7A", "#B9A38C", "#7C9B8E", "#B5C98F", "#9FB4C7", "#CBB994", "#8B9DC3"];

/* ---------------- Navigation entre onglets ---------------- */
const MONTH_SCOPED_TABS = ["dashboard", "history"];

function updateTopbarVisibility(tabName) {
  document.querySelector(".topbar").style.display = MONTH_SCOPED_TABS.includes(tabName) ? "" : "none";
  document.getElementById("greetingBanner").style.display = tabName === "dashboard" ? "" : "none";
}

document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
  updateTopbarVisibility(btn.dataset.tab);
  if (btn.dataset.tab === "history") renderHistory();
  if (btn.dataset.tab === "yearly") renderYearlyComparison();
  if (btn.dataset.tab === "monthly") renderMonthlyPivot();
  if (btn.dataset.tab === "projects") renderProjects();
  if (btn.dataset.tab === "savings") renderSavings();
});

/* ---------------- Navigation entre mois ---------------- */
document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth.setMonth(currentMonth.getMonth() - 1);
  renderAll();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth.setMonth(currentMonth.getMonth() + 1);
  renderAll();
});

/* ---------------- Rendu général ---------------- */
function renderAll() {
  const label = currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  document.getElementById("monthDisplay").textContent = label;
  renderDashboard();
  renderCategorySelect();
  renderCategoryList();
  renderHistory();
}

function transactionsForMonth(date) {
  const key = monthKey(date);
  return state.transactions.filter(t => t.date.startsWith(key));
}

/* ---------------- Tableau de bord ---------------- */
/* ---------------- Dépenses récurrentes (copilote financier) ---------------- */
function detectRecurringExpenses() {
  const currentKey = monthKey(currentMonth);

  // Fenêtre glissante : les 6 mois précédant le mois affiché (hors mois en cours)
  const windowMonths = [];
  const cursor = new Date(currentMonth);
  for (let i = 1; i <= 6; i++) {
    cursor.setMonth(currentMonth.getMonth() - i);
    windowMonths.push(monthKey(cursor));
  }

  const signatures = {}; // "catId|note" -> [{monthKey, amount}]
  state.transactions.forEach(t => {
    if (t.amount >= 0) return; // seulement les dépenses
    const note = (t.note || "").trim().toLowerCase();
    if (!note) return; // il faut un intitulé pour identifier un prélèvement récurrent
    const month = t.date.slice(0, 7);
    if (!windowMonths.includes(month) && month !== currentKey) return;
    const sig = t.categoryId + "|" + note;
    (signatures[sig] = signatures[sig] || []).push({ month, amount: t.amount });
  });

  const upcoming = [];
  Object.entries(signatures).forEach(([sig, occurrences]) => {
    const pastOccurrences = occurrences.filter(o => o.month !== currentKey);
    const distinctPastMonths = new Set(pastOccurrences.map(o => o.month));
    if (distinctPastMonths.size < 3) return; // pas assez régulier sur les 6 derniers mois
    const alreadyThisMonth = occurrences.some(o => o.month === currentKey);
    if (alreadyThisMonth) return; // déjà prélevée ce mois-ci

    const [catId, note] = sig.split("|");
    const cat = catById(catId);
    const avgAmount = pastOccurrences.reduce((s, o) => s + o.amount, 0) / pastOccurrences.length;
    upcoming.push({ catId, cat, note, amount: -avgAmount });
  });

  upcoming.sort((a, b) => b.amount - a.amount);
  return upcoming;
}

function renderRecurringExpenses(currentRemaining) {
  const card = document.getElementById("recurringCard");
  const upcoming = detectRecurringExpenses();

  if (upcoming.length === 0) {
    card.style.display = "none";
    return;
  }
  card.style.display = "";

  const total = upcoming.reduce((s, u) => s + u.amount, 0);
  const projected = currentRemaining - total;
  const shown = upcoming.slice(0, 8);

  document.getElementById("recurringList").innerHTML = shown.map(u => `
    <div class="mini-item">
      <span><span class="cat-tag">${u.cat ? catLabel(u.cat) : "🔸"}</span>${u.note}</span>
      <span class="amt">−${money(u.amount)}</span>
    </div>`).join("") + (upcoming.length > shown.length
      ? `<p class="hint" style="margin:6px 0 0;">+ ${upcoming.length - shown.length} autre${upcoming.length - shown.length > 1 ? "s" : ""} prélèvement${upcoming.length - shown.length > 1 ? "s" : ""} habituel${upcoming.length - shown.length > 1 ? "s" : ""}</p>`
      : "");

  document.getElementById("recurringNote").innerHTML =
    `Il te reste probablement <strong>${moneySigned(projected)}</strong> une fois ces ${upcoming.length} prélèvement${upcoming.length > 1 ? "s" : ""} habituel${upcoming.length > 1 ? "s" : ""} passé${upcoming.length > 1 ? "s" : ""} (estimation basée sur ton historique).`;
}

function renderDashboard() {
  const txs = transactionsForMonth(currentMonth);

  let income = 0, expense = 0, saved = 0;
  const netByCat = {};

  txs.forEach(t => {
    const cat = catById(t.categoryId);
    if (!cat) return;
    netByCat[cat.id] = (netByCat[cat.id] || 0) + t.amount;
    if (t.amount >= 0) income += t.amount;
    else expense += -t.amount;
    if (cat.id === "epargne" || cat.id === "epargne_tf") saved += -t.amount;
  });

  animateKpi("kpiIncome", income, money);
  animateKpi("kpiExpense", expense, money);
  animateKpi("kpiRemaining", income - expense, moneySigned);
  animateKpi("kpiSaved", saved, moneySigned);

  const totalBudget = state.categories
    .filter(c => c.type === "expense" && c.budget > 0)
    .reduce((s, c) => s + c.budget, 0);
  const remainingBudget = totalBudget - expense;
  const greeting = document.getElementById("greetingText");
  const activeProfileName = (getProfiles().find(p => p.id === activeProfileId) || {}).name || USER_NAME;
  let msg = `<span class="greeting-name">Bonjour ${activeProfileName} !</span>`;
  if (saved > 0) {
    msg += `Tu as économisé ${money(saved)} ce mois-ci. `;
  } else if (expense > 0) {
    msg += `Pas encore d'épargne enregistrée ce mois-ci. `;
  } else {
    msg += `Le mois démarre tout juste. `;
  }
  if (totalBudget > 0) {
    msg += remainingBudget >= 0
      ? `Il te reste ${money(remainingBudget)} avant ton budget prévu. Continue comme ça !`
      : `Tu as dépassé ton budget prévu de ${money(-remainingBudget)} ce mois-ci.`;
  } else {
    msg += `Continue comme ça !`;
  }
  greeting.innerHTML = msg;

  renderRecurringExpenses(income - expense);

  // Jauges par catégorie de dépense ayant un budget défini
  const container = document.getElementById("gaugesContainer");
  container.innerHTML = "";
  const expenseCats = sortedCategories().filter(c => c.type === "expense");

  if (expenseCats.every(c => !c.budget)) {
    container.innerHTML = `<p class="empty-state">Définissez des budgets dans l'onglet « Catégories » pour voir apparaître vos jauges ici.</p>`;
  } else {
    expenseCats.forEach(cat => {
      if (!cat.budget) return;
      const spent = Math.max(0, -(netByCat[cat.id] || 0));
      const pct = Math.min(100, Math.round((spent / cat.budget) * 100));
      const realPct = Math.round((spent / cat.budget) * 100);
      let cls = "ok";
      if (realPct >= 100) cls = "over";
      else if (realPct >= 80) cls = "warn";

      const row = document.createElement("div");
      row.className = "gauge-row";
      row.innerHTML = `
        <div class="gauge-top">
          <span class="gauge-name">${catLabel(cat)}</span>
          <span class="gauge-figures">${money(spent)} / ${money(cat.budget)}</span>
        </div>
        <div class="gauge-track">
          <div class="gauge-fill ${cls}" style="width:${pct}%"></div>
        </div>
        <div class="gauge-pct ${realPct >= 100 ? "over-text" : ""}">
          ${realPct}% du budget ${realPct >= 100 ? `— dépassé de ${money(spent - cat.budget)}` : "utilisé"}
        </div>`;
      container.appendChild(row);
    });
  }

  renderExpensePie(netByCat);

  // Dernières opérations
  const recentList = document.getElementById("recentList");
  recentList.innerHTML = "";
  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  if (recent.length === 0) {
    recentList.innerHTML = `<p class="empty-state">Aucune opération ce mois-ci pour l'instant.</p>`;
  } else {
    recent.forEach(t => {
      const cat = catById(t.categoryId);
      const item = document.createElement("div");
      item.className = "mini-item";
      item.innerHTML = `
        <span><span class="cat-tag">${cat ? catLabel(cat) : "?"}</span>${t.note || ""}</span>
        <span class="amt ${t.amount >= 0 ? "income" : ""}">${moneySigned(t.amount)}</span>`;
      recentList.appendChild(item);
    });
  }
}

let expenseChart = null;

function renderExpensePie(netByCat) {
  const rows = sortedCategories()
    .filter(c => c.type === "expense")
    .map(c => ({ cat: c, spent: Math.max(0, -(netByCat[c.id] || 0)) }))
    .filter(r => r.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const canvas = document.getElementById("expensePie");
  const legend = document.getElementById("pieLegend");

  if (rows.length === 0) {
    if (expenseChart) { expenseChart.destroy(); expenseChart = null; }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    legend.innerHTML = `<p class="empty-state">Pas encore de dépenses ce mois-ci.</p>`;
    return;
  }

  const total = rows.reduce((s, r) => s + r.spent, 0);
  const labels = rows.map(r => catLabel(r.cat));
  const data = rows.map(r => r.spent);
  const colors = rows.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]);

  if (expenseChart) expenseChart.destroy();
  expenseChart = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: "#fff", borderWidth: 2 }] },
    options: {
      cutout: "62%",
      plugins: { legend: { display: false }, tooltip: { enabled: !hideAmounts } },
      animation: { duration: 500 },
    },
  });

  legend.innerHTML = rows.map((r, i) => {
    const pct = Math.round((r.spent / total) * 100);
    return `
      <div class="pie-legend-row">
        <span class="pie-legend-dot" style="background:${colors[i]}"></span>
        <span class="pie-legend-name">${catLabel(r.cat)}</span>
        <span class="pie-legend-pct">${pct}%</span>
      </div>`;
  }).join("");
}
const txForm = document.getElementById("txForm");
document.getElementById("txDate").valueAsDate = new Date();

function renderCategorySelect() {
  const select = document.getElementById("txCategory");
  const prevValue = select.value;
  select.innerHTML = "";
  sortedCategories().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = `${cat.name} (${cat.type === "income" ? "Revenu" : "Dépense"})`;
    select.appendChild(opt);
  });
  if (prevValue) select.value = prevValue;
  syncSignWithCategory();
}

function syncSignWithCategory() {
  const cat = catById(document.getElementById("txCategory").value);
  if (!cat) return;
  const wanted = cat.type === "income" ? "income" : "expense";
  document.querySelector(`input[name="txSign"][value="${wanted}"]`).checked = true;
}

document.getElementById("txCategory").addEventListener("change", syncSignWithCategory);

txForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("txDate").value;
  const rawAmount = parseFloat(document.getElementById("txAmount").value);
  const categoryId = document.getElementById("txCategory").value;
  const note = document.getElementById("txNote").value.trim();
  const sign = document.querySelector('input[name="txSign"]:checked').value;

  if (!date || !rawAmount || rawAmount <= 0 || !categoryId) return;
  const amount = sign === "expense" ? -Math.abs(rawAmount) : Math.abs(rawAmount);

  state.transactions.push({ id: uid(), date, amount, categoryId, note });
  saveState();

  const feedback = document.getElementById("txFeedback");
  feedback.textContent = "Opération enregistrée ✓";
  setTimeout(() => feedback.textContent = "", 2000);

  txForm.reset();
  document.getElementById("txDate").valueAsDate = new Date();
  renderCategorySelect();

  // Si l'opération concerne le mois affiché, on rafraîchit le tableau de bord
  if (date.startsWith(monthKey(currentMonth))) renderDashboard();
  renderHistory();
});

/* ---------------- Catégories ---------------- */
function categoriesForManagementList() {
  const income = state.categories
    .filter(c => c.type === "income")
    .sort((a, b) => (a.id === "salaire" ? -1 : b.id === "salaire" ? 1 : a.name.localeCompare(b.name, "fr")));
  const expense = state.categories
    .filter(c => c.type === "expense")
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return [...income, ...expense];
}

function renderCategoryList() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  categoriesForManagementList().forEach(cat => {
    const row = document.createElement("div");
    row.className = "category-item" + (cat.type === "income" ? " category-item-income" : "");
    row.innerHTML = `
      <span class="cname">${catLabel(cat)}</span>
      <span class="ctype">${cat.type === "income" ? "Revenu" : "Dépense"}</span>
      ${cat.type === "expense" ? `<input type="number" min="0" step="1" value="${cat.budget || 0}" data-budget-for="${cat.id}" aria-label="Budget mensuel pour ${cat.name}">` : `<span></span>`}
      <button class="icon-btn" data-delete-cat="${cat.id}" title="Supprimer la catégorie" aria-label="Supprimer ${cat.name}">✕</button>
    `;
    list.appendChild(row);
  });
}

document.getElementById("categoryList").addEventListener("change", (e) => {
  const id = e.target.dataset.budgetFor;
  if (!id) return;
  const cat = catById(id);
  cat.budget = parseFloat(e.target.value) || 0;
  saveState();
  renderDashboard();
});

document.getElementById("categoryList").addEventListener("click", (e) => {
  const id = e.target.dataset.deleteCat;
  if (!id) return;
  const cat = catById(id);
  const used = state.transactions.some(t => t.categoryId === id);
  if (used && !confirm(`« ${cat.name} » contient des opérations. La supprimer conservera ces opérations mais elles n'apparaîtront plus classées. Continuer ?`)) return;
  state.categories = state.categories.filter(c => c.id !== id);
  saveState();
  renderCategoryList();
  renderCategorySelect();
  renderDashboard();
});

const catForm = document.getElementById("catForm");
catForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("catName").value.trim();
  const type = document.getElementById("catType").value;
  const budget = parseFloat(document.getElementById("catBudget").value) || 0;
  if (!name) return;
  state.categories.push({ id: uid(), name, type, budget });
  saveState();
  catForm.reset();
  renderCategoryList();
  renderCategorySelect();
  renderDashboard();
});

/* ---------------- Historique ---------------- */
function renderHistoryFilterOptions() {
  const filter = document.getElementById("historyFilter");
  const prev = filter.value;
  filter.innerHTML = `<option value="all">Toutes les catégories</option>`;
  sortedCategories().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = catLabel(cat);
    filter.appendChild(opt);
  });
  if (prev) filter.value = prev;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderHistory() {
  renderHistoryFilterOptions();
  const filterValue = document.getElementById("historyFilter").value;
  const txs = transactionsForMonth(currentMonth)
    .filter(t => filterValue === "all" || t.categoryId === filterValue)
    .sort((a, b) => b.date.localeCompare(a.date));

  const body = document.getElementById("historyBody");
  body.innerHTML = "";
  document.getElementById("historyEmpty").style.display = txs.length ? "none" : "block";

  txs.forEach(t => {
    const tr = document.createElement("tr");
    if (t.amount >= 0) tr.className = "row-income";
    const catOptions = sortedCategories()
      .map(c => `<option value="${c.id}" ${c.id === t.categoryId ? "selected" : ""}>${catLabel(c)}</option>`)
      .join("");
    tr.innerHTML = `
      <td><input type="date" class="inline-date-input" data-tx-id="${t.id}" value="${t.date}" aria-label="Modifier la date"></td>
      <td><select class="inline-cat-select cat-pill-select" data-tx-id="${t.id}" aria-label="Changer la catégorie">${catOptions}</select></td>
      <td><input type="text" class="inline-note-input" data-tx-id="${t.id}" value="${escapeAttr(t.note || "")}" placeholder="Ajouter une note" aria-label="Modifier la note"></td>
      <td class="num">${moneySigned(t.amount)}</td>
      <td><button class="icon-btn" data-delete-tx="${t.id}" aria-label="Supprimer l'opération">✕</button></td>`;
    body.appendChild(tr);
  });
}

document.getElementById("historyFilter").addEventListener("change", renderHistory);

document.getElementById("historyBody").addEventListener("change", (e) => {
  const txId = e.target.dataset.txId;
  if (!txId) return;
  const t = state.transactions.find(tx => tx.id === txId);
  if (!t) return;
  if (e.target.classList.contains("inline-cat-select")) {
    t.categoryId = e.target.value;
  } else if (e.target.classList.contains("inline-date-input")) {
    if (e.target.value) t.date = e.target.value;
  } else if (e.target.classList.contains("inline-note-input")) {
    t.note = e.target.value.trim();
  }
  saveState();
  renderHistory();
  renderDashboard();
});

document.getElementById("historyBody").addEventListener("click", (e) => {
  const id = e.target.dataset.deleteTx;
  if (!id) return;
  if (!confirm("Supprimer cette opération ?")) return;
  state.transactions = state.transactions.filter(t => t.id !== id);
  saveState();
  renderHistory();
  renderDashboard();
});

/* ---------------- Mes projets ---------------- */
function monthsUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  let months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
  if (target.getDate() < today.getDate()) months -= 1;
  return Math.max(0, months);
}

function renderProjects() {
  const list = document.getElementById("projectList");
  list.innerHTML = "";

  if (state.projects.length === 0) {
    list.innerHTML = `<p class="empty-state">Aucun projet pour l'instant. Crée-en un ci-dessous, par exemple « Vacances » ou « Réparation voiture ».</p>`;
    return;
  }

  state.projects.forEach(p => {
    const pct = p.target > 0 ? Math.min(100, Math.round((p.saved / p.target) * 100)) : 0;
    const realPct = p.target > 0 ? Math.round((p.saved / p.target) * 100) : 0;
    let cls = "ok";
    if (realPct >= 100) cls = "over";
    else if (realPct >= 80) cls = "warn";

    let deadlineHtml = "";
    if (p.date) {
      const remaining = p.target - p.saved;
      const months = monthsUntil(p.date);
      const [y, m, d] = p.date.split("-");
      if (remaining <= 0) {
        deadlineHtml = `<p class="project-deadline">🎉 Objectif atteint avant le <strong>${d}/${m}/${y}</strong></p>`;
      } else if (months === 0) {
        deadlineHtml = `<p class="project-deadline">Échéance ce mois-ci — il manque <strong>${money(remaining)}</strong></p>`;
      } else {
        deadlineHtml = `<p class="project-deadline">Échéance le <strong>${d}/${m}/${y}</strong> (${months} mois) → épargner <strong>${money(remaining / months)}</strong>/mois</p>`;
      }
    }

    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-top">
        <div>
          <div class="project-name">${p.name}</div>
          ${p.note ? `<p class="project-note">${p.note}</p>` : ""}
        </div>
        <button class="icon-btn" data-delete-project="${p.id}" aria-label="Supprimer ${p.name}">✕</button>
      </div>
      <div class="gauge-track">
        <div class="gauge-fill ${cls}" style="width:${pct}%"></div>
      </div>
      <div class="project-figures">${money(p.saved)} / ${money(p.target)} (${realPct}%)</div>
      ${deadlineHtml}
      <div class="project-editrow">
        <label>Mettre à jour l'épargné :
          <input type="number" min="0" step="1" value="${p.saved}" data-saved-for="${p.id}" aria-label="Montant épargné pour ${p.name}">
        </label>
      </div>`;
    list.appendChild(card);
  });
}

document.getElementById("projectList").addEventListener("change", (e) => {
  const id = e.target.dataset.savedFor;
  if (!id) return;
  const p = state.projects.find(pr => pr.id === id);
  p.saved = parseFloat(e.target.value) || 0;
  saveState();
  renderProjects();
});

document.getElementById("projectList").addEventListener("click", (e) => {
  const id = e.target.dataset.deleteProject;
  if (!id) return;
  if (!confirm("Supprimer ce projet ?")) return;
  state.projects = state.projects.filter(p => p.id !== id);
  saveState();
  renderProjects();
});

const projectForm = document.getElementById("projectForm");
projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("projName").value.trim();
  const target = parseFloat(document.getElementById("projTarget").value) || 0;
  const saved = parseFloat(document.getElementById("projSaved").value) || 0;
  const date = document.getElementById("projDate").value || null;
  const note = document.getElementById("projNote").value.trim();
  if (!name || target <= 0) return;
  state.projects.push({ id: uid(), name, target, saved, date, note });
  saveState();
  projectForm.reset();
  renderProjects();
});

/* ---------------- Suivi épargne (repère Excel) ---------------- */
let savingsChart = null;
const SAVINGS_MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function moneyRound(n) {
  if (hideAmounts) return "•••• €";
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

const SAVINGS_SERIES = [
  { key: "la", label: "Livret A", color: "#8EA58B" },
  { key: "vie", label: "Assurance Vie", color: "#C7D68A" },
  { key: "doca", label: "Épargne salariale", color: "#F3C78A" },
  { key: "total", label: "Total", color: "#2F3437" },
];
let savingsVisibility = { la: true, vie: true, doca: true, total: true };

function renderSavings() {
  const sorted = [...state.savings].sort((a, b) => a.date.localeCompare(b.date));

  const body = document.getElementById("savingsBody");
  body.innerHTML = "";
  if (sorted.length === 0) {
    body.innerHTML = `<tr><td>Aucune donnée pour l'instant.</td></tr>`;
  } else {
    sorted.forEach(s => {
      const total = s.la + s.vie + s.doca;
      const [y, m] = s.date.split("-");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m}/${y}</td>
        <td class="num">${money(s.la)}</td>
        <td class="num">${money(s.vie)}</td>
        <td class="num">${money(s.doca)}</td>
        <td class="num">${money(total)}</td>
        <td><button class="icon-btn" data-delete-saving="${s.id}" aria-label="Supprimer ce mois">✕</button></td>`;
      body.appendChild(tr);
    });
  }

  // Évolution depuis janvier de l'année du dernier point connu
  const ytdEl = document.getElementById("savingsYtdChange");
  if (sorted.length > 0) {
    const lastYear = sorted[sorted.length - 1].date.slice(0, 4);
    const yearSnapshots = sorted.filter(s => s.date.startsWith(lastYear + "-"));
    const first = yearSnapshots[0];
    const last = yearSnapshots[yearSnapshots.length - 1];
    const delta = (last.la + last.vie + last.doca) - (first.la + first.vie + first.doca);
    ytdEl.textContent = moneySigned(delta);
  } else {
    ytdEl.textContent = "—";
  }

  // Versements Épargne + Épargne Taxe Foncière de l'année en cours, fléchés vers le Livret A
  const laEl = document.getElementById("savingsToLA");
  const currentYear = String(currentMonth.getFullYear());
  const toLA = state.transactions
    .filter(t => (t.categoryId === "epargne" || t.categoryId === "epargne_tf") && t.date.startsWith(currentYear + "-"))
    .reduce((s, t) => s - t.amount, 0);
  laEl.textContent = money(toLA);

  // Légende à cases à cocher
  const legend = document.getElementById("savingsLegend");
  legend.innerHTML = SAVINGS_SERIES.map(s => `
    <label>
      <input type="checkbox" data-series="${s.key}" ${savingsVisibility[s.key] ? "checked" : ""}>
      <span class="legend-swatch" style="background:${s.color}"></span>
      ${s.label}
    </label>`).join("");

  const canvas = document.getElementById("savingsChart");
  if (savingsChart) { savingsChart.destroy(); savingsChart = null; }

  if (sorted.length > 0) {
    const labels = sorted.map(s => {
      const [y, m] = s.date.split("-");
      return `${SAVINGS_MONTH_LABELS[parseInt(m, 10) - 1]} ${y.slice(2)}`;
    });
    const dataByKey = {
      la: sorted.map(s => s.la),
      vie: sorted.map(s => s.vie),
      doca: sorted.map(s => s.doca),
      total: sorted.map(s => s.la + s.vie + s.doca),
    };
    savingsChart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: SAVINGS_SERIES.map(s => ({
          label: s.label,
          data: dataByKey[s.key],
          borderColor: s.color,
          backgroundColor: s.color,
          tension: 0.35,
          pointRadius: 3,
          borderWidth: s.key === "total" ? 2.5 : 2,
          hidden: !savingsVisibility[s.key],
        })),
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: !hideAmounts,
            callbacks: { label: ctx => `${ctx.dataset.label} : ${moneyRound(ctx.parsed.y)}` },
          },
        },
        scales: {
          y: { ticks: { display: !hideAmounts, callback: v => moneyRound(v) }, grid: { display: false } },
          x: { grid: { display: false } },
        },
      },
    });
  }
}

document.getElementById("savingsLegend").addEventListener("change", (e) => {
  const key = e.target.dataset.series;
  if (!key) return;
  savingsVisibility[key] = e.target.checked;
  if (savingsChart) {
    const index = SAVINGS_SERIES.findIndex(s => s.key === key);
    savingsChart.setDatasetVisibility(index, e.target.checked);
    savingsChart.update();
  }
});

document.getElementById("savingsBody").addEventListener("click", (e) => {
  const id = e.target.dataset.deleteSaving;
  if (!id) return;
  if (!confirm("Supprimer ce mois d'épargne ?")) return;
  state.savings = state.savings.filter(s => s.id !== id);
  saveState();
  renderSavings();
});

const savingsForm = document.getElementById("savingsForm");
savingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const monthValue = document.getElementById("savDate").value; // "YYYY-MM"
  if (!monthValue) return;
  const date = `${monthValue}-01`;
  const la = parseFloat(document.getElementById("savLA").value) || 0;
  const vie = parseFloat(document.getElementById("savVIE").value) || 0;
  const doca = parseFloat(document.getElementById("savDOCA").value) || 0;

  const existing = state.savings.find(s => s.date === date);
  if (existing) {
    existing.la = la; existing.vie = vie; existing.doca = doca;
  } else {
    state.savings.push({ id: uid(), date, la, vie, doca });
  }
  saveState();
  savingsForm.reset();
  renderSavings();
});

/* ---------------- Comparatif annuel (repère Excel) ---------------- */
function monthsWithDataInYear(year) {
  const set = new Set();
  state.transactions.forEach(t => { if (t.date.startsWith(year + "-")) set.add(t.date.slice(0, 7)); });
  return set.size || 1;
}

function renderYearlyComparison() {
  const years = [...new Set(state.transactions.map(t => t.date.slice(0, 4)))].sort();
  const head = document.getElementById("yearlyHead");
  let headHtml = `<th class="sticky-col">Catégorie</th>`;
  years.forEach((y, i) => {
    headHtml += `<th class="num">${y} (moy./mois)</th>`;
    if (i < years.length - 1) headHtml += `<th class="num muted-col">Écart ${y}→${years[i + 1]}</th>`;
  });
  head.innerHTML = headHtml;

  const body = document.getElementById("yearlyBody");
  body.innerHTML = "";

  if (years.length === 0) {
    body.innerHTML = `<tr><td class="sticky-col">Aucune donnée pour l'instant.</td></tr>`;
    return;
  }

  sortedCategories().forEach(cat => {
    const avgs = years.map(y => {
      const total = state.transactions
        .filter(t => t.categoryId === cat.id && t.date.startsWith(y + "-"))
        .reduce((s, t) => s + t.amount, 0);
      return total / monthsWithDataInYear(y);
    });
    if (avgs.every(v => v === 0)) return;

    const hasEnvelope = cat.type === "expense" && cat.budget > 0;
    let row = `<td class="sticky-col">${catLabel(cat)}</td>`;
    avgs.forEach((v, i) => {
      let cls = "";
      if (v !== 0 && hasEnvelope) cls = Math.abs(v) > cat.budget ? "neg" : "pos";
      row += `<td class="num ${cls}">${v === 0 ? "—" : moneySigned(v)}</td>`;
      if (i < avgs.length - 1) {
        const diff = avgs[i + 1] - avgs[i];
        row += `<td class="num muted-col">${diff === 0 ? "—" : moneySigned(diff)}</td>`;
      }
    });
    const tr = document.createElement("tr");
    tr.innerHTML = row;
    body.appendChild(tr);
  });
}

/* ---------------- Résumé mensuel (repère Excel) ---------------- */
const MONTH_SHORT = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

function renderMonthlyPivot() {
  const years = [...new Set(state.transactions.map(t => t.date.slice(0, 4)))].sort();
  const yearSelect = document.getElementById("monthlyYearFilter");
  const currentOptions = [...yearSelect.options].map(o => o.value);
  const optionsChanged = currentOptions.length !== years.length || currentOptions.some((v, i) => v !== years[i]);

  if (optionsChanged) {
    const prevYear = yearSelect.value;
    yearSelect.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join("");
    if (years.includes(prevYear)) yearSelect.value = prevYear;
    else if (years.length) yearSelect.value = years[years.length - 1];
  }

  const year = yearSelect.value;
  const head = document.getElementById("monthlyHead");
  head.innerHTML = `<th class="sticky-col">Catégorie</th>` +
    MONTH_SHORT.map(m => `<th class="num">${m}</th>`).join("") + `<th class="num">Total</th>`;

  const body = document.getElementById("monthlyBody");
  body.innerHTML = "";

  if (!year) {
    body.innerHTML = `<tr><td class="sticky-col">Aucune donnée pour l'instant.</td></tr>`;
    return;
  }

  sortedCategories().forEach(cat => {
    const monthTotals = Array(12).fill(0);
    state.transactions.forEach(t => {
      if (t.categoryId === cat.id && t.date.startsWith(year + "-")) {
        monthTotals[parseInt(t.date.slice(5, 7), 10) - 1] += t.amount;
      }
    });
    const total = monthTotals.reduce((a, b) => a + b, 0);
    if (total === 0 && monthTotals.every(v => v === 0)) return;

    const hasEnvelope = cat.type === "expense" && cat.budget > 0;
    let row = `<td class="sticky-col">${catLabel(cat)}</td>`;
    monthTotals.forEach(v => {
      let cls = "";
      if (v !== 0 && hasEnvelope) cls = Math.abs(v) > cat.budget ? "neg" : "pos";
      row += `<td class="num ${cls}">${v === 0 ? "—" : moneySigned(v)}</td>`;
    });
    let totalCls = "";
    if (total !== 0 && hasEnvelope) totalCls = Math.abs(total) > cat.budget * 12 ? "neg" : "pos";
    row += `<td class="num ${totalCls}">${moneySigned(total)}</td>`;
    const tr = document.createElement("tr");
    tr.innerHTML = row;
    body.appendChild(tr);
  });
}

document.getElementById("monthlyYearFilter").addEventListener("change", renderMonthlyPivot);

/* ---------------- Import de relevé PDF ---------------- */
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
}

const CATEGORY_KEYWORDS = [
  { cat: "courses", words: ["carrefour", "cora ", "cora\n", "leclerc", "e.leclerc", "intermarche", "intermarché", "monoprix", "auchan", "lidl", "picard", "franprix", "casino", "grand frais"] },
  { cat: "restaurants", words: ["mcdonald", "kfc", "restaurant", "pizza", "sushi", "uber", "deliveroo", "starbucks", "boulangerie", "paul ", "del arte", "creperie", "brasserie", "traiteur"] },
  { cat: "charges", words: ["edf", "orange", "free mobile", "sfr", "bouygues", "loyer", "assurance", "netflix", "spotify", "disney", "apple.com", "cotisations bancaires", "frais bancaires", "macif", "bpce assurances", "abonnement"] },
  { cat: "voiture", words: ["total", "esso", " bp ", "shell", "sncf", "navigo", "bip & go", "bip&go", "peage", "péage", "autoroute", "parking", "essence", "station", "certas", "sanef", "parcofrance"] },
  { cat: "sante", words: ["pharmacie", "docteur", "clinique", "laboratoire", "mutuelle", "medecin", "médecin", "dentiste", "hopital", "hôpital"] },
  { cat: "vetements", words: ["kiabi", "zara", "h&m", "zalando", "decathlon", "jj s house", "jjshouse", "gemo", "celio", "gap "] },
  { cat: "plaisirs", words: ["cinema", "cinéma", "theatre", "théâtre", "concert", " bar ", "fnac", "loisirs", "spectacle"] },
  { cat: "cadeaux", words: ["cadeau", "fleuriste", "bouquetiere", "bouquetière"] },
  { cat: "amenagement", words: ["leroy merlin", "ikea", "castorama", "but ", "conforama", "brico"] },
  { cat: "salaire", words: ["salaire", "paie ", "virement employeur"] },
];

function guessCategoryForImport(label, amount) {
  const lower = label.toLowerCase();
  for (const rule of CATEGORY_KEYWORDS) {
    if (rule.words.some(w => lower.includes(w))) return rule.cat;
  }
  return amount > 0 ? "remboursements" : "charges";
}

async function extractLinesFromPdf(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const allLines = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const lineMap = new Map();
    content.items.forEach(item => {
      const y = Math.round(item.transform[5]);
      const x = item.transform[4];
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y).push({ x, text: item.str });
    });
    const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
    sortedYs.forEach(y => allLines.push(lineMap.get(y).sort((a, b) => a.x - b.x)));
  }
  return allLines;
}

const DATE_LINE_RE = /^(\d{2})\/(\d{2})\/(\d{4})/;
const AMOUNT_RE = /(-?\d[\d\s\u00A0]*,\d{2})\s*(?:€|EUR)/i;
const NUMERIC_ITEM_RE = /\d,\d{2}/;

function parseTransactionsFromLines(lines) {
  let debitX = null, creditX = null;
  for (const line of lines) {
    const debitItem = line.find(it => /d[ée]bit/i.test(it.text));
    const creditItem = line.find(it => /cr[ée]dit/i.test(it.text));
    if (debitItem && creditItem) { debitX = debitItem.x; creditX = creditItem.x; break; }
  }
  const threshold = (debitX !== null && creditX !== null) ? (debitX + creditX) / 2 : null;

  const results = [];
  lines.forEach(line => {
    const lineText = line.map(it => it.text).join(" ").replace(/\s+/g, " ").trim();
    const dateMatch = lineText.match(DATE_LINE_RE);
    if (!dateMatch) return;
    const amountMatch = lineText.match(AMOUNT_RE);
    if (!amountMatch) return;

    const numericItems = line.filter(it => NUMERIC_ITEM_RE.test(it.text));
    const amountItem = numericItems[numericItems.length - 1];
    const isCredit = threshold !== null && amountItem && amountItem.x > threshold;

    const value = parseFloat(amountMatch[1].replace(/[\s\u00A0]/g, "").replace(",", "."));
    if (isNaN(value)) return;
    const signedAmount = isCredit ? Math.abs(value) : -Math.abs(value);

    let label = lineText.slice(dateMatch[0].length).replace(amountMatch[0], "").replace(/EUR\s*$/i, "").trim();
    if (!label) label = "Opération";

    const [, dd, mm, yyyy] = dateMatch;
    results.push({ date: `${yyyy}-${mm}-${dd}`, note: label, amount: signedAmount });
  });
  return results;
}

let importPreviewData = [];

async function handleImportFile(file) {
  if (!file || file.type !== "application/pdf") {
    alert("Merci de déposer un fichier PDF.");
    return;
  }
  document.getElementById("importDropzoneText").textContent = "Lecture du PDF en cours…";
  try {
    const lines = await extractLinesFromPdf(file);
    const parsed = parseTransactionsFromLines(lines);
    if (parsed.length === 0) {
      alert("Aucune opération détectée dans ce PDF. Le format n'est peut-être pas reconnu.");
      document.getElementById("importDropzoneText").textContent = "Glisser un fichier PDF ici";
      return;
    }
    importPreviewData = parsed.map(p => ({ ...p, categoryId: guessCategoryForImport(p.note, p.amount), include: true }));
    renderImportPreview();
  } catch (e) {
    console.error(e);
    alert("Impossible de lire ce PDF. Vérifie qu'il ne s'agit pas d'un scan (image) sans texte.");
  }
  document.getElementById("importDropzoneText").textContent = "Glisser un fichier PDF ici";
}

function renderImportPreview() {
  document.getElementById("importPreviewWrap").style.display = "";
  document.getElementById("importSummary").textContent =
    `${importPreviewData.length} opération(s) détectée(s) — vérifie les catégories avant d'importer.`;

  const body = document.getElementById("importPreviewBody");
  body.innerHTML = importPreviewData.map((p, i) => {
    const [y, m, d] = p.date.split("-");
    const options = sortedCategories().map(c => `<option value="${c.id}" ${c.id === p.categoryId ? "selected" : ""}>${catLabel(c)}</option>`).join("");
    return `
      <tr>
        <td><input type="checkbox" data-import-idx="${i}" ${p.include ? "checked" : ""}></td>
        <td>${d}/${m}/${y}</td>
        <td>${p.note}</td>
        <td><select data-import-cat-idx="${i}">${options}</select></td>
        <td class="num">${moneySigned(p.amount)}</td>
      </tr>`;
  }).join("");
}

document.getElementById("importPreviewBody").addEventListener("change", (e) => {
  const idx = e.target.dataset.importIdx;
  if (idx !== undefined) importPreviewData[idx].include = e.target.checked;
  const catIdx = e.target.dataset.importCatIdx;
  if (catIdx !== undefined) importPreviewData[catIdx].categoryId = e.target.value;
});

document.getElementById("importConfirmBtn").addEventListener("click", () => {
  const toImport = importPreviewData.filter(p => p.include);
  toImport.forEach(p => {
    state.transactions.push({ id: uid(), date: p.date, amount: p.amount, categoryId: p.categoryId, note: p.note });
  });
  saveState();
  renderAll();
  document.getElementById("importPreviewWrap").style.display = "none";
  document.getElementById("importFileInput").value = "";
  alert(`${toImport.length} opération(s) importée(s) avec succès.`);
});

document.getElementById("importCancelBtn").addEventListener("click", () => {
  importPreviewData = [];
  document.getElementById("importPreviewWrap").style.display = "none";
  document.getElementById("importFileInput").value = "";
});

document.getElementById("importChooseBtn").addEventListener("click", () => {
  document.getElementById("importFileInput").click();
});

document.getElementById("importFileInput").addEventListener("change", (e) => {
  if (e.target.files[0]) handleImportFile(e.target.files[0]);
});

const importDropzone = document.getElementById("importDropzone");
["dragenter", "dragover"].forEach(evt => {
  importDropzone.addEventListener(evt, (e) => { e.preventDefault(); importDropzone.classList.add("dragover"); });
});
["dragleave", "drop"].forEach(evt => {
  importDropzone.addEventListener(evt, (e) => { e.preventDefault(); importDropzone.classList.remove("dragover"); });
});
importDropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleImportFile(file);
});

/* ---------------- Menu profil ---------------- */
function renderProfileSwitcher() {
  const profiles = getProfiles();
  const active = profiles.find(p => p.id === activeProfileId) || profiles[0];

  document.getElementById("profileAvatar").textContent = active.name.charAt(0).toUpperCase();
  document.getElementById("profileNameLabel").textContent = active.name;

  document.getElementById("profileSwitchList").innerHTML = profiles.map(p => `
    <button type="button" class="profile-switch-item ${p.id === activeProfileId ? "active" : ""}" data-switch-profile="${p.id}">
      <span class="profile-switch-avatar">${p.name.charAt(0).toUpperCase()}</span>
      ${p.name}
      ${p.id === activeProfileId ? '<span class="profile-switch-check">✓</span>' : ""}
    </button>`).join("");
}

function switchProfile(profileId) {
  if (profileId === activeProfileId) return;
  activeProfileId = profileId;
  setActiveProfileId(profileId);
  state = loadState(activeProfileId);
  renderProfileSwitcher();
  renderAll();
}

document.getElementById("profileButton").addEventListener("click", (e) => {
  e.stopPropagation();
  renderProfileSwitcher();
  document.getElementById("profileMenu").classList.toggle("open");
});

document.addEventListener("click", () => {
  document.getElementById("profileMenu").classList.remove("open");
});

document.getElementById("profileMenu").addEventListener("click", (e) => {
  const switchId = e.target.closest("[data-switch-profile]")?.dataset.switchProfile;
  if (switchId) {
    switchProfile(switchId);
    document.getElementById("profileMenu").classList.remove("open");
    return;
  }
  const action = e.target.dataset.profileAction;
  if (!action) return;
  if (action === "logout") {
    sessionStorage.removeItem(LOCK_SESSION_KEY);
    document.getElementById("profileMenu").classList.remove("open");
    document.getElementById("appRoot").style.display = "none";
    document.getElementById("lockScreen").style.display = "flex";
    document.getElementById("lockInput").value = "";
    document.getElementById("lockInput").focus();
  } else {
    document.getElementById("profileMenu").classList.remove("open");
    alert("Bientôt disponible.");
  }
});

/* ---------------- Barre latérale rétractable ---------------- */
let sidebarCollapsed = localStorage.getItem("paeonia_sidebarCollapsed") === "1";

function applySidebarState() {
  document.getElementById("tabs").classList.toggle("collapsed", sidebarCollapsed);
  document.getElementById("sidebarCollapseBtn").setAttribute(
    "aria-label",
    sidebarCollapsed ? "Déplier la barre latérale" : "Réduire la barre latérale"
  );
}

document.getElementById("sidebarCollapseBtn").addEventListener("click", () => {
  sidebarCollapsed = !sidebarCollapsed;
  localStorage.setItem("paeonia_sidebarCollapsed", sidebarCollapsed ? "1" : "0");
  applySidebarState();
});

/* ---------------- Démarrage protégé par mot de passe ---------------- */
const LOCK_PASSWORD = "owen";
const LOCK_SESSION_KEY = "cahierBudget_unlocked";

function unlockApp() {
  document.getElementById("lockScreen").style.display = "none";
  document.getElementById("appRoot").style.display = "";
  applyHideAmountsUI();
  applySidebarState();
  renderProfileSwitcher();
  updateTopbarVisibility("dashboard");
  renderAll();
}

function applyHideAmountsUI() {
  document.body.classList.toggle("hide-amounts", hideAmounts);
  document.getElementById("hideAmountsLabel").textContent = hideAmounts ? "Afficher les sommes" : "Masquer les sommes";
  document.getElementById("toggleHideAmounts").classList.toggle("active", hideAmounts);
}

document.getElementById("toggleHideAmounts").addEventListener("click", () => {
  hideAmounts = !hideAmounts;
  sessionStorage.setItem("paeonia_hideAmounts", hideAmounts ? "1" : "0");
  applyHideAmountsUI();
  renderAll();
  renderProjects();
  renderYearlyComparison();
  renderMonthlyPivot();
  renderSavings();
});

if (sessionStorage.getItem(LOCK_SESSION_KEY) === "1") {
  unlockApp();
} else {
  document.getElementById("lockForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("lockInput");
    if (input.value.trim().toLowerCase() === LOCK_PASSWORD) {
      sessionStorage.setItem(LOCK_SESSION_KEY, "1");
      unlockApp();
    } else {
      document.getElementById("lockError").textContent = "Mot de passe incorrect.";
      input.value = "";
      input.focus();
    }
  });
}
