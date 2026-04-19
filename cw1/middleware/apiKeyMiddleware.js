import db from "../models/index.js";
const { ApiKey, ApiUsage } = db;

/**
 * Middleware to track usage and authorize Public Developer API access via Bearer Tokens
 */
const trackUsage = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "Unauthorised: Bearer token required" });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify key exists and is not revoked 
    const keyRecord = await ApiKey.findOne({ 
      where: { 
        key: token, 
        isActive: true
      } 
    });

    if (!keyRecord) {
      return res.status(403).json({ msg: "Invalid or revoked API key" });
    }

    // 3. Update key usage record
    await ApiUsage.create({
      apiKeyId: keyRecord.id, // api key foreign key
      endpoint: req.originalUrl // log the endpoint being accessed
    });

    // 3. Attach key info to request for the controller if needed
    // This allows the controller to know which Developer is making the request
    req.apiKey = keyRecord; 

    next();
  } catch (err) {
    // Standardizing the error response to match your protect middleware
    return res.status(500).json({ msg: "Internal server error during API key validation" });
  }
};

export default trackUsage;