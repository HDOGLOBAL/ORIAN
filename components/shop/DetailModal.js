"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const DetailModal = ({ children,form }) => {
  const modalRef = useRef(null);
  const router = useRouter();


  const onHide = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e) => {
      if (e.target === modalRef.current) {
        if (onHide) onHide();
      }
    },
    [onHide, modalRef]
  );

  useEffect(() => {
    if (!modalRef.current?.open) {
      modalRef.current?.showModal();
    }
  }, []);

  return createPortal(
    <dialog
      onClose={onHide}
      ref={modalRef}
      onClick={onClick}
      className={`shadow-teal-700 shadow-md border
         border-teal-600 flex flex-col p-2 
        rounded-md bg-white ${form ? 'sm:w-8/12 md:w-6/12':'sm:w-10/12 md:w-8/12'}`}

    >
      <span onClick={onHide} className="flex justify-end cursor-pointer">
        <Image
          src="/assets/xmark.svg"
          alt="close"
          width={30}
          height={30}
        />
      </span>
      {children}
    </dialog>,
    document.getElementById("modal-root-content")
  );
};

export default DetailModal;
