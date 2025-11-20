import http, {get, ServerResponse} from "http";
import dotenv from 'dotenv';
import { Client } from 'pg';
import JWT from 'jsonwebtoken';

// import the cypto module
let crypto;
try {
    crypto = await import('node:crypto');
} catch (err) {
    console.error('crypto support is disabled: ' + err);
}

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
    const res = await client.query(`CREATE TABLE IF NOT EXISTS users
    (
        "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 5 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        "Username" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "Password" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "CreatedDate" timestamp with time zone DEFAULT now(),
        "ChangeDate" time with time zone,
        CONSTRAINT "Users_pkey" PRIMARY KEY ("ID"),
        CONSTRAINT "Unique ID" UNIQUE ("ID")
            INCLUDE("ID"),
        CONSTRAINT usernameunique UNIQUE ("Username")
    )
    
    TABLESPACE pg_default;
    
    ALTER TABLE IF EXISTS users
        OWNER to postgres;
    
    CREATE TABLE IF NOT EXISTS collection
    (
        "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 5 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        "userID" integer NOT NULL,
        "collectionTitle" character varying(255) COLLATE pg_catalog."default" NOT NULL,
        "collectionSummary" text,
        "CreatedDate" timestamp with time zone DEFAULT now(),
        "ChangeDate" time with time zone,
        CONSTRAINT collection_pkey PRIMARY KEY ("ID"),
        CONSTRAINT "Unique Collection ID" UNIQUE ("ID")
            INCLUDE("ID"),
        CONSTRAINT "collection_userID_fkey" FOREIGN KEY ("userID")
            REFERENCES users ("ID") MATCH SIMPLE
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
        "ItemValue" TEXT,
        "CreatedDate" timestamp with time zone DEFAULT now(),
        "ChangeDate" time with time zone,
        CONSTRAINT "Item_pkey" PRIMARY KEY ("ID"),
        CONSTRAINT "Unique Item ID" UNIQUE ("ID")
            INCLUDE("ID"),
        CONSTRAINT item_collection FOREIGN KEY ("collectionID")
            REFERENCES public.collection ("ID") MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
    )
    
    TABLESPACE pg_default;
    
    ALTER TABLE IF EXISTS item
        OWNER to postgres;`)
    

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
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS, DELETE"); // Allow POST for /UserLogin
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

                let sqlQuery = `SELECT "ID", "Username", "Password" FROM users WHERE "Username" = $1 and "Password" = $2`;

                let values = [parsedbody.Username, parsedbody.Password];

                let findUser = await client.query(sqlQuery, values);

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

                let sqlQuery = `INSERT INTO users("Username", "Password") VALUES ($1, $2)`;

                let values = [parsedbody.Username, parsedbody.Password];

                let insertUser = await client.query(sqlQuery, values);

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
    else if (parsedUrl.pathname === '/createCollection' && method == 'POST') {
        let body = '';

        // Used to get the request body. Creates a event listener that takes time to complete
        req.on('data', chunk => {
            body += chunk.toString(); // Append each chunk to the body string
        });
        req.on('end', async () => {
           res.statusCode = 200;
           
           let parsedbody = JSON.parse(body);

           try {
                let sqlQuery = `Insert INTO collection ("userID", "collectionTitle")
                VALUES ($1, $2)
                returning "ID"`;

                let values = [parsedbody.user, parsedbody.title];

                let createCollection = await client.query(sqlQuery, values);

                res.statusCode = 201;
                res.end(JSON.stringify(createCollection.rows[0]));
           } catch (err) {
                console.log(err);
                res.statusCode = 400;
                res.end('Issue Creating Collection');
           } finally {
               // todo
           }

        })
    }
    else if (parsedUrl.pathname === '/getCollections' && urlParams.get('userID') != '' && method === 'GET') {

        let userID = urlParams.get('userID');

        let sqlQuery = `SELECT "ID", "collectionTitle" FROM collection
        WHERE "userID" = $1`;

        let values = [userID];

        try {
            let getCollection = await client.query(sqlQuery, values);

            res.statusCode = 200;
    
            res.end(JSON.stringify(getCollection.rows));
        } catch (err) {
            res.statusCode = 500;
            res.end('Issue getting collection')
        } finally {
            // todo
        }
    }
    else if (parsedUrl.pathname === '/getCollectionItems' && urlParams.get('collectionID') != '' && method === 'GET') {

        res.statusCode = 200;
        let collectionID = urlParams.get('collectionID');

        let sqlQuery = `SELECT * FROM item
        where "collectionID" = $1`;

        let values = [collectionID];
    
        try {
            let getColItems = await client.query(sqlQuery, values);
            res.statusCode = 200;
            res.end(JSON.stringify(getColItems.rows));
            
        }catch (err) {
            res.statusCode = 500;
            console.log(err);
            res.end('Issue getting collection items.' + err);
        }
    }
    else if (parsedUrl.pathname === '/createItem' && method === 'POST') {
        res.statusCode = 200;

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            res.statusCode = 200;

            let parsedBody = JSON.parse(body);

            let query = `INSERT INTO item 
            ("collectionID", "ItemName", "ItemValue")
            VALUES ($1, $2, $3)
            RETURNING "ID"`;

            let values = [parsedBody.collectionID, parsedBody.itemName, parsedBody.itemValue]

            try {
                let insertQuery = await client.query(query, values);

                res.statusCode = 201;
                res.end(JSON.stringify(insertQuery.rows))
            }catch (err) {
                res.statusCode = 500;
                res.end('Issue with creating item. ' + err);
            }
        })
    }
    // Selecting a single item from the database
    else if (parsedUrl.pathname === '/getItem' && urlParams.get('itemID') != '' && method === 'GET') {

        res.statusCode = 200;
        let itemID = urlParams.get('itemID');

        let sqlQuery = `SELECT * FROM item
        where "ID" = $1`;

        let values = [itemID];

        try {
            let getItem = await client.query(sqlQuery, values);
            res.statusCode = 200;
            res.end(JSON.stringify(getItem.rows));
            
        }catch (err) {
            res.statusCode = 500;
            console.log(err);
            res.end('Issue getting item data.' + err);
        }
    }
    // combine this and the edit collection APIs into one 
    else if (parsedUrl.pathname === '/editItem' && method === "PATCH") {

        let body = '';

        // Used to get the request body. Creates a event listener that takes time to complete
        req.on('data', chunk => {
            body += chunk.toString(); // Append each chunk to the body string
        });
        req.on('end', async () => {
           res.statusCode = 200;
           let parsedbody = JSON.parse(body);

           try {

            // Previous code, vulnerable to SQL injection
                // let setClause = "";

                // let objectSize = checkLength(parsedbody.Columns);

                // let endCounter = 1;
   
                // for (let column in parsedbody.Columns) {

                //     let columnVal = parsedbody.Columns[column]
                //     if (endCounter < objectSize) {
                //         setClause += `"${column}" = '${columnVal}',`;   
                //         endCounter++;
                //     }
                //     else if (endCounter === objectSize) {
                //         setClause += `"${column}" = '${columnVal}'`;   
                //     }
                // }

                // console.log(setClause);

                // let sqlQuery = `UPDATE item SET $1 WHERE "ID" = $2`;

                // let values = [setClause, parsedbody.ID];

                let columns = parsedbody.Columns;
                let keys = Object.keys(columns)

                // Dynamic array builder using maps
                let setClause = keys.map((col, i) => `"${col}" = $${i+1}`).join(",");
                // ... is a spread operator that turns iterable structures into individual elements 
                let values = [...keys.map(k => columns[k]), parsedbody.ID];

                let sqlQuery = `UPDATE item SET ${setClause} WHERE "ID" = $${values.length}`;

                let editItem =  await client.query(sqlQuery, values);

                res.statusCode = 201;
                res.end(JSON.stringify(editItem));
           } catch (err) {
                console.log(err);
                res.statusCode = 400;
                res.end('Issue Modifying Item');
           } finally {
               // todo
           }

        })
    }
        else if (parsedUrl.pathname === '/editCollection' && method === "PATCH") {

        let body = '';

        // Used to get the request body. Creates a event listener that takes time to complete
        req.on('data', chunk => {
            body += chunk.toString(); // Append each chunk to the body string
        });
        req.on('end', async () => {
           res.statusCode = 200;
           let parsedbody = JSON.parse(body);

           try {

            // Old code vulnerable to SQL Injection
                // let setClause = "";

                // let objectSize = checkLength(parsedbody.Columns);

                // let endCounter = 1;
   
                // for (let column in parsedbody.Columns) {

                //     let columnVal = parsedbody.Columns[column]
                //     if (endCounter < objectSize) {
                //         setClause += `"${column}" = '${columnVal}',`;   
                //         endCounter++;
                //     }
                //     else if (endCounter === objectSize) {
                //         setClause += `"${column}" = '${columnVal}'`;   
                //     }
                // }

                // let sqlQuery = `UPDATE collection SET ${setClause} WHERE "ID" = '${parsedbody.ID}'`;

                // let editItem =  await client.query(sqlQuery);

                let columns = parsedbody.Columns;
                let keys = Object.keys(columns)

                // Dynamic array builder using maps
                let setClause = keys.map((col, i) => `"${col}" = $${i+1}`).join(",");
                // ... is a spread operator that turns iterable structures into individual elements 
                let values = [...keys.map(k => columns[k]), parsedbody.ID];

                let sqlQuery = `UPDATE collection SET ${setClause} WHERE "ID" = $${values.length}`;

                let editCollection =  await client.query(sqlQuery, values);

                res.statusCode = 201;
                res.end(JSON.stringify(editCollection));
           } catch (err) {
                console.log(err);
                res.statusCode = 400;
                res.end('Issue Modifying Item');
           } finally {
               // todo
           }

        })
    }
    else if (parsedUrl.pathname.startsWith('/remove') === true && method === 'DELETE') {
        let sqlQuery = '';
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            res.statusCode = 200;
            let parsedbody = JSON.parse(body);
            let ID = parsedbody.ID;
            let values = [ID];

            try {
                if (parsedUrl.pathname.includes('/collection') === true) {
                    sqlQuery = `DELETE FROM collection
                    WHERE "ID" = $1`;


                    await client.query(sqlQuery, values);

                    console.log('removed collection: ' + ID);
                    res.statusCode = 200;
                    res.end(JSON.stringify('Collection Deleted'));
                } 
                else if (parsedUrl.pathname.includes('/item') === true) {
                    sqlQuery = `DELETE FROM item
                    WHERE "ID" = $1`;

                    await client.query(sqlQuery, values);

                    console.log('removed item: ' + ID);
                    res.statusCode = 200;
                    res.end(JSON.stringify('Item Deleted'));
                }
                else if (parsedUrl.pathname.includes('/user') === true) {
                    sqlQuery = `DELETE FROM users
                    WHERE "ID" = $1`;

                    await client.query(sqlQuery, values);

                    console.log('removed user: ' + ID);
                    res.statusCode = 200;
                    res.end(JSON.stringify('User Deleted'));
                }
            } catch(err) {
                console.log('error: ' + err);
                res.statusCode = 400;
                res.end('Issue Deleting Record:' + err);
            }
            finally {
                // todo
            }
        })
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

