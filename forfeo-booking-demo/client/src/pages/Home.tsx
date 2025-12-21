  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1">Forfeo Booking</h1>
          <div className="text-muted">
            Bienvenue <span className="fw-semibold">{user.name}</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-success">En ligne</span>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="fw-semibold">Réservations</div>
              <div className="text-muted small">Voir, confirmer, annuler</div>
              <div className="mt-3">
                <a className="btn btn-primary btn-sm" href="/bookings">Ouvrir</a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="fw-semibold">Services</div>
              <div className="text-muted small">Forfaits & activités</div>
              <div className="mt-3">
                <a className="btn btn-outline-primary btn-sm" href="/services">Gérer</a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="fw-semibold">Clients</div>
              <div className="text-muted small">Profils & historique</div>
              <div className="mt-3">
                <a className="btn btn-outline-primary btn-sm" href="/customers">Consulter</a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="fw-semibold">Chat</div>
              <div className="text-muted small">Messages avec clients</div>
              <div className="mt-3">
                <a className="btn btn-outline-primary btn-sm" href="/chat">Ouvrir</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <div className="fw-semibold mb-1">Prochaine étape</div>
          <div className="text-muted">
            Ajoute ici ton dashboard (réservations, services, clients, chat).
          </div>
        </div>
      </div>
    </div>
  );
