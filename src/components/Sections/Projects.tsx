import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent,
} from "react";
import { useStore } from "@nanostores/react";
import { projects, type Project } from "../../data/ProjectData";
import { ProjectText } from "../ProjectText";
import { $endingState, isEndingActive } from "../../stores/endingStore";
import { ApplianceShell } from "../appliance/ApplianceShell";
import { ApplianceTerminal } from "../appliance/ApplianceTerminal";

const DESKTOP_BREAKPOINT_PX = 1280;
const DESKTOP_PROJECT_CARD_HEIGHT_PX = 76;
const DESKTOP_PROJECT_CARD_GAP_PX = 8;
const MOBILE_SWIPE_THRESHOLD_PX = 32;

type SelectorBank = {
  size: number;
  startIndex: number;
};

type TouchPoint = {
  x: number;
  y: number;
};

const browserSupportsPointerEvents = () => {
  return typeof window !== "undefined" && window.PointerEvent != null;
};

const formatProjectId = (projectId: number) => {
  return projectId.toString().padStart(2, "0");
};

const areSelectorBanksEqual = (
  currentBanks: SelectorBank[],
  nextBanks: SelectorBank[]
) => {
  return (
    currentBanks.length === nextBanks.length &&
    currentBanks.every((bank, index) => {
      const nextBank = nextBanks[index];

      return (
        bank.startIndex === nextBank?.startIndex && bank.size === nextBank?.size
      );
    })
  );
};

const buildSelectorBanks = ({
  pageSize,
  totalProjects,
}: {
  pageSize: number;
  totalProjects: number;
}) => {
  const clampedPageSize = Math.max(1, Math.min(totalProjects, pageSize));
  const banks: SelectorBank[] = [];

  for (let startIndex = 0; startIndex < totalProjects; startIndex += clampedPageSize) {
    banks.push({
      size: Math.min(clampedPageSize, totalProjects - startIndex),
      startIndex,
    });
  }

  return banks;
};

export const getMobileProjectSwipeDirection = ({
  touchEnd,
  touchStart,
}: {
  touchEnd: TouchPoint | null;
  touchStart: TouchPoint | null;
}) => {
  if (touchStart == null || touchEnd == null) {
    return 0;
  }

  const deltaX = touchStart.x - touchEnd.x;
  const deltaY = Math.abs(touchStart.y - touchEnd.y);

  if (
    Math.abs(deltaX) < MOBILE_SWIPE_THRESHOLD_PX ||
    Math.abs(deltaX) <= deltaY
  ) {
    return 0;
  }

  return deltaX > 0 ? 1 : -1;
};

const findSelectorBankIndex = ({
  banks,
  projectIndex,
}: {
  banks: SelectorBank[];
  projectIndex: number;
}) => {
  return banks.findIndex((bank) => {
    return (
      projectIndex >= bank.startIndex &&
      projectIndex < bank.startIndex + bank.size
    );
  });
};

const getSelectorViewportHeight = (selectorViewport: HTMLDivElement | null) => {
  if (selectorViewport == null) {
    return 0;
  }

  if (selectorViewport.clientHeight > 0) {
    return selectorViewport.clientHeight;
  }

  return selectorViewport.getBoundingClientRect().height;
};

const getProjectCardHeight = (selectorList: HTMLDivElement | null) => {
  const measuredProjectCardHeight =
    selectorList
      ?.querySelector<HTMLElement>('[role="tab"]')
      ?.getBoundingClientRect().height ?? 0;

  return measuredProjectCardHeight > 0
    ? measuredProjectCardHeight
    : DESKTOP_PROJECT_CARD_HEIGHT_PX;
};

const getProjectCardGap = (selectorList: HTMLDivElement | null) => {
  const measuredRowGap = selectorList
    ? Number.parseFloat(window.getComputedStyle(selectorList).rowGap)
    : Number.NaN;

  return Number.isFinite(measuredRowGap)
    ? measuredRowGap
    : DESKTOP_PROJECT_CARD_GAP_PX;
};

const getFittedSelectorPageSize = ({
  selectorList,
  totalProjects,
  viewportHeight,
}: {
  selectorList: HTMLDivElement | null;
  totalProjects: number;
  viewportHeight: number;
}) => {
  const projectCardHeight = getProjectCardHeight(selectorList);
  const projectCardGap = getProjectCardGap(selectorList);
  const fittedProjects = Math.floor(
    (Math.max(0, viewportHeight - 4) + projectCardGap) /
      (projectCardHeight + projectCardGap)
  );

  return Math.max(1, Math.min(totalProjects, fittedProjects));
};

