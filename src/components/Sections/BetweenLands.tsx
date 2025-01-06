import { SeparatorIn } from "../test";
import { SeparatorOut } from "../test2";

export const BetweenLands = () => {
  return (
    <>
      <SeparatorIn />
      <div 
        className="relative"
      >
        <div className="-z-20 h-auto bg-primary w-full absolute inset-0">
        </div>
        <img src={"/star-svgrepo-com.svg"} alt="Icon"/>
      </div>
      <SeparatorOut />
    </>
  );
};