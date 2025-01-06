import { useEffect } from "react";

export const ButtonPrimary = ({ text, href, margin }: any) => {
  return (
    <a href={href} style={{ margin }}>
      <button
        className={`cursor-pointer text-sm sm:text-base rounded-xl bg-secondary px-4 py-2 font-sans text-white transition-colors ease-in hover:bg-tertiary`}
        aria-label="primary button"
      >
        {text}
      </button>
    </a>
  );
};
