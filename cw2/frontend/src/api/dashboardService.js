// api/dashboardService.js

// @param {Object} params - { programme?: string, gradDate?: string }
import dashboardApi from "./dashboardApi";

export const getSkillsGap = (params) =>
  dashboardApi.get("/keys/analytics/skills-gap", {params});

export const getJobTrends = (params) =>
  dashboardApi.get("/keys/analytics/job-trends", {params});

export const getTopEmployers = (params) =>
  dashboardApi.get("/keys/analytics/top-employers", {params});

export const getGeography = (params) =>
  dashboardApi.get("/keys/analytics/geography", {params});

export const getCertificationTrends = (params) =>
  dashboardApi.get("/keys/analytics/certification-trends", {params});

export const getProgrammeDistribution = (params) =>
  dashboardApi.get("/keys/analytics/programme-distribution", {params});

export const getDirectory = (params) =>
  dashboardApi.get("/keys/directory", {params});

// Export the Alumni Directory as a CSV file
export const exportAlumniCSV = (params) =>
  dashboardApi.get("/keys/directory/export", {
    params,
    responseType: 'blob' // Important for handling file downloads
  });

// Filter options

// Get all available programmes for dropdown
export const getProgrammes = () =>
  dashboardApi.get("/keys/directory/options/programmes");

// Get all available graduation years for dropdown
export const getGraduationYears = () =>
  dashboardApi.get("/keys/directory/options/years");