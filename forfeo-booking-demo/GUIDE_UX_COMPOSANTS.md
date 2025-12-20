# Guide UX & Composants - Plateforme Forfeo

## 🎨 Design System

### Palette de Couleurs

```css
/* Couleurs principales */
--primary: #0d6efd;      /* Bleu primaire - Actions principales */
--success: #198754;      /* Vert - Disponible, succès */
--warning: #ffc107;      /* Orange - Places limitées, attention */
--danger: #dc3545;       /* Rouge - Erreurs, no-show */
--secondary: #6c757d;    /* Gris - Désactivé, secondaire */

/* Couleurs sémantiques */
--available: #198754;    /* Créneaux disponibles */
--limited: #ffc107;      /* Places limitées */
--full: #6c757d;         /* Complet */
--booked: #0d6efd;       /* Réservé */
```

### Typographie

```css
/* Hiérarchie */
h1: 2.5rem (40px) - Titres principaux
h2: 2rem (32px) - Sections importantes
h3: 1.75rem (28px) - Sous-sections
h4: 1.5rem (24px) - Cartes, modals
h5: 1.25rem (20px) - Labels importants
h6: 1rem (16px) - Labels standards

/* Poids */
Regular: 400 - Corps de texte
Medium: 500 - Labels
Semibold: 600 - Titres secondaires
Bold: 700 - Titres principaux
```

### Espacements

```css
/* Système 8px */
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

## 📱 Écrans UX Détaillés

### 1. Page Utilisateur (Home.tsx)

#### A. Hero Section
```
┌─────────────────────────────────────────┐
│ [Image de fond plein écran]             │
│                                          │
│ Massage Thérapeutique Signature         │
│ 📍 Spa Détente Montréal                 │
│                                          │
│ ⭐ 4.8 (127 avis)                       │
│ ✓ Testé Ambassadeurs  ⏱ 90 min         │
└─────────────────────────────────────────┘
```

**Composant:**
```tsx
<div className="position-relative" style={{ height: '400px' }}>
  <img src={heroImage} className="w-100 h-100 object-fit-cover" />
  <div className="position-absolute top-0 start-0 w-100 h-100 
                  bg-dark bg-opacity-50 d-flex align-items-end">
    <div className="container pb-4">
      <h1 className="text-white display-5 fw-bold">{title}</h1>
      <div className="d-flex gap-3">
        <Badge variant="warning">⭐ {rating}</Badge>
        <Badge variant="success">✓ Ambassadeur</Badge>
        <Badge variant="primary">⏱ {duration} min</Badge>
      </div>
    </div>
  </div>
</div>
```

#### B. Section "À propos"
```
┌─────────────────────────────────────────┐
│ À propos de cette expérience            │
│                                          │
│ Massage relaxant signature de 90        │
│ minutes combinant techniques...         │
└─────────────────────────────────────────┘
```

#### C. Section "Inclus / Non inclus"
```
┌──────────────────┬──────────────────────┐
│ ✓ Inclus         │ ✗ Non inclus         │
│                  │                      │
│ ✓ Massage 90min  │ ✗ Pourboire         │
│ ✓ Aromathérapie  │ ✗ Stationnement     │
│ ✓ Accès sauna    │ ✗ Services extra    │
│ ✓ Thé & collation│                      │
│ ✓ Peignoir       │                      │
└──────────────────┴──────────────────────┘
```

**Composant:**
```tsx
<div className="row">
  <div className="col-md-6">
    <h6 className="text-success">
      <i className="bi bi-check-circle-fill me-2"></i>
      Inclus
    </h6>
    <ul className="list-unstyled">
      {included.map(item => (
        <li key={item}>
          <i className="bi bi-check text-success me-2"></i>
          {item}
        </li>
      ))}
    </ul>
  </div>
  <div className="col-md-6">
    <h6 className="text-muted">
      <i className="bi bi-x-circle me-2"></i>
      Non inclus
    </h6>
    <ul className="list-unstyled text-muted">
      {notIncluded.map(item => (
        <li key={item}>
          <i className="bi bi-x me-2"></i>
          {item}
        </li>
      ))}
    </ul>
  </div>