const Projects = () => {
  const endingState = useStore($endingState);
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? 0);
  const [selectorBanks, setSelectorBanks] = useState<SelectorBank[]>(() =>
    buildSelectorBanks({ pageSize: projects.length, totalProjects: projects.length })
  );
  const [selectorPage, setSelectorPage] = useState(0);
  const [selectorShellHeight, setSelectorShellHeight] = useState<number | null>(
    null
  );
  const [isDesktopLayout, setIsDesktopLayout] = useState(true);
  const selectorViewportRef = useRef<HTMLDivElement>(null);
  const selectorListRef = useRef<HTMLDivElement>(null);
  const archiveModuleRef = useRef<HTMLDivElement>(null);
  const mobileActivePointerIdRef = useRef<number | null>(null);
  const mobileLatestTouchRef = useRef<TouchPoint | null>(null);
  const mobileTouchStartRef = useRef<TouchPoint | null>(null);
  const isNegativeEndingActive = isEndingActive("negative", endingState);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0];
  const activeProjectIndex = projects.findIndex((project) => {
    return project.id === activeProject?.id;
  });
  const totalPages = selectorBanks.length;
  const currentSelectorBank =
    selectorBanks[selectorPage] ??
    selectorBanks.at(-1) ?? {
      size: projects.length,
      startIndex: 0,
    };
  const visibleProjects = projects.slice(
    currentSelectorBank.startIndex,
    currentSelectorBank.startIndex + currentSelectorBank.size
  );
  const activeProjectLabel = activeProject
    ? formatProjectId(activeProject.id)
    : "00";
  const pageLabel = `${(selectorPage + 1).toString().padStart(2, "0")} / ${totalPages
    .toString()
    .padStart(2, "0")}`;
  const visibleRangeLabel = `${formatProjectId(visibleProjects[0]?.id ?? 0)} - ${formatProjectId(
    visibleProjects.at(-1)?.id ?? 0
  )}`;
  const hasPagination = totalPages > 1;

  const stepProjectSelection = (direction: -1 | 1) => {
    const nextProject = projects[activeProjectIndex + direction];

    if (nextProject) {
      setActiveProjectId(nextProject.id);
    }
  };

  const beginMobileProjectSwipe = (point: TouchPoint) => {
    mobileTouchStartRef.current = {
      x: point.x,
      y: point.y,
    };
    mobileLatestTouchRef.current = point;
  };

  const updateMobileProjectSwipe = (point: TouchPoint) => {
    mobileLatestTouchRef.current = point;
  };

  const resetMobileProjectSwipe = () => {
    mobileActivePointerIdRef.current = null;
    mobileLatestTouchRef.current = null;
    mobileTouchStartRef.current = null;
  };

  const completeMobileProjectSwipe = (touchEnd: TouchPoint | null) => {
    const swipeDirection = getMobileProjectSwipeDirection({
      touchEnd: touchEnd ?? mobileLatestTouchRef.current,
      touchStart: mobileTouchStartRef.current,
    });

    resetMobileProjectSwipe();

    if (swipeDirection === 0) {
      return;
    }

    stepProjectSelection(swipeDirection);
  };

  const handleMobileProjectPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === "mouse") {
      return;
    }

    mobileActivePointerIdRef.current = event.pointerId;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some mobile browsers can refuse capture during scroll negotiation.
    }

    beginMobileProjectSwipe({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMobileProjectPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (mobileActivePointerIdRef.current !== event.pointerId) {
      return;
    }

    updateMobileProjectSwipe({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const releaseMobileProjectPointer = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore capture release issues on browsers without full support.
    }
  };

  const handleMobileProjectPointerUp = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (mobileActivePointerIdRef.current !== event.pointerId) {
      return;
    }

    completeMobileProjectSwipe({
      x: event.clientX,
      y: event.clientY,
    });
    releaseMobileProjectPointer(event);
  };

  const handleMobileProjectPointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (mobileActivePointerIdRef.current !== event.pointerId) {
      return;
    }

    completeMobileProjectSwipe(null);
    releaseMobileProjectPointer(event);
  };

  const handleMobileProjectSwipeStart = (event: TouchEvent<HTMLDivElement>) => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    beginMobileProjectSwipe({
      x: event.touches[0]?.clientX ?? 0,
      y: event.touches[0]?.clientY ?? 0,
    });
  };

  const handleMobileProjectSwipeMove = (event: TouchEvent<HTMLDivElement>) => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    updateMobileProjectSwipe({
      x: event.touches[0]?.clientX ?? 0,
      y: event.touches[0]?.clientY ?? 0,
    });
  };

  const handleMobileProjectSwipeEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    completeMobileProjectSwipe({
      x: event.changedTouches[0]?.clientX ?? 0,
      y: event.changedTouches[0]?.clientY ?? 0,
    });
  };

  const handleMobileProjectSwipeCancel = () => {
    if (browserSupportsPointerEvents()) {
      return;
    }

    completeMobileProjectSwipe(null);
  };

  useEffect(() => {
    let animationFrameId = 0;
    let followUpAnimationFrameId = 0;

    const updateProjectLayout = ({ resetBanks = false } = {}) => {
      const nextIsDesktopLayout = window.innerWidth >= DESKTOP_BREAKPOINT_PX;
      setIsDesktopLayout(nextIsDesktopLayout);

      if (!nextIsDesktopLayout) {
        setSelectorShellHeight(null);
        if (resetBanks) {
          setSelectorBanks((currentBanks) => {
            const nextBanks = buildSelectorBanks({
              pageSize: projects.length,
              totalProjects: projects.length,
            });

            return areSelectorBanksEqual(currentBanks, nextBanks)
              ? currentBanks
              : nextBanks;
          });
        }
        return;
      }

      const archiveHeight = Math.ceil(
        archiveModuleRef.current?.getBoundingClientRect().height ?? 0
      );

      if (archiveHeight > 0) {
        setSelectorShellHeight((currentHeight) => {
          return currentHeight === archiveHeight ? currentHeight : archiveHeight;
        });
      }

      const selectorViewport = selectorViewportRef.current;
      const viewportHeight = getSelectorViewportHeight(selectorViewport);

      if (viewportHeight <= 0) {
        return;
      }

      const selectorList = selectorListRef.current;
      const nextPageSize = getFittedSelectorPageSize({
        selectorList,
        totalProjects: projects.length,
        viewportHeight,
      });

      if (resetBanks) {
        setSelectorBanks((currentBanks) => {
          const nextBanks = buildSelectorBanks({
            pageSize: nextPageSize,
            totalProjects: projects.length,
          });

          return areSelectorBanksEqual(currentBanks, nextBanks)
            ? currentBanks
            : nextBanks;
        });
      }
    };

    updateProjectLayout({ resetBanks: true });
    animationFrameId = window.requestAnimationFrame(() => {
      updateProjectLayout({ resetBanks: true });
      followUpAnimationFrameId = window.requestAnimationFrame(() => {
        updateProjectLayout({ resetBanks: true });
      });
    });

    const selectorViewport = selectorViewportRef.current;
    const archiveModule = archiveModuleRef.current;
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            updateProjectLayout();
          });

    if (selectorViewport != null) {
      resizeObserver?.observe(selectorViewport);
    }

    if (archiveModule != null) {
      resizeObserver?.observe(archiveModule);
    }

    const handleWindowResize = () => {
      updateProjectLayout({ resetBanks: true });
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.cancelAnimationFrame(followUpAnimationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (selectorPage > totalPages - 1) {
      setSelectorPage(Math.max(totalPages - 1, 0));
      return;
    }

    if (activeProjectIndex === -1) {
      return;
    }

    const visibleStart = currentSelectorBank.startIndex;
    const visibleEnd = visibleStart + currentSelectorBank.size;

    if (activeProjectIndex < visibleStart || activeProjectIndex >= visibleEnd) {
      const nextSelectorPage = findSelectorBankIndex({
        banks: selectorBanks,
        projectIndex: activeProjectIndex,
      });

      if (nextSelectorPage !== -1 && nextSelectorPage !== selectorPage) {
        setSelectorPage(nextSelectorPage);
      }
    }
  }, [activeProjectIndex, currentSelectorBank, selectorBanks, selectorPage, totalPages]);

  const showSelectorPage = (nextPage: number) => {
    const clampedPage = Math.max(0, Math.min(nextPage, totalPages - 1));
    const nextSelectorBank =
      selectorBanks[clampedPage] ?? selectorBanks.at(-1) ?? currentSelectorBank;
    const nextVisibleProjects = projects.slice(
      nextSelectorBank.startIndex,
      nextSelectorBank.startIndex + nextSelectorBank.size
    );

    setSelectorPage(clampedPage);

    if (
      activeProject == null ||
      !nextVisibleProjects.some((project) => {
        return project.id === activeProject.id;
      })
    ) {
      setActiveProjectId(nextVisibleProjects[0]?.id ?? projects[0]?.id ?? 0);
    }
  };

  const routeMonitorLabel = useMemo(() => {
    if (activeProject == null) {
      return "No route selected";
    }

    return `module ${activeProjectLabel} latched`;
  }, [activeProject, activeProjectLabel]);

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

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.64fr)_minmax(0,1fr)] xl:items-start">
        {isDesktopLayout ? (
          <DesktopProjectSelector
            activeProject={activeProject}
            activeProjectLabel={activeProjectLabel}
            hasPagination={hasPagination}
            pageLabel={pageLabel}
            routeMonitorLabel={routeMonitorLabel}
            selectorListRef={selectorListRef}
            selectorPage={selectorPage}
            selectorShellHeight={selectorShellHeight}
            selectorViewportRef={selectorViewportRef}
            totalPages={totalPages}
            visibleProjects={visibleProjects}
            visibleRangeLabel={visibleRangeLabel}
            onSelectProject={setActiveProjectId}
            onShowPage={showSelectorPage}
          />
        ) : null}

        {!activeProject ? null : (
          <div ref={archiveModuleRef} className="w-full xl:self-start">
            <ProjectText
              mobileNavigator={
                isDesktopLayout ? null : (
                  <MobileProjectControls
                    activeProjectIndex={activeProjectIndex}
                    totalProjects={projects.length}
                    onShowPreviousProject={() => {
                      stepProjectSelection(-1);
                    }}
                    onShowNextProject={() => {
                      stepProjectSelection(1);
                    }}
                  />
                )
              }
              onMobileOverviewTouchStart={
                isDesktopLayout ? undefined : handleMobileProjectSwipeStart
              }
              onMobileOverviewTouchMove={
                isDesktopLayout ? undefined : handleMobileProjectSwipeMove
              }
              onMobileOverviewTouchEnd={
                isDesktopLayout ? undefined : handleMobileProjectSwipeEnd
              }
              onMobileOverviewTouchCancel={
                isDesktopLayout ? undefined : handleMobileProjectSwipeCancel
              }
              onMobileOverviewPointerDown={
                isDesktopLayout ? undefined : handleMobileProjectPointerDown
              }
              onMobileOverviewPointerMove={
                isDesktopLayout ? undefined : handleMobileProjectPointerMove
              }
              onMobileOverviewPointerUp={
                isDesktopLayout ? undefined : handleMobileProjectPointerUp
              }
              onMobileOverviewPointerCancel={
                isDesktopLayout ? undefined : handleMobileProjectPointerCancel
              }
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
          </div>
        )}
      </div>
    </div>
  );
};

