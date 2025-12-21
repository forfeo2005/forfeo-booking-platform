import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: user, isLoading, isError } = trpc.auth.me.useQuery();

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex align-items-center gap-2">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-label="Chargement"
          />
          <span className="text-muted">Chargement…</span>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="fw-semibold">Forfeo Booking</div>
                  <span className="badge text-bg-secondary">Accès</span>
                </div>

                <h1 className="h3 fw-bold mb-2">Connexion requise</h1>
                <p className="text-muted mb-4">
                  Vous devez être connecté pour continuer et accéder au module de réservation.
                </p>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      window.location.href = "/api/oauth/login";
                    }}
                  >
                    Se connecter
                  </button>
                </div>

                <div className="small text-muted mt-3">
                  Astuce : si tu viens de te connecter, rafraîchis la page.
                </div>
              </div>
            </div>

            <div className="text-center text-muted small mt-3">
              © {new Date().getFullYear()} Forfeo
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1">Forfeo Booking</h1>
          <div className="text-muted">
            Bienvenue <span className="fw-semibold">{user.name}</span>
          </div>
        </div>

        <span className="badge text-bg-success">En ligne</span>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="fw-semibold">Réservations</div>
              <div className="text-muted small">Voir, confirmer, annuler</div>
              <div className="mt-3">
                <a className="btn btn-primary btn-sm" href="/bookings">
                  Ouvrir
                </a>
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
                <a className="btn btn-outline-primary btn-sm" href="/services">
                  Gérer
                </a>
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
                <a className="btn btn-outline-primary btn-sm" href="/customers">
                  Consulter
                </a>
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
                <a className="btn btn-outline-primary btn-sm" href="/chat">
                  Ouvrir
                </a>
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
}
