const https = require("https");
const http = require("http");

exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const body = event.body || "";

  return new Promise((resolve) => {
    const options = {
      hostname: "followers-store.com",
      path: "/api/v2",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve({ statusCode: 200, headers, body: data });
        } catch (e) {
          resolve({ statusCode: 200, headers, body: data });
        }
      });
    });

    req.on("error", (err) => {
      resolve({
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message }),
      });
    });

    req.write(body);
    req.end();
  });
};
