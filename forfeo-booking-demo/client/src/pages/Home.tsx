import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

// Données de démonstration enrichies
const demoExperience = {
  name: "Massage Thérapeutique Signature",
  company: "Spa Détente Montréal",
  duration: 90,
  price: 129,
  description: "Massage relaxant signature de 90 minutes combinant techniques suédoises et aromathérapie pour soulager les tensions musculaires profondes",
  location: "1234 Rue Sainte-Catherine O, Montréal, QC H3G 1M8",
  phone: "514-555-1234",
  email: "contact@spa-detente.com",
  rating: 4.8,
  reviewCount: 127,
  ambassadorTested: true,
  images: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
  ],
  included: [
    "Massage de 90 minutes",
    "Aromathérapie personnalisée",
    "Accès au sauna (30 min)",
    "Thé et collation santé",
    "Peignoir et serviettes"
  ],
  notIncluded: [
    "Pourboire (suggéré 15-20%)",
    "Stationnement",
    "Services additionnels"
  ],
  cancellationPolicy: {
    title: "Politique d'annulation flexible",
    description: "Annulation gratuite jusqu'à 24h avant. Frais de 50% entre 24h et 12h. Non remboursable moins de 12h avant."
  }
};

const demoReviews = [
  {
    id: 1,
    author: "Marie L.",
    rating: 5,
    date: "Il y a 2 semaines",
    comment: "Expérience absolument divine! La masseuse était exceptionnelle et l'ambiance parfaite.",
    ambassadorBadge: true
  },
  {
    id: 2,
    author: "Jean-François D.",
    rating: 5,
    date: "Il y a 1 mois",
    comment: "Meilleur massage à Montréal. Le sauna est un gros plus!",
    ambassadorBadge: false
  },
  {
    id: 3,
    author: "Sophie T.",
    rating: 4,
    date: "Il y a 2 mois",
    comment: "Très relaxant, personnel accueillant. Je recommande vivement.",
    ambassadorBadge: true
  }
];

// Générer des créneaux avec codes couleurs
const generateSlotsWithAvailability = () => {
  const slots = [];
  const today = new Date();
  
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + (week * 7) + day);
      
      if (date.getDay() === 0) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      
      for (let hour = 9; hour <= 17; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const random = Math.random();
        
        let availability: 'available' | 'limited' | 'full' = 'available';
        if (random > 0.7) availability = 'full';
        else if (random > 0.4) availability = 'limited';
        
        slots.push({ date: dateStr, time, availability, capacity: availability === 'available' ? 3 : availability === 'limited' ? 1 : 0 });
      }
    }
  }
  
  return slots;
};

