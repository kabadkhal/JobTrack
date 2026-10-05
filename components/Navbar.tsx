"use client";

import {
  ChevronDown,
  LogOut,
  Menu,
  User,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import GlobalSearch from "@/components/GlobalSearch";
import NotificationBell from "@/components/NotificationBell";
import ThemeSwitcher from "@/components/ThemeSwitcher";

type ProfilePosition = {
  top: number;
  left: number;
};

export default function Navbar() {
  const { data: session } = useSession();

  const [visible, setVisible] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [profilePosition, setProfilePosition] =
    useState<ProfilePosition>({
      top: 0,
      left: 0,
    });

  const lastScrollY = useRef(0);

  const profileButtonRef =
    useRef<HTMLButtonElement>(null);

  /*
   * ============================================================
   * CLIENT MOUNT
   * ============================================================
   */

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * ============================================================
   * HIDE NAVBAR ON SCROLL DOWN
   * ============================================================
   */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setVisible(true);
      } else if (
        currentScrollY > lastScrollY.current
      ) {
        setVisible(false);
        setProfileOpen(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
   * ============================================================
   * PROFILE POPUP POSITION
   *
   * Always calculate from the real M button.
   * Popup appears BELOW the button.
   * ============================================================
   */

  useLayoutEffect(() => {
    if (!profileOpen) return;

    const updatePosition = () => {
      const button =
        profileButtonRef.current;

      if (!button) return;

      const rect =
        button.getBoundingClientRect();

      const popupWidth = 300;

      const gap = 10;

      let left =
        rect.right - popupWidth;

      /*
       * Keep popup inside viewport.
       */
      if (left < 12) {
        left = 12;
      }

      if (
        left + popupWidth >
        window.innerWidth - 12
      ) {
        left =
          window.innerWidth -
          popupWidth -
          12;
      }

      const top =
        rect.bottom + gap;

      setProfilePosition({
        top,
        left,
      });
    };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );
    };
  }, [profileOpen]);

  /*
   * ============================================================
   * ESCAPE
   * ============================================================
   */

  useEffect(() => {
    if (!profileOpen) return;

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [profileOpen]);

  /*
   * ============================================================
   * USER
   * ============================================================
   */

  const userName =
    session?.user?.name || "User";

  const userEmail =
    session?.user?.email || "";

  const avatarLetter =
    userName
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  /*
   * ============================================================
   * MOBILE SIDEBAR
   * ============================================================
   */

  const toggleMobileSidebar = () => {
    window.dispatchEvent(
      new Event(
        "jobtrack:toggle-sidebar"
      )
    );
  };

  /*
   * ============================================================
   * PROFILE BUTTON
   *
   * Used both for the normal navbar and
   * the sharp button displayed above the blur.
   * ============================================================
   */

  const profileButton = (
    <button
      ref={profileButtonRef}
      type="button"
      onClick={() =>
        setProfileOpen(
          (current) => !current
        )
      }
      aria-label="Open profile menu"
      aria-expanded={profileOpen}
      className="
        relative
        flex
        h-11
        shrink-0
        items-center
        gap-2
        rounded-xl
        border
        border-white/10
        bg-white/5
        px-2.5
        transition-all
        duration-200
        hover:bg-white/10
      "
    >
      {/* Avatar */}
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-xs
          font-semibold
        "
        style={{
          background:
            "var(--accent-soft)",
          color:
            "var(--accent)",
        }}
      >
        {avatarLetter}
      </div>

      {/* Desktop user information */}
      <div
        className="
          hidden
          max-w-[135px]
          min-w-0
          text-left
          xl:block
        "
      >
        <p className="truncate text-xs font-medium">
          {userName}
        </p>

        <p
          className="
            truncate
            text-[10px]
          "
          style={{
            color:
              "var(--text-muted)",
          }}
        >
          {userEmail}
        </p>
      </div>

      {/* Chevron */}
      <ChevronDown
        size={15}
        className={`
          hidden
          shrink-0
          transition-transform
          duration-200
          xl:block
          ${
            profileOpen
              ? "rotate-180"
              : ""
          }
        `}
        style={{
          color:
            "var(--text-muted)",
        }}
      />
    </button>
  );

  /*
   * ============================================================
   * PROFILE PORTAL
   *
   * IMPORTANT:
   *
   * This is NOT inside AnimatePresence.
   *
   * The backdrop is above the entire application.
   * The selected M button and popup are above the backdrop.
   * ============================================================
   */

  const profilePortal =
    profileOpen &&
    mounted &&
    createPortal(
      <>
        {/* ======================================================
            FULL SCREEN BACKDROP
        ====================================================== */}

        <motion.button
          type="button"
          aria-label="Close profile menu"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.18,
          }}
          onClick={() =>
            setProfileOpen(false)
          }
          className="
            fixed
            inset-0
            z-[200]
            h-full
            w-full
            cursor-default
            border-0
            bg-black/35
            p-0
            backdrop-blur-md
          "
        />

        {/* ======================================================
            SELECTED M BUTTON
            ONLY THIS PART OF NAVBAR REMAINS SHARP
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.16,
          }}
          className="
            fixed
            z-[230]
          "
          style={{
            top:
              profileButtonRef.current
                ? profileButtonRef.current.getBoundingClientRect()
                    .top
                : 0,

            left:
              profileButtonRef.current
                ? profileButtonRef.current.getBoundingClientRect()
                    .left
                : 0,
          }}
        >
          {/*
            We intentionally don't use the original
            button ref here because the original button
            is underneath the backdrop.

            This button visually replaces it.
          */}

          <button
            type="button"
            onClick={() =>
              setProfileOpen(false)
            }
            aria-label="Close profile menu"
            className="
              flex
              h-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/10
              px-2.5
              shadow-xl
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-xs
                font-semibold
              "
              style={{
                background:
                  "var(--accent-soft)",
                color:
                  "var(--accent)",
              }}
            >
              {avatarLetter}
            </div>

            <ChevronDown
              size={15}
              className="
                ml-2
                rotate-180
              "
              style={{
                color:
                  "var(--text-muted)",
              }}
            />
          </button>
        </motion.div>

        {/* ======================================================
            PROFILE POPUP
            ALWAYS BELOW THE M BUTTON
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -6,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -6,
            scale: 0.97,
          }}
          transition={{
            duration: 0.17,
            ease: "easeOut",
          }}
          className="
            fixed
            z-[230]
            w-[300px]
            overflow-hidden
            rounded-2xl
            border
          "
          style={{
            top:
              profilePosition.top,

            left:
              profilePosition.left,

            background:
              "var(--background-secondary)",

            borderColor:
              "var(--glass-border)",

            boxShadow:
              "0 28px 80px rgba(0,0,0,0.45)",
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* ==================================================
              USER INFORMATION
          ================================================== */}

          <div
            className="
              border-b
              px-4
              py-4
            "
            style={{
              borderColor:
                "var(--glass-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  text-sm
                  font-semibold
                "
                style={{
                  background:
                    "var(--accent-soft)",
                  color:
                    "var(--accent)",
                }}
              >
                {avatarLetter}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                  "
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                >
                  {userName}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                  "
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              ACCOUNT SETTINGS
          ================================================== */}

          <button
            type="button"
            onClick={() => {
              setProfileOpen(false);

              window.location.href =
                "/settings";
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-4
              text-left
              text-sm
              transition-colors
              hover:bg-white/5
            "
            style={{
              color:
                "var(--text-primary)",
            }}
          >
            <User
              size={18}
              strokeWidth={1.7}
              style={{
                color:
                  "var(--text-secondary)",
              }}
            />

            <span>
              Account Settings
            </span>
          </button>

          {/* ==================================================
              SIGN OUT
          ================================================== */}

          <button
            type="button"
            onClick={() => {
              setProfileOpen(false);

              signOut({
                callbackUrl:
                  "/login",
              });
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              border-t
              px-4
              py-4
              text-left
              text-sm
              transition-colors
              hover:bg-white/5
            "
            style={{
              borderColor:
                "var(--glass-border)",

              color:
                "var(--danger)",
            }}
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
            />

            <span>
              Sign Out
            </span>
          </button>
        </motion.div>
      </>,
      document.body
    );

  /*
   * ============================================================
   * NAVBAR
   * ============================================================
   */

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.header
            initial={{
              y: -100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -100,
              opacity: 0,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="
              fixed
              left-4
              right-4
              top-4
              z-50
              lg:left-[calc(18rem+2rem)]
              lg:right-8
            "
          >
            {/* ==================================================
                NAVBAR GLASS CONTAINER
            ================================================== */}

            <div
              className="
                glass
                relative
                overflow-visible
                rounded-2xl
              "
            >
              {/* =================================================
                  MAIN ROW
              ================================================= */}

              <div
                className="
                  flex
                  h-[68px]
                  w-full
                  items-center
                  gap-3
                  px-3
                  sm:px-4
                "
              >
                {/* ===============================================
                    MOBILE HAMBURGER

                    This replaces the J logo on mobile.
                =============================================== */}

                <button
                  type="button"
                  onClick={
                    toggleMobileSidebar
                  }
                  aria-label="Open navigation"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    transition-all
                    duration-200
                    hover:bg-white/10
                    lg:hidden
                  "
                  style={{
                    color:
                      "var(--text-secondary)",
                  }}
                >
                  <Menu
                    size={21}
                    strokeWidth={1.8}
                  />
                </button>

                {/* ===============================================
                    DESKTOP SEARCH
                =============================================== */}

                <div
                  className="
                    hidden
                    min-w-0
                    flex-1
                    items-center
                    lg:flex
                  "
                >
                  <GlobalSearch />
                </div>

                {/* ===============================================
                    RIGHT CONTROLS
                =============================================== */}

                <div
                  className="
                    ml-auto
                    flex
                    shrink-0
                    flex-nowrap
                    items-center
                    gap-2
                  "
                >
                  {/* Notifications */}
                  <NotificationBell />

                  {/* Theme */}
                  <ThemeSwitcher />

                  {/* Profile */}

                  <div className="shrink-0">
                    {/*
                      The actual profile button.

                      When popup opens, backdrop covers this
                      version and portal renders the sharp clone.
                    */}

                    {profileButton}
                  </div>
                </div>
              </div>

              {/* =================================================
                  MOBILE SEARCH

                  This stays inside the navbar only.
                  It is NOT part of the profile popup.
              ================================================= */}

              <div
                className="
                  px-3
                  pb-3
                  lg:hidden
                "
              >
                <GlobalSearch />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ========================================================
          PROFILE PORTAL

          IMPORTANT:
          This is outside AnimatePresence.
      ======================================================== */}

      {profilePortal}
    </>
  );
}