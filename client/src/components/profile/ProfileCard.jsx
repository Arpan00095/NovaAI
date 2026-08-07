import { useContext, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  Copy,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const ProfileCard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const rawName = user?.full_name || user?.name || "Arpan Maji";
  const profilePic = user?.avatar_url || user?.picture || user?.photo_url || user?.avatar;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(rawName)}&background=282a2c&color=3b82f6&bold=true`;

  const copyUserId = async () => {
    if (!user?.id) return;

    await navigator.clipboard.writeText(user.id);
    toast.success("User ID copied to clipboard 📋", {
      style: {
        background: "#1e1f20",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)",
      },
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="
            flex 
            items-center 
            gap-2 
            px-3.5 
            py-2 
            rounded-xl 
            bg-white/5 
            hover:bg-white/10 
            border 
            border-white/10 
            text-sm 
            font-medium 
            text-slate-300 
            hover:text-white 
            transition
          "
        >
          <ArrowLeft size={16} />
          Back to Workspace
        </button>

        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Account Settings
        </span>
      </div>

      {/* Main Glassmorphic Card Container */}
      <div
        className="
          relative 
          overflow-hidden 
          rounded-3xl 
          border 
          border-white/10 
          bg-[#1e1f20] 
          p-6 
          sm:p-8 
          shadow-2xl 
          backdrop-blur-xl
        "
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl pointer-events-none rounded-full" />

        {/* Profile Avatar Header */}
        <div className="relative flex flex-col items-center text-center pb-8 border-b border-white/5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur transition group-hover:opacity-100" />

            <img
              src={!imgError && profilePic ? profilePic : fallbackAvatar}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              alt=""
              className="
                relative 
                h-24 
                w-24 
                sm:h-28 
                sm:w-28 
                rounded-full 
                border-2 
                border-white/20 
                object-cover 
                shadow-2xl 
                bg-[#282a2c]
              "
            />
          </div>

          <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {rawName}
          </h1>

          <p className="mt-1 text-sm text-slate-400 font-medium">
            {user?.email || "arpanmaji2004@gmail.com"}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Active Subscription Plan
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-8 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Personal Details
          </p>

          <InfoRow
            icon={<User size={18} className="text-blue-400" />}
            label="Full Name"
            value={rawName}
          />

          <InfoRow
            icon={<Mail size={18} className="text-purple-400" />}
            label="Email Address"
            value={user?.email || "arpanmaji2004@gmail.com"}
          />

          <InfoRow
            icon={<KeyRound size={18} className="text-amber-400" />}
            label="Auth Provider"
            value={
              <span className="capitalize">
                {user?.auth_provider || "google"}
              </span>
            }
          />

          <InfoRow
            icon={<ShieldCheck size={18} className="text-emerald-400" />}
            label="Account Status"
            value={
              user?.is_verified !== false ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={16} /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-rose-400">
                  <XCircle size={16} /> Unverified
                </span>
              )
            }
          />

          <InfoRow
            icon={<Calendar size={18} className="text-pink-400" />}
            label="Member Since"
            value={
              user?.created_at
                ? new Date(user.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Aug 2026"
            }
          />
        </div>

        {/* User ID */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            System Identity
          </p>

          <div
            className="
              flex 
              items-center 
              justify-between 
              rounded-2xl 
              bg-white/5 
              border 
              border-white/5 
              px-4 
              py-3
            "
          >
            <div className="flex flex-col min-w-0 pr-3">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                User Identifier Code
              </span>
              <span className="truncate font-mono text-xs text-slate-300">
                {user?.id || "usr_nova_98372410"}
              </span>
            </div>

            <button
              onClick={copyUserId}
              title="Copy ID"
              className="
                shrink-0 
                rounded-xl 
                p-2.5 
                bg-white/5 
                hover:bg-white/10 
                border 
                border-white/10 
                text-slate-300 
                hover:text-white 
                transition
              "
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            mt-8 
            flex 
            w-full 
            items-center 
            justify-center 
            gap-2.5 
            rounded-2xl 
            bg-red-500/10 
            hover:bg-red-500/20 
            border 
            border-red-500/20 
            py-3.5 
            font-medium 
            text-red-400 
            transition-all 
            duration-200 
            active:scale-[0.99]
          "
        >
          <LogOut size={18} />
          Log Out Account
        </button>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div
    className="
      flex 
      items-center 
      justify-between 
      rounded-2xl 
      bg-white/5 
      hover:bg-white/[0.07] 
      border 
      border-white/5 
      px-4 
      py-3.5 
      transition
    "
  >
    <div className="flex items-center gap-3 text-slate-400 text-sm">
      {icon}
      <span>{label}</span>
    </div>

    <div className="font-medium text-sm text-white">{value}</div>
  </div>
);

export default ProfileCard;