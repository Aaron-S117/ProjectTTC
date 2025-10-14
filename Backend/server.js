import http, {get, ServerResponse} from "http";
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

    // const res3 = await client.query('SELECT * FROM Users');
    //console.log(res3.rows);
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
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS"); // Allow POST for /UserLogin
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow the Content-Type header

    if (req.method === 'OPTIONS') {
        // Respond with a 200 OK status for preflight requests
        // A 204 No Content is also a valid alternative
        res.writeHead(200); 
        res.end();
        return; // End the response here so it doesn't fall through to other handlers
    }

    const {method, url} = req;

    // creates main url for path splicing
    const parsedUrl = new URL(req.url, baseURL);
    // general query parameter variable for later access
    const urlParams = parsedUrl.searchParams;

    // get param named name
    // urlParams.get('name');

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
    else if (parsedUrl.pathname === '/UserLogin' && method === "POST") {

        let body = '';

        // Used to get the request body. Creates a event listener that takes time to complete
        req.on('data', chunk => {
            body += chunk.toString(); // Append each chunk to the body string
        });

        req.on('end', async () => {
            let parsedbody = JSON.parse(body)
            if (!parsedbody.Username || !parsedbody.Password) {
                res.statusCode = 400;
                res.end('Bad Request, Username or Password missing');
            }
            
            try {
                let sqlQuery = `SELECT "ID", "Username", "Password" FROM users 
                WHERE "Username" = '${parsedbody.Username}' and "Password" = '${parsedbody.Password}'`

                let findUser = await client.query(sqlQuery) ;

                if(findUser.rows.length === 0) {
                    res.statusCode = 403
                    res.end("Incorrect Username or Password");
                    return;
                }

                res.statusCode = 200;
                if (parsedbody.login === false) {
                    
                    let userRow = findUser.rows;   
                    let userID = userRow.map(user => user.ID);
                    console.log(userID.toString());

                    res.end(JSON.stringify(userID.toString()))
                }
                else {
                    console.log('Account Match');
                    res.end(JSON.stringify('Account Match'));
                }

            } catch(err) {
                console.error(err);
                res.statusCode = 500;
                res.end();
            } finally {
                // todo
            }
        });
    }
    else if (parsedUrl.pathname === '/UserCreation' && method === "POST") {
        let body = '';

        // Used to get the request body. Creates a event listener that takes time to complete
        req.on('data', chunk => {
            body += chunk.toString(); // Append each chunk to the body string
        });

        req.on('end', async () => {
            let parsedbody = JSON.parse(body)
            if (!parsedbody.Username || !parsedbody.Password) {
                res.statusCode = 400;
                res.end('Bad Request, Username or Password missing');
            }
            
            try {

                let sqlQuery = `INSERT INTO users("Username", "Password")
                                VALUES ('${parsedbody.Username}', '${parsedbody.Password}')`

                let insertUser = await client.query(sqlQuery);

                console.log('Row Count: ' + insertUser.rowCount);
            
                res.statusCode = 201;
                res.end('User Created');

            } catch(err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Issue Creating User');
            } finally {
                // todo
            }
        });
    }
    else if (parsedUrl.pathname = 'createCollection' && method == 'POST') {
        let body = '';

        // Used to get the request body. Creates a event listener that takes time to complete
        req.on('data', chunk => {
            body += chunk.toString(); // Append each chunk to the body string
        });
        req.on('end', async () => {
           res.statusCode = 200;
           
           let parsedbody = JSON.parse(body);

           try {
                // Initial Query
                // TODO Make USER ID Encrypted on frontend
                let sqlQuery = `Insert INTO collection ("userID", "collectionTitle")
                VALUES ('${parsedbody.user}', '${parsedbody.title}')`

                let createCollection = await client.query(sqlQuery);

                console.log(createCollection.rowCount);

                res.statusCode = 201;
                res.end('Collection Created');
           } catch (err) {
                console.log(err);
                res.statusCode = 400;
                res.end('Issue Creating Collection');
           } finally {
               // todo
           }

        })
    }
    else if (parsedUrl.pathname = 'getCollections' && urlParams.get('userID') != '' && method === 'GET') {

        let userID = urlParams.get('userID');

        let sqlQuery = `SELECT "collectionTitle" FROM collection
        WHERE "userID" = ${userID}`
        try {
            let getCollection = await client.query(sqlQuery);

            console.log(getCollection.rows);
    
            res.end(JSON.stringify(getCollection.rows));
        } catch (err) {
            res.statusCode = 500;
            res.end('Issue getting collection')
        } finally {
            // todo
        }

    }
    else {
        // Handle all other unmatched routes
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
})

const port = backendPort;
// After creating the server, tells it to listen on that port 
server.listen(port, () => {
    console.log(`Server running at ${baseURL}:${port}`);
})