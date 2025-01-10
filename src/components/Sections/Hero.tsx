import { Face } from "../Face";

export const Hero = () => {
  return (
    <>
      <div className="relative flex flex-col items-center justify-between bg-white">

        <Face />

        <div className="relative z-10 w-full px-8 text-center">
          <h1 className="inline-block w-auto mb-8 h1-text text-secondary">
            I'm Joshua!
          </h1>
          <p className="mb-10 xl:mb-16 p-text text-primary">
            Welcome to my website! Cool that you found it something something{" "}
            <br />
            somethings. cool cool something something. Everthings nice thanks
            to you &lt;3
          </p>



          {/* <ButtonPrimary href="#about" text="See More"></ButtonPrimary> */}
          <a href={"#about"} className="relative w-10 h-10 xl:w-16 xl:h-16 inline-block cursor-pointer">
            <img className="animate-bounce" src={"/arrow-down-svgrepo-com.svg"} alt="Icon"  />
          </a>

        </div>
      </div>
    </>
  );
};
