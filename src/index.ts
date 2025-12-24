// proxy.ts
import http from "node:http"
import https from "node:https"
import { IncomingMessage, ServerResponse, RequestOptions } from "node:http"
import * as dotenv from "dotenv"
dotenv.config()
//@ts-ignore
const API_KEYS: string[] = process.env.API_KEYS?.split(",")
//@ts-ignore
const DST_HOST: string = process.env.DST_HOST
let currentIndex = 0

const server = http.createServer(
  (clientReq: IncomingMessage, clientRes: ServerResponse) => {
    // 1. Rotate Key
    const currentKey = API_KEYS[currentIndex]
    currentIndex = (currentIndex + 1) % API_KEYS.length

    // 2. Define proxy request options
    const options: RequestOptions = {
      hostname: DST_HOST,
      port: 443,
      path: clientReq.url,
      method: clientReq.method,
      headers: {
        ...clientReq.headers,
        Authorization: `Bearer ${currentKey}`,
        Host: process.env.DST_HOST, // Explicitly set host for the target API
      },
    }

    // 3. Create the outgoing request (piping)
    const proxyReq = https.request(options, (proxyRes: IncomingMessage) => {
      // Forward status and headers from the target API to the client
      if (proxyRes.statusCode) {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers)
      }

      // PIPE response body back to client
      proxyRes.pipe(clientRes, { end: true })
    })

    // 4. Handle Errors
    proxyReq.on("error", (err: Error) => {
      console.error("Proxy Request Error:", err.message)
      clientRes.writeHead(502)
      clientRes.end("Bad Gateway")
    })

    // 5. PIPE client request body (e.g., POST/PUT data) to the target API
    clientReq.pipe(proxyReq, { end: true })
  }
)

const PORT = process.env.SERVICE_PORT
const HOST = process.env.SERVICE_HOST
//@ts-ignore
server.listen(PORT, HOST, () => {
  console.log({ API_KEYS, DST_HOST })
  console.log(`TS Proxy (ESM) listening on http://${HOST}:${PORT}`)
})
