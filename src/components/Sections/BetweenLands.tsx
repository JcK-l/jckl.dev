import { SeparatorIn } from "../test";
import { SeparatorOut } from "../test2";
import type { ReactNode } from 'react';

interface BetweenLandsProps {
  children: ReactNode;
}
// {children}: BetweenLandsProps
export const BetweenLands = () => {
  return (
    <>
      <SeparatorIn />
      <div 
        className="relative bg-primary -z-20"
      >
        <img src={"/star-svgrepo-com.svg"} alt="Icon"/>
      </div>
      <SeparatorOut />
    </>
  );
};