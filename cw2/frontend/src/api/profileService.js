import api from "./axios";

// BASE PROFILE

// GET /profile/me
export const getMyProfile = () => api.get("/profiles/me");

// POST /profile/
export const createProfile = (data) => api.post("/profiles", data);

// PUT /profile/
export const updateProfile = (data) => api.put("/profiles", data);

// POST /profile/me/image
export const uploadProfileImage = (formData) =>
  api.post("/profiles/me/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


// DEGREES

// POST /profile/degrees
export const addDegree = (data) => api.post("/profiles/degrees", data);

// PUT /profile/degrees/:id
export const updateDegree = (id, data) =>
  api.put(`/profiles/degrees/${id}`, data);

// DELETE /profile/degrees/:id
export const deleteDegree = (id) =>
  api.delete(`/profiles/degrees/${id}`);


// CERTIFICATIONS

export const addCertification = (data) =>
  api.post("/profiles/certifications", data);

export const updateCertification = (id, data) =>
  api.put(`/profiles/certifications/${id}`, data);

export const deleteCertification = (id) =>
  api.delete(`/profiles/certifications/${id}`);


// EXPERIENCE (WORK)

export const addExperience = (data) =>
  api.post("/profiles/experiences", data);

export const updateExperience = (id, data) =>
  api.put(`/profiles/experiences/${id}`, data);

export const deleteExperience = (id) =>
  api.delete(`/profiles/experiences/${id}`);


// LICENSES

export const addLicense = (data) =>
  api.post("/profiles/licenses", data);

export const updateLicense = (id, data) =>
  api.put(`/profiles/licenses/${id}`, data);

export const deleteLicense = (id) =>
  api.delete(`/profiles/licenses/${id}`);


// COURSES

export const addCourse = (data) =>
  api.post("/profiles/courses", data);

export const updateCourse = (id, data) =>
  api.put(`/profiles/courses/${id}`, data);

export const deleteCourse = (id) =>
  api.delete(`/profiles/courses/${id}`);