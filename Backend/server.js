import http, {ServerResponse} from "http";
import dotenv from 'dotenv';
import { json } from "stream/consumers";
import { time } from "console";
import { Client } from 'pg';

// .env file reading setup
dotenv.config();

// postgre SQL setup
const client = new Client({
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.port,
    database: process.env.database
});

await client.connect();

// Create schema if needed
try {
    const res = await client.query(`CREATE TABLE IF NOT EXISTS Users
    (
        "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 5 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        "Username" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "Password" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "CreatedDate" timestamp with time zone DEFAULT now(),
        "ChangeDate" time with time zone,
        CONSTRAINT "Users_pkey" PRIMARY KEY ("ID"),
        CONSTRAINT "Unique ID" UNIQUE ("ID")
            INCLUDE("ID")
    )
    
    TABLESPACE pg_default;
    
    ALTER TABLE IF EXISTS Users
        OWNER to postgres;
    
    CREATE TABLE IF NOT EXISTS collection
    (
        "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 5 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        "userID" integer NOT NULL,
        "collectionTitle" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "CreatedDate" timestamp with time zone DEFAULT now(),
        "ChangeDate" time with time zone,
        CONSTRAINT collection_pkey PRIMARY KEY ("ID"),
        CONSTRAINT "Unique Collection ID" UNIQUE ("ID")
            INCLUDE("ID"),
        CONSTRAINT "collection_userID_fkey" FOREIGN KEY ("userID")
            REFERENCES Users ("ID") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
    )
    
    TABLESPACE pg_default;
    
    ALTER TABLE IF EXISTS collection
        OWNER to postgres;
    
    CREATE TABLE IF NOT EXISTS item
    (
        "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 5 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        "collectionID" integer NOT NULL,
        "ItemName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "CreatedDate" timestamp with time zone DEFAULT now(),
        "ChangeDate" time with time zone,
        CONSTRAINT "Item_pkey" PRIMARY KEY ("ID"),
        CONSTRAINT "Unique Item ID" UNIQUE ("ID")
            INCLUDE("ID"),
        CONSTRAINT "item_collectionID_fkey" FOREIGN KEY ("collectionID")
            REFERENCES collection ("ID") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
    )
    
    TABLESPACE pg_default;`)
    

    // const res2 = await client.query('SELECT NOW()');
    // console.log(res2.rows);

    const res3 = await client.query('SELECT * FROM Users');
    console.log(res3.rows);
 } catch (err) {
    console.error(err);
 } finally {
    console.log('Schema created/updated');
    // Shutdowns database connection and in turn the backend server
    // await client.end()
 }

// try {
//     const res = await client.query('SELECT $1::text as message', ['Hello world!'])
//     console.log(res.rows[0].message) // Hello world!

//     // const res2 = await client.query('SELECT NOW()');
//     // console.log(res2.rows);

//     const res3 = await client.query('SELECT * FROM Users');
//     console.log(res3.rows);
//  } catch (err) {
//     console.error(err);
//  } finally {
//     await client.end()
//  }

// URL and Port setup
const baseURL = process.env.baseURL;
const backendPort = process.env.backendPort;

// Creates server and defines paths
const server = http.createServer(async (req, res) => {
    res.statusCode = 200;

    const {method, url} = req;

    // creates main url for path splicing
    const parsedUrl = new URL(req.url, baseURL);
    // general query parameter variable for later access
    const queryParams = parsedUrl.searchParams;

    if (parsedUrl.pathname === "/test" && method === "GET") {
        let currentTime = new Date();
        res.end(JSON.stringify({message: 'Hello Test, testing at: ' + currentTime.toString()}));
        res.statusCode = 200;
    }
    else if (parsedUrl.pathname ==='/users' && method === "GET") {
        try {
            const allusers = await client.query('SELECT * FROM USERS');
            // console.log(allusers);
            res.write(JSON.stringify(allusers.rows));
        } catch (err) {
            console.error(err);
         } finally {
            console.log('Users URL HIT');
            res.end();
         }
    }
})

const port = backendPort;
// After creating the server, tells it to listen on that port 
server.listen(port, () => {
    console.log(`Server running at ${baseURL}:${port}`);
})