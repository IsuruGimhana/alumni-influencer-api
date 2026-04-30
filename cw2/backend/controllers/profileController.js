import db from "../models/index.js";
const { User, Profile, Degree, Certification, License, Course, Work, Bid } = db;

/**
 * Get My Profile
 *
 * Retrieves the authenticated user's full profile with all related data
 * for dashboard display.
 */
export const getMyProfile = async (req, res) => {
  try {
    // We fetch the profile with ALL associated data for the user's dashboard
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [Degree, Certification, License, Course, Work],
    });

    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    const profileData = profile.toJSON(); // Convert to plain javascript object for easier manipulation instead of Json

    // console.log("controller:",profileData.profileImage);
    // const baseUrl = process.env.BASE_URL; // e.g. http://localhost:5050
    // if (!profileData.profileImage) profileData.profileImage = `${baseUrl}/uploads/profile-default.jpg`;

    res.status(200).json({ msg: "Profile retrieved successfully", profile: profileData });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Create Profile
 *
 * Creates a new user profile with default values and validation checks.
 */
export const createProfile = async (req, res) => {
  try {
    const existingProfile = req?.user?.Profile;

    if (existingProfile) {
      return res.status(404).json({ msg: "A profile already exists" });
    }
    const {
      fullName,
      city,
      country,
      bio,
      linkedInUrl,
      attendedEvent,
      sponsorshipBalance,
    } = req.body;

    // safety check (prevents DB crash)
    if (!fullName) {
      return res.status(400).json({ msg: "Full name is required" });
    }

    const baseUrl = process.env.BASE_URL; // e.g. http://localhost:5050

    const profile = await Profile.create({
      fullName,
      city,
      country,
      bio,
      linkedInUrl,
      attendedEvent,
      sponsorshipBalance,
      profileImage: `${baseUrl}/uploads/profile-default.jpg`,
      userId: req.user.id,
    });

    return res.status(201).json({
      msg: "Profile created successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Update Profile
 *
 * Updates existing profile fields while preserving existing data.
 */
export const updateProfile = async (req, res) => {
  try {
    const profile = req?.user?.Profile;

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    const {
      fullName,
      city,
      country,
      bio,
      linkedInUrl,
      attendedEvent,
      sponsorshipBalance,
    } = req.body;

    const updateData = {
      fullName: fullName ?? profile.fullName,
      city: city ?? profile.city,
      country: country ?? profile.country,
      bio: bio ?? profile.bio,
      linkedInUrl: linkedInUrl ?? profile.linkedInUrl,
      attendedEvent: attendedEvent ?? profile.attendedEvent,
      sponsorshipBalance: sponsorshipBalance ?? profile.sponsorshipBalance,
    };

    await profile.update(updateData);

    return res.status(200).json({
      msg: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Upload Profile Image
 *
 * Handles profile image upload and updates stored image path.
 *
 * Logic:
 * - Validate file upload from Multer.
 * - Ensure user has an existing profile.
 * - Save uploaded file path to profile.
 * - Return updated image URL.
 */
export const uploadImage = async (req, res) => {
  try {
    // 1. Check if Multer actually processed a file
    if (!req.file) {
      return res.status(400).json({ msg: "No image file provided." });
    }

    // 2. Check if the user even has a profile yet
    const profile = req.user.Profile;
    if (!profile) {
      return res.status(404).json({ msg: "Create a profile before uploading an image." });
    }

    const baseUrl = process.env.BASE_URL; // e.g. http://localhost:5050
    // 3. Update the profile field with the new path
    // Multer gives us 'filename' (the unique name it generated)
    // profile.profileImage = `/uploads/${req.file.filename}`;
    profile.profileImage = `${baseUrl}/uploads/${req.file.filename}`;
    
    await profile.save();

    res.status(200).json({ 
      msg: "Profile image updated successfully", 
      url: profile.profileImage
    });

  } catch (err) {
    // 4. Handle unexpected errors (DB issues, etc.)
    console.error("Upload Error:", err);
    res.status(500).json({ msg: "Failed to save image path to profile." });
  }
};

/**
 * HELPER: Add Entry
 *
 * Generic function to add profile-related entries (Degree, Work, etc.).
 *
 * Logic:
 * - Ensure profile exists.
 * - Attach entry to user's profileId.
 * - Create record in specified model.
 */
const addEntry = async (Model, req, res) => {
  try {
    if (!req.user.Profile) return res.status(404).json({ msg: "Create profile first" });
    const entry = await Model.create({ ...req.body, profileId: req.user.Profile.id });
    res.status(201).json({ msg: "Added successfully", entry });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * HELPER: Update Entry
 *
 * Generic function to update profile-related entries.
 *
 * Logic:
 * - Find entry by ID and ensure ownership via profileId.
 * - Update only allowed fields.
 */
const updateEntry = async (Model, req, res) => {
  try {
    // We find the entry by its ID AND ensure it belongs to the user's profile
    const entry = await Model.findOne({ 
      where: { id: req.params.id, profileId: req.user.Profile.id } 
    });

    if (!entry) {
      return res.status(404).json({ msg: "Entry not found or unauthorized" });
    }

    // Update with whatever fields are sent in req.body
    await entry.update(req.body);
    res.status(200).json({ msg: "Updated successfully", entry });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * HELPER: Delete Entry
 *
 * Generic function to delete profile-related entries.
 *
 * Logic:
 * - Validate ownership using profileId.
 * - Remove entry from database if authorized.
 */
const deleteEntry = async (Model, req, res) => {
  try {
    const entry = await Model.findOne({ 
      where: { id: req.params.id, profileId: req.user.Profile.id } 
    });
    if (!entry) return res.status(404).json({ msg: "Entry not found" });
    await entry.destroy();
    res.status(200).json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Exported controller functions for each profile-related model using the generic helpers
 */
export const addDegree = (req, res) => addEntry(Degree, req, res);
export const updateDegree = (req, res) => updateEntry(Degree, req, res);
export const deleteDegree = (req, res) => deleteEntry(Degree, req, res);

export const addCertification = (req, res) => addEntry(Certification, req, res);
export const updateCertification = (req, res) => updateEntry(Certification, req, res);
export const deleteCertification = (req, res) => deleteEntry(Certification, req, res);

export const addWork = (req, res) => addEntry(Work, req, res);
export const updateWork = (req, res) => updateEntry(Work, req, res);
export const deleteWork = (req, res) => deleteEntry(Work, req, res);

export const addLicense = (req, res) => addEntry(License, req, res);
export const updateLicense = (req, res) => updateEntry(License, req, res);
export const deleteLicense = (req, res) => deleteEntry(License, req, res);

export const addCourse = (req, res) => addEntry(Course, req, res);
export const updateCourse = (req, res) => updateEntry(Course, req, res);
export const deleteCourse = (req, res) => deleteEntry(Course, req, res);