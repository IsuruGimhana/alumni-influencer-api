import api from "./axios";

  // DEVELOPER (JWT AUTH)

// Create API Key
export const createApiKey = (data) => api.post("/keys", data);

// Get all my keys
export const getMyKeys = () => api.get("/keys/me");

// Revoke key
export const revokeKey = (id) => api.delete(`/keys/${id}`);

// Get usage stats
export const getKeyStats = (id) => api.get(`/keys/${id}/stats`);


// // AR APP (API KEY)

// // Get Alumni of the Day
// export const getAlumnusOfTheDay = (apiKey) =>
//   api.get("/keys/featured/alumnus-of-the-day", {
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//     },
//   });


// // DASHBOARD (API KEY)

// // Analytics
// export const getSkillsGap = (apiKey) =>
//   api.get("/keys/analytics/skills-gap", {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });

// export const getJobTrends = (apiKey) =>
//   api.get("/keys/analytics/job-trends", {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });

// export const getTopEmployersData = (apiKey) =>
//   api.get("/keys/analytics/top-employers", {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });

// export const getGeographyData = (apiKey) =>
//   api.get("/keys/analytics/geography", {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });

// export const getCertificationTrends = (apiKey) =>
//   api.get("/keys/analytics/certification-trends", {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });

// export const getProgrammeDistributionData = (apiKey) =>
//   api.get("/keys/analytics/programme-distribution", {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });


// // Directory
// export const getAlumniDirectoryData = (apiKey) =>
//   api.get("/keys/directory", {
//     headers: { Authorization: `Bearer ${apiKey}` },
//   });