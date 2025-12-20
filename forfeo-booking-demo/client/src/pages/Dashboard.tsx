import { useState } from "react";

interface Booking {
  id: string;
  confirmationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  isGift: boolean;
  specialMessage?: string;
  internalNotes?: string;
  amount: number;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
  isActive: boolean;
}

interface RecurringSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
}

const demoService = {
  name: "Massage Thérapeutique Signature",
  company: "Spa Détente Montréal",
  price: 129
};

const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Données de démonstration
const generateDemoBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - Math.floor(Math.random() * 30));
    const dateStr = date.toISOString().split('T')[0];
    const hour = 9 + Math.floor(Math.random() * 8);
    const time = `${hour.toString().padStart(2, '0')}:00`;
    
    const statuses: Array<'confirmed' | 'completed' | 'cancelled' | 'no-show'> = ['confirmed', 'completed', 'cancelled', 'no-show'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    bookings.push({
      id: `BK${1000 + i}`,
      confirmationNumber: `FORFEO-2025-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      customerName: ['Marie Tremblay', 'Jean Dupont', 'Sophie Martin', 'Luc Gagnon'][Math.floor(Math.random() * 4)],
      customerEmail: 'client@example.com',
      customerPhone: '514-555-1234',
      date: dateStr,
      time,
      status,
      isGift: Math.random() > 0.7,
      specialMessage: Math.random() > 0.6 ? 'Allergie aux noix' : undefined,
      amount: 129
    });
  }
  
  return bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateDemoSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let day = 0; day < 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    if (date.getDay() === 0) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const capacity = 3;
      const booked = Math.floor(Math.random() * 4);
      
      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        time,
        capacity,
        booked: Math.min(booked, capacity),
        isActive: true
      });
    }
  }
  
  return slots;
};

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>(generateDemoBookings());
  const [slots, setSlots] = useState<TimeSlot[]>(generateDemoSlots());
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', capacity: 3, isActive: true },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', capacity: 3, isActive: true },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', capacity: 3, isActive: true },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', capacity: 3, isActive: true },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', capacity: 3, isActive: true },
    { dayOfWeek: 6, startTime: '09:00', endTime: '14:00', capacity: 2, isActive: true },
  ]);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'availability' | 'schedule' | 'policies'>('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [draggedSlot, setDraggedSlot] = useState<string | null>(null);

  // Statistiques
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const noShowBookings = bookings.filter(b => b.status === 'no-show').length;
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0);
  const potentialRevenue = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.amount, 0);
  
  const totalCapacity = slots.reduce((sum, s) => sum + s.capacity, 0);
  const totalBooked = slots.reduce((sum, s) => sum + s.booked, 0);
  const fillRate = totalCapacity > 0 ? ((totalBooked / totalCapacity) * 100).toFixed(1) : '0';

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
  };

  const updateInternalNotes = (bookingId: string, notes: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, internalNotes: notes } : b
    ));
  };

  const toggleSlot = (slotId: string) => {
    setSlots(slots.map(slot => 
      slot.id === slotId && slot.booked === 0
        ? { ...slot, isActive: !slot.isActive }
        : slot
    ));
  };

  const toggleDaySchedule = (dayOfWeek: number) => {
    setRecurringSchedule(recurringSchedule.map(schedule =>
      schedule.dayOfWeek === dayOfWeek
        ? { ...schedule, isActive: !schedule.isActive }
        : schedule
    ));
  };

  const updateSchedule = (dayOfWeek: number, field: keyof RecurringSchedule, value: string | number) => {
    setRecurringSchedule(recurringSchedule.map(schedule =>
      schedule.dayOfWeek === dayOfWeek
        ? { ...schedule, [field]: value }
        : schedule
    ));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });
  };

  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const dates = Object.keys(slotsByDate).sort();

  const getStatusBadge = (status: Booking['status']) => {
    const badges = {
      confirmed: 'bg-primary',
      completed: 'bg-success',
      cancelled: 'bg-secondary',
      'no-show': 'bg-danger'
    };
    const labels = {
      confirmed: 'Confirmé',
      completed: 'Complété',
      cancelled: 'Annulé',
      'no-show': 'Absent'
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <i className="bi bi-calendar-check me-2"></i>
            <strong>Forfeo</strong> <span className="text-muted">| Dashboard</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <i className="bi bi-eye me-1"></i>
                  Voir la page publique
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#notifications">
                  <i className="bi bi-bell me-1"></i>
                  <span className="badge bg-danger">3</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* En-tête */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container-fluid py-3">
          <h4 className="mb-0">{demoService.name}</h4>
          <p className="text-muted mb-0 small">{demoService.company}</p>
        </div>
      </div>

      <div className="container-fluid py-4">
        {/* Onglets */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Vue d'ensemble
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="bi bi-calendar-check me-2"></i>
              Réservations
              <span className="badge bg-primary ms-2">{confirmedBookings}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'availability' ? 'active' : ''}`}
              onClick={() => setActiveTab('availability')}
            >
              <i className="bi bi-calendar-week me-2"></i>
              Disponibilités
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Horaire récurrent
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              <i className="bi bi-shield-check me-2"></i>
              Politiques
            </button>
          </li>
        </ul>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <>
            {/* Statistiques clés */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-primary bg-opacity-10 rounded p-3">
                          <i className="bi bi-currency-dollar text-primary fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="text-muted mb-1 small">Revenus (complétés)</h6>
                        <h3 className="mb-0">{totalRevenue.toLocaleString()}$</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-success bg-opacity-10 rounded p-3">
                          <i className="bi bi-graph-up text-success fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="text-muted mb-1 small">Revenus potentiels</h6>
                        <h3 className="mb-0">{potentialRevenue.toLocaleString()}$</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-info bg-opacity-10 rounded p-3">
                          <i className="bi bi-calendar-check text-info fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="text-muted mb-1 small">Réservations</h6>
                        <h3 className="mb-0">{totalBookings}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-warning bg-opacity-10 rounded p-3">
                          <i className="bi bi-percent text-warning fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="text-muted mb-1 small">Taux de remplissage</h6>
                        <h3 className="mb-0">{fillRate}%</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques détaillées */}
            <div className="row g-4 mb-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Répartition des réservations</h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-3">
                        <div className="p-3">
                          <i className="bi bi-check-circle-fill text-primary fs-2 mb-2"></i>
                          <h4 className="mb-1">{confirmedBookings}</h4>
                          <small className="text-muted">Confirmées</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="p-3">
                          <i className="bi bi-check-circle-fill text-success fs-2 mb-2"></i>
                          <h4 className="mb-1">{completedBookings}</h4>
                          <small className="text-muted">Complétées</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="p-3">
                          <i className="bi bi-x-circle-fill text-secondary fs-2 mb-2"></i>
                          <h4 className="mb-1">{cancelledBookings}</h4>
                          <small className="text-muted">Annulées</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="p-3">
                          <i className="bi bi-exclamation-circle-fill text-danger fs-2 mb-2"></i>
                          <h4 className="mb-1">{noShowBookings}</h4>
                          <small className="text-muted">No-show</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Actions rapides</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary" onClick={() => setActiveTab('bookings')}>
                        <i className="bi bi-calendar-plus me-2"></i>
                        Voir les réservations
                      </button>
                      <button className="btn btn-outline-primary" onClick={() => setActiveTab('availability')}>
                        <i className="bi bi-calendar-week me-2"></i>
                        Gérer les disponibilités
                      </button>
                      <button className="btn btn-outline-secondary">
                        <i className="bi bi-download me-2"></i>
                        Exporter les données
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prochaines réservations */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Prochaines réservations</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date & Heure</th>
                        <th>Client</th>
                        <th>Statut</th>
                        <th>Montant</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.filter(b => b.status === 'confirmed').slice(0, 5).map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div className="fw-semibold">{formatShortDate(booking.date)}</div>
                            <small className="text-muted">{booking.time}</small>
                          </td>
                          <td>
                            <div>{booking.customerName}</div>
                            {booking.isGift && (
                              <span className="badge bg-success-subtle text-success small">
                                <i className="bi bi-gift me-1"></i>Cadeau
                              </span>
                            )}
                          </td>
                          <td>{getStatusBadge(booking.status)}</td>
                          <td className="fw-semibold">{booking.amount}$</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowBookingModal(true);
                              }}
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Réservations */}
        {activeTab === 'bookings' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Toutes les réservations</h5>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-outline-primary active">Toutes</button>
                  <button className="btn btn-outline-primary">Confirmées</button>
                  <button className="btn btn-outline-primary">Complétées</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Confirmation</th>
                      <th>Date & Heure</th>
                      <th>Client</th>
                      <th>Contact</th>
                      <th>Statut</th>
                      <th>Montant</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <small className="font-monospace">{booking.confirmationNumber}</small>
                        </td>
                        <td>
                          <div className="fw-semibold">{formatShortDate(booking.date)}</div>
                          <small className="text-muted">{booking.time}</small>
                        </td>
                        <td>
                          <div>{booking.customerName}</div>
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
                        </td>
                        <td>
                          <small className="d-block">{booking.customerEmail}</small>
                          <small className="text-muted">{booking.customerPhone}</small>
                        </td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td className="fw-semibold">{booking.amount}$</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowBookingModal(true);
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Disponibilités */}
        {activeTab === 'availability' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Gestion des créneaux</h5>
                <div className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Glissez-déposez pour réorganiser
                </div>
              </div>
            </div>
            <div className="card-body">
              {dates.slice(0, 7).map((date) => {
                const daySlots = slotsByDate[date];
                return (
                  <div key={date} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-primary mb-0">
                        <i className="bi bi-calendar-day me-2"></i>
                        {formatDate(date)}
                      </h6>
                      <span className="badge bg-secondary">
                        {daySlots.reduce((sum, s) => sum + s.booked, 0)} / {daySlots.reduce((sum, s) => sum + s.capacity, 0)} places réservées
                      </span>
                    </div>
                    <div className="row g-2">
                      {daySlots.map((slot) => (
                        <div key={slot.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                          <div
                            className={`card text-center p-2 ${
                              slot.booked >= slot.capacity
                                ? 'bg-danger text-white'
                                : slot.booked > 0
                                ? 'bg-warning'
                                : slot.isActive
                                ? 'bg-success-subtle border-success'
                                : 'bg-secondary bg-opacity-10'
                            }`}
                            draggable={slot.booked === 0}
                            onDragStart={() => setDraggedSlot(slot.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (draggedSlot && draggedSlot !== slot.id) {
                                // Logique de réorganisation
                                setDraggedSlot(null);
                              }
                            }}
                            onClick={() => slot.booked === 0 && toggleSlot(slot.id)}
                            style={{ cursor: slot.booked === 0 ? 'pointer' : 'default' }}
                          >
                            <div className="fw-semibold">{slot.time}</div>
                            <div className="small">
                              {slot.booked >= slot.capacity ? (
                                <>
                                  <i className="bi bi-lock-fill"></i> Complet
                                </>
                              ) : (
                                <>
                                  {slot.booked}/{slot.capacity} places
                                </>
                              )}
                            </div>
                            {!slot.isActive && slot.booked === 0 && (
                              <small className="d-block text-muted">Désactivé</small>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Horaire récurrent */}
        {activeTab === 'schedule' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Horaire hebdomadaire récurrent</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Jour</th>
                      <th>Heure de début</th>
                      <th>Heure de fin</th>
                      <th>Capacité par créneau</th>
                      <th>Statut</th>
                      <th>Activer/Désactiver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recurringSchedule.map((schedule) => (
                      <tr key={schedule.dayOfWeek}>
                        <td className="fw-semibold">{dayNames[schedule.dayOfWeek]}</td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={schedule.startTime}
                            onChange={(e) => updateSchedule(schedule.dayOfWeek, 'startTime', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={schedule.endTime}
                            onChange={(e) => updateSchedule(schedule.dayOfWeek, 'endTime', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={schedule.capacity}
                            min="1"
                            max="10"
                            onChange={(e) => updateSchedule(schedule.dayOfWeek, 'capacity', parseInt(e.target.value))}
                          />
                        </td>
                        <td>
                          <span className={`badge ${schedule.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {schedule.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td>
                          <label className="availability-toggle">
                            <input
                              type="checkbox"
                              checked={schedule.isActive}
                              onChange={() => toggleDaySchedule(schedule.dayOfWeek)}
                            />
                            <span className="availability-slider"></span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="alert alert-info mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Les modifications s'appliqueront automatiquement aux nouveaux créneaux générés.
              </div>
            </div>
          </div>
        )}

        {/* Politiques */}
        {activeTab === 'policies' && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-x-circle me-2 text-danger"></i>
                    Politique d'annulation
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Type de politique</label>
                    <select className="form-select">
                      <option>Flexible (annulation gratuite 24h avant)</option>
                      <option>Modérée (annulation gratuite 48h avant)</option>
                      <option>Stricte (annulation gratuite 7 jours avant)</option>
                      <option>Personnalisée</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Frais d'annulation (%)</label>
                    <input type="number" className="form-control" defaultValue="50" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Délai minimum (heures)</label>
                    <input type="number" className="form-control" defaultValue="24" />
                  </div>
                  <button className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-x me-2 text-warning"></i>
                    Gestion des no-show
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Frais de no-show (%)</label>
                    <input type="number" className="form-control" defaultValue="100" />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="blockNoShow" defaultChecked />
                      <label className="form-check-label" htmlFor="blockNoShow">
                        Bloquer les clients après 2 no-show
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="reminderEmail" defaultChecked />
                      <label className="form-check-label" htmlFor="reminderEmail">
                        Envoyer un rappel 24h avant
                      </label>
                    </div>
                  </div>
                  <button className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails de réservation */}
      {showBookingModal && selectedBooking && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Réservation {selectedBooking.confirmationNumber}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowBookingModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6>Informations client</h6>
                    <p className="mb-1"><strong>Nom:</strong> {selectedBooking.customerName}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                    <p className="mb-1"><strong>Téléphone:</strong> {selectedBooking.customerPhone}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Détails de la réservation</h6>
                    <p className="mb-1"><strong>Date:</strong> {formatDate(selectedBooking.date)}</p>
                    <p className="mb-1"><strong>Heure:</strong> {selectedBooking.time}</p>
                    <p className="mb-1"><strong>Statut:</strong> {getStatusBadge(selectedBooking.status)}</p>
                  </div>
                  {selectedBooking.specialMessage && (
                    <div className="col-12">
                      <h6>Message spécial du client</h6>
                      <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {selectedBooking.specialMessage}
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <h6>Notes internes</h6>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={selectedBooking.internalNotes || ''}
                      onChange={(e) => updateInternalNotes(selectedBooking.id, e.target.value)}
                      placeholder="Ajoutez des notes internes (visibles uniquement par vous)..."
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <h6>Changer le statut</h6>
                    <div className="btn-group w-100">
                      <button
                        className={`btn ${selectedBooking.status === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                      >
                        Confirmé
                      </button>
                      <button
                        className={`btn ${selectedBooking.status === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                      >
                        Complété
                      </button>
                      <button
                        className={`btn ${selectedBooking.status === 'cancelled' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                      >
                        Annulé
                      </button>
                      <button
                        className={`btn ${selectedBooking.status === 'no-show' ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => updateBookingStatus(selectedBooking.id, 'no-show')}
                      >
                        No-show
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-chat-dots me-2"></i>
                  Contacter le client
                </button>
                <button className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
