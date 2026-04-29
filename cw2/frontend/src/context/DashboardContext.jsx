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
  // Memoized directory fetch function to prevent unnecessary re-creation on every render.
  // useCallback ensures the function reference remains stable unless `filters` change,
  // which is important when passing this function as a dependency (e.g., in useEffect).
  // This avoids redundant API calls and improves performance while ensuring
  // the directory is re-fetched whenever filters are updated.
  const fetchDirectory = useCallback(async () => {
    console.log("Filters sent to directory:", filters);
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
      const results = await Promise.allSettled([
        dashboardService.getSkillsGap(filters),
        dashboardService.getJobTrends(filters),
        dashboardService.getTopEmployers(filters),
        dashboardService.getGeography(filters),
        dashboardService.getCertificationTrends(filters),
        dashboardService.getProgrammeDistribution(filters),
      ]);

      const [
        skills,
        jobs,
        emp,
        geoRes,
        certTrends,
        progDist,
      ] = results;

      setSkillsGap(skills.value?.data || []);
      setJobTrends(jobs.value?.data || []);
      setEmployers(emp.value?.data || []);
      setGeo(geoRes.value?.data || []);
      setCertificationTrends(certTrends.value?.data || []);
      setProgrammeDistribution(progDist.value?.data || []);

    } catch (err) {
      console.error("Analytics error:", err);
    }
  }, [filters]);

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
  console.log("skillsGap:", skillsGap);
  console.log("jobTrends:", jobTrends);
  console.log("employers:", employers);
  console.log("geo:", geo);
  console.log("certificationTrends:", certificationTrends);
  console.log("programmeDistribution:", programmeDistribution);
  }, [skillsGap, jobTrends, geo, employers, certificationTrends, programmeDistribution]);
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchDirectory();
    fetchAnalytics();
  }, [fetchDirectory, fetchAnalytics]);

  /**
   * EXPORT CSV: Handles the CSV file download process.
   * 1. Sends the current UI filters to the backend to ensure we only export 
   * the data the user is currently looking at.
   * 2. Receives raw CSV text data from the server.
   * 3. Creates a 'Blob' (Binary Large Object) to represent the data in browser memory.
   * 4. Generates a temporary 'Object URL' and simulates a click on a hidden 
   * anchor tag to trigger the browser's native download manager.
   */
  const exportCSV = async () => {
    try {
      const res = await dashboardService.exportAlumniCSV(filters);

      // Create a blob object from the raw CSV string
      const blob = new Blob([res.data], { type: "text/csv" });

      // Create a temporary link in memory pointing to the blob
      const url = window.URL.createObjectURL(blob);

      // DOM Manipulation to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "alumni_directory.csv";

      document.body.appendChild(link);
      link.click(); // Programmatic click
      link.remove(); // Clean up the DOM

      // Release memory held by the blob URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const exportPDF = async () => {
    try {
      const res = await dashboardService.exportAlumniPDF(filters);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "alumni_directory.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Export failed:", err);
    }
  };

  const generateReport = async () => {
    try {
      const res = await dashboardService.generateReport(filters);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "dashboard_report.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Report generation failed:", err);
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
        exportPDF,
        generateReport,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};