const https = require("https");

exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const body = event.body || "";
  const params = new URLSearchParams(body);

  // بناء query string للـ GET
  const queryString = params.toString();
  const path = "/api/v2?" + queryString;

  return new Promise((resolve) => {
    const options = {
      hostname: "followers-store.com",
      path: path,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({ statusCode: 200, headers, body: data });
      });
    });

    req.on("error", (err) => {
      resolve({
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: err.message }),
      });
    });

    req.end();
  });
};
