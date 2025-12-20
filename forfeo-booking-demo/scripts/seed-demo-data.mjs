/**
 * Seed script to populate demo data
 * Run with: node scripts/seed-demo-data.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in environment");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Starting database seed...");

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // Create demo company
    console.log("Creating demo company...");
    const [companyResult] = await connection.execute(
      `INSERT INTO companies (ownerId, name, description, address, phone, email, cancellationPolicy, cancellationHours) 
       VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Spa Détente Montréal",
        "Spa de luxe offrant des massages thérapeutiques et des soins de bien-être dans une ambiance zen et relaxante.",
        "1234 Rue Sainte-Catherine O, Montréal, QC H3G 1M8",
        "514-555-1234",
        "contact@spa-detente.com",
        "flexible",
        24
      ]
    );

    const companyId = companyResult.insertId;
    console.log(`✓ Company created with ID: ${companyId}`);

    // Create demo service
    console.log("Creating demo service...");
    const [serviceResult] = await connection.execute(
      `INSERT INTO services (companyId, name, description, duration, price, images, included, notIncluded, ambassadorTested, rating, reviewCount, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        companyId,
        "Massage Thérapeutique Signature",
        "Massage relaxant signature de 90 minutes combinant techniques suédoises et aromathérapie pour soulager les tensions musculaires profondes",
        90,
        "129.00",
        JSON.stringify([
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800"
        ]),
        JSON.stringify([
          "Massage complet 90 minutes",
          "Huiles essentielles premium",
          "Serviettes chaudes",
          "Musique relaxante",
          "Thé détox offert"
        ]),
        JSON.stringify([
          "Pourboire",
          "Stationnement",
          "Produits à emporter"
        ]),
        true,
        "4.80",
        127,
        true
      ]
    );

    const serviceId = serviceResult.insertId;
    console.log(`✓ Service created with ID: ${serviceId}`);

    // Create availability slots for the next 4 weeks
    console.log("Creating availability slots...");
    const today = new Date();
    let slotCount = 0;

    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + (week * 7) + day);
        const dateStr = date.toISOString().split('T')[0];

        // Skip Sundays
        if (date.getDay() === 0) continue;

        // Create slots for each day
        const times = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
        
        for (const time of times) {
          // Vary capacity and booked count for demo
          const capacity = Math.random() > 0.7 ? 2 : 3;
          const booked = Math.random() > 0.5 ? Math.floor(Math.random() * capacity) : 0;
          
          await connection.execute(
            `INSERT INTO availability_slots (serviceId, date, time, capacity, booked, isActive) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [serviceId, dateStr, time, capacity, booked, true]
          );
          slotCount++;
        }
      }
    }

    console.log(`✓ Created ${slotCount} availability slots`);

    // Create some demo reviews
    console.log("Creating demo reviews...");
    
    // Create demo customers first
    const customers = [
      { name: "Marie Tremblay", email: "marie.t@example.com" },
      { name: "Jean Dupont", email: "jean.d@example.com" },
      { name: "Sophie Martin", email: "sophie.m@example.com" },
    ];

    for (const customer of customers) {
      const [customerResult] = await connection.execute(
        `INSERT INTO customers (name, email) VALUES (?, ?)`,
        [customer.name, customer.email]
      );

      const customerId = customerResult.insertId;

      // Create review
      const ratings = [5, 5, 4];
      const comments = [
        "Expérience exceptionnelle ! Le massage était exactement ce dont j'avais besoin. L'ambiance est parfaite et la thérapeute très professionnelle.",
        "Excellent service, je recommande vivement. Les huiles essentielles utilisées sont de très haute qualité.",
        "Très bon massage, je reviendrai certainement. Seul bémol : le stationnement est un peu difficile."
      ];

      const index = customers.indexOf(customer);
      await connection.execute(
        `INSERT INTO reviews (serviceId, customerId, rating, comment, ambassadorBadge) 
         VALUES (?, ?, ?, ?, ?)`,
        [serviceId, customerId, ratings[index], comments[index], index === 0]
      );
    }

    console.log(`✓ Created ${customers.length} reviews`);

    console.log("\n✅ Database seeded successfully!");
    console.log(`\nDemo data created:`);
    console.log(`- 1 company: Spa Détente Montréal`);
    console.log(`- 1 service: Massage Thérapeutique Signature`);
    console.log(`- ${slotCount} availability slots (4 weeks)`);
    console.log(`- ${customers.length} customers with reviews`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed()
  .then(() => {
    console.log("\n🎉 Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
