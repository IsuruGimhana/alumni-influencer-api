import { createContext, useEffect, useState } from "react";
import * as profileService from "../api/profileService";
import { useAuth } from "../hooks/useAuth";

export const ProfileContext = createContext();

// NORMALIZER
const normalizeProfile = (res) => {
  return (
    res?.data?.profile ||
    res?.data ||
    null
  );
};

const normalizeEntry = (res) => {
  return res?.data?.entry || res?.data || null;
};

const normalizeImage = (res) => {
  return (
    res?.data?.url ||
    res?.data?.profileImage ||
    null
  );
};

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // -----------------------------
  // GET PROFILE
  // -----------------------------
  const fetchProfile = async () => {
    console.log("user",user);
    if (!user) return;

    try {
      setLoadingProfile(true);

      const res = await profileService.getMyProfile();
      console.log(res.data);
      const data = normalizeProfile(res);

      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // -----------------------------
  // CREATE / UPDATE PROFILE
  // -----------------------------
  const updateProfile = async (data) => {
    const res = await profileService.updateProfile(data);
    const updated = normalizeProfile(res);

    setProfile(updated);

    // return updated;
    return res.data;
  };

  const createProfile = async (data) => {
    const res = await profileService.createProfile(data);
    const created = normalizeProfile(res);

    setProfile(created);

    // return created;
    return res.data;
  };

  // -----------------------------
  // IMAGE UPLOAD
  // -----------------------------
  const updateProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const res = await profileService.uploadProfileImage(formData);
    const imageUrl = normalizeImage(res);

    setProfile((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }));

    // return imageUrl;
    return res.data;
  };

  // -----------------------------
  // DEGREE
  // -----------------------------
  const addDegree = async (data) => {
    const res = await profileService.addDegree(data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      degrees: [...(prev?.degrees || []), entry],
    }));

    // return entry;
    return res.data;
  };

  const updateDegree = async (id, data) => {
    const res = await profileService.updateDegree(id, data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      degrees: prev.degrees.map((d) =>
        d.id === id ? entry : d
      ),
    }));

    // return entry;
    return res.data;
  };

  const deleteDegree = async (id) => {
    const res = await profileService.deleteDegree(id);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      degrees: prev.degrees.filter((d) => d.id !== id),
    }));

    // return entry;
    return res.data;
  };

  // -----------------------------
  // CERTIFICATION
  // -----------------------------
  const addCertification = async (data) => {
    const res = await profileService.addCertification(data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      certifications: [...(prev?.certifications || []), entry],
    }));

    // return entry;
    return res.data;
  };

  const updateCertification = async (id, data) => {
    const res = await profileService.updateCertification(id, data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.id === id ? entry : c
      ),
    }));

    // return entry;
    return res.data;
  };

  const deleteCertification = async (id) => {
    const res = await profileService.deleteCertification(id);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));

    // return entry;
    return res.data;
  };

  // -----------------------------
  // EXPERIENCE
  // -----------------------------
  const addExperience = async (data) => {
    const res = await profileService.addExperience(data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      experience: [...(prev?.experience || []), entry],
    }));

    // return entry;
    return res.data;
  };

  const updateExperience = async (id, data) => {
    const res = await profileService.updateExperience(id, data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === id ? entry : e
      ),
    }));

    // return entry;
    return res.data;
  };

  const deleteExperience = async (id) => {
    const res = await profileService.deleteExperience(id);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));

    // return entry;
    return res.data;
  };

  // -----------------------------
  // LICENSES
  // -----------------------------
  const addLicense = async (data) => {
    const res = await profileService.addLicense(data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      licenses: [...(prev?.licenses || []), entry],
    }));

    // return entry;
    return res.data;
  };

  const updateLicense = async (id, data) => {
    const res = await profileService.updateLicense(id, data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      licenses: prev.licenses.map((l) =>
        l.id === id ? entry : l
      ),
    }));

    // return entry;
    return res.data;
  };

  const deleteLicense = async (id) => {
    const res = await profileService.deleteLicense(id);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((l) => l.id !== id),
    }));

    // return entry;
    return res.data;
  };

  // -----------------------------
  // COURSES
  // -----------------------------
  const addCourse = async (data) => {
    const res = await profileService.addCourse(data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      courses: [...(prev?.courses || []), entry],
    }));

    // return entry;
    return res.data;
  };

  const updateCourse = async (id, data) => {
    const res = await profileService.updateCourse(id, data);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === id ? entry : c
      ),
    }));

    // return entry;
    return res.data;
  };

  const deleteCourse = async (id) => {
    const res = await profileService.deleteCourse(id);
    const entry = normalizeEntry(res);

    setProfile((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));

    // return entry;
    return res.data;
  };

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loadingProfile,
        fetchProfile,

        createProfile,
        updateProfile,
        updateProfileImage,

        addDegree,
        updateDegree,
        deleteDegree,

        addCertification,
        updateCertification,
        deleteCertification,

        addExperience,
        updateExperience,
        deleteExperience,

        addLicense,
        updateLicense,
        deleteLicense,

        addCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};