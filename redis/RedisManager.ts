
import { Redis } from "ioredis"


export class RedisManager {

  private async getClusterConnection() {

    console.log("🚀 ~ file: RedisManager.ts:16 ~ RedisManager ~ getClusterConnection ~ started")

    const cluster = new Redis.Cluster([
      {
        "host": "127.0.0.1", 
        "port": 6379,
      }
    ], {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: {
        password: "password",
        tls: {}
      }
    });

    let error = undefined

    cluster.on('connect', () => {
      console.log('Redis Cluster is connected')
    });

    cluster.on('error', (err) => {
      console.log('Redis Cluster Error', err)
      error = err
      throw new Error(`No se pudo conectar con el cluster de redis ${error}`)
    });

    if (error) throw new Error('No se pudo conectar con el cluster de redis')

    return cluster
  }


  async saveInCluster(config: {
    key: string,
    data: any
  }) {

    console.log("saveInCluster Started");
    try {
      const connection = await this.getClusterConnection()

      console.log("🚀 ~ file: RedisManager.ts:55 ~ RedisManager ~ saveInCluster ~ config:")
      console.log(config);

      const toSave: string = JSON.stringify(config.data)

      await connection.set(config.key, toSave)

      await connection.expire(config.key, 86400)

      const data = await connection.get(config.key)
      console.log("🚀 ~ file: RedisManager.ts:65 ~ RedisManager ~ saveInCluster ~ data:")
      console.log((data) ? JSON.parse(data) : null);

      await connection.disconnect();

      return (data) ? JSON.parse(data) : null
    } catch (e) {
      console.log("saveInCluster Error");
      console.log(e);

      const reponse = {
        code: 500,
        message: "Operación fallida 'saveInCluster' del RedisManager.",
        error: e
      };
      return reponse;
    }

  }

  async getData(key: string) {

    try {
      const connection = await this.getClusterConnection()

      const data = await connection.get(key)
      console.log("🚀 ~ file: RedisManager.ts:90 ~ RedisManager ~ getData ~ data:")
      console.log(data);

      await connection.disconnect();


      const response = {
        code: 200,
        message: 'getData Redis Manager ok',
        data: data
      }
      return response
    } catch (e) {
      const reponse = {
        code: 500,
        message: "Operación fallida 'getData' del RedisManager.",
        error: e
      };
      return reponse;
    }
  }


  async clearAll() {

    try {
      const connection = await this.getClusterConnection()

      const keys = await connection.keys('*')

      console.log("🚀 ~ file: RedisManager.ts:119 ~ RedisManager ~ clearAll ~ keys:")
      console.log(keys);

      for (const current of keys) {
        await connection.del(current)
      }

      await connection.disconnect();

      return true
    } catch (e) {
      const reponse = {
        code: 500,
        message: "Operación fallida 'clearAll' del RedisManager.",
        error: e
      };
      return reponse;
    }
  }

}