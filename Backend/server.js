import http, {ServerResponse} from "http";
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.baseURL;
const backendPort = process.env.backendPort;

const server = http.createServer((req, res) => {
    res.statusCode = 200;

    // 
    const parsedUrl = new URL(req.url, baseURL);
    const queryParams = parsedUrl.searchParams;
})