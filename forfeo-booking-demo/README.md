# 🎯 Forfeo - Plateforme de Réservation Premium

Plateforme complète de réservation d'expériences locales premium avec système de paiement intégré, chat en temps réel et gestion avancée des disponibilités.

![Forfeo Banner](https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=300&fit=crop)

## ✨ Fonctionnalités

### 🎨 Côté Utilisateur
- **Calendrier de disponibilité en temps réel** avec codes couleurs (disponible, limité, complet)
- **Navigation multi-semaines** pour visualiser les créneaux sur 4 semaines
- **Réservation pour soi ou en cadeau** avec message personnalisé
- **Champ de notes spéciales** (allergies, surprises, demandes particulières)
- **Avis vérifiés** avec badge "Testé par Ambassadeurs Forfeo"
- **Paiement sécurisé** via Stripe avec support des codes promo
- **Confirmation enrichie** avec numéro unique (FORFEO-YYYY-XXXXXX)

### 💼 Côté Entreprise
- **Tableau de bord analytique** (réservations, revenus, taux de remplissage)
- **Gestion des disponibilités** avec capacité par créneau
- **Créneaux récurrents** pour automatiser la planification
- **Politiques d'annulation** configurables (flexible, modérée, stricte)
- **Historique clients** avec notes internes
- **Statistiques en temps réel** (KPIs, graphiques)

### 💬 Chat Intégré
- **Messages en temps réel** utilisateur ↔ entreprise
- **Bouton flottant** visible avant et après réservation
- **Notifications email** automatiques
- **Message de bienvenue** personnalisé
- **Architecture prête** pour bot IA "Forfy"

## 🛠️ Stack Technique

### Frontend
- **React 19** avec TypeScript
- **Bootstrap 5** pour l'UI
- **Wouter** pour le routing
- **tRPC** pour les appels API type-safe
- **Socket.io Client** pour le chat temps réel

### Backend
- **Node.js** avec Express
- **tRPC** pour l'API REST type-safe
- **Drizzle ORM** avec MySQL
- **Stripe Connect** pour les paiements
- **Socket.io** pour le WebSocket
- **Vitest** pour les tests

### Base de Données
- **MySQL** avec 10 tables :
  - `companies` - Entreprises partenaires
  - `services` - Services/expériences offerts
  - `availability_slots` - Créneaux horaires
  - `bookings` - Réservations
  - `customers` - Clients
  - `chat_messages` - Messages du chat
  - `reviews` - Avis clients
  - `cancellation_policies` - Politiques d'annulation
  - `company_stats` - Statistiques entreprises
  - `notification_logs` - Logs des notifications

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- pnpm 8+
- MySQL 8+
- Compte Stripe (test ou production)

### Configuration

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/forfeo-booking-demo.git
cd forfeo-booking-demo
