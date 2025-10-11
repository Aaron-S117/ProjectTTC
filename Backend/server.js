import http, {ServerResponse} from "http";
import dotenv from 'dotenv';
import { json } from "stream/consumers";
import { time } from "console";

dotenv.config();

const baseURL = process.env.baseURL;
const backendPort = process.env.backendPort;

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
server.listen(port, () => {
    console.log(`Server running at ${baseURL}:${port}`);
})