// Fichier: reset-db.js
import 'dotenv/config';
import mysql from 'mysql2/promise';

async function wipe() {
  console.log("🔌 Connexion à la base de données...");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ Erreur : DATABASE_URL est introuvable dans le fichier .env");
    process.exit(1);
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log("🔓 Désactivation des sécurités Foreign Keys...");
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  const [rows] = await connection.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
  `);

  if (rows.length === 0) {
      console.log("✅ La base est déjà vide.");
  } else {
      console.log(`🔥 Suppression de ${rows.length} tables...`);
      for (const row of rows) {
          const tableName = row.TABLE_NAME || row.table_name;
          await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
          console.log(`   - 🗑️  Table supprimée : ${tableName}`);
      }
  }

  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log("✨ Nettoyage terminé !");
  await connection.end();
  process.exit(0);
}

wipe().catch(err => {
  console.error(err);
  process.exit(1);
});
