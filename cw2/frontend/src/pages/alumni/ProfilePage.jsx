import { useState } from "react";
import ExperienceCard from "../../components/profile/experience/ExperienceCard";
import DegreeCard from "../../components/profile/education/DegreeCard";
import CertificationCard from "../../components/profile/certification/CertificationCard";
import CourseCard from "../../components/profile/course/CourseCard";
import LicenseCard from "../../components/profile/license/LicenseCard";
import { Pencil, BadgeDollarSign, CalendarCheck2 } from "lucide-react";

import ProfileFormModal from "../../components/profile/ProfileFormModal";
// import ProfileImageModal from "../../components/profile/ProfileImageModel";
import ProfileImageForm from "../../components/profile/ProfileImageForm";
import ProfileForm from "../../components/profile/ProfileForm";
import AboutForm from"../../components/profile/ProfileAboutForm";
import { useProfile } from "../../hooks/useProfile";
import Loader from "../../components/common/Loader";

import { normalizeError } from "../../utils/normalizeError";

export default function ProfilePage() {
  const { profile, loadingProfile, updateProfile, updateProfileImage } = useProfile();
  console.log(profile);
  // const [profile] = useState({
  //   fullName: "Alex Sterling",
  //   city: "Colombo",
  //   country: "Sri Lanka",
  //   bio: "Passionate about building scalable distributed systems and mentoring the next generation of engineers.",
  //   linkedInUrl: "https://linkedin.com/in/example",
  //   profileImage:
  //     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  //   attendedEvent: true,
  //   sponsorshipBalance: 200,
  //   coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1350&q=80"
  // });

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "profile", "about", etc
  
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState([]);

  if (loadingProfile) return <Loader />; 
  

  // const handleUpdate = async (newData) => {
  //   try {
  //     // Logic: Merge existing data with new form data
  //     const updatedProfile = { ...profile, ...newData };
  //     await profileService.saveProfile(updatedProfile);
      
  //     fetchProfile(); // Refresh UI
  //     setOpenModal(false);
  //   } catch (error) {
  //     console.error("Update failed", error);
  //   }
  // };
  const handleUpdate = async (formData) => {
    setUpdating(true);
    setUpdateError([]);

    try {
      await updateProfile(formData);

      setOpenModal(false); // close modal

    } catch (err) {
      setUpdateError(normalizeError(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (file) => {
    setUpdating(true);
    setUpdateError([]);

    try {
      console.log("file",file);
      await updateProfileImage(file);
      setOpenModal(false);
    } catch (err) {
      setUpdateError(normalizeError(err));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-12 font-sans">
      <div className="max-w-5xl mx-auto pt-6 px-4 space-y-6">

        {/* COVER + HEADER CARD */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

          {/* COVER */}
          <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-500 border-b border-blue-100" />

          {/* PROFILE INFO */}
          <div className="px-8 pb-8 relative pt-8 group">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setModalType("profile");
                  setOpenModal(true);
                }}
                className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition"
              >
                <Pencil size={18} />
              </button>
            </div>
            
            <div>

              {/* PROFILE IMAGE */}
              <div
                className="absolute -top-16 left-8 cursor-pointer"
                onClick={() => {
                  setModalType("photo");
                  setOpenModal(true);
                }}
              >
                <img
                  src={profile?.profileImage}
                  alt="Profile"
                  className="w-36 h-36 rounded-full border-4 border-white shadow-md object-cover"
                />

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition">
                  <Pencil className="text-white" size={20} />
                </div>
              </div>

              <div className="pt-16 flex justify-between items-start">
                <div>
                  {/* <div className="flex items-center gap-2"> */}
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile?.fullName}
                    </h1>

                    {/* <button
                      onClick={() => {
                        setModalType("profile");
                        setOpenModal(true);
                      }}
                      className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Pencil size={18} />
                    </button> */}
                  {/* </div> */}

                  {/* <p className="text-sm text-gray-500 mt-1">
                    {profile?.city}, {profile?.country}
                  </p> */}
                  <p className="text-sm text-gray-500 mt-1">
                    {[profile?.city, profile?.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {profile?.linkedInUrl && (
                    <a
                      href={profile?.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-2 block"
                    >
                      View LinkedIn Profile
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  
                  {/* Sponsorship */}
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    <BadgeDollarSign size={16} />
                    <span>${profile?.sponsorshipBalance}</span>
                  </div>

                  {/* Event */}
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <CalendarCheck2 size={16} />
                    <span>{profile?.attendedEvent ? "Attended Event" : "No Events Yet"}</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm group">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">About</h2>

            {/* future edit button */}
            <button 
              onClick={() => {
                setModalType("about");
                setOpenModal(true);
              }}
              className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition">
              <Pencil size={18} />
            </button>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {profile?.bio ? profile?.bio : "Bio information is currently unavailable."}
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6">

          <div className="lg:col-span-2 space-y-6">
            <ExperienceCard />
            <DegreeCard />
            <CertificationCard />
            <CourseCard />
            <LicenseCard />
          </div>
        </div>

        <ProfileFormModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title={
            modalType === "about"
              ? "Edit About"
              : modalType === "profile"
              ? "Edit Profile"
              : modalType === "photo"
              ? "Edit Photo"
              : "Edit"
          }
        >
          {modalType === "about" && (
            <AboutForm
              profile={profile}
              onSubmit={handleUpdate}
              loading={updating}
              error={updateError}
            />
          )}

          {modalType === "profile" && (
            <ProfileForm 
              profile={profile} 
              onSubmit={handleUpdate}
              loading={updating}
              error={updateError}
             />
          )}

          {modalType === "photo" && (
            <ProfileImageForm
              profile={profile}
              onSubmit={handleImageUpload}
              loading={updating}
              error={updateError}
            />
          )}          
        </ProfileFormModal>

      </div>
    </div>
  );
}