const HOSTEL_PUBLIC_IP = process.env.HOSTEL_PUBLIC_IP;

function getClientIP(req) {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

  if (Array.isArray(ip)) ip = ip[0];
  if (typeof ip === "string" && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  if (typeof ip === "string" && ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  return String(ip).trim();
}

export default function networkLock(req, res, next) {
  const ip = getClientIP(req);

  console.log("========== NETWORK LOCK ==========");
  console.log("Detected client IP:", ip);
  console.log("Allowed HOSTEL_PUBLIC_IP:", HOSTEL_PUBLIC_IP);
  console.log("x-forwarded-for:", req.headers["x-forwarded-for"]);
  console.log("remoteAddress:", req.socket.remoteAddress);
  console.log("originalUrl:", req.originalUrl);
  console.log("method:", req.method);
  console.log("==================================");

  if (ip === String(HOSTEL_PUBLIC_IP || "").trim()) {
    return next();
  }

  return res.status(403).json({
    message: "Access Denied - Only Hostel WiFi allowed for Login",
    detectedIP: ip,
    allowedIP: HOSTEL_PUBLIC_IP || null,
  });
}