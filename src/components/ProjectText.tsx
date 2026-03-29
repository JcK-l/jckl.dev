import { type ComponentType, type ReactNode, type TouchEventHandler } from "react";
import { Carousel } from "./Carousel";
import { GitHub, Youtube, Code } from "../utility/icons";
import { ApplianceShell } from "./appliance/ApplianceShell";
import { ApplianceInsetPanel } from "./appliance/ApplianceInsetPanel";

interface ProjectTextProps {
  className?: string;
  mobileNavigator?: ReactNode;
  onMobileOverviewTouchStart?: TouchEventHandler<HTMLDivElement>;
  onMobileOverviewTouchEnd?: TouchEventHandler<HTMLDivElement>;
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
  className = "",
  mobileNavigator = null,
  onMobileOverviewTouchStart,
  onMobileOverviewTouchEnd,
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
    githubLink ? { href: githubLink, icon: GitHub, label: "repo" } : null,
    youtubeLink ? { href: youtubeLink, icon: Youtube, label: "video" } : null,
    demoLink ? { href: demoLink, icon: Code, label: "demo" } : null,
  ].filter((link): link is {
    href: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
  } =>
    Boolean(link)
  );
  const projectLabel = projectId.toString().padStart(2, "0");
  const totalLabel = totalProjects.toString().padStart(2, "0");

  return (
    <ApplianceShell
      className={`w-full px-5 py-5 md:px-7 ${className}`}
      radius="1.75rem"
    >
      <div className="flex flex-col">
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

        <div className={`${mobileNavigator ? "mt-1" : "mt-5"} flex flex-1 flex-col gap-3`}>
          <ApplianceInsetPanel className="px-4 py-4 sm:px-5 sm:py-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p
                className="font-appliance text-[0.56rem] uppercase tracking-[0.24em]"
                style={{ color: "var(--color-appliance-label-soft)" }}
              >
                Preview Reel
              </p>
              <p
                className="font-appliance text-[0.56rem] uppercase tracking-[0.24em]"
                style={{ color: "var(--color-appliance-label-soft)" }}
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
                className="flex min-h-[18rem] items-center justify-center rounded-[1rem] border px-6 py-10 text-center font-appliance text-[0.68rem] uppercase tracking-[0.18em] lg:min-h-[20rem]"
                style={{
                  borderColor: "var(--color-appliance-panel-border)",
                  color: "var(--color-appliance-label)",
                }}
              >
                Preview offline
              </div>
            )}
          </ApplianceInsetPanel>

          <div
            onTouchStart={onMobileOverviewTouchStart}
            onTouchEnd={onMobileOverviewTouchEnd}
          >
            <ApplianceInsetPanel className="flex flex-col px-4 py-4 sm:px-5 sm:py-5 md:min-h-[12.75rem]">
              <p
                className="font-appliance text-[0.56rem] uppercase tracking-[0.24em]"
                style={{ color: "var(--color-appliance-label-soft)" }}
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
                className="mt-4 font-sans text-[1rem] leading-7 md:min-h-[6.75rem]"
                style={{ color: "var(--color-appliance-copy)" }}
              >
                {description}
              </p>

              {mobileNavigator ? <div className="mt-5">{mobileNavigator}</div> : null}
            </ApplianceInsetPanel>
          </div>

          {!links.length ? null : (
            <div className="flex flex-wrap gap-2 pt-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex whitespace-nowrap no-underline"
                >
                  <ApplianceInsetPanel
                    as="span"
                    className="inline-flex items-center whitespace-nowrap px-2.5 py-1.5 transition-colors duration-150"
                    patternOpacity={0.48}
                  >
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="inline-flex text-[0.8rem] opacity-80 transition-[filter,opacity] duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:[filter:drop-shadow(0_0_6px_var(--color-tertiary))] group-focus-visible:[filter:drop-shadow(0_0_6px_var(--color-tertiary))]"
                        style={{ filter: "drop-shadow(0 0 0 transparent)" }}
                      >
                        <link.icon className="text-[var(--color-appliance-copy)] [&_path]:transition-colors [&_path]:duration-150" />
                      </span>
                      <span
                        className="font-appliance text-[0.58rem] uppercase tracking-[0.16em] text-[var(--color-appliance-copy)] transition-colors duration-150 group-hover:text-[var(--color-tertiary)] group-focus-visible:text-[var(--color-tertiary)]"
                      >
                        {link.label}
                      </span>
                    </span>
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
