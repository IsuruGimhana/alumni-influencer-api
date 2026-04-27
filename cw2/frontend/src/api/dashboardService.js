// api/dashboardService.js
import dashboardApi from "./dashboardApi";

export const getSkillsGap = () =>
  dashboardApi.get("/keys/analytics/skills-gap");

export const getJobTrends = () =>
  dashboardApi.get("/keys/analytics/job-trends");

export const getTopEmployers = () =>
  dashboardApi.get("/keys/analytics/top-employers");

export const getGeography = () =>
  dashboardApi.get("/keys/analytics/geography");

export const getCertificationTrends = () =>
  dashboardApi.get("/keys/analytics/certification-trends");

export const getProgrammeDistribution = () =>
  dashboardApi.get("/keys/analytics/programme-distribution");

export const getDirectory = () =>
  dashboardApi.get("/keys/directory");