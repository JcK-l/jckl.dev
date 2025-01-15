import { useRef, useEffect, useState } from "react";
import { FlyingMan } from "../FlyingMan";
import { Puzzle } from "../Puzzle";
import { PuzzleProvider } from "../../context/PuzzleContext";
import { AboutText } from "../AboutText";



const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsWide(true);
    } else {
      setIsWide(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>
      {/* <FlyingMan ref={ref} /> */}
      <div 
        className="relative page-margins"
        ref={ref}
      >
        {/* <div className="h-auto bg-white w-full absolute inset-0"></div> */}
        <div className="z-10 w-full">
          <h1 className="inline-block mb-8 xl:mb-24 h2-text text-secondary">
            About Me!
          </h1>
        </div>

        <PuzzleProvider>
          <div className="relative flex justify-between flex-col-reverse md:flex-row gap-2 mb-1">
            <div className="relative flex flex-col w-full gap-2">
              <AboutText text="" showRange={{min:0, max:3}} remove={true} />
              <AboutText 
                text={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare arcu est, nec lobortis purus placerat sed. Ut sed dolor elit. Integer quis est nisl. Curabitur semper lectus sit amet dolor consequat, pellentesque tempor justo venenatis. Nunc ut massa ac tellus aliquet sollicitudin. Mauris erat lorem, convallis quis sapien id, pharetra venenatis mauris. Nunc quis magna justo."} 
                showRange={{min:4, max:7}} remove={!isWide} />
              <AboutText 
                text="In dictum augue efficitur nisi malesuada, nec hendrerit ipsum accumsan. Maecenas volutpat malesuada ante, quis consectetur libero molestie vitae. Integer sit amet mauris rhoncus, pharetra nisi nec, ultricies lacus. Vivamus quis malesuada elit. Aenean scelerisque lorem sed lorem porttitor hendrerit. Maecenas sit amet dictum urna. Nam mollis pharetra rutrum. Sed pharetra ultrices lorem, vitae finibus ex condimentum aliquam." 
                showRange={{min:8, max:11}} remove={!isWide} />
              <AboutText 
                text="Suspendisse potenti. Sed in finibus leo, nec hendrerit metus. Integer eleifend interdum elit a ultrices. Maecenas tincidunt sed erat quis aliquet. Pellentesque ac laoreet dolor. Morbi a tortor bibendum, maximus metus non, semper elit. Cras eu suscipit tortor. Aenean faucibus, mauris ut fringilla porttitor, ipsum erat ultricies lacus, et dapibus mauris urna eu libero. Nulla sem ipsum, pellentesque in tincidunt sed, convallis vel justo. Aenean ultrices dapibus diam, sit amet posuere magna posuere ac. Vestibulum eu odio eget neque varius porttitor. Nullam laoreet viverra leo, eu faucibus neque eleifend nec. Sed vel pulvinar dui. Maecenas congue odio eu odio pellentesque, non dapibus purus suscipit. Aenean rhoncus malesuada commodo." 
                showRange={{min:12, max:16}} remove={!isWide} />
            </div>
            <Puzzle />
          </div>
        </PuzzleProvider>
      </div>
    </>
  );
};

export default About;