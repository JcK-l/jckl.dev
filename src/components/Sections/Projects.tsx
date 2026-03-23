import { useState } from "react";
import { useStore } from "@nanostores/react";
import { projects } from "../../data/ProjectData";
import { ProjectText } from "../ProjectText";
import { $endingState, isEndingActive } from "../../stores/endingStore";
import { ApplianceShell } from "../appliance/ApplianceShell";
import { ApplianceTerminal } from "../appliance/ApplianceTerminal";

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

      <div className="flex flex-col gap-6">
        <ApplianceShell className="w-full px-5 py-5 md:px-7" radius="1.6rem">
          <div
            className="flex items-start justify-between gap-4 border-b pb-4"
            style={{ borderColor: "var(--color-appliance-shell-border)" }}
          >
            <div className="space-y-1.5">
              <p
                className="text-[0.56rem] uppercase tracking-[0.3em]"
                style={{ color: "var(--color-appliance-label)" }}
              >
                Project Selector
              </p>
              <p
                className="text-[0.86rem] tracking-[0.08em] sm:text-[0.98rem]"
                style={{ color: "var(--color-appliance-label-soft)" }}
              >
                appliance routing
              </p>
            </div>
            <p
              className="font-appliance text-[0.58rem] uppercase tracking-[0.22em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              {activeProject
                ? `${activeProject.id.toString().padStart(2, "0")} active`
                : "standby"}
            </p>
          </div>

          <div className="mt-5">
            <ApplianceTerminal
              className="px-4 py-4"
              bodyClassName="space-y-2"
              headerLabel="selector bus"
              headerMeta={`${projects.length.toString().padStart(2, "0")} projects online`}
            >
              <div
                className="grid gap-2 md:grid-cols-2 xl:grid-cols-3"
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
                      className="rounded-[0.95rem] border px-3 py-3 text-left transition-colors"
                      style={{
                        backgroundColor: isActive
                          ? "var(--color-appliance-screen-border)"
                          : "transparent",
                        borderColor: isActive
                          ? "var(--color-extra2)"
                          : "var(--color-appliance-screen-border)",
                        color: isActive
                          ? "var(--color-appliance-screen-text)"
                          : "var(--color-appliance-screen-muted)",
                      }}
                      onClick={() => setActiveProjectId(project.id)}
                    >
                      <span className="block text-[0.58rem] uppercase tracking-[0.24em]">
                        {isActive ? "> load" : "  load"}{" "}
                        {project.id.toString().padStart(2, "0")}
                      </span>
                      <span className="mt-2 block text-[0.8rem] tracking-[0.08em]">
                        {project.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ApplianceTerminal>
          </div>
        </ApplianceShell>

        {!activeProject ? null : (
          <ProjectText
            projectId={activeProject.id}
            totalProjects={projects.length}
            title={activeProject.title}
            description={activeProject.description}
            imageFolder={activeProject.imageFolder}
            numberImages={activeProject.numberImages}
            githubLink={activeProject.githubLink}
            youtubeLink={activeProject.youtubeLink}
            demoLink={activeProject.demoLink}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
