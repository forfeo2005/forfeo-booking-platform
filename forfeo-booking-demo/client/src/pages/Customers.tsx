export default function Customers() {
  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Clients</h1>
          <div className="text-muted">Voir les profils, historique et notes.</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-primary">CRM</span>
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
                + Nouveau client
              </a>
              <a className="btn btn-outline-primary btn-sm" href="#">
                Exporter
              </a>
            </div>

            <div className="d-flex gap-2">
              <input
                className="form-control form-control-sm"
                placeholder="Rechercher (nom, courriel)…"
                style={{ minWidth: 260 }}
              />
              <select className="form-select form-select-sm" defaultValue="all">
                <option value="all">Tous</option>
                <option value="recent">Récents</option>
                <option value="vip">VIP</option>
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
                  <th>Nom</th>
                  <th>Courriel</th>
                  <th>Dernière réservation</th>
                  <th>Tag</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold">Émilie R.</td>
                  <td className="text-muted">emilie@example.com</td>
                  <td>2025-12-28</td>
                  <td>
                    <span className="badge text-bg-warning">VIP</span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">Profil</button>
                      <button className="btn btn-sm btn-outline-secondary">Message</button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="fw-semibold">Client test</td>
                  <td className="text-muted">test@example.com</td>
                  <td>2026-01-02</td>
                  <td>
                    <span className="badge text-bg-secondary">Standard</span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary">Profil</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="small text-muted mt-3">
            Démo : plus tard on branchera la table <code>customers</code> + historique <code>bookings</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