</div>
```

#### D. Section Avis
```
┌─────────────────────────────────────────┐
│ ⭐ 4.8 · 127 avis                       │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Marie L.          ⭐⭐⭐⭐⭐  [🏅]  │ │
│ │ Il y a 2 semaines                   │ │
│ │                                     │ │
│ │ Expérience absolument divine!       │ │
│ │ La masseuse était exceptionnelle... │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Badge Ambassadeur:**
```tsx
{review.ambassadorBadge && (
  <span className="badge bg-success-subtle text-success">
    <i className="bi bi-patch-check-fill me-1"></i>
    Ambassadeur
  </span>
)}
```

#### E. Calendrier Flottant (Desktop)
```
┌─────────────────────────────────────────┐
│ 129$ par personne                        │
│                                          │
│ Disponibilités          [◀] [▶]         │
│ [S1] [S2] [S3] [S4]                     │
│                                          │
│ ● Disponible  ● Limité  ● Complet       │
│                                          │
│ ven. 19 déc                              │
│ [09:00] [10:00] [11:00]                 │
│ [12:00] [13:00] [14:00]                 │
│                                          │
│ sam. 20 déc                              │
│ [09:00] [10:00] [11:00]                 │
│                                          │
│ ✓ Sélectionné: ven. 19 déc à 09:00     │
│                                          │
│ ☐ C'est un cadeau                       │
│                                          │
│ [Formulaire de réservation]             │
└─────────────────────────────────────────┘
```

**Sticky Positioning:**
```tsx
<div className="sticky-top" style={{ top: '80px' }}>
  <div className="card shadow border-0">
    {/* Contenu */}
  </div>
</div>
```

#### F. Formulaire Cadeau
```
┌─────────────────────────────────────────┐
│ ☑ C'est un cadeau                       │
│                                          │
│ Informations du destinataire            │
│ ┌─────────────────────────────────────┐ │
│ │ Nom du destinataire *               │ │
│ │ [Jean Tremblay                    ] │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Email du destinataire *             │ │
│ │ [jean@example.com                 ] │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Message cadeau                      │ │
│ │ [Joyeux anniversaire!             ] │ │
│ │ [                                  ] │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ Vos informations                         │
│ [Formulaire acheteur...]                │
└─────────────────────────────────────────┘
```

**Toggle Logic:**
```tsx
const [isGift, setIsGift] = useState(false);

<div className="form-check form-switch mb-3">
  <input
    type="checkbox"
    checked={isGift}
    onChange={(e) => setIsGift(e.target.checked)}
  />
  <label>
    <i className="bi bi-gift me-1"></i>
    C'est un cadeau
  </label>
</div>

{isGift && (
  <div className="gift-section">
    {/* Formulaire destinataire */}
  </div>
)}
```

#### G. Page de Confirmation
```
┌─────────────────────────────────────────┐
│           ✓ Réservation Confirmée!      │
│                                          │
│     Numéro de confirmation              │
│     FORFEO-2025-A3B9X2                  │
│                                          │
│ ┌─────────────────┬───────────────────┐ │
│ │ 📅 Détails      │ 📍 Lieu           │ │
│ │                 │                   │ │
│ │ Massage...      │ 1234 Rue...       │ │
│ │ ven. 19 déc     │                   │ │
│ │ 09:00           │ [Ouvrir Maps]     │ │
│ │ 90 minutes      │                   │ │
│ └─────────────────┴───────────────────┘ │
│                                          │
│ 🔔 Rappels automatiques:                │
│ Vous recevrez des rappels 24h et 2h     │
│ avant votre rendez-vous.                │
│                                          │
│ [💬 Contacter Spa Détente Montréal]    │
│ [Nouvelle réservation]                  │
└─────────────────────────────────────────┘
```

