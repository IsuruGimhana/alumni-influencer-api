import api from "./axios";

export const getSkillsGap = () => api.get("/analytics/skills-gap");
export const getJobTrends = () => api.get("/analytics/job-trends");
export const getDirectory = () => api.get("/directory");