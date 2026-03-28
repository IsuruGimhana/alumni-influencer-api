import db from "../models/index.js";
const { User, Profile, Degree, Certification, License, Course, Work, Bid } = db;

// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    // We fetch the profile with ALL associated data for the user's dashboard
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [Degree, Certification, License, Course, Work],
    });

    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    const profileData = profile.toJSON(); // Convert to plain javascript object for easier manipulation instead of Json

    if (!profileData.profileImage) profileData.profileImage = "/uploads/profile-default.jpg";

    res.json(profileData); // convert to JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create / Update Profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { fullName, bio, linkedInUrl, attendedEvent, sponsorshipBalance } = req.body;

    // USE THE PROFILE ALREADY ATTACHED BY MIDDLEWARE
    let profile = req.user.Profile;

    if (profile) {
      // UPDATE
      await profile.update({ fullName, bio, linkedInUrl, attendedEvent, sponsorshipBalance });
    } else {
      // CREATE
      profile = await Profile.create({ 
        fullName, bio, linkedInUrl, attendedEvent, sponsorshipBalance, 
        userId: req.user.id 
      });
    }

    res.json({ msg: "Profile saved successfully", profile });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Profile Image Upload ---
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

    // 3. Update the profile field with the new path
    // Multer gives us 'filename' (the unique name it generated)
    profile.profileImage = `/uploads/${req.file.filename}`;
    
    await profile.save();

    res.json({ 
      msg: "Profile image updated successfully", 
      url: profile.profileImage
    });

  } catch (err) {
    // 4. Handle unexpected errors (DB issues, etc.)
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to save image path to profile." });
  }
};

// --- Helper for Adding Entries ---
const addEntry = async (Model, req, res) => {
  try {
    if (!req.user.Profile) return res.status(400).json({ msg: "Create profile first" });
    const entry = await Model.create({ ...req.body, profileId: req.user.Profile.id });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: "Validation failed. Ensure URLs and Dates are correct." });
  }
};

// --- Helper for Updating Entries ---
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
    res.json({ msg: "Updated successfully", entry });
  } catch (err) {
    res.status(400).json({ error: "Update failed. Check data format." });
  }
};

// --- Helper for Deleting Entries ---
const deleteEntry = async (Model, req, res) => {
  try {
    const entry = await Model.findOne({ 
      where: { id: req.params.id, profileId: req.user.Profile.id } 
    });
    if (!entry) return res.status(404).json({ msg: "Entry not found" });
    await entry.destroy();
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// EXPORTS
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

// Get Alumnus of the Day Api
export const getAlumnusOfTheDay = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    // Find today's winner
    const winningBid = await Bid.findOne({
      where: { bidDate: today, isWinner: true },
      include: [{
        model: User,
        include: [{
          model: Profile,
          include: [Degree, Certification, License, Course, Work]
        }]
      }]
    });

    if (!winningBid) return res.status(404).json({ msg: "No featured Alumnus today." });

    // Get profile
    const profile = winningBid.User.Profile;
    const profileData = profile.toJSON();

    if (!profileData.profileImage) profileData.profileImage = "/uploads/profile-default.jpg";

    res.json(profileData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};