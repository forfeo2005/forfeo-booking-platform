export default function Services() {
  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Services</h1>
          <div className="text-muted">Créer et gérer tes forfaits & activités.</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-primary">Catalogue</span>
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
                + Nouveau service
              </a>
              <a className="btn btn-outline-primary btn-sm" href="#">
                Importer
              </a>
            </div>

            <div className="d-flex gap-2">
              <input
                className="form-control form-control-sm"
                placeholder="Rechercher (nom, catégorie)…"
                style={{ minWidth: 260 }}
              />
              <select className="form-select form-select-sm" defaultValue="all">
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">Massage 60 min</div>
                      <div className="text-muted small">Bien-être</div>
                    </div>
                    <span className="badge text-bg-success">Actif</span>
                  </div>
                  <div className="mt-3 text-muted small">
                    Durée: 60 min • Prix: 129 $
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary">Modifier</button>
                    <button className="btn btn-sm btn-outline-secondary">Disponibilités</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">Souper découverte</div>
                      <div className="text-muted small">Restauration</div>
                    </div>
                    <span className="badge text-bg-success">Actif</span>
                  </div>
                  <div className="mt-3 text-muted small">
                    Durée: 90 min • Prix: 89 $
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary">Modifier</button>
                    <button className="btn btn-sm btn-outline-secondary">Disponibilités</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">Atelier VIP</div>
                      <div className="text-muted small">Expérience</div>
                    </div>
                    <span className="badge text-bg-secondary">Inactif</span>
                  </div>
                  <div className="mt-3 text-muted small">
                    Durée: 120 min • Prix: 199 $
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary">Modifier</button>
                    <button className="btn btn-sm btn-outline-secondary">Activer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="small text-muted mt-3">
            Démo : plus tard on remplacera par une grille branchée sur la table <code>services</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