const demoSlots = generateSlotsWithAvailability();

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [isGift, setIsGift] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialMessage: "",
    recipientName: "",
    recipientEmail: "",
    giftMessage: ""
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showChat, setShowChat] = useState(false);

  const handleSlotSelect = (slot: { date: string; time: string; availability: string }) => {
    if (slot.availability === 'full') return;
    setSelectedSlot({ date: slot.date, time: slot.time });
    
    // Scroll vers le formulaire sur mobile
    const formElement = document.getElementById('booking-form');
    if (formElement && window.innerWidth < 992) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setConfirmationNumber(`FORFEO-${year}-${random}`);
    setShowConfirmation(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-CA', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const slotsByDate = demoSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof demoSlots>);

  const dates = Object.keys(slotsByDate).sort();
  
  const today = new Date();
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + (currentWeek * 7) + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }

  const currentWeekDates = dates.filter(date => weekDates.includes(date));

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-light">
        <nav className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <a className="navbar-brand" href="/">
              <i className="bi bi-calendar-check me-2"></i>
              <strong>Forfeo</strong>
            </a>
          </div>
        </nav>

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-lg border-0">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h2 className="mb-2">{isGift ? 'Cadeau Envoyé !' : 'Réservation Confirmée !'}</h2>
                    <p className="text-muted">
                      {isGift 
                        ? `Un email a été envoyé à ${formData.recipientEmail} avec tous les détails`
                        : 'Votre réservation a été enregistrée avec succès'}
                    </p>
                  </div>

                  <div className="bg-primary bg-opacity-10 border border-primary border-2 rounded p-4 mb-4 text-center">
                    <p className="text-primary small mb-2 fw-semibold">Numéro de confirmation</p>
                    <h3 className="text-primary fw-bold mb-0" style={{ letterSpacing: '2px' }}>
                      {confirmationNumber}
                    </h3>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="card bg-light border-0 h-100">
                        <div className="card-body">
                          <h6 className="mb-3"><i className="bi bi-calendar-event me-2 text-primary"></i>Détails de la réservation</h6>
                          <div className="small">
                            <p className="mb-2"><strong>Expérience:</strong> {demoExperience.name}</p>
                            <p className="mb-2"><strong>Date:</strong> {selectedSlot && formatDate(selectedSlot.date)}</p>
                            <p className="mb-2"><strong>Heure:</strong> {selectedSlot?.time}</p>
                            <p className="mb-0"><strong>Durée:</strong> {demoExperience.duration} minutes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light border-0 h-100">
                        <div className="card-body">
                          <h6 className="mb-3"><i className="bi bi-geo-alt me-2 text-primary"></i>Lieu</h6>
                          <p className="small mb-2">{demoExperience.location}</p>
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(demoExperience.location)}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-map me-1"></i>
                            Ouvrir dans Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info mb-4">
                    <i className="bi bi-bell me-2"></i>
                    <strong>Rappels automatiques:</strong> Vous recevrez des rappels par email 24h et 2h avant votre rendez-vous.
                  </div>

                  {isGift && (
                    <div className="alert alert-success mb-4">
                      <i className="bi bi-gift me-2"></i>
                      <strong>Message cadeau:</strong> "{formData.giftMessage}"
                    </div>
                  )}

                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-lg" onClick={() => setShowChat(true)}>
                      <i className="bi bi-chat-dots me-2"></i>
                      Contacter {demoExperience.company}
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowConfirmation(false);
                        setSelectedSlot(null);
                        setFormData({ name: "", email: "", phone: "", specialMessage: "", recipientName: "", recipientEmail: "", giftMessage: "" });
                        setIsGift(false);
                      }}
                    >
                      Nouvelle réservation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light position-relative">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand" href="/">
            <i className="bi bi-calendar-check me-2"></i>
            <strong>Forfeo</strong>
          </a>
          <span className="navbar-text text-white-50 d-none d-md-inline">
            Expériences locales premium
          </span>
        </div>
      </nav>

      {/* Hero Section avec Images */}
      <div className="position-relative" style={{ height: '400px', overflow: 'hidden' }}>
        <img 
          src={demoExperience.images[0]} 
          alt={demoExperience.name}
          className="w-100 h-100 object-fit-cover"
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-end">
          <div className="container pb-4">
            <div className="row">
              <div className="col-lg-8">
                <h1 className="text-white display-5 fw-bold mb-2">{demoExperience.name}</h1>
                <p className="text-white-50 mb-3">
                  <i className="bi bi-geo-alt me-2"></i>
                  {demoExperience.company}
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="badge bg-warning text-dark px-3 py-2">
                    <i className="bi bi-star-fill me-1"></i>
                    {demoExperience.rating} ({demoExperience.reviewCount} avis)
                  </div>
                  {demoExperience.ambassadorTested && (
                    <div className="badge bg-success px-3 py-2">
                      <i className="bi bi-patch-check-fill me-1"></i>
                      Testé par Ambassadeurs Forfeo
                    </div>
                  )}
                  <div className="badge bg-primary px-3 py-2">
                    <i className="bi bi-clock me-1"></i>
                    {demoExperience.duration} minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container py-4">
        <div className="row g-4">
          {/* Colonne gauche - Informations */}
          <div className="col-lg-8">
            {/* Description */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">À propos de cette expérience</h5>
                <p className="text-muted">{demoExperience.description}</p>
              </div>
            </div>

            {/* Inclus / Non inclus */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h5 className="mb-4">Ce qui est inclus</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-success mb-3">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Inclus
                    </h6>
                    <ul className="list-unstyled">
                      {demoExperience.included.map((item, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-check text-success me-2"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-3">
                      <i className="bi bi-x-circle me-2"></i>
                      Non inclus
                    </h6>
                    <ul className="list-unstyled text-muted">
                      {demoExperience.notIncluded.map((item, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-x me-2"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Politique d'annulation */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">
                  <i className="bi bi-shield-check me-2 text-primary"></i>
                  {demoExperience.cancellationPolicy.title}
                </h5>
                <p className="text-muted mb-0">{demoExperience.cancellationPolicy.description}</p>
              </div>
            </div>

            {/* Avis */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    {demoExperience.rating} · {demoExperience.reviewCount} avis
                  </h5>
                </div>
                <div className="row g-3">
                  {demoReviews.map((review) => (
                    <div key={review.id} className="col-12">
                      <div className="border-bottom pb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-semibold">{review.author}</div>
                            <div className="small text-muted">{review.date}</div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <div className="text-warning">
                              {'★'.repeat(review.rating)}
                            </div>
                            {review.ambassadorBadge && (
                              <span className="badge bg-success-subtle text-success">
                                <i className="bi bi-patch-check-fill me-1"></i>
                                Ambassadeur
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mb-0 text-muted small">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendrier (visible sur mobile) */}
            <div className="card shadow-sm border-0 mb-4 d-lg-none">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-calendar3 me-2"></i>
                    Disponibilités
                  </h5>
                  <div className="btn-group btn-group-sm">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                      disabled={currentWeek === 0}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setCurrentWeek(Math.min(3, currentWeek + 1))}
                      disabled={currentWeek === 3}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex gap-2 flex-wrap">
                    {[0, 1, 2, 3].map((week) => (
                      <button
                        key={week}
                        className={`btn btn-sm ${currentWeek === week ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setCurrentWeek(week)}
                      >
                        Semaine {week + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3 small">
                  <div className="d-flex gap-3 flex-wrap">
                    <span><span className="badge bg-success me-1">●</span> Disponible</span>
                    <span><span className="badge bg-warning me-1">●</span> Places limitées</span>
                    <span><span className="badge bg-secondary me-1">●</span> Complet</span>
                  </div>
                </div>

                {currentWeekDates.map((date) => {
                  const slots = slotsByDate[date] || [];
                  if (slots.length === 0) return null;

                  return (
                    <div key={date} className="mb-4">
                      <h6 className="text-primary mb-3">
                        <i className="bi bi-calendar-day me-2"></i>
                        {formatDate(date)}
                      </h6>
                      <div className="row g-2">
                        {slots.map((slot, index) => (
                          <div key={index} className="col-4 col-sm-3">
                            <button
                              className={`btn btn-sm w-100 ${
                                selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                  ? 'btn-primary'
                                  : slot.availability === 'available'
                                  ? 'btn-outline-success'
                                  : slot.availability === 'limited'
                                  ? 'btn-outline-warning'
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() => handleSlotSelect(slot)}
                              disabled={slot.availability === 'full'}
                            >
                              <div className="fw-semibold">{slot.time}</div>
                              {slot.availability === 'limited' && (
                                <small className="d-block">({slot.capacity} place{slot.capacity > 1 ? 's' : ''})</small>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne droite - Réservation */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '80px' }} id="booking-form">
              <div className="card shadow border-0 mb-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h3 className="mb-0">{demoExperience.price}$</h3>
                      <small className="text-muted">par personne</small>
                    </div>
                  </div>

                  {/* Calendrier desktop */}
                  <div className="d-none d-lg-block mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Disponibilités</h6>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                          disabled={currentWeek === 0}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => setCurrentWeek(Math.min(3, currentWeek + 1))}
                          disabled={currentWeek === 3}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex gap-2 flex-wrap">
                        {[0, 1, 2, 3].map((week) => (
                          <button
                            key={week}
                            className={`btn btn-sm ${currentWeek === week ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setCurrentWeek(week)}
                          >
                            S{week + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3 small">
                      <div className="d-flex flex-column gap-1">
                        <span><span className="badge bg-success me-1">●</span> Disponible</span>
                        <span><span className="badge bg-warning me-1">●</span> Limité</span>
                        <span><span className="badge bg-secondary me-1">●</span> Complet</span>
                      </div>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {currentWeekDates.slice(0, 3).map((date) => {
                        const slots = slotsByDate[date] || [];
                        if (slots.length === 0) return null;

                        return (
                          <div key={date} className="mb-3">
                            <div className="small fw-semibold text-primary mb-2">
                              {formatShortDate(date)}
                            </div>
                            <div className="row g-1">
                              {slots.slice(0, 6).map((slot, index) => (
                                <div key={index} className="col-4">
                                  <button
                                    className={`btn btn-sm w-100 ${
                                      selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                        ? 'btn-primary'
                                        : slot.availability === 'available'
                                        ? 'btn-outline-success'
                                        : slot.availability === 'limited'
                                        ? 'btn-outline-warning'
                                        : 'btn-outline-secondary'
                                    }`}
                                    onClick={() => handleSlotSelect(slot)}
                                    disabled={slot.availability === 'full'}
                                  >
                                    {slot.time.substring(0, 5)}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedSlot && (
                    <>
                      <div className="alert alert-info mb-3">
                        <small>
                          <i className="bi bi-calendar-check me-1"></i>
                          {formatShortDate(selectedSlot.date)} à {selectedSlot.time}
                        </small>
                      </div>

                      {/* Toggle Cadeau */}
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="giftToggle"
                          checked={isGift}
                          onChange={(e) => setIsGift(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="giftToggle">
                          <i className="bi bi-gift me-1"></i>
                          C'est un cadeau
                        </label>
                      </div>

                      <form onSubmit={handleSubmit}>
                        {isGift ? (
                          <>
                            <h6 className="mb-3">Informations du destinataire</h6>
                            <div className="mb-3">
                              <label className="form-label small">Nom du destinataire *</label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                value={formData.recipientName}
                                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label small">Email du destinataire *</label>
                              <input
                                type="email"
                                className="form-control"
                                required
                                value={formData.recipientEmail}
                                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label small">Message cadeau</label>
                              <textarea
                                className="form-control"
                                rows={3}
                                value={formData.giftMessage}
                                onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                                placeholder="Votre message personnel..."
                              ></textarea>
                            </div>
                            <h6 className="mb-3 mt-4">Vos informations</h6>
                          </>
                        ) : null}

                        <div className="mb-3">
                          <label className="form-label small">Nom complet *</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small">Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small">Téléphone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small">
                            Message spécial
                            <small className="text-muted d-block">Allergies, surprise, notes...</small>
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={formData.specialMessage}
                            onChange={(e) => setFormData({ ...formData, specialMessage: e.target.value })}
                            placeholder="Ex: Allergie aux noix, c'est une surprise..."
                          ></textarea>
                        </div>

                        <div className="d-grid gap-2">
                          <button type="submit" className="btn btn-primary btn-lg">
                            <i className="bi bi-check-circle me-2"></i>
                            {isGift ? 'Offrir ce cadeau' : 'Confirmer la réservation'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setSelectedSlot(null)}
                          >
                            Changer de créneau
                          </button>
                        </div>
                      </form>
                    </>
                  )}

                  {!selectedSlot && (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-calendar-plus" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-2 small">Sélectionnez un créneau pour réserver</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de chat flottant */}
      <button
        className="btn btn-primary rounded-circle position-fixed shadow-lg"
        style={{ bottom: '20px', right: '20px', width: '60px', height: '60px', zIndex: 1000 }}
        onClick={() => setShowChat(!showChat)}
      >
        <i className="bi bi-chat-dots-fill" style={{ fontSize: '1.5rem' }}></i>
      </button>

      {/* Chat Widget */}
      {showChat && (
        <div
          className="position-fixed bg-white shadow-lg rounded"
          style={{
            bottom: '90px',
            right: '20px',
            width: '350px',
            maxWidth: 'calc(100vw - 40px)',
            height: '500px',
            zIndex: 1000
          }}
        >
          <div className="bg-primary text-white p-3 rounded-top d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">{demoExperience.company}</h6>
              <small>En ligne</small>
            </div>
            <button className="btn btn-sm btn-link text-white" onClick={() => setShowChat(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="p-3" style={{ height: 'calc(100% - 120px)', overflowY: 'auto' }}>
            <div className="alert alert-light small mb-3">
              <i className="bi bi-robot me-2"></i>
              Bonjour! Comment puis-je vous aider avec votre réservation?
            </div>
          </div>
          <div className="p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Votre message..."
              />
              <button className="btn btn-primary">
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
