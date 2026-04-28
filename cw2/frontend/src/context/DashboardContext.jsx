// import { createContext, useEffect, useState, useCallback } from "react";
// import * as dashboardService from "../api/dashboardService";

// export const DashboardContext = createContext();

// const normalizeDirectory = (res) => {
//   return Array.isArray(res?.data) ? res.data : [];
// };

// export const DashboardProvider = ({ children }) => {
//   // -----------------------------
//   // STATE
//   // -----------------------------
//   const [alumni, setAlumni] = useState([]);
//   const [loadingDirectory, setLoadingDirectory] = useState(false);

//   const [programmes, setProgrammes] = useState([]);
//   const [years, setYears] = useState([]);

//   const [filters, setFilters] = useState({
//     programme: "",
//     gradDate: "",
//   });

//   const [skillsGap, setSkillsGap] = useState([]);
//   const [jobTrends, setJobTrends] = useState([]);
//   const [employers, setEmployers] = useState([]);
//   const [geo, setGeo] = useState([]);

//   // -----------------------------
//   // DIRECTORY
//   // -----------------------------
//   const fetchDirectory = useCallback(async () => {
//     try {
//       setLoadingDirectory(true);
//       const res = await dashboardService.getDirectory(filters);
//       setAlumni(normalizeDirectory(res));
//     } catch (err) {
//       console.error("Directory error:", err);
//       setAlumni([]);
//     } finally {
//       setLoadingDirectory(false);
//     }
//   }, [filters]);

//   // -----------------------------
//   // OPTIONS
//   // -----------------------------
//   const fetchOptions = useCallback(async () => {
//     try {
//       const [progRes, yearRes] = await Promise.all([
//         dashboardService.getProgrammes(),
//         dashboardService.getGraduationYears(),
//       ]);

//       setProgrammes(progRes.data || []);
//       setYears(yearRes.data || []);
//     } catch (err) {
//       console.error("Options error:", err);
//     }
//   }, []);

//   // -----------------------------
//   // ANALYTICS
//   // -----------------------------
//   const fetchAnalytics = useCallback(async () => {
//     try {
//       const [skills, jobs, emp, geoRes] = await Promise.all([
//         dashboardService.getSkillsGap(filters),
//         dashboardService.getJobTrends(filters),
//         dashboardService.getTopEmployers(filters),
//         dashboardService.getGeography(filters),
//       ]);

//       setSkillsGap(skills.data || skills || []);
//       setJobTrends(jobs.data || jobs || []);
//       setEmployers(emp.data || emp || []);
//       setGeo(geoRes.data || geoRes || []);
//     } catch (err) {
//       console.error("Analytics error:", err);
//     }
//   }, [filters]);

//   // -----------------------------
//   // INIT
//   // -----------------------------
//   useEffect(() => {
//     fetchOptions();
//   }, [fetchOptions]);

//   useEffect(() => {
//     fetchDirectory();
//     fetchAnalytics();
//   }, [fetchDirectory, fetchAnalytics]);

//   // -----------------------------
//   // EXPORT
//   // -----------------------------
//   const exportCSV = async () => {
//     try {
//       const res = await dashboardService.exportAlumniCSV(filters);

//       const blob = new Blob([res.data], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "alumni_directory.csv";

//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Export failed:", err);
//     }
//   };

//   return (
//     <DashboardContext.Provider
//       value={{
//         alumni,
//         loadingDirectory,
//         fetchDirectory,

//         programmes,
//         years,

//         filters,
//         setFilters,

//         skillsGap,
//         jobTrends,
//         employers,
//         geo,

//         exportCSV,
//       }}
//     >
//       {children}
//     </DashboardContext.Provider>
//   );
// };

import { createContext, useEffect, useState, useCallback } from "react";
import * as dashboardService from "../api/dashboardService";

export const DashboardContext = createContext();

const normalizeDirectory = (res) => {
  return Array.isArray(res?.data) ? res.data : [];
};

export const DashboardProvider = ({ children }) => {
  // -----------------------------
  // STATE
  // -----------------------------
  const [alumni, setAlumni] = useState([]);
  const [loadingDirectory, setLoadingDirectory] = useState(false);

  const [programmes, setProgrammes] = useState([]);
  const [years, setYears] = useState([]);

  const [filters, setFilters] = useState({
    programme: "",
    gradDate: "",
  });

  const [skillsGap, setSkillsGap] = useState([]);
  const [jobTrends, setJobTrends] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [geo, setGeo] = useState([]);
  const [certificationTrends, setCertificationTrends] = useState([]);
  const [programmeDistribution, setProgrammeDistribution] = useState([]);

  // -----------------------------
  // DIRECTORY
  // -----------------------------
  const fetchDirectory = useCallback(async () => {
    try {
      setLoadingDirectory(true);
      const res = await dashboardService.getDirectory(filters);
      setAlumni(normalizeDirectory(res));
    } catch (err) {
      console.error("Directory error:", err);
      setAlumni([]);
    } finally {
      setLoadingDirectory(false);
    }
  }, [filters]);

  // -----------------------------
  // OPTIONS
  // -----------------------------
  const fetchOptions = useCallback(async () => {
    try {
      const [progRes, yearRes] = await Promise.all([
        dashboardService.getProgrammes(),
        dashboardService.getGraduationYears(),
      ]);

      setProgrammes(progRes.data || []);
      setYears(yearRes.data || []);
    } catch (err) {
      console.error("Options error:", err);
    }
  }, []);

  // -----------------------------
  // ANALYTICS
  // -----------------------------
  const fetchAnalytics = useCallback(async () => {
    try {
      const [
        skills,
        jobs,
        emp,
        geoRes,
        certTrends,
        progDist
      ] = await Promise.all([
        dashboardService.getSkillsGap(filters),
        dashboardService.getJobTrends(filters),
        dashboardService.getTopEmployers(filters),
        dashboardService.getGeography(filters),
        dashboardService.getCertificationTrends(filters),
        dashboardService.getProgrammeDistribution(filters),
      ]);

      setSkillsGap(skills.data || skills || []);
      setJobTrends(jobs.data || jobs || []);
      setEmployers(emp.data || emp || []);
      setGeo(geoRes.data || geoRes || []);
      setCertificationTrends(certTrends.data || certTrends || []);
      setProgrammeDistribution(progDist.data || progDist || []);
    } catch (err) {
      console.error("Analytics error:", err);
    }
  }, [filters]);

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchDirectory();
    fetchAnalytics();
  }, [fetchDirectory, fetchAnalytics]);

  // -----------------------------
  // EXPORT
  // -----------------------------
  const exportCSV = async () => {
    try {
      const res = await dashboardService.exportAlumniCSV(filters);

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "alumni_directory.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        alumni,
        loadingDirectory,
        fetchDirectory,

        programmes,
        years,

        filters,
        setFilters,

        skillsGap,
        jobTrends,
        employers,
        geo,
        certificationTrends,
        programmeDistribution,

        exportCSV,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};