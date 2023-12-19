# Requisitos

- Tener instalado nodejs
- Tener instalado docker y docker compose
- Tener instalado postman

## Instalación

Para utilizar cualquiera de las dos api's debe utilizar el comando:

```
  npm i
```

Posteriormente debe ejecutar el comando:

```
  docker-compose up -d
```

Asegurandose de estar parado en la raiz del proyecto, con esto se busca instalar y levantar las bases de datos que usarás en este ejemplo

## Base de datos

Para ejecutar este ejemplo es necesario que usando una base de datos postgres se ejecute el siguiente comando:

```

CREATE TABLE personas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  hobbies TEXT[]
);

```

Seguido del siguiente comando, siguiendo el esquema de datos planteado por el archivo "mock.json", se recomienda usar este esquema ya que contiene suficientes bites para notar la diferencia de rendimiento en tiempo de respuesta cuando usemos la Api.

```

INSERT INTO personas (id, nombre, hobbies)
VALUES (
  1,
  'Persona 1',
  ARRAY[
    'Hobby 1', 'Hobby 2', 'Hobby 3', 'Hobby 4', 'Hobby 5',
    'Hobby 6', 'Hobby 7', 'Hobby 8', 'Hobby 9', 'Hobby 10',
    -- ... Agrega los hobbies restantes aquí ...
    'Hobby 399', 'Hobby 400'
  ]
);

```

## Http Request

Usando postman puedes importar el siguiente curl para hacer una prueba de rendimiento

```
  curl --location 'localhost:3000/data/1'
```