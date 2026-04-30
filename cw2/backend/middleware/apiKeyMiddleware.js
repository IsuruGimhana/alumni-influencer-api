import db from "../models/index.js";
const { ApiKey, ApiUsage } = db;

/**
 * API Key Usage Tracking Middleware
 *
 * Protects public API routes using Bearer token authentication and enforces scope-based access control.
 *
 * Logic:
 * - Extract Bearer token from Authorization header.
 * - Validate API key existence and active status.
 * - Check if key has required scope permission.
 * - Log API usage for analytics and monitoring.
 * - Attach API key metadata to request object for downstream use.
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

      // 2. Verify key exists, is active, AND contains the required scopes
      const keyRecord = await ApiKey.findOne({ 
        where: { 
          key: token, 
          isActive: true
        } 
      });

      if (!keyRecord) {
        return res.status(403).json({ msg: "Invalid or revoked API key" });
      }

      // 3. Scope Verification logic
      if (!keyRecord.scopes.includes(requiredScope)) {
        return res.status(403).json({ 
          msg: `Forbidden: This key does not have the '${requiredScope}' permission.` 
        });
      }

      // 4. Update key usage record
      await ApiUsage.create({
        apiKeyId: keyRecord.id, // api key foreign key
        endpoint: req.originalUrl // log the endpoint being accessed
      });

      // 5. Attach key info to request for the controller if needed
      req.apiKey = keyRecord; 

      next();
    } catch (err) {
      return res.status(500).json({ msg: "Internal server error during API key validation" });
    }
  };
};

export default trackUsage;