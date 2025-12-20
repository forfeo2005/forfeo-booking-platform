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
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine :

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/forfeo_booking"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# JWT
JWT_SECRET="votre-secret-jwt-super-securise"

# OAuth (Manus)
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"

# App
VITE_APP_TITLE="Forfeo"
VITE_APP_ID="forfeo-booking"
```

4. **Initialiser la base de données**
```bash
# Créer les tables
pnpm db:push

# Peupler avec des données de démonstration
node scripts/seed-demo-data.mjs
```

5. **Lancer le serveur de développement**
```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

## 📋 Scripts Disponibles

```bash
pnpm dev          # Lancer le serveur de développement
pnpm build        # Build pour la production
pnpm start        # Lancer en mode production
pnpm test         # Exécuter les tests
pnpm db:push      # Pousser le schéma vers la DB
pnpm check        # Vérifier TypeScript
```

## 🗂️ Structure du Projet

```
forfeo-booking-demo/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Pages de l'application
│   │   ├── components/    # Composants réutilisables
│   │   ├── lib/           # Utilitaires et helpers
│   │   └── App.tsx        # Point d'entrée React
│   └── index.html
├── server/                # Backend Node.js
│   ├── _core/            # Core du serveur (tRPC, OAuth, etc.)
│   ├── stripe/           # Intégration Stripe
│   ├── chat/             # WebSocket chat
│   ├── db.ts             # Helpers base de données
│   └── routers.ts        # Routes tRPC
├── drizzle/              # Schéma et migrations DB
│   └── schema.ts
├── scripts/              # Scripts utilitaires
│   └── seed-demo-data.mjs
├── shared/               # Types partagés
└── docs/                 # Documentation
    ├── DOCUMENTATION_TECHNIQUE.md
    └── GUIDE_UX_COMPOSANTS.md
```

## 🔐 Sécurité

- **Authentification JWT** pour les sessions utilisateur
- **Validation des entrées** avec Zod
- **Protection CSRF** via tokens
- **Webhooks Stripe** avec vérification de signature
- **Prévention des doubles réservations** avec transactions SQL
- **Rate limiting** sur les endpoints sensibles

## 🧪 Tests

Le projet inclut des tests vitest pour valider :
- Opérations CRUD sur les entités
- Génération des numéros de confirmation
- Gestion des disponibilités et capacités
- Création de réservations
- Messages du chat

```bash
pnpm test
```

## 📊 Données de Démonstration

Le script de seed crée :
- 1 entreprise : **Spa Détente Montréal**
- 1 service : **Massage Thérapeutique Signature** (90 min, 129$)
- 144 créneaux de disponibilité sur 4 semaines
- 3 clients avec avis vérifiés

## 🚢 Déploiement

### Option 1 : Vercel + Railway

**Frontend (Vercel)**
```bash
vercel --prod
```

**Backend + DB (Railway)**
1. Créer un nouveau projet sur Railway
2. Ajouter MySQL et Node.js
3. Configurer les variables d'environnement
4. Déployer avec `railway up`

### Option 2 : Docker

```bash
docker-compose up -d
```

## 🔄 Webhooks Stripe

Configurer l'URL du webhook dans le dashboard Stripe :
```
https://votre-domaine.com/api/stripe/webhook
```

Événements à écouter :
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## 📖 Documentation Complète

- [Documentation Technique](./DOCUMENTATION_TECHNIQUE.md) - Architecture, API, déploiement
- [Guide UX & Composants](./GUIDE_UX_COMPOSANTS.md) - Écrans, patterns, wireframes

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

- [ ] Intégration Google Calendar pour synchronisation
- [ ] Notifications push (Progressive Web App)
- [ ] Bot IA "Forfy" pour assistance automatique
- [ ] Application mobile (React Native)
- [ ] Multi-langues (EN, ES)
- [ ] Système de fidélité et points
- [ ] Intégration avec systèmes de caisse

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 👥 Équipe

Développé avec ❤️ par l'équipe Forfeo

## 📞 Support

- Email : support@forfeo.com
- Documentation : https://docs.forfeo.com
- Issues : https://github.com/votre-username/forfeo-booking-demo/issues

---

**Note** : Ce projet utilise des clés Stripe de test. Pour la production, remplacez par vos clés live après vérification KYC.
