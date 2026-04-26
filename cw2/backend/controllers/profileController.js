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

    // console.log("controller:",profileData.profileImage);
    // const baseUrl = process.env.BASE_URL; // e.g. http://localhost:5050
    // if (!profileData.profileImage) profileData.profileImage = `${baseUrl}/uploads/profile-default.jpg`;

    res.status(200).json({ msg: "Profile retrieved successfully", profile: profileData });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create / Update Profile
// export const createOrUpdateProfile = async (req, res) => {
//   try {
//     const { fullName, city, country, bio, linkedInUrl, attendedEvent, sponsorshipBalance } = req.body;

//     // USE THE PROFILE ALREADY ATTACHED BY MIDDLEWARE
//     let profile = req.user.Profile;

//     if (profile) {
//       // UPDATE
//       // await profile.update({ fullName, city, country, bio, linkedInUrl, attendedEvent, sponsorshipBalance });
//       await profile.update(req.body);
//       return res.status(200).json({ msg: "Profile updated successfully", profile });
//     } else {
//       // CREATE
//       profile = await Profile.create({ 
//         fullName, city, country, bio, linkedInUrl, attendedEvent, sponsorshipBalance, 
//         userId: req.user.id 
//       });
//       return res.status(201).json({ msg: "Profile created successfully", profile });
//     }

//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
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

// --- Helper for Adding Entries ---
const addEntry = async (Model, req, res) => {
  try {
    if (!req.user.Profile) return res.status(404).json({ msg: "Create profile first" });
    const entry = await Model.create({ ...req.body, profileId: req.user.Profile.id });
    res.status(201).json({ msg: "Added successfully", entry });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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
    res.status(200).json({ msg: "Updated successfully", entry });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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
    res.status(200).json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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

// // Get Alumnus of the Day Api
// export const getAlumnusOfTheDay = async (req, res) => {
//   try {
//     const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
    
//     // Find today's winner
//     const winningBid = await Bid.findOne({
//       where: { bidDate: today, isWinner: true },
//       include: [{
//         model: User,
//         include: [{
//           model: Profile,
//           include: [Degree, Certification, License, Course, Work]
//         }]
//       }]
//     });

//     if (!winningBid) return res.status(404).json({ msg: "No featured Alumnus today." });

//     // Get profile
//     const profile = winningBid.User.Profile;
//     const profileData = profile.toJSON();

//     if (!profileData.profileImage) profileData.profileImage = "/uploads/profile-default.jpg";

//     res.status(200).json({ msg: "Profile retrieved successfully", profile: profileData });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };