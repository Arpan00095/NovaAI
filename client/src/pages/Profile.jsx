import ProfileCard from "../components/profile/ProfileCard";

const Profile = () => {
  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] px-4 sm:px-6 py-8 sm:py-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <ProfileCard />
      </div>
    </div>
  );
};

export default Profile;