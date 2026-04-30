import arAppApi from "./arAppApi";

export const getAlumnusOfTheDay = () =>
  arAppApi.get("/keys/featured/alumnus-of-the-day");