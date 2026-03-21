import { useState } from "react";
import { useStore } from "@nanostores/react";
import { projects } from "../../data/ProjectData";
import { ProjectText } from "../ProjectText";
import { $endingState, isEndingActive } from "../../stores/endingStore";

const Projects = () => {
  const endingState = useStore($endingState);
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? 0);
  const isNegativeEndingActive = isEndingActive("negative", endingState);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0];

  return (
    <div
      aria-hidden={isNegativeEndingActive}
      className={`page-margins relative bg-fgColor py-4 ${
        isNegativeEndingActive ? "pointer-events-none invisible" : ""
      }`}
    >
      <div className="z-10 w-full text-titleColor">
        <h1 className="h2-text mb-8 inline-block w-auto xl:mb-16">
          My Projects{endingState.selectedSentiment === "positive" ? "!" : ""}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div
          className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          role="tablist"
          aria-label="Project navigation"
        >
          {projects.map((project) => {
            const isActive = project.id === activeProject?.id;

            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`min-w-[14rem] rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-titleColor/20 bg-white/60 text-textColor hover:border-primary hover:text-titleColor"
                }`}
                onClick={() => setActiveProjectId(project.id)}
              >
                <span className="mb-1 block text-xs uppercase tracking-[0.2em] opacity-70">
                  {project.id.toString().padStart(2, "0")}
                </span>
                <span className="h5-text block font-heading font-bold">
                  {project.title}
                </span>
              </button>
            );
          })}
        </div>

        {!activeProject ? null : (
          <div className="border-titleColor/10 bg-white/40 rounded-[2rem] border p-5 md:p-8">
            <ProjectText
              title={activeProject.title}
              description={activeProject.description}
              imageFolder={activeProject.imageFolder}
              numberImages={activeProject.numberImages}
              githubLink={activeProject.githubLink}
              youtubeLink={activeProject.youtubeLink}
              demoLink={activeProject.demoLink}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
