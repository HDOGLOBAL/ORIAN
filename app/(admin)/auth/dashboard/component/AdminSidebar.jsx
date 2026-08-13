"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

// Import React Icons
import {
  FiPlusCircle,
  FiTruck,
  FiSettings,
  FiPieChart,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiShoppingCart as FiCart,
  FiLayers,
  FiShoppingBag,
} from "react-icons/fi";

// Import additional icons for variety
import { RiAdminLine, RiProductHuntLine, RiAuctionLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { toast } from "react-toastify";
import { createManualOrder, createPendingOrder } from "@/database/queries";
import CompanyOrderModal from "./CompanyOrderModal";
import PendingOrderModal from "./PendingOrderModal";
import Logout from "./Logout";

export default function AdminSidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [openSubmenus, setOpenSubmenus] = useState({});
  const pathname = usePathname();
  const router = useRouter();

  // Auto-close mobile menu when route changes
  useEffect(() => {
    setCollapseShow("hidden");
  }, [pathname]);

  const toggleSubmenu = (menuName) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const [showCompanyOrder, setShowCompanyOrder] = useState(false);
  const [savingCompanyOrder, setSavingCompanyOrder] = useState(false);

  const [showPendingOrder, setShowPendingOrder] = useState(false);
  const [savingPendingOrder, setSavingPendingOrder] = useState(false);

  const submitPendingOrder = async (formData) => {
    setSavingPendingOrder(true);
    try {
      const result = await createPendingOrder(formData);
      if (result && result.success) {
        toast.success("Pending order created successfully!", {
          position: "bottom-right",
        });
        setShowPendingOrder(false);
        router.push("/auth/dashboard/pending-orders");
      } else {
        toast.error(result?.error || "Failed to create pending order", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Create pending order error:", err);
      toast.error("Failed to create pending order", {
        position: "bottom-right",
      });
    } finally {
      setSavingPendingOrder(false);
    }
  };

  const submitCompanyOrder = async (formData) => {
    setSavingCompanyOrder(true);
    try {
      const result = await createManualOrder(formData);
      if (result && result.success) {
        toast.success("Company order created successfully!", {
          position: "bottom-right",
        });
        setShowCompanyOrder(false);
        router.push("/auth/dashboard/company-orders");
      } else {
        toast.error(result?.error || "Failed to create company order", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error("Create manual order error:", err);
      toast.error("Failed to create company order", {
        position: "bottom-right",
      });
    } finally {
      setSavingCompanyOrder(false);
    }
  };

  // Check if a link is active
  const isActiveLink = (href) => {
    if (href === "/auth/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Menu items configuration for better maintainability
  const menuItems = {
    auth: {
      title: "General Panel",
      items: [
        {
          href: "/auth/dashboard",
          label: "Dashboard",
          icon: <FiPieChart className="text-lg" />,
          color: "text-blue-500",
        },
      ],
    },
    products: {
      title: "Product Management",
      items: [
        {
          href: "/auth/dashboard/products",
          label: "All Products",
          icon: <RiProductHuntLine className="text-lg" />,
          color: "text-green-500",
        },
        {
          href: "/auth/dashboard/add-product",
          label: "Add New Product",
          icon: <FiPlusCircle className="text-lg" />,
          color: "text-teal-500",
        },
        {
          href: "/auth/dashboard/orders",
          label: "Orders",
          icon: <RiAuctionLine className="text-lg" />,
          color: "text-orange-500",
        },
        {
          label: "Categories",
          icon: <FiLayers className="text-lg" />,
          color: "text-pink-500",
          submenu: [
            { href: "/auth/dashboard/categories", label: "All Categories" },
            { href: "/auth/dashboard/add-category", label: "Add Category" },
            { href: "/auth/dashboard/sub-categories", label: "Sub-Categories" },
          ],
        },

        {
          label: "Manufacturers",
          icon: <FiTruck className="text-lg" />,
          color: "text-yellow-500",
          submenu: [
            {
              href: "/auth/dashboard/manufacturers",
              label: "All Manufacturers",
            },
            {
              href: "/auth/dashboard/add-manufacturer",
              label: "Add Manufacturer",
            },
          ],
        },
        {
          href: "/auth/dashboard/carts",
          label: "Shopping Carts",
          icon: <FiCart className="text-lg" />,
          color: "text-red-500",
        },
         {
          href: "/support",
          label: "Support Chat",
          icon: <BiSupport className="text-lg" />,
          color: "text-red-500",
        },
        {
          href: "/auth/dashboard/company-orders",
          label: "Company Orders",
          icon: <FiShoppingBag className="text-lg" />,
          color: "text-teal-500",
        },
        {
          href: "/auth/dashboard/pending-orders",
          label: "Pending Orders",
          icon: <FiShoppingBag className="text-lg" />,
          color: "text-amber-500",
        },
        {
          action: "companyOrder",
          label: "New Company Order",
          icon: <FiPlusCircle className="text-lg" />,
          color: "text-emerald-500",
        },
        {
          action: "pendingOrder",
          label: "New Pending Order",
          icon: <FiPlusCircle className="text-lg" />,
          color: "text-amber-500",
        },
      ],
    },
    other: {
      title: "Admin Panel",
      items: [
        {
          href: "/auth/dashboard/admins",
          label: "Admins",
          icon: <RiAdminLine className="text-lg" />,
          color: "text-purple-500",
        },
        {
          href: "#",
          label: <Logout />,
          icon: <FiLogOut className="text-lg" />,
          color: "text-red-400",
          isLogout: true,
        },
      ],
    },
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Example:
    // localStorage.removeItem('authToken');
    // router.push('/login');
  };

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-lg bg-white flex flex-wrap items-center justify-between relative w-full md:w-64 z-30 py-3 px-4 md:py-4 md:px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-gray-600 opacity-70 md:hidden px-3 py-1 text-2xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            aria-label="Open menu"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <FiMenu />
          </button>

          {/* Brand */}
          <Link
            href="/auth/dashboard"
            className="text-blue-600 md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-base md:text-xl font-bold uppercase p-3 md:p-4 px-0"
          >
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-md mr-2 text-white">
                <FiSettings className="text-lg" />
              </span>
              HDOTRADE Admin
            </div>
          </Link>

          {/* Mobile user menu (hidden for now) */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              {/* <NotificationDropdown /> */}
            </li>
            <li className="inline-block relative">{/* <UserDropdown /> */}</li>
          </ul>

          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-full left-0 right-0 z-40 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-4rem)] items-stretch flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    href="/auth/dashboard"
                    className="md:block text-left md:pb-2 text-blue-600 mr-0 inline-block whitespace-nowrap text-sm uppercase p-4 px-0"
                  >
                    HDOTRADE Admin
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-gray-600 opacity-70 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            {Object.entries(menuItems).map(([key, section]) => (
              <div key={key}>
                {key !== "auth" && <hr className="my-4 border-gray-200" />}

                {/* Heading */}
                <h6 className="md:min-w-full text-gray-500 text-xs uppercase font-semibold tracking-wider block pt-1 pb-2 no-underline">
                  {section.title}
                </h6>

                {/* Navigation Items */}
                <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                  {section.items.map((item, index) => (
                    <li key={index} className="items-center">
                      {item.href && !item.isLogout ? (
                        // Regular link item
                        <Link
                          href={item.href}
                          className={`text-sm py-3 flex items-center gap-3 px-4 rounded-lg transition-colors duration-200 group ${
                            isActiveLink(item.href)
                              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium"
                              : "text-gray-600 hover:bg-gray-100 hover:text-blue-500"
                          }`}
                        >
                          <span
                            className={`${item.color} ${
                              isActiveLink(item.href)
                                ? "text-blue-600"
                                : "group-hover:text-blue-500"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                          {isActiveLink(item.href) && (
                            <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </Link>
                      ) : item.isLogout ? (
                        // Logout button
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-sm py-3 flex items-center gap-3 px-4 rounded-lg transition-colors duration-200 group text-gray-600 hover:bg-red-50 hover:text-red-500"
                        >
                          <span className="text-red-400 group-hover:text-red-500">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ) : item.action === "companyOrder" ? (
                        // Company Order button
                        <button
                          onClick={() => setShowCompanyOrder(true)}
                          className="w-full text-left text-sm py-3 flex items-center gap-3 px-4 rounded-lg transition-colors duration-200 group text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <span className="text-teal-500 group-hover:text-emerald-600">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ) : item.action === "pendingOrder" ? (
                        // Pending Order button
                        <button
                          onClick={() => setShowPendingOrder(true)}
                          className="w-full text-left text-sm py-3 flex items-center gap-3 px-4 rounded-lg transition-colors duration-200 group text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <span className="text-amber-500 group-hover:text-amber-600">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        // Submenu item
                        <div>
                          <button
                            onClick={() => toggleSubmenu(item.label)}
                            className={`w-full text-left text-sm py-3 flex items-center justify-between gap-3 px-4 rounded-lg transition-colors duration-200 group ${
                              item.submenu.some((subItem) =>
                                isActiveLink(subItem.href)
                              )
                                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-blue-500"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`${item.color} group-hover:text-blue-500`}
                              >
                                {item.icon}
                              </span>
                              <span>{item.label}</span>
                            </div>
                            <FiChevronDown
                              className={`transform transition-transform ${
                                openSubmenus[item.label] ? "rotate-180" : ""
                              } text-gray-400`}
                            />
                          </button>

                          {/* Submenu items */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              openSubmenus[item.label] ? "max-h-96" : "max-h-0"
                            }`}
                          >
                            <ul className="pl-11 mt-1 space-y-1">
                              {item.submenu.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                    href={subItem.href}
                                    className={`text-sm py-2 flex items-center gap-2 px-3 rounded-lg transition-colors duration-200 ${
                                      isActiveLink(subItem.href)
                                        ? "text-blue-600 font-medium bg-blue-50"
                                        : "text-gray-500 hover:text-blue-500 hover:bg-gray-50"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isActiveLink(subItem.href)
                                          ? "bg-blue-600"
                                          : "bg-gray-300"
                                      }`}
                                    ></span>
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {showCompanyOrder && (
        <CompanyOrderModal
          saving={savingCompanyOrder}
          onClose={() => setShowCompanyOrder(false)}
          onSubmit={submitCompanyOrder}
        />
      )}

      {showPendingOrder && (
        <PendingOrderModal
          saving={savingPendingOrder}
          onClose={() => setShowPendingOrder(false)}
          onSubmit={submitPendingOrder}
        />
      )}
    </>
  );
}
