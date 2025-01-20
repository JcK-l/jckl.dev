import { projects } from "../../data/ProjectData";
import { PhoneProvider } from "../../context/PhoneContext";
import { Phone } from "../Phone";
import { ProjectText } from "../ProjectText";
import {
  $sentimentState,
  isBitSet,
  SentimentStateFlags,
} from "../../stores/sentimentStateStore";
import { useStore } from "@nanostores/react";

const Projects = () => {
  const sentimentState = useStore($sentimentState);
  return isBitSet(SentimentStateFlags.FLAG_NEGATIVE) ? (
    <div></div>
  ) : (
    <div className="page-margins my-4 relative bg-fgColor">
      <div className="z-10 w-full text-titleColor">
        <h1 className="h2-text mb-8 inline-block w-auto xl:mb-24">
          My Projects{isBitSet(SentimentStateFlags.FLAG_POSITIVE) ? '!' : ''}
        </h1>
      </div>
      <PhoneProvider>
        <div className="relative flex flex-col-reverse justify-between gap-2 md:flex-row ">
          <div className="relative flex w-full flex-col justify-center gap-2">
            {projects.map((project, index) => (
              <ProjectText
                title={project.title}
                description={project.description}
                showOnNumber={index}
                imageFolder={project.imageFolder}
                numberImages={project.numberImages}
                githubLink={project.githubLink}
              />
            ))}
            <ProjectText
              title={"No Project"}
              description="There is no project with this number!"
              showOnNumber={0}
              numbersExclude={Array.from(
                { length: projects.length + 1 },
                (_, i) => i - 1
              )}
            />
            <ProjectText
              title={"No Project"}
              description="There is no project with this number!"
              showOnNumber={-1}
            />
          </div>
          <Phone />
        </div>
      </PhoneProvider>
    </div>
  );
};

export default Projects;
