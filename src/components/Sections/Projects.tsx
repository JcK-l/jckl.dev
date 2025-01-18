// import { Carousel } from "../Carousel";
import { projects } from '../../data/ProjectData';
import { PhoneProvider } from "../../context/PhoneContext";
import { Phone } from "../Phone";
import { ProjectText } from "../ProjectText";

const Projects = () => {
  return (
    <div className="relative page-margins bg-fgColor">
    <div className="z-10 w-full text-titleColor">
      <h1 className="inline-block w-auto mb-8 xl:mb-24 h2-text">
        My Projects!
      </h1>
    </div>
    <PhoneProvider>
      <div className="relative flex justify-between flex-col md:flex-row gap-2 ">
        <div className="relative flex flex-col justify-start w-full gap-2">
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
          <ProjectText title={"No Project"} description="There is no project with this number!" showOnNumber={0} numbersExclude={Array.from({length: projects.length + 1}, (_, i) => i - 1)} />
          <ProjectText title={"No Project"} description="There is no project with this number!" showOnNumber={-1} />
        </div>
        <Phone />
      </div>
    </PhoneProvider>
    </div>
  );
};

export default Projects;