import { usePhoneContext } from "../hooks/useDataContext";
import { Carousel } from "./Carousel";

interface ProjectTextProps {
  title: string;
  description: string;
  showOnNumber: number; 
  numbersExclude?: number[]
  imageFolder?: string;
  numberImages?: number;
  githubLink?: string;
}

export const ProjectText = ({title, description, showOnNumber, numbersExclude, imageFolder, numberImages, githubLink}: ProjectTextProps) => {
  const { number, setNumber, timer, setTimer  } = usePhoneContext();

  if (numbersExclude && numbersExclude.length > 0) {
    if (numbersExclude.includes(number)) {
      return null;
    }
  } else if (showOnNumber !== number) {
    return null;
  } 



  if (showOnNumber == -1) {

    const formatDate = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = { hour: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    const currentDate = new Date();
    const pastDate = new Date(currentDate.getTime() - timer * 60 * 60 * 1000);

    const isSuccess = pastDate.getFullYear() === 2024;

    return (
      <div className="relative">
        <p>Current Date: {formatDate(currentDate)}</p>
        <p>Date {timer} hours ago: {formatDate(pastDate)}</p>
        {isSuccess ? (
          <p>Success: The past date is in the year 2024.</p>
        ) : (
          <p>Failure: The past date is not in the year 2024. It is in the year {pastDate.getFullYear()}.</p>
        )}
      </div>
    );
  }


  const anyLink = githubLink ? true : false;

  return (
    <div className="relative w-full">
      { imageFolder && numberImages ? <Carousel imageFolder={imageFolder} numberImages={numberImages} /> : null }
      <div className="relative flex justify-center items-center gap-3 mb-2">
        <h5 className="relative h5-text block font-bold text-titleColor">{title}</h5>
        { !anyLink ? null : (
          <svg
            width="2"
            viewBox="0 -1 2 26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="24"
              stroke="var(--color-text-color)"
              stroke-linecap="round"
              stroke-linejoin="round"
              />
          </svg>
        )}
        { !githubLink ? null : (
          <a href={githubLink} target="_blank" rel="noreferrer noopener">
            <img className="h-6 w-6" src={"/github-svgrepo-com.svg"} alt="Icon"  />
          </a>
        )}
      </div>
      <p className="p-text text-center w-full md:w-2/3 mx-auto mb-4">{description}</p>
    </div>
  );
}