const express = require("express");
const { Pool } = require("pg");
const memjs = require("memjs");
const client = memjs.Client.create();

const app = express();

const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "postgres",
  password: "123456789",
  port: 5432,
});

async function getMemcache(key) {
  return new Promise((resolve, reject) => {
    client.get(key, function (err, val) {
      if (err !== null) reject(new Error(err));

      console.log("🚀 ~ file: index.js:40 ~ val:", val);

      if (val === null) return resolve(val);

      resolve(val.toString());
    });
  });
}

async function setMemcache(key, data) {
  return new Promise((resolve, reject) => {
    client.set(
      key,
      JSON.stringify(data),
      { expires: 600 },
      function (err, val) {
        if (err !== null) reject(new Error(err));

        resolve(val);
      }
    );
  });
}

app.get("/data/:id", async (req, res) => {
  try {
    const { params } = req;
    console.log("🚀 ~ file: index.js:19 ~ app.get ~ params:");
    console.log(params);

    let person = await getMemcache(params.id);

    console.log("🚀 ~ file: index.js:43 ~ person ~ person:", person);

    if (!person) {
      const result = await pool.query(
        `SELECT * FROM personas WHERE id = ${params.id}`
      );
      console.log("🚀 ~ file: index.js:19 ~ app.get ~ result:");
      console.log(result);
      const dataFromPostgres = result.rows;

      // Ejemplo de almacenamiento en Memcached
      await setMemcache(params.id, dataFromPostgres);
      person = await getMemcache(params.id);
    }

    console.log("🚀 ~ file: index.js:64 ~ person:", person);

    res.json({
      message: "Data fetched and stored in memcached",
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
