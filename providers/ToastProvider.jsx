"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
export default ToastProvider;