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

try {
    const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!

    // const res2 = await client.query('SELECT NOW()');
    // console.log(res2.rows);

    const res3 = await client.query('SELECT * FROM public."Users"');
    console.log(res3.rows);
 } catch (err) {
    console.error(err);
 } finally {
    await client.end()
 }

// URL and Port setup
const baseURL = process.env.baseURL;
const backendPort = process.env.backendPort;

// Creates server and defines paths
const server = http.createServer((req, res) => {
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
})

const port = backendPort;
// After creating the server, tells it to listen on that port 
server.listen(port, () => {
    console.log(`Server running at ${baseURL}:${port}`);
})