import { usePhoneContext } from "../hooks/useDataContext";
import { Carousel } from "./Carousel";
import { GitHub } from "../utility/icons";
import type { ReactNode } from "react";
// <div className="relative w-full">
//   {renderItem()}
// </div>

interface ProjectTextProps {
  title: string;
  description: string;
  showOnNumbers: number[];
  numbersExclude?: number[];
  imageFolder?: string;
  numberImages?: number;
  githubLink?: string;
  renderItem?: () => ReactNode;
}

export const ProjectText = ({
  title,
  description,
  showOnNumbers,
  numbersExclude,
  imageFolder,
  numberImages,
  githubLink,
  renderItem,
}: ProjectTextProps) => {
  const { number, setNumber, timer, setTimer } = usePhoneContext();

  if (numbersExclude && numbersExclude.length > 0) {
    if (numbersExclude.includes(number)) {
      return null;
    }
  } else if (!showOnNumbers.includes(number)) {
    return null;
  }

  const anyLink = githubLink ? true : false;

  return renderItem ? (
    renderItem()
  ) : (
    <div className="relative my-auto w-full sm:h-auto">
      {imageFolder && numberImages ? (
        <Carousel imageFolder={imageFolder} numberImages={numberImages} />
      ) : null}
      <div className="relative mb-2 flex items-center justify-center gap-3">
        <h5 className="h5-text relative block font-bold text-titleColor">
          {title}
        </h5>
        {!anyLink ? null : (
          <svg width="2" viewBox="0 -1 2 26" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="24"
              stroke="var(--color-text-color)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {!githubLink ? null : (
          <a href={githubLink} target="_blank" rel="noreferrer noopener">
            <GitHub />
          </a>
        )}
      </div>
      <p className="p-text mx-auto mb-4 w-full text-center md:w-2/3">
        {description}
      </p>
    </div>
  );
};