**Google Maps Integration:**
```tsx
<a 
  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-sm btn-outline-primary"
>
  <i className="bi bi-map me-1"></i>
  Ouvrir dans Maps
</a>
```

#### H. Chat Widget
```
┌─────────────────────────────────────┐
│ Spa Détente Montréal      [✕]      │
│ En ligne                            │
├─────────────────────────────────────┤
│                                     │
│ 🤖 Bonjour! Comment puis-je        │
│    vous aider avec votre           │
│    réservation?                    │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [Votre message...           ] [📤] │
└─────────────────────────────────────┘
```

**Floating Button:**
```tsx
<button
  className="btn btn-primary rounded-circle position-fixed shadow-lg"
  style={{ 
    bottom: '20px', 
    right: '20px', 
    width: '60px', 
    height: '60px',
    zIndex: 1000 
  }}
  onClick={() => setShowChat(!showChat)}
>
  <i className="bi bi-chat-dots-fill" style={{ fontSize: '1.5rem' }}></i>
</button>
```

### 2. Dashboard Entreprise (Dashboard.tsx)

#### A. Vue d'Ensemble
```
┌─────────────────────────────────────────────────────────┐
│ Forfeo | Dashboard                    [👁 Voir public]  │
├─────────────────────────────────────────────────────────┤
│ Massage Thérapeutique Signature                         │
│ Spa Détente Montréal                                    │
├─────────────────────────────────────────────────────────┤
│ [Vue d'ensemble] [Réservations] [Disponibilités]        │
│ [Horaire récurrent] [Politiques]                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────┬────────────┬────────────┬──────────────┐ │
│ │ 💵 Revenus │ 📈 Potentiel│ 📅 Réserv. │ 📊 Taux     │ │
│ │ 1,548$     │ 387$        │ 15         │ 67.3%       │ │
│ └────────────┴────────────┴────────────┴──────────────┘ │
│                                                          │
│ Répartition des réservations                            │
│ ┌──────────────────────────────────────────────────────┐│
│ │   ✓ 3        ✓ 8        ✗ 2        ⚠ 2              ││
│ │ Confirmées Complétées Annulées  No-show             ││
│ └──────────────────────────────────────────────────────┘│
│                                                          │
│ Prochaines réservations                                 │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Date       Client        Statut    Montant  Actions ││
│ │ ven. 19    Marie T.      [✓]       129$    [Détails]││
│ │ 09:00      🎁 Cadeau                                 ││
│ │                                                      ││
│ │ ven. 19    Jean D.       [✓]       129$    [Détails]││
│ │ 14:00      ⚠ Note                                    ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**KPI Cards:**
```tsx
<div className="row g-3">
  <div className="col-md-3">
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 rounded p-3">
            <i className="bi bi-currency-dollar text-primary fs-4"></i>
          </div>
          <div className="ms-3">
            <h6 className="text-muted small">Revenus</h6>
            <h3>{totalRevenue}$</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Autres KPIs... */}