const DesktopProjectSelector = ({
  activeProject,
  activeProjectLabel,
  hasPagination,
  pageLabel,
  routeMonitorLabel,
  selectorListRef,
  selectorPage,
  selectorShellHeight,
  selectorViewportRef,
  totalPages,
  visibleProjects,
  visibleRangeLabel,
  onSelectProject,
  onShowPage,
}: {
  activeProject: Project | undefined;
  activeProjectLabel: string;
  hasPagination: boolean;
  pageLabel: string;
  routeMonitorLabel: string;
  selectorListRef: React.RefObject<HTMLDivElement | null>;
  selectorPage: number;
  selectorShellHeight: number | null;
  selectorViewportRef: React.RefObject<HTMLDivElement | null>;
  totalPages: number;
  visibleProjects: Project[];
  visibleRangeLabel: string;
  onSelectProject: (projectId: number) => void;
  onShowPage: (nextPage: number) => void;
}) => {
  return (
    <ApplianceShell
      className="w-full px-5 py-5 md:px-7"
      radius="1.6rem"
      style={
        selectorShellHeight == null
          ? undefined
          : { height: `${selectorShellHeight}px` }
      }
    >
      <div className="flex h-full flex-col">
        <div
          className="appliance-panel-header"
          style={{ borderColor: "var(--color-appliance-shell-border)" }}
        >
          <div className="appliance-panel-heading">
            <p className="appliance-panel-eyebrow">Project Selector</p>
            <p className="appliance-header-subtitle">appliance routing</p>
          </div>
          <p className="appliance-panel-chip-muted">
            {activeProject ? `${activeProjectLabel} active` : "standby"}
          </p>
        </div>

        <div className="mt-5 flex min-h-0 flex-1 flex-col">
          <ApplianceTerminal
            className="flex min-h-0 flex-1 flex-col px-4 py-4"
            bodyClassName="flex min-h-0 flex-1 flex-col"
            headerLabel="selector bus"
            headerMeta={`${formatProjectId(projects.length)} projects online`}
          >
            <div
              ref={selectorViewportRef}
              data-testid="project-selector-viewport"
              className="min-h-0 flex-1 overflow-hidden"
            >
              <div
                ref={selectorListRef}
                className="grid gap-2 xl:grid-cols-1"
                role="tablist"
                aria-label="Project navigation"
              >
                {visibleProjects.map((project) => {
                  const isActive = project.id === activeProject?.id;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className="min-h-[4.75rem] rounded-[0.95rem] border px-3 py-3 text-left transition-colors"
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
                      onClick={() => onSelectProject(project.id)}
                    >
                      <span className="block text-[0.58rem] uppercase tracking-[0.24em]">
                        {isActive ? "> load" : "  load"} {formatProjectId(project.id)}
                      </span>
                      <span className="mt-2 block text-[0.8rem] tracking-[0.08em]">
                        {project.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="mt-4 shrink-0 space-y-3 border-t pt-4"
              style={{ borderColor: "var(--color-appliance-screen-border)" }}
            >
              <div
                className="rounded-[0.95rem] border px-3 py-3"
                style={{
                  borderColor: "var(--color-appliance-screen-border)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <p
                  className="text-[0.56rem] uppercase tracking-[0.24em]"
                  style={{ color: "var(--color-appliance-screen-muted)" }}
                >
                  Route monitor
                </p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[0.8rem] tracking-[0.08em]">
                      {routeMonitorLabel}
                    </p>
                    <p
                      className="mt-1 text-[0.56rem] uppercase tracking-[0.22em]"
                      style={{ color: "var(--color-appliance-screen-muted)" }}
                    >
                      showing {visibleRangeLabel}
                    </p>
                  </div>
                  <span className="appliance-panel-chip">bank {pageLabel}</span>
                </div>
              </div>

              {hasPagination ? (
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="rounded-full border px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.22em] transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.16)",
                      borderColor: "var(--color-appliance-screen-border)",
                      color: "var(--color-appliance-screen-text)",
                    }}
                    onClick={() => onShowPage(selectorPage - 1)}
                    disabled={selectorPage === 0}
                    aria-label="Show previous project routes"
                  >
                    Prev bank
                  </button>
                  <p
                    className="text-[0.56rem] uppercase tracking-[0.22em]"
                    style={{ color: "var(--color-appliance-screen-muted)" }}
                  >
                    Route set {pageLabel}
                  </p>
                  <button
                    type="button"
                    className="rounded-full border px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.22em] transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.16)",
                      borderColor: "var(--color-appliance-screen-border)",
                      color: "var(--color-appliance-screen-text)",
                    }}
                    onClick={() => onShowPage(selectorPage + 1)}
                    disabled={selectorPage === totalPages - 1}
                    aria-label="Show next project routes"
                  >
                    Next bank
                  </button>
                </div>
              ) : null}
            </div>
          </ApplianceTerminal>
        </div>
      </div>
    </ApplianceShell>
  );
};

export default Projects;

const MobileProjectControls = ({
  activeProjectIndex,
  totalProjects,
  onShowPreviousProject,
  onShowNextProject,
}: {
  activeProjectIndex: number;
  totalProjects: number;
  onShowPreviousProject: () => void;
  onShowNextProject: () => void;
}) => {
  const activeProjectLabel = (activeProjectIndex + 1).toString().padStart(2, "0");
  const totalProjectsLabel = totalProjects.toString().padStart(2, "0");
  const hasPreviousProject = activeProjectIndex > 0;
  const hasNextProject = activeProjectIndex < totalProjects - 1;

  return (
    <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="rounded-full border px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.22em] transition-colors disabled:cursor-not-allowed disabled:opacity-45"
          style={{
            backgroundColor: "rgba(255,255,255,0.14)",
            borderColor: "var(--color-appliance-panel-border)",
            color: "var(--color-appliance-label-soft)",
          }}
          onClick={onShowPreviousProject}
          disabled={!hasPreviousProject}
          aria-label="Show previous project"
        >
          Prev
        </button>
        <span className="appliance-panel-chip">
          {activeProjectLabel} / {totalProjectsLabel}
        </span>
        <button
          type="button"
          className="rounded-full border px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.22em] transition-colors disabled:cursor-not-allowed disabled:opacity-45"
          style={{
            backgroundColor: "rgba(255,255,255,0.14)",
            borderColor: "var(--color-appliance-panel-border)",
            color: "var(--color-appliance-label-soft)",
          }}
          onClick={onShowNextProject}
          disabled={!hasNextProject}
          aria-label="Show next project"
        >
          Next
        </button>
    </div>
  );
};
