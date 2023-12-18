const express = require("express");
const Redis = require("ioredis");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "postgres",
  password: "123456789",
  port: 5432,
});

app.get("/data/:id", async (req, res) => {
  try {
    const { params } = req;
    console.log("🚀 ~ file: index.js:19 ~ app.get ~ params:");
    console.log(params);

    const redisClient = new Redis({
      host: "127.0.0.1",
      port: 6379,
    });

    let person = await redisClient.get(params.id);
    console.log("🚀 ~ file: index.js:22 ~ app.get ~ person:");
    console.log(person);

    if (!person) {
      const result = await pool.query(
        `SELECT * FROM personas WHERE id = ${params.id}`
      );
      console.log("🚀 ~ file: index.js:19 ~ app.get ~ result:");
      console.log(result);
      const dataFromPostgres = result.rows;

      // Ejemplo de almacenamiento en Redis
      await redisClient.set(params.id, JSON.stringify(dataFromPostgres));
      person = await redisClient.get(params.id);
    }

    // Ejemplo de consulta a PostgreSQL

    res.json({
      message: "Data fetched and stored in Redis",
      data: {
        person: JSON.parse(person),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
