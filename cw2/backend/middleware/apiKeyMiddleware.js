import db from "../models/index.js";
const { ApiKey, ApiUsage } = db;

/**
 * Middleware to track usage and authorize Public API access via Bearer Tokens
 */
const trackUsage = (requiredScope) => {
  return async (req, res, next) => {
    try {
      // 1. Get token from Authorization header 
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Unauthorised: Bearer token required" });
      }

      const token = authHeader.split(' ')[1];

      // Verify key exists, is active, AND contains the required scopes
      const keyRecord = await ApiKey.findOne({ 
        where: { 
          key: token, 
          isActive: true
        } 
      });

      if (!keyRecord) {
        return res.status(403).json({ msg: "Invalid or revoked API key" });
      }

      // NEW: Scope Verification logic
      if (!keyRecord.scopes.includes(requiredScope)) {
        return res.status(403).json({ 
          msg: `Forbidden: This key does not have the '${requiredScope}' permission.` 
        });
      }

      // 3. Update key usage record
      await ApiUsage.create({
        apiKeyId: keyRecord.id, // api key foreign key
        endpoint: req.originalUrl // log the endpoint being accessed
      });

      // 3. Attach key info to request for the controller if needed
      req.apiKey = keyRecord; 

      next();
    } catch (err) {
      // Standardizing the error response to match your protect middleware
      return res.status(500).json({ msg: "Internal server error during API key validation" });
    }
  };
};

export default trackUsage;