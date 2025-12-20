# Documentation Technique - Plateforme de Réservation Forfeo Premium

## 📋 Vue d'ensemble

Cette plateforme est un module de réservation complet orienté expériences locales premium, inspiré des meilleures pratiques de Booking et Airbnb, mais adapté au marché québécois.

## 🏗️ Architecture

### Stack Technique

**Frontend:**
- React 19 avec TypeScript
- Bootstrap 5.3 pour le design system
- Wouter pour le routing
- Architecture mobile-first responsive

**Backend (à implémenter):**
- Node.js + Express
- PostgreSQL avec Prisma ORM
- WebSocket (Socket.io) pour le chat temps réel
- API REST + GraphQL (optionnel)

### Structure du Projet

```
forfeo-booking-demo/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Page utilisateur premium
│   │   │   ├── Dashboard.tsx     # Dashboard entreprise
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   └── ui/               # Composants shadcn/ui
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── lib/
│   ├── public/
│   └── index.html
├── server/                        # À développer
└── shared/                        # Types partagés
```

## 🎨 Fonctionnalités Implémentées

### Côté Utilisateur

#### 1. **Calendrier de Disponibilité Avancé**
- ✅ Codes couleurs (Vert: Disponible, Orange: Limité, Gris: Complet)
- ✅ Navigation multi-semaines (4 semaines)
- ✅ Affichage de la capacité par créneau
- ✅ Mise à jour en temps réel (simulé)
- ✅ Vue responsive (desktop sticky, mobile scrollable)

**Implémentation:**
```typescript
const slotAvailability = {
  available: 'bg-success',    // Vert - Places disponibles
  limited: 'bg-warning',      // Orange - Places limitées
  full: 'bg-secondary'        // Gris - Complet
};
```

#### 2. **Expérience Premium**
- ✅ Hero section avec images haute qualité
- ✅ Affichage clair de la durée (90 minutes)
- ✅ Section "Inclus / Non inclus" détaillée
- ✅ Système d'avis avec badges "Ambassadeur Forfeo"
- ✅ Rating agrégé (4.8/5 avec 127 avis)

#### 3. **Réservation Cadeau**
- ✅ Toggle "C'est un cadeau"
- ✅ Formulaire destinataire séparé
- ✅ Message cadeau personnalisé
- ✅ Email de confirmation au destinataire

**Workflow cadeau:**
1. Utilisateur active le toggle cadeau
2. Formulaire s'adapte pour demander infos destinataire
3. Message personnalisé optionnel
4. Confirmation envoyée au destinataire + acheteur

#### 4. **Messages Spéciaux**
- ✅ Champ "Message spécial" (allergies, surprises, notes)
- ✅ Visible par l'entreprise dans le dashboard
- ✅ Badge d'alerte dans la liste des réservations

#### 5. **Confirmation Enrichie**
- ✅ Numéro de confirmation unique (FORFEO-YYYY-XXXXXX)
- ✅ Lien Google Maps intégré
- ✅ Informations de contact
- ✅ Rappels automatiques (24h et 2h avant)
- ✅ Bouton de chat direct

#### 6. **Chat Intégré**
- ✅ Bouton flottant toujours visible
- ✅ Widget de chat responsive
- ✅ Message de bienvenue automatique
- ✅ Architecture prête pour Socket.io
- ✅ Prêt pour bot IA "Forfy" (à venir)

### Côté Entreprise

#### 1. **Dashboard Vue d'Ensemble**
- ✅ 4 KPIs principaux:
  - Revenus complétés
  - Revenus potentiels (confirmés)
  - Nombre total de réservations
  - Taux de remplissage (%)
- ✅ Répartition par statut (Confirmé, Complété, Annulé, No-show)
- ✅ Actions rapides
- ✅ Liste des prochaines réservations

#### 2. **Gestion des Réservations**
- ✅ Liste complète avec filtres
- ✅ Badges visuels (Cadeau, Note spéciale)
- ✅ Modal de détails complet
- ✅ Changement de statut en un clic
- ✅ Notes internes par client
- ✅ Historique complet

**Statuts disponibles:**
- `confirmed` - Réservation confirmée
- `completed` - Service complété
- `cancelled` - Annulé par le client
- `no-show` - Client absent

