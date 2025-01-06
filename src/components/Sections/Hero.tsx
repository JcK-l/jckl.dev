import { Face } from "../Face";

export const Hero = () => {
  return (
    <>
      <div className="relative flex flex-col items-center justify-between ">

        <div className="h-full bg-white w-full absolute inset-0"></div>
        <Face />

        {/* <div className="absolute pointer-events-none z-50 inset-0 bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-[length:200%_auto] animate-gradient mix-blend-lighten"></div> */}
        <div className="relative z-10 w-full px-8 text-center">
          {/* <h1 className="inline-block w-auto bg-clip-text text-transparent mb-8 font-heading font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl bg-gradient-to-r from-someblue via-feldgrau to-chinarose bg-[length:200%_auto] animate-gradient"> */}
          <h1 className="inline-block w-auto mb-8 font-heading font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl text-secondary">
            I'm Joshua!
          </h1>
          <p className="mb-10 xl:mb-24 text-sm sm:text-base md:text-base lg:text-base xl:text-base 2xl:text-lg text-primary">
            Welcome to my website! Cool that you found it something something{" "}
            <br />
            somethings. cool cool something something. Everthings nice thanks
            to you &lt;3
          </p>



          {/* <ButtonPrimary href="#about" text="See More"></ButtonPrimary> */}
          <a href={"#about"} className="relative w-10 h-10 xl:w-16 xl:h-16 inline-block cursor-pointer">
            <img src={"/arrow-down-svgrepo-com.svg"} alt="Icon"  />
          </a>

        </div>
      </div>
    </>
  );
};
