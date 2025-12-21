export default function Chat() {
  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Chat</h1>
          <div className="text-muted">Messages entre clients et entreprise.</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-success">Connecté</span>
          <a className="btn btn-outline-secondary btn-sm" href="/">
            ← Retour
          </a>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="fw-semibold mb-2">Conversations</div>

              <div className="list-group">
                <button className="list-group-item list-group-item-action active">
                  Émilie R. <span className="badge text-bg-light text-dark ms-2">2</span>
                  <div className="small opacity-75">“On peut déplacer l’heure?”</div>
                </button>

                <button className="list-group-item list-group-item-action">
                  Client test
                  <div className="small text-muted">“Merci, c’est confirmé!”</div>
                </button>
              </div>

              <div className="small text-muted mt-3">
                Démo : on branchera <code>chat_messages</code> + Socket.io.
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column" style={{ minHeight: 420 }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <div className="fw-semibold">Émilie R.</div>
                  <div className="small text-muted">En ligne</div>
                </div>
                <button className="btn btn-outline-secondary btn-sm">Voir profil</button>
              </div>

              <div className="border rounded p-3 flex-grow-1" style={{ background: "#fff" }}>
                <div className="d-flex mb-2">
                  <div className="p-2 rounded bg-light">
                    Bonjour! Est-ce possible de déplacer l’heure?
                  </div>
                </div>

                <div className="d-flex justify-content-end mb-2">
                  <div className="p-2 rounded text-bg-primary">
                    Oui, propose-moi une heure et je confirme.
                  </div>
                </div>

                <div className="d-flex mb-2">
                  <div className="p-2 rounded bg-light">Parfait, 15h ça marche?</div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <input className="form-control" placeholder="Écrire un message…" />
                <button className="btn btn-primary">Envoyer</button>
              </div>

              <div className="small text-muted mt-2">
                Démo : bouton “Envoyer” sera connecté à Socket.io + persistance MySQL.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
