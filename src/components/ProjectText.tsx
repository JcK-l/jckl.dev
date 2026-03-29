import { Carousel } from "./Carousel";
import { GitHub, Youtube, Code } from "../utility/icons";
import { ApplianceShell } from "./appliance/ApplianceShell";
import { ApplianceInsetPanel } from "./appliance/ApplianceInsetPanel";

interface ProjectTextProps {
  projectId: number;
  totalProjects: number;
  title: string;
  description: string;
  imageFolder?: string;
  numberImages?: number;
  githubLink?: string;
  youtubeLink?: string;
  demoLink?: string;
}

export const ProjectText = ({
  projectId,
  totalProjects,
  title,
  description,
  imageFolder,
  numberImages,
  githubLink,
  youtubeLink,
  demoLink,
}: ProjectTextProps) => {
  const links = [
    githubLink ? { href: githubLink, icon: <GitHub />, label: "repo" } : null,
    youtubeLink ? { href: youtubeLink, icon: <Youtube />, label: "video" } : null,
    demoLink ? { href: demoLink, icon: <Code />, label: "demo" } : null,
  ].filter((link): link is { href: string; icon: JSX.Element; label: string } =>
    Boolean(link)
  );
  const projectLabel = projectId.toString().padStart(2, "0");
  const totalLabel = totalProjects.toString().padStart(2, "0");

  return (
    <ApplianceShell className="w-full px-5 py-5 md:px-7" radius="1.75rem">
      <div
        className="appliance-panel-header"
        style={{ borderColor: "var(--color-appliance-shell-border)" }}
      >
        <div className="appliance-panel-heading">
          <p className="appliance-panel-eyebrow">Project Module {projectLabel}</p>
          <p className="appliance-header-subtitle">active build archive</p>
        </div>
        <div className="appliance-panel-chip-group">
          <span className="appliance-panel-chip">
            {projectLabel} / {totalLabel}
          </span>
          <span className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--color-extra2)", boxShadow: "0 0 10px var(--color-extra2)"}}
            />
            <span
              className="font-appliance text-[0.55rem] uppercase tracking-[0.2em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              Live
            </span>
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <ApplianceInsetPanel className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p
              className="font-appliance text-[0.56rem] uppercase tracking-[0.24em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              Preview Reel
            </p>
            <p
              className="font-appliance text-[0.56rem] uppercase tracking-[0.24em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              {numberImages
                ? `${numberImages.toString().padStart(2, "0")} frames`
                : "no frames"}
            </p>
          </div>

          {imageFolder && numberImages ? (
            <Carousel imageFolder={imageFolder} numberImages={numberImages} />
          ) : (
            <div
              className="flex min-h-[18rem] items-center justify-center rounded-[1rem] border px-6 py-10 text-center font-appliance text-[0.68rem] uppercase tracking-[0.18em]"
              style={{
                borderColor: "var(--color-appliance-panel-border)",
                color: "var(--color-appliance-label)",
              }}
            >
              Preview offline
            </div>
          )}
        </ApplianceInsetPanel>

        <div className="flex flex-col gap-4">
          <ApplianceInsetPanel className="px-4 py-4 sm:px-5 sm:py-5">
            <p
              className="font-appliance text-[0.56rem] uppercase tracking-[0.24em]"
              style={{ color: "var(--color-appliance-label)" }}
            >
              Project Overview
            </p>
            <h3
              className="mt-3 font-heading text-[1.55rem] font-extrabold leading-tight sm:text-[1.8rem]"
              style={{ color: "var(--color-appliance-label-soft)" }}
            >
              {title}
            </h3>
            <p
              className="mt-4 font-sans text-[1rem] leading-7"
              style={{ color: "var(--color-appliance-label-soft)" }}
            >
              {description}
            </p>
          </ApplianceInsetPanel>

          {!links.length ? null : (
            <div className="grid gap-2 sm:grid-cols-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block"
                >
                  <ApplianceInsetPanel className="h-full px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="font-appliance text-[0.58rem] uppercase tracking-[0.22em]"
                        style={{ color: "var(--color-appliance-label)" }}
                      >
                        {link.label}
                      </span>
                      <span
                        style={{ color: "var(--color-appliance-label-soft)" }}
                      >
                        {link.icon}
                      </span>
                    </div>
                  </ApplianceInsetPanel>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </ApplianceShell>
  );
};
