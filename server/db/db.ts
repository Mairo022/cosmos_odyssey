import { Pool, QueryResult } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
})

pool.on("error", (err: Error) => {
    console.error("DB connection lost")
    console.error("Error message", err.message)
    console.error("Stack trace", err.stack)
})

async function connectToDB(): Promise<boolean> {
    try {
        const clinet = await pool.connect()
        clinet.release()
        console.log("Connected to database")
        return true
    } catch (e) {
        console.error("Failed to connect to db", e.message)
        return false
    }
}

export async function testDBConnection(): Promise<void> {
    if (await connectToDB()) return

    const interval = setInterval(async () => {
        if (await connectToDB()) {
            clearInterval(interval)
        }
    }, 10000)
}

export const query = <T>(text: string, params = undefined): Promise<QueryResult<T>> => pool.query(text, params)
