"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PdfMaker = ({ order }) => {
  const { name, totalPrice, orderedAt } = order;
  const pdfRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Get the image dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Calculate the dimensions of the image that fits within A4 while maintaining the aspect ratio
      const imgAspect = imgWidth / imgHeight;
      const pdfAspect = pdfWidth / pdfHeight;

      let width, height;
      if (imgAspect > pdfAspect) {
        // Image is wider in proportion to its height than A4
        width = pdfWidth;
        height = pdfWidth / imgAspect;
      } else {
        // Image is taller in proportion to its width than A4
        width = pdfHeight * imgAspect;
        height = pdfHeight;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Center the image on the PDF
      const xOffset = (pdfWidth - width) / 2;
      const yOffset = (pdfHeight - height) / 2;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, width, height);
      pdf.save("order-confirmation.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Generating PDF..." : "Download PDF"}
      </button>
      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          left: "-9999px",
          padding: 20,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Arial, sans-serif",
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: "0", color: "#333", fontSize: "20px" }}>
            Order Confirmation
          </h2>
          <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
            Order ID: 891y37812y3128
          </p>
        </div>
        <div style={{ fontSize: "14px" }}>
          <p style={{ margin: "0" }}>Customer Name: {name}</p>
          <p style={{ margin: "5px 0" }}>
            Order Date/Time: {new Date(orderedAt).toLocaleString()}
          </p>
        </div>
        <div
          style={{ marginTop: "20px", textAlign: "right", fontSize: "16px" }}
        >
          <p style={{ margin: "0" }}>Total: ${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PdfMaker;
