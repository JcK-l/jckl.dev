export const ButtonSecondary = ({ text, href, margin }: any) => (
  <a href={href} style={{ margin }}>
    <button
      className={`cursor-pointer rounded-xl  border-2 border-black px-4 py-2 font-sans transition-colors ease-in hover:bg-black hover:text-white`}
      aria-label="secondary button"
    >
      {text}
    </button>
  </a>
);
