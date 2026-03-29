
import { useEffect, useState } from "react";
import { ApplianceShell } from "./ApplianceShell";
import { ApplianceTerminal } from "./ApplianceTerminal";

interface EmailProps {
  name: string;
  email: string;
  message: string;
  date: string;
  isMail: boolean;
}

export const Email = ({ name, email, message, date, isMail }: EmailProps) => {
  const trimmedName = name.trim();
  const subject = trimmedName
    ? `Message from ${trimmedName}`
    : "Incoming message";
  const [inboxDate, setInboxDate] = useState("Today");

  useEffect(() => {
    setInboxDate(
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date())
    );
  }, []);

  if (!isMail) return null;

  return (
    <ApplianceShell className="relative w-full p-3" showHighlight>
      <div className="p-3">
        <div className="appliance-panel-header mb-3">
          <div className="appliance-panel-heading">
            <p className="appliance-panel-eyebrow">Mail Viewer</p>
            <p className="appliance-header-subtitle mt-1">
              incoming correspondence
            </p>
          </div>
          <span className="appliance-panel-chip" style={{ color: "var(--color-primary)" }}>
            Read
          </span>
        </div>
        <ApplianceTerminal
          className="rounded-[1rem] px-0 pb-0 pt-3"
          headerLabel="Inbox"
          headerMeta={inboxDate}
          bodyClassName="overflow-hidden rounded-[inherit]"
        >
          <div
            className="border-b px-4 py-4"
            style={{ borderColor: "var(--color-appliance-screen-border)" }}
          >
            <p
              className="text-[0.55rem] uppercase tracking-[0.24em]"
              style={{ color: "var(--color-appliance-screen-muted)" }}
            >
              Subject
            </p>
            <p className="mt-2 font-sans text-[1rem] font-semibold leading-6">
              {subject}
            </p>
          </div>
          <div
            className="border-b px-4 py-4"
            style={{ borderColor: "var(--color-appliance-screen-border)" }}
          >
            <dl className="grid gap-3 text-[0.72rem] leading-5 sm:grid-cols-3 sm:gap-4">
              <div>
                <dt
                  className="text-[0.55rem] uppercase tracking-[0.2em]"
                  style={{ color: "var(--color-appliance-screen-muted)" }}
                >
                  From
                </dt>
                <dd
                  className="mt-1 break-all font-sans text-[0.85rem] leading-5"
                >
                  {email}
                </dd>
              </div>
              <div>
                <dt
                  className="text-[0.55rem] uppercase tracking-[0.2em]"
                  style={{ color: "var(--color-appliance-screen-muted)" }}
                >
                  To
                </dt>
                <dd className="mt-1 font-sans text-[0.85rem] leading-5">
                  mail@jckl.dev
                </dd>
              </div>
              <div>
                <dt
                  className="text-[0.55rem] uppercase tracking-[0.2em]"
                  style={{ color: "var(--color-appliance-screen-muted)" }}
                >
                  Received
                </dt>
                <dd className="mt-1 font-sans text-[0.85rem] leading-5">
                  {date}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-4">
            <div
              className="rounded-[0.95rem] border px-4 py-4"
              style={{
                backgroundColor: "rgba(15,31,52,0.24)",
                borderColor: "rgba(241,250,238,0.16)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <p
                className="mb-3 text-[0.55rem] uppercase tracking-[0.24em]"
                style={{ color: "var(--color-appliance-screen-muted)" }}
              >
                Message
              </p>
              <p className="whitespace-pre-wrap font-sans text-[0.95rem] leading-7">
                {message}
              </p>
            </div>
          </div>
        </ApplianceTerminal>
      </div>
    </ApplianceShell>
  );
};