</div>
```

#### B. Liste des Réservations
```
┌─────────────────────────────────────────────────────────┐
│ Toutes les réservations    [Toutes][Confirmées][...]   │
├─────────────────────────────────────────────────────────┤
│ Confirm.      Date    Client      Contact    Statut    │
│ FORFEO-...    19 déc  Marie T.    marie@... [Confirmé] │
│               09:00   🎁 Cadeau    514-...             │
│                       ⚠ Note                           │
│                                                   [👁]  │
├─────────────────────────────────────────────────────────┤
│ FORFEO-...    19 déc  Jean D.     jean@...  [Complété] │
│               14:00                514-...             │
│                                                   [👁]  │
└─────────────────────────────────────────────────────────┘
```

**Badges Visuels:**
```tsx
{booking.isGift && (
  <span className="badge bg-success-subtle text-success small">
    <i className="bi bi-gift me-1"></i>Cadeau
  </span>
)}
{booking.specialMessage && (
  <span className="badge bg-warning-subtle text-warning small ms-1">
    <i className="bi bi-exclamation-circle me-1"></i>Note
  </span>
)}
```

#### C. Modal Détails Réservation
```
┌─────────────────────────────────────────────────────────┐
│ Réservation FORFEO-2025-A3B9X2                    [✕]  │
├─────────────────────────────────────────────────────────┤
│ Informations client    │ Détails réservation           │
│                        │                                │
│ Nom: Marie Tremblay    │ Date: ven. 19 déc 2025        │
│ Email: marie@...       │ Heure: 09:00                  │
│ Tél: 514-555-1234      │ Statut: [Confirmé]            │
│                                                          │
│ ⚠ Message spécial du client                            │
│ Allergie aux noix - Huiles sans parfum SVP             │
│                                                          │
│ Notes internes                                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Cliente régulière, préfère pression forte...        ││
│ └──────────────────────────────────────────────────────┘│
│                                                          │
│ Changer le statut                                       │
│ [Confirmé] [Complété] [Annulé] [No-show]               │
│                                                          │
│                    [💬 Contacter] [Fermer]             │
└─────────────────────────────────────────────────────────┘
```

**Status Buttons:**
```tsx
<div className="btn-group w-100">
  {statuses.map(status => (
    <button
      key={status}
      className={`btn ${
        booking.status === status 
          ? `btn-${statusColor[status]}` 
          : `btn-outline-${statusColor[status]}`
      }`}
      onClick={() => updateStatus(booking.id, status)}
    >
      {statusLabel[status]}
    </button>
  ))}
</div>
```

#### D. Gestion Disponibilités (Drag & Drop)
```
┌─────────────────────────────────────────────────────────┐
│ Gestion des créneaux          ℹ Glissez-déposez        │
├─────────────────────────────────────────────────────────┤
│ 📅 vendredi 19 décembre 2025        12/27 places       │
│                                                          │
│ [09:00]  [10:00]  [11:00]  [12:00]  [13:00]  [14:00]   │
│  3/3     2/3      0/3      1/3      3/3      2/3        │
│  🔴      🟡      🟢      🟢      🔴      🟡            │
│                                                          │
│ 📅 samedi 20 décembre 2025          8/18 places        │
│                                                          │
│ [09:00]  [10:00]  [11:00]  [12:00]  [13:00]  [14:00]   │
│  1/3     0/3      2/3      1/3      2/3      2/3        │
│  🟢      🟢      🟡      🟢      🟡      🟡            │
└─────────────────────────────────────────────────────────┘
```

**Codes Couleurs:**
- 🔴 Rouge: Complet (booked >= capacity)
- 🟡 Orange: Partiel (booked > 0 && booked < capacity)
- 🟢 Vert: Disponible (booked === 0 && isActive)
- ⚫ Gris: Désactivé (isActive === false)

**Drag & Drop:**
```tsx
<div
  draggable={slot.booked === 0}
  onDragStart={() => setDraggedSlot(slot.id)}
  onDragOver={(e) => e.preventDefault()}
  onDrop={() => handleDrop(slot.id)}
  className={getSlotClassName(slot)}
>
  <div className="fw-semibold">{slot.time}</div>
  <div className="small">{slot.booked}/{slot.capacity}</div>
</div>
```

#### E. Horaire Récurrent
```
┌─────────────────────────────────────────────────────────┐
│ Horaire hebdomadaire récurrent                          │
├─────────────────────────────────────────────────────────┤
│ Jour      Début    Fin      Capacité  Statut    Toggle │
│ Lundi     [09:00]  [17:00]  [3]       [Actif]   [ON]   │
│ Mardi     [09:00]  [17:00]  [3]       [Actif]   [ON]   │
│ Mercredi  [09:00]  [17:00]  [3]       [Actif]   [ON]   │
│ Jeudi     [09:00]  [17:00]  [3]       [Actif]   [ON]   │
│ Vendredi  [09:00]  [17:00]  [3]       [Actif]   [ON]   │
│ Samedi    [09:00]  [14:00]  [2]       [Actif]   [ON]   │
│                                                          │
│ ℹ Les modifications s'appliqueront aux nouveaux créneaux│
└─────────────────────────────────────────────────────────┘
```

**Toggle Switch CSS:**
```css
.availability-toggle {
  position: relative;
  width: 50px;
  height: 24px;
}

