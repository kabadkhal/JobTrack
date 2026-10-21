"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Sparkles,
  Building2,
  ShieldCheck,
  X,
} from "lucide-react";

import { useSession } from "next-auth/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Interviews",
    href: "/interviews",
    icon: CalendarDays,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Companies",
    href: "/companies",
    icon: Building2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  /*
   * Mount check for the mobile portal.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Listen for hamburger button from Navbar.
   */
  useEffect(() => {
    const handleToggle = () => {
      setMobileOpen((current) => !current);
    };

    const handleClose = () => {
      setMobileOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "jobtrack:toggle-sidebar",
      handleToggle
    );

    window.addEventListener(
      "jobtrack:close-sidebar",
      handleClose
    );

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "jobtrack:toggle-sidebar",
        handleToggle
      );

      window.removeEventListener(
        "jobtrack:close-sidebar",
        handleClose
      );

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /*
   * Close mobile sidebar when route changes.
   */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const isActiveRoute = (href: string) => {
    return href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);
  };

  /*
   * ============================================================
   * DESKTOP SIDEBAR
   * ============================================================
   */

  const desktopSidebar = (
    <aside
      className="
        glass
        fixed
        bottom-4
        left-4
        top-4
        z-50
        hidden
        w-64
        flex-col
        rounded-3xl
        p-4
        lg:flex
      "
      style={{
        position: "fixed",
      }}
    >
      {/* Logo */}

      <div className="px-5 pt-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
            "
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            <Sparkles
              size={17}
              strokeWidth={1.8}
            />
          </div>

          <span
            className="
              text-2xl
              font-semibold
              tracking-tight
            "
            style={{
              color: "var(--text-primary)",
            }}
          >
            JobTrack
          </span>
        </div>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Career command center
        </p>
      </div>

      {/* Navigation */}

      <nav
        className="
          mt-10
          flex-1
          space-y-2
          overflow-y-auto
        "
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className="
                flex
                items-center
                gap-4
                rounded-2xl
                px-4
                py-3
                transition-all
                duration-200
              "
              style={{
                background: isActive
                  ? "var(--accent-soft)"
                  : "transparent",

                color: isActive
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              }}
            >
              <Icon
                size={20}
                strokeWidth={1.7}
                style={{
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              />

              <span
                className="
                  text-[15px]
                  font-medium
                "
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Admin Dashboard */}

        {isAdmin && (
          <Link
            href="/admin"
            className="
              mt-4
              flex
              items-center
              gap-4
              rounded-2xl
              px-4
              py-3
              transition-all
              duration-200
            "
            style={{
              background: pathname.startsWith("/admin")
                ? "var(--accent-soft)"
                : "transparent",

              color: pathname.startsWith("/admin")
                ? "var(--text-primary)"
                : "var(--text-secondary)",
            }}
          >
            <ShieldCheck
              size={20}
              strokeWidth={1.7}
            />

            <div className="flex items-center gap-2">
              <span
                className="
                  text-[15px]
                  font-medium
                "
              >
                Admin Dashboard
              </span>

              <span
                className="
                  rounded-full
                  px-2
                  py-0.5
                  text-[10px]
                  font-semibold
                "
                style={{
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                ADMIN
              </span>
            </div>
          </Link>
        )}
      </nav>

      {/* Settings */}

      <div
        className="
          mt-4
          border-t
          pt-3
        "
        style={{
          borderColor: "var(--glass-border)",
        }}
      >
        <Link
          href="/settings"
          className="
            flex
            items-center
            gap-4
            rounded-2xl
            px-4
            py-3
            transition-all
            duration-200
          "
          style={{
            background: pathname.startsWith("/settings")
              ? "var(--accent-soft)"
              : "transparent",

            color: pathname.startsWith("/settings")
              ? "var(--text-primary)"
              : "var(--text-secondary)",
          }}
        >
          <Settings
            size={20}
            strokeWidth={1.7}
          />

          <span
            className="
              text-[15px]
              font-medium
            "
          >
            Settings
          </span>
        </Link>
      </div>
    </aside>
  );

  /*
   * ============================================================
   * MOBILE SIDEBAR
   * ============================================================
   */

  const mobileSidebar = (
    <>
      {/* ======================================================
          MOBILE BACKDROP
          
          Strong blur + dark overlay makes the sidebar readable.
          ====================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
          className="
            fixed
            inset-0
            z-[55]
            bg-[color:var(--overlay)]
            backdrop-blur-md
            lg:hidden
          "
        />
      )}

      {/* ======================================================
          MOBILE DRAWER
          ====================================================== */}

      <aside
        className={`
          glass
          fixed
          bottom-4
          left-4
          top-4
          z-[60]
          isolate
          flex
          w-[calc(100%-2rem)]
          max-w-[320px]
          flex-col
          rounded-3xl
          p-4
          lg:hidden
          transition-transform
          duration-300
          ease-out
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-[110%]"
          }
        `}
        style={{
          position: "fixed",
        }}
      >
        {/* Mobile Header */}

        <div
          className="
            flex
            items-start
            justify-between
            px-4
            pt-4
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                "
                style={{
                  background:
                    "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                <Sparkles
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <span
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
                style={{
                  color:
                    "var(--text-primary)",
                }}
              >
                JobTrack
              </span>
            </div>

            <p
              className="mt-2 text-xs"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Career command center
            </p>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close navigation"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              transition
              hover:bg-[color:var(--surface-hover)]
            "
            style={{
              borderColor:
                "var(--glass-border)",
              color:
                "var(--text-secondary)",
            }}
          >
            <X size={19} />
          </button>
        </div>

        {/* Mobile Navigation */}

        <nav
          className="
            mt-8
            flex-1
            space-y-2
            overflow-y-auto
            px-1
          "
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              isActiveRoute(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileSidebar}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  px-4
                  py-3.5
                  transition-all
                  duration-200
                "
                style={{
                  background: isActive
                    ? "var(--accent-soft)"
                    : "transparent",

                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={1.7}
                />

                <span
                  className="
                    text-[15px]
                    font-medium
                  "
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Admin */}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeMobileSidebar}
              className="
                mt-4
                flex
                items-center
                gap-4
                rounded-2xl
                px-4
                py-3.5
                transition-all
                duration-200
              "
              style={{
                background:
                  pathname.startsWith(
                    "/admin"
                  )
                    ? "var(--accent-soft)"
                    : "transparent",

                color:
                  pathname.startsWith(
                    "/admin"
                  )
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
              }}
            >
              <ShieldCheck
                size={20}
                strokeWidth={1.7}
              />

              <div className="flex items-center gap-2">
                <span
                  className="
                    text-[15px]
                    font-medium
                  "
                >
                  Admin Dashboard
                </span>

                <span
                  className="
                    rounded-full
                    px-2
                    py-0.5
                    text-[10px]
                    font-semibold
                  "
                  style={{
                    background:
                      "var(--accent-soft)",
                    color:
                      "var(--accent)",
                  }}
                >
                  ADMIN
                </span>
              </div>
            </Link>
          )}
        </nav>

        {/* Mobile Settings */}

        <div
          className="
            mt-4
            border-t
            pt-3
          "
          style={{
            borderColor:
              "var(--glass-border)",
          }}
        >
          <Link
            href="/settings"
            onClick={closeMobileSidebar}
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              px-4
              py-3.5
              transition-all
              duration-200
            "
            style={{
              background:
                pathname.startsWith(
                  "/settings"
                )
                  ? "var(--accent-soft)"
                  : "transparent",

              color:
                pathname.startsWith(
                  "/settings"
                )
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
            }}
          >
            <Settings
              size={20}
              strokeWidth={1.7}
            />

            <span
              className="
                text-[15px]
                font-medium
              "
            >
              Settings
            </span>
          </Link>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {desktopSidebar}

      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          mobileSidebar,
          document.body
        )}
    </>
  );
}