import { useEffect } from "react";

export const usePrintSignatures = () => {
  const adjustSignatures = () => {
    const signatures = document.getElementById("signatures");
    if (!signatures) return;

    const rect = signatures.getBoundingClientRect();
    const pageHeight = document.documentElement.clientHeight;

    const spaceBelow = pageHeight - rect.top;

    if (rect.height < spaceBelow) {
      const push = spaceBelow - rect.height;
      signatures.style.marginTop = `${push}px`;
    } else {
      signatures.style.breakBefore = "auto"; // 👈 importante: NO forzar page
    }
  };

  const resetStyles = () => {
    const signatures = document.getElementById("signatures");
    if (!signatures) return;

    signatures.style.marginTop = "";
    signatures.style.breakBefore = "";
  };

  useEffect(() => {
    window.addEventListener("beforeprint", adjustSignatures);
    window.addEventListener("afterprint", resetStyles);

    return () => {
      window.removeEventListener("beforeprint", adjustSignatures);
      window.removeEventListener("afterprint", resetStyles);
    };
  }, []);

  return adjustSignatures; // 👈 CLAVE
};