.availability-slider {
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.4s;
}

.availability-toggle input:checked + .availability-slider {
  background-color: #198754;
}
```

#### F. Politiques
```
┌──────────────────────┬──────────────────────────────────┐
│ ✗ Politique          │ ⚠ Gestion des no-show           │
│   d'annulation       │                                  │
│                      │                                  │
│ Type de politique    │ Frais de no-show (%)             │
│ [Flexible ▼]         │ [100                          ]  │
│                      │                                  │
│ Frais d'annulation   │ ☑ Bloquer après 2 no-show       │
│ [50              ]%  │                                  │
│                      │ ☑ Rappel 24h avant              │
│ Délai minimum        │                                  │
│ [24              ]h  │ [💾 Enregistrer]                │
│                      │                                  │
│ [💾 Enregistrer]    │                                  │
└──────────────────────┴──────────────────────────────────┘
```

## 🎯 Patterns UX Clés

### 1. Codes Couleurs Consistants

**Disponibilité:**
- Vert (#198754): Disponible, succès
- Orange (#ffc107): Limité, attention
- Gris (#6c757d): Complet, désactivé
- Rouge (#dc3545): Erreur, no-show
- Bleu (#0d6efd): Sélectionné, action

### 2. Feedback Visuel

**États des boutons:**
```css
/* Hover */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Active */
.btn.selected {
  border: 2px solid var(--primary);
  background: var(--primary);
  color: white;
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 3. Responsive Breakpoints

**Mobile (<768px):**
- Navigation bottom
- Calendrier scrollable vertical
- Formulaire pleine largeur
- Chat plein écran

**Tablet (768-1024px):**
- Sidebar collapsible
- Calendrier grid 3 colonnes
- Formulaire 2 colonnes

**Desktop (>1024px):**
- Sidebar fixe
- Calendrier sticky
- Formulaire sidebar droite
- Multi-colonnes

### 4. Micro-interactions

**Animations:**
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide in */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 5. États de Chargement

**Skeleton:**
```tsx
<div className="skeleton">
  <div className="skeleton-line"></div>
  <div className="skeleton-line short"></div>
</div>
```

**Spinner:**
```tsx
<div className="text-center py-4">
  <div className="spinner-border text-primary" role="status">
    <span className="visually-hidden">Chargement...</span>
  </div>
</div>
```

## 📱 Mobile UX

### Navigation Mobile
```
┌─────────────────────────────────┐
│ ☰  Forfeo              [💬] [🔔]│
├─────────────────────────────────┤
│                                 │
│ [Contenu scrollable]            │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📅] [💬] [👤]            │
└─────────────────────────────────┘
```

### Gestes Tactiles
- Swipe gauche/droite: Navigation semaines
- Pull to refresh: Actualiser disponibilités
- Long press: Options avancées
- Pinch to zoom: Calendrier mensuel

## ✅ Checklist Accessibilité

- [ ] Contraste WCAG AA (4.5:1)
- [ ] Navigation clavier complète
- [ ] Labels ARIA
- [ ] Focus visible
- [ ] Textes alternatifs
- [ ] Taille touch min 44x44px
- [ ] Erreurs explicites
- [ ] Skip links

## 🎨 Conclusion

Ce guide UX fournit tous les composants et patterns nécessaires pour implémenter une expérience utilisateur premium et cohérente sur toute la plateforme Forfeo.

**Principes clés:**
1. **Clarté**: Chaque élément a un but clair
2. **Cohérence**: Design system unifié
3. **Feedback**: Retour visuel immédiat
4. **Accessibilité**: Utilisable par tous
5. **Performance**: Rapide et fluide
