"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  LogOut,
  Mail,
  Moon,
  Palette,
  Save,
  Settings,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  const handleProfileSave = async () => {
    const trimmedName = name.trim();

    setProfileMessage("");
    setProfileError("");

    if (!trimmedName) {
      setProfileError("Name cannot be empty.");
      return;
    }

    if (trimmedName.length > 80) {
      setProfileError(
        "Name cannot exceed 80 characters."
      );
      return;
    }

    try {
      setSavingProfile(true);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update profile."
        );
      }

      /*
       * Update the current Auth.js session
       * so the new name appears immediately
       * in the navbar.
       */
      await update({
        name: trimmedName,
      });

      setName(trimmedName);

      setProfileMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError(
        "Enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "Enter a new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        "/api/profile/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        "Password changed successfully."
      );
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (status === "loading") {
    return (
      <main
        className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8"
        style={{
          color: "var(--text-primary)",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="glass rounded-3xl p-8">
            Loading settings...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 pb-12 sm:px-6 lg:px-8"
      style={{
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl border"
              style={{
                borderColor:
                  "var(--glass-border)",
                background:
                  "var(--glass)",
              }}
            >
              <Settings size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                Settings
              </h1>

              <p
                className="text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Manage your JobTrack account
                and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <section className="glass mb-6 rounded-3xl p-5 sm:p-7">
          <div className="mb-6 flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background:
                  "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <User size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Profile
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Update your personal information.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  maxLength={80}
                  className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition"
                  style={{
                    borderColor:
                      "var(--glass-border)",
                    background:
                      "var(--glass)",
                    color:
                      "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                />

                <input
                  id="email"
                  type="email"
                  value={
                    session?.user?.email || ""
                  }
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border py-3 pl-11 pr-4 opacity-60 outline-none"
                  style={{
                    borderColor:
                      "var(--glass-border)",
                    background:
                      "var(--glass)",
                    color:
                      "var(--text-primary)",
                  }}
                />
              </div>

              <p
                className="mt-2 text-xs"
                style={{
                  color:
                    "var(--text-muted)",
                }}
              >
                Email address cannot be changed
                here.
              </p>
            </div>
          </div>

          {/* Profile messages */}
          {profileMessage && (
            <div
              className="mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor:
                  "rgba(52, 211, 153, 0.25)",
                background:
                  "rgba(52, 211, 153, 0.08)",
                color:
                  "var(--success)",
              }}
            >
              <CheckCircle2 size={17} />
              {profileMessage}
            </div>
          )}

          {profileError && (
            <div
              className="mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor:
                  "rgba(251, 113, 133, 0.25)",
                background:
                  "rgba(251, 113, 133, 0.08)",
                color:
                  "var(--danger)",
              }}
            >
              <AlertTriangle size={17} />
              {profileError}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleProfileSave}
              disabled={savingProfile}
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background:
                  "var(--accent)",
                color: "#ffffff",
              }}
            >
              <Save size={17} />

              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="glass mb-6 rounded-3xl p-5 sm:p-7">
          <div className="mb-6 flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background:
                  "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <Palette size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Appearance
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Choose how JobTrack should look.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {/* Light */}
            <button
              type="button"
              onClick={() =>
                setTheme("light")
              }
              className="rounded-2xl border p-4 text-left transition-all duration-200 hover:scale-[1.01]"
              style={{
                borderColor:
                  theme === "light"
                    ? "var(--accent)"
                    : "var(--glass-border)",
                background:
                  theme === "light"
                    ? "var(--accent-soft)"
                    : "var(--glass)",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "var(--accent-soft)",
                    color:
                      "var(--accent)",
                  }}
                >
                  <Sun size={20} />
                </div>

                {theme === "light" && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs"
                    style={{
                      background:
                        "var(--accent-soft)",
                      color:
                        "var(--accent)",
                    }}
                  >
                    Active
                  </span>
                )}
              </div>

              <h3 className="font-medium">
                Light
              </h3>

              <p
                className="mt-1 text-xs"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Use the light appearance.
              </p>
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() =>
                setTheme("dark")
              }
              className="rounded-2xl border p-4 text-left transition-all duration-200 hover:scale-[1.01]"
              style={{
                borderColor:
                  theme === "dark"
                    ? "var(--accent)"
                    : "var(--glass-border)",
                background:
                  theme === "dark"
                    ? "var(--accent-soft)"
                    : "var(--glass)",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "var(--accent-soft)",
                    color:
                      "var(--accent)",
                  }}
                >
                  <Moon size={20} />
                </div>

                {theme === "dark" && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs"
                    style={{
                      background:
                        "var(--accent-soft)",
                      color:
                        "var(--accent)",
                    }}
                  >
                    Active
                  </span>
                )}
              </div>

              <h3 className="font-medium">
                Dark
              </h3>

              <p
                className="mt-1 text-xs"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Use the dark appearance.
              </p>
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="glass mb-6 rounded-3xl p-5 sm:p-7">
          <div className="mb-6 flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background:
                  "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <Shield size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Security
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Change your account password.
              </p>
            </div>
          </div>

          <div className="grid gap-5">

            {/* Current password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium"
              >
                Current Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--text-muted)",
                  }}
                />

                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter current password"
                  className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none"
                  style={{
                    borderColor:
                      "var(--glass-border)",
                    background:
                      "var(--glass)",
                    color:
                      "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* New password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "var(--glass-border)",
                    background:
                      "var(--glass)",
                    color:
                      "var(--text-primary)",
                  }}
                />
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    borderColor:
                      "var(--glass-border)",
                    background:
                      "var(--glass)",
                    color:
                      "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          {passwordMessage && (
            <div
              className="mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor:
                  "rgba(52, 211, 153, 0.25)",
                background:
                  "rgba(52, 211, 153, 0.08)",
                color:
                  "var(--success)",
              }}
            >
              <CheckCircle2 size={17} />
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div
              className="mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor:
                  "rgba(251, 113, 133, 0.25)",
                background:
                  "rgba(251, 113, 133, 0.08)",
                color:
                  "var(--danger)",
              }}
            >
              <AlertTriangle size={17} />
              {passwordError}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={changingPassword}
              className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor:
                  "var(--glass-border)",
                background:
                  "var(--glass)",
              }}
            >
              <Lock size={17} />

              {changingPassword
                ? "Changing..."
                : "Change Password"}
            </button>
          </div>
        </section>

        {/* Session */}
        <section className="glass mb-6 rounded-3xl p-5 sm:p-7">
          <div className="mb-5 flex items-start gap-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background:
                  "var(--accent-soft)",
                color:
                  "var(--accent)",
              }}
            >
              <Shield size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Session
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                You are currently signed in to
                JobTrack.
              </p>
            </div>
          </div>

          <div
            className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor:
                "var(--glass-border)",
              background:
                "var(--glass)",
            }}
          >
            <div>
              <p className="text-sm font-medium">
                {session?.user?.email}
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color:
                    "var(--text-muted)",
                }}
              >
                Active account session
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:scale-[1.02]"
              style={{
                borderColor:
                  "rgba(251, 113, 133, 0.25)",
                color:
                  "var(--danger)",
                background:
                  "rgba(251, 113, 133, 0.06)",
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section
          className="rounded-3xl border p-5 sm:p-7"
          style={{
            borderColor:
              "rgba(251, 113, 133, 0.2)",
            background:
              "rgba(251, 113, 133, 0.035)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background:
                  "rgba(251, 113, 133, 0.1)",
                color:
                  "var(--danger)",
              }}
            >
              <AlertTriangle size={19} />
            </div>

            <div>
              <h2
                className="text-lg font-semibold"
                style={{
                  color:
                    "var(--danger)",
                }}
              >
                Danger Zone
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Account deletion will be added
                after the core account system is
                complete.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}