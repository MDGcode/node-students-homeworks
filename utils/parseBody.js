// utils/parseBody.js
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      // Optional: Limit the size of the body to prevent attacks
      if (body.length > 1e6) {
        // ~1MB
        req.connection.destroy();
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body || "{}");
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
};

module.exports = parseBody;
