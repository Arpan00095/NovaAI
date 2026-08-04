import { useContext } from "react";

import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  Trash2,
  Download,
  ChevronRight,
} from "lucide-react";

import { AuthContext } from "../../contexts/AuthContext";

const SettingsCard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your NovaAI account and preferences.
        </p>
      </div>

      {/* Account */}

      <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            Account
          </h2>
        </div>

        <SettingRow
          icon={<User size={20} />}
          title="Full Name"
          value={user?.full_name || "-"}
        />

        <SettingRow
          icon={<Mail size={20} />}
          title="Email"
          value={user?.email || "-"}
        />

        <SettingRow
          icon={<ShieldCheck size={20} />}
          title="Login Provider"
          value={user?.auth_provider || "email"}
        />

      </section>

      {/* Security */}

      <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            Security
          </h2>
        </div>

        <ActionRow
          icon={<Lock size={20} />}
          title="Change Password"
          description="Available soon"
          disabled
        />

      </section>

      {/* Data */}

      <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            Data
          </h2>
        </div>

        <ActionRow
          icon={<Download size={20} />}
          title="Export My Data"
          description="Coming soon"
          disabled
        />

      </section>

      {/* Danger */}

      <section className="rounded-3xl border border-red-900 bg-red-950/20 overflow-hidden">

        <div className="border-b border-red-900 px-6 py-5">
          <h2 className="text-xl font-semibold text-red-400">
            Danger Zone
          </h2>
        </div>

        <ActionRow
          icon={<Trash2 size={20} />}
          title="Delete Account"
          description="This action cannot be undone."
          danger
          disabled
        />

      </section>

    </div>
  );
};

const SettingRow = ({
  icon,
  title,
  value,
}) => (
  <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 last:border-none">
    <div className="flex items-center gap-4">
      <div className="text-blue-400">
        {icon}
      </div>

      <span className="text-slate-200">
        {title}
      </span>
    </div>

    <span className="font-medium text-white">
      {value}
    </span>
  </div>
);

const ActionRow = ({
  icon,
  title,
  description,
  danger = false,
  disabled = false,
}) => (
  <button
    disabled={disabled}
    className={`
      w-full
      flex
      items-center
      justify-between
      px-6
      py-5
      transition
      ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "hover:bg-slate-800"
      }
    `}
  >
    <div className="flex items-center gap-4">

      <div
        className={
          danger
            ? "text-red-400"
            : "text-blue-400"
        }
      >
        {icon}
      </div>

      <div className="text-left">

        <p
          className={
            danger
              ? "font-medium text-red-300"
              : "font-medium text-white"
          }
        >
          {title}
        </p>

        <p className="text-sm text-slate-400">
          {description}
        </p>

      </div>

    </div>

    <ChevronRight
      size={18}
      className="text-slate-500"
    />
  </button>
);

export default SettingsCard;