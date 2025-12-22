// Fichier: reset-db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function wipe() {
  console.log("🔌 Connexion à la base de données...");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ Erreur : DATABASE_URL est introuvable dans le fichier .env");
    process.exit(1);
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  // 1. Désactiver la vérification des clés étrangères (C'est la clé magique !)
  console.log("🔓 Désactivation des sécurités Foreign Keys...");
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  // 2. Récupérer la liste de toutes les tables
  const [rows] = await connection.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
  `);

  if (rows.length === 0) {
      console.log("✅ La base est déjà vide.");
  } else {
      console.log(`🔥 Suppression de ${rows.length} tables...`);
      
      // 3. Supprimer chaque table une par une sans pitié
      for (const row of rows) {
          const tableName = row.TABLE_NAME || row.table_name;
          await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
          console.log(`   - 🗑️  Table supprimée : ${tableName}`);
      }
  }

  // 4. Réactiver la sécurité
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log("✨ Nettoyage terminé avec succès !");
  
  await connection.end();
  process.exit(0);
}

wipe().catch(err => {
  console.error("❌ Une erreur est survenue :", err);
  process.exit(1);
});
