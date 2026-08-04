import { useContext } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  Copy,
} from "lucide-react";

import { AuthContext } from "../../contexts/AuthContext";

import toast from "react-hot-toast";

const ProfileCard = () => {
  const { user, logout } =
    useContext(AuthContext);

  const copyUserId = async () => {
    if (!user?.id) return;

    await navigator.clipboard.writeText(
      user.id
    );

    toast.success("User ID copied 📋");
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-8
        shadow-2xl
      "
    >
      {/* Header */}

      <div className="flex flex-col items-center">

        <img
          src={
            user?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.full_name || "User"
            )}&background=2563eb&color=fff`
          }
          alt="Profile"
          className="
            h-28
            w-28
            rounded-full
            border-4
            border-blue-600
            object-cover
          "
        />

        <h1 className="mt-5 text-3xl font-bold text-white">
          {user?.full_name}
        </h1>

        <p className="mt-2 text-slate-400">
          {user?.email}
        </p>

      </div>

      {/* Info */}

      <div className="mt-10 grid gap-5">

        <InfoRow
          icon={<User size={18} />}
          label="Full Name"
          value={user?.full_name}
        />

        <InfoRow
          icon={<Mail size={18} />}
          label="Email"
          value={user?.email}
        />

        <InfoRow
          icon={<ShieldCheck size={18} />}
          label="Provider"
          value={
            user?.auth_provider ||
            "email"
          }
        />

        <InfoRow
          icon={<ShieldCheck size={18} />}
          label="Verified"
          value={
            user?.is_verified
              ? "Yes ✅"
              : "No ❌"
          }
        />

        <InfoRow
          icon={<Calendar size={18} />}
          label="Joined"
          value={
            user?.created_at
              ? new Date(
                  user.created_at
                ).toLocaleDateString()
              : "-"
          }
        />

      </div>

      {/* User ID */}

      <div className="mt-8">

        <p className="mb-2 text-sm text-slate-400">
          User ID
        </p>

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-800
            px-4
            py-3
          "
        >
          <span className="truncate text-slate-200">
            {user?.id}
          </span>

          <button
            onClick={copyUserId}
            className="
              rounded-lg
              p-2
              hover:bg-slate-700
            "
          >
            <Copy size={18} />
          </button>

        </div>

      </div>

      {/* Logout */}

      <button
        onClick={logout}
        className="
          mt-10
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          bg-red-600
          py-3
          font-semibold
          text-white
          transition
          hover:bg-red-700
        "
      >
        <LogOut size={18} />

        Logout
      </button>

    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}) => (
  <div
    className="
      flex
      items-center
      justify-between
      rounded-xl
      bg-slate-800
      px-5
      py-4
    "
  >
    <div className="flex items-center gap-3 text-slate-300">
      {icon}

      <span>{label}</span>
    </div>

    <span className="font-medium text-white">
      {value}
    </span>
  </div>
);

export default ProfileCard;