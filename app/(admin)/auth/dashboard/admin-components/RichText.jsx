"use client";
/* Imports */
import React, { useRef, useMemo } from "react";
import dynamic from "next/dynamic";

/* Using dynamic import of Jodit component as it can't render in server side*/
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/*functions*/
export default function JoditRich({ setForm, form, field = "description" }) {
  const editor = useRef(null); //declared a null value

  /* The most important point*/
  const config = useMemo(
    //  Using of useMemo while make custom configuration is strictly recomended
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    []
  );

  /* function to handle the changes in the editor */
  const handleChange = (value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  return (
    <>
      <div>
        {/* This is the main initialization of the Jodit editor */}
        <JoditEditor
          ref={editor} //This is important
          value={form[field]} //This is important - now uses the field prop
          config={config} //Only use when you declare some custom configs
          onChange={handleChange} //handle the changes
          className="w-full h-[70%] mt-10 text-gray-800"
        />
        <style>{`
          .jodit-wysiwyg{height:300px !important}
          .jodit-status-bar{
            display:flex !important;
            align-items:center !important;
            flex-wrap:nowrap !important;
            gap:8px !important;
            overflow:hidden !important;
            white-space:nowrap !important;
            padding-left:0 !important;
            padding-right:6px !important;
          }
          .jodit-status-bar > *{
            flex:0 0 auto !important;
            white-space:nowrap !important;
          }
          .jodit-status-bar .jodit-status-bar__item:first-child{
            margin-left:-5px !important;
          }
          .jodit-status-bar,
          .jodit-status-bar *{
            font-size:10px !important;
            line-height:1.2 !important;
          }
        `}</style>
      </div>
    </>
  );
}
