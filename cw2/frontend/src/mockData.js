export const mockData = {
  // 1. getSkillsGapData -> returns { title, count }
  skillsGap: [
    { title: "AWS Certified Solutions Architect", count: "120" },
    { title: "Docker Certified Associate", count: "95" },
    { title: "Terraform Associate", count: "40" }
  ],

  // 3. getJobTitleTrends -> returns { jobTitle, count }
  jobTrends: [
    { jobTitle: "Software Engineer", count: "150" },
    { jobTitle: "Data Analyst", count: "85" },
    { jobTitle: "DevOps Engineer", count: "60" }
  ],

  // 4. getTopEmployers -> returns { company, count }
  employers: [
    { company: "Google", count: "25" },
    { company: "Amazon", count: "20" },
    { company: "Meta", count: "15" }
  ],

  // 5. getGeographicalDist -> returns { city, country, count }
  geography: [
    { city: "London", country: "United Kingdom", count: "210" },
    { city: "Colombo", country: "Sri Lanka", count: "155" }
  ],

  // 6. getCertificationTrend -> returns { month, count }
  certTrends: [
    { month: "Jan 2024", count: "10" },
    { month: "Feb 2024", count: "25" },
    { month: "Mar 2024", count: "65" },
    { month: "Apr 2024", count: "110" }
  ],

  programmeDist: [
    { programme: "Computer Science", count: "210" },
    { programme: "Business", count: "155" }
  ],

  // getAlumniDirectory -> returns User objects with Profile/Degree
  alumniDirectory: [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      Profile: {
        Degrees: [{ title: "BSc Computer Science", completionDate: "2023-07-01" }],
        Work: [{ jobTitle: "Software Engineer", company: "Google" }]
      }
    },
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      Profile: {
        Degrees: [{ title: "BSc Computer Science", completionDate: "2023-07-01" }],
        Work: [{ jobTitle: "Software Engineer", company: "Google" }]
      }
    }
  ]
};