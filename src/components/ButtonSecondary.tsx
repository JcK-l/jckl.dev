export const ButtonSecondary = ({ text, href }: any) => (
  <a href={href}>
    <button
      className="hover:black-bg cursor-pointer rounded-xl border-2 border-black px-4 py-2 font-sans transition-colors delay-100 ease-in-out hover:bg-black hover:text-white"
      aria-label="secondary button"
    >
      {text}
    </button>
  </a>
);