#### 3. **Gestion des Disponibilités**
- ✅ Vue calendrier par jour
- ✅ Drag & drop pour réorganiser (préparé)
- ✅ Activation/désactivation par créneau
- ✅ Indicateur de capacité (X/Y places)
- ✅ Codes couleurs (Complet, Partiel, Vide, Désactivé)

#### 4. **Horaire Récurrent**
- ✅ Configuration par jour de la semaine
- ✅ Heures de début/fin personnalisables
- ✅ Capacité par créneau configurable
- ✅ Toggle actif/inactif par jour
- ✅ Application automatique aux nouveaux créneaux

#### 5. **Politiques**
- ✅ Politique d'annulation configurable:
  - Flexible (24h)
  - Modérée (48h)
  - Stricte (7 jours)
  - Personnalisée
- ✅ Gestion des no-show:
  - Frais configurables
  - Blocage après X no-show
  - Rappels automatiques

## 🔧 Recommandations Techniques MVP

### Phase 1: Backend Essentiel (2-3 semaines)

**Priorité Haute:**

1. **API REST Core**
```typescript
// Routes essentielles
POST   /api/bookings              // Créer réservation
GET    /api/bookings/:id          // Détails réservation
PATCH  /api/bookings/:id/status   // Changer statut
GET    /api/availability          // Disponibilités
POST   /api/availability/bulk     // Créer créneaux en masse
```

2. **Base de Données**
```sql
-- Tables principales
companies          -- Entreprises partenaires
services           -- Services/expériences
availability       -- Créneaux disponibles
bookings           -- Réservations
customers          -- Clients (dédupliqués)
reviews            -- Avis clients
chat_messages      -- Messages chat
```

3. **Schéma Prisma Recommandé**
```prisma
model Booking {
  id                  String   @id @default(cuid())
  confirmationNumber  String   @unique
  service             Service  @relation(fields: [serviceId], references: [id])
  serviceId           String
  customer            Customer @relation(fields: [customerId], references: [id])
  customerId          String
  date                DateTime
  time                String
  status              BookingStatus
  isGift              Boolean  @default(false)
  recipientName       String?
  recipientEmail      String?
  giftMessage         String?
  specialMessage      String?
  internalNotes       String?
  amount              Decimal
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

enum BookingStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

4. **Système de Notifications**
- Email transactionnel (SendGrid/Mailgun)
- Templates HTML responsive
- Queue de jobs (Bull/BullMQ)
- Rappels automatiques (24h, 2h avant)

### Phase 2: Chat Temps Réel (1-2 semaines)

**Architecture WebSocket:**

```typescript
// server/socket.ts
import { Server } from 'socket.io';

io.on('connection', (socket) => {
  // Rejoindre room par réservation
  socket.on('join:booking', (bookingId) => {
    socket.join(`booking:${bookingId}`);
  });

  // Envoyer message
  socket.on('message:send', async (data) => {
    const message = await saveMessage(data);
    io.to(`booking:${data.bookingId}`).emit('message:new', message);
    
    // Notification email si destinataire offline
    if (!isUserOnline(data.recipientId)) {
      await sendEmailNotification(data);
    }
  });
});
```

**Fonctionnalités Chat:**
- ✅ Messages en temps réel
- ✅ Historique persistant
- ✅ Notifications email si offline
- ✅ Indicateur "en train d'écrire"
- ✅ Lecture/non-lu
- 🔄 Bot IA "Forfy" (Phase 3)

### Phase 3: Fonctionnalités Avancées (2-3 semaines)

1. **Système de Paiement**
- Stripe Connect pour multi-vendeurs
- Paiement à la réservation
- Remboursements automatiques selon politique
- Gestion des pourboires

2. **Bot IA "Forfy"**
```typescript
// Intégration OpenAI
const forfyResponse = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: `Tu es Forfy, l'assistant IA de Forfeo. 
                Aide les clients avec leurs réservations d'expériences locales.
                Contexte: ${bookingContext}`
    },
    { role: "user", content: userMessage }
  ]
});
```

3. **Analytics & Reporting**
- Dashboard analytics temps réel
- Export CSV/Excel
- Rapports automatiques mensuels
- Prédictions de remplissage (ML)

### Phase 4: Optimisations (1-2 semaines)

1. **Performance**
- Cache Redis pour disponibilités
- CDN pour images
- Lazy loading
- Service Worker (PWA)

2. **SEO**
- Meta tags dynamiques
- Schema.org markup
- Sitemap XML
- Canonical URLs

3. **Sécurité**
- Rate limiting
- CSRF protection
- Input validation (Zod)
- SQL injection prevention (Prisma)

## 📊 Modèle de Données Complet

### Entités Principales

```typescript
interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  cancellationPolicy: CancellationPolicy;
  noShowPolicy: NoShowPolicy;
  settings: CompanySettings;
}