function checkLength(object) {
    let objectSize = Object.keys(object).length;

    return objectSize;
}

class dataHandler {
    createAccessToken(userID, role) {
        const payload = { userID: userID, role: role};
        const secret = process.env.privateKey;
        const token = JWT.sign(payload, secret, { expiresIn: '1h', subject: 'Access Token'});

        return token;
    }

    createRefreshToken(userID, role, device, browser, ip, screenSize) {
        const payload = { userID: userID, role: role, device: device, browser: browser, ip: ip, screenSize: screenSize};
        const secret = process.env.privateKey;
        const token = JWT.sign(payload, secret, { expiresIn: '1d', subject: 'Refresh Token'});

        return token;
    }
    
    checkAuthExperiation(auth) {
        // todo
    }
    
    retrieveAuth(userID) {
        // todo
    }

    verifyJWT(token) {
        try {
            let verifiedJWT = JWT.verify(token, process.env.privateKey);
            return verifiedJWT;
        } catch (err) {
            console.error(err);
            return 'invalid signature';
        }
    }

    checkJWTExpire(token) {
        // todo
    }
    
    encryptValue(value) {
        // todo
    }
    
    decryptValue(value) {
        // todo
    }
    
    // Create hashed code using inputted data
    createHashData(data) {
        // Read it as a regular stream (not a piped one)
        const hash = crypto.createHash('sha256');
    
        hash.update(data);
    
        return hash.digest('hex');
    }
    
    // Compare two hahses, mainly for login password comparison
    compareHashData (hash1, hash2) {
        if (hash1 === hash2) {
            console.log('hashes match, same value');
            return true;
        }
        else if (hash1 !== hash2) {
            console.log(`hashes don't match, not same value`);
            return false;
        }
        else {
            console.log('something went wrong');
            return false;
        }
    }
}

