export default function Bookings() {
  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Réservations</h1>
          <div className="text-muted">Gérer, confirmer, annuler des réservations.</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-primary">Module</span>
          <a className="btn btn-outline-secondary btn-sm" href="/">
            ← Retour
          </a>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex flex-wrap gap-2">
              <a className="btn btn-primary btn-sm" href="#">
                + Nouvelle réservation
              </a>
              <a className="btn btn-outline-primary btn-sm" href="#">
                Exporter
              </a>
            </div>

            <div className="d-flex gap-2">
              <input
                className="form-control form-control-sm"
                placeholder="Rechercher (nom, #, service)…"
                style={{ minWidth: 260 }}
              />
              <select className="form-select form-select-sm" defaultValue="all">
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="canceled">Annulée</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold">BK-1001</td>
                  <td>Émilie R.</td>
                  <td>Massage 60 min</td>
                  <td>2025-12-28 14:00</td>
                  <td>
                    <span className="badge text-bg-warning">En attente</span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-success">Confirmer</button>
                      <button className="btn btn-sm btn-outline-danger">Annuler</button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="fw-semibold">BK-1002</td>
                  <td>Nolan</td>
                  <td>Atelier découverte</td>
                  <td>2025-12-30 10:30</td>
                  <td>
                    <span className="badge text-bg-success">Confirmée</span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">Détails</button>
                      <button className="btn btn-sm btn-outline-secondary">Message</button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="fw-semibold">BK-1003</td>
                  <td>Client test</td>
                  <td>Souper 2 services</td>
                  <td>2026-01-02 19:00</td>
                  <td>
                    <span className="badge text-bg-danger">Annulée</span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary">Détails</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="small text-muted mt-3">
            Démo : plus tard on branchera la vraie liste avec MySQL/Drizzle.
          </div>
        </div>
      </div>
    </div>
  );
}
