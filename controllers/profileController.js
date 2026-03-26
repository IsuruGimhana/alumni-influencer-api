import db from "../models/index.js";
const { Profile, Degree, Certification, License, Course, Work } = db;

// Create / Update Profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { fullName, bio, linkedIn } = req.body;

    let profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (profile) {
      await profile.update({ fullName, bio, linkedIn });
    } else {
      profile = await Profile.create({ fullName, bio, linkedIn, userId: req.user.id });
    }

    res.json({ msg: "Profile saved", profile });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Degree
export const addDegree = async (req, res) => {
  try {
    const { title, institution, startDate, endDate, link } = req.body;

    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const degree = await Degree.create({
      title, institution, startDate, endDate, link,
      profileId: profile.id
    });

    res.json({ msg: "Degree added", degree });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Certification
export const addCertification = async (req, res) => {
  try {
    const { title, institution, startDate, endDate, link } = req.body;

    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const certification = await Certification.create({
      title, institution, startDate, endDate, link,
      profileId: profile.id
    });

    res.json({ msg: "Certification added", certification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add License
export const addLicense = async (req, res) => {
  try {
    const { title, institution, startDate, endDate, link } = req.body;

    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const license = await License.create({
      title, institution, startDate, endDate, link,
      profileId: profile.id
    });

    res.json({ msg: "License added", license });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Course
export const addCourse = async (req, res) => {
  try {
    const { title, institution, startDate, endDate, link } = req.body;

    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const course = await Course.create({
      title, institution, startDate, endDate, link,
      profileId: profile.id
    });

    res.json({ msg: "Course added", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Work Experience
export const addWorkExperience = async (req, res) => {
  try {
    const { title, institution, startDate, endDate, link } = req.body;

    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const work = await Work.create({
      title, institution, startDate, endDate, link,
      profileId: profile.id
    });

    res.json({ msg: "Work experience added", work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};