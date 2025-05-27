import {neon} from "@neondatabase/serverless";
import "dotenv/config";

//creates a sql connection using db url
export const sql = neon(process.env.NEON_DB_URL);