interface Service {
  id: string;
  companyId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  images: string[];
  included: string[];
  notIncluded: string[];
  ambassadorTested: boolean;
  rating: number;
  reviewCount: number;
}

interface Availability {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
  isActive: boolean;
  isRecurring: boolean;
}

interface RecurringSchedule {
  id: string;
  serviceId: string;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
}
```

## 🔐 Sécurité

### Authentification
- JWT pour les sessions
- OAuth2 pour les entreprises
- 2FA optionnel
- Rate limiting par IP

### Données Sensibles
- Encryption at rest (PostgreSQL)
- HTTPS obligatoire
- PCI DSS compliance (paiements)
- GDPR compliance (données personnelles)

## 🚀 Déploiement

### Infrastructure Recommandée

**Option 1: Vercel + Railway (Recommandé pour MVP)**
- Frontend: Vercel (gratuit)
- Backend: Railway ($5-20/mois)
- Database: Railway PostgreSQL
- Redis: Railway ($5/mois)
- Storage: Cloudflare R2 (gratuit jusqu'à 10GB)

**Option 2: AWS (Production)**
- Frontend: CloudFront + S3
- Backend: ECS Fargate
- Database: RDS PostgreSQL
- Cache: ElastiCache Redis
- Storage: S3

### CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Frontend
        run: vercel --prod
      - name: Deploy Backend
        run: railway up
```

## 📱 Mobile-First

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Optimisations Mobile
- Touch-friendly (min 44x44px)
- Swipe gestures
- Bottom navigation
- Reduced animations
- Optimized images (WebP)

## 🧪 Testing

### Tests Recommandés

```typescript
// Unit tests
describe('Booking Service', () => {
  it('should create booking with confirmation number', async () => {
    const booking = await createBooking(mockData);
    expect(booking.confirmationNumber).toMatch(/^FORFEO-\d{4}-[A-Z0-9]{6}$/);
  });
});

// Integration tests
describe('Availability API', () => {
  it('should prevent double booking', async () => {
    await createBooking({ slotId: 'slot1' });
    await expect(createBooking({ slotId: 'slot1' })).rejects.toThrow();
  });
});

// E2E tests (Playwright)
test('complete booking flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="slot-9am"]');
  await page.fill('[name="name"]', 'Test User');
  await page.click('[type="submit"]');
  await expect(page.locator('text=Confirmée')).toBeVisible();
});
```

## 📈 Métriques de Succès

### KPIs Techniques
- Temps de chargement < 2s
- Uptime > 99.9%
- Taux d'erreur < 0.1%
- Score Lighthouse > 90

### KPIs Business
- Taux de conversion > 15%
- Taux d'annulation < 10%
- Taux de no-show < 5%
- NPS > 50

## 🔄 Roadmap Future

### Q1 2025
- ✅ MVP Frontend complet
- ⏳ Backend API
- ⏳ Système de paiement
- ⏳ Chat temps réel

### Q2 2025
- Bot IA Forfy
- Application mobile (React Native)
- Programme ambassadeurs
- Marketplace multi-entreprises

### Q3 2025
- Analytics avancés
- Recommandations IA
- Intégration calendriers (Google, Outlook)
- API publique pour partenaires

## 📞 Support & Maintenance

### Monitoring
- Sentry pour les erreurs
- Datadog pour les métriques
- LogRocket pour les sessions
- Hotjar pour l'UX

### Backup
- Backup quotidien PostgreSQL
- Retention 30 jours
- Point-in-time recovery
- Disaster recovery plan

## 🎯 Conclusion

Cette plateforme est conçue pour être **scalable**, **maintenable** et **orientée conversion**. L'architecture modulaire permet d'ajouter des fonctionnalités progressivement sans refactoring majeur.

**Prochaines étapes recommandées:**
1. Implémenter le backend API (2-3 semaines)
2. Intégrer le système de paiement Stripe (1 semaine)
3. Déployer le chat temps réel (1-2 semaines)
4. Tests utilisateurs et optimisations (1 semaine)

**Estimation MVP complet:** 6-8 semaines avec 1-2 développeurs full-stack.
