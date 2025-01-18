import { Face } from "../Face";

const Hero = () => {
  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    const section = document.getElementById("starConstellation");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <div className="relative flex flex-col items-center justify-between">
        <Face />

        <div className="relative z-10 w-full px-8 text-center">
          <h1 className="h1-text mb-8 inline-block w-auto text-titleColor">
            I'm Joshua!
          </h1>
          <p className="p-text mb-10 xl:mb-16">
            Welcome to my website! Cool that you found it something something{" "}
            <br />
            somethings. cool cool something something. Everthings nice thanks to
            you &lt;3
          </p>

          {/* <ButtonPrimary href="#about" text="See More"></ButtonPrimary> */}
          <a
            onClick={scrollToSection}
            className="relative inline-block h-10 w-10 cursor-pointer xl:h-16 xl:w-16"
          >
            <svg
              className="animate-bounce"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 20L18 14M12 20L6 14M12 20L12 9.5M12 4V6.5"
                stroke="var(--color-title-color)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default Hero;
