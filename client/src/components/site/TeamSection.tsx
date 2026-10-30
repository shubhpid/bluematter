import { useMotionValue } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import erik from "../assets/erik-headshot.webp";
import lucca from "../assets/lucca-headshot.webp";
import saee from "../assets/saee-headshot.webp";
import taylor from "../assets/taylor-foster-headshot.webp";
import tyler from "../assets/tyler-headshot.webp";
import nathan from "../assets/nathan-narrik-headshot.webp";
import shubhadip from "../assets/shubhadip-saha-headshot.webp";
import ronak from "../assets/ronak-bhatia-headshot.webp";
import arjun from "../assets/arjun-arora-headshot.jpg";
import TeamBio from "./TeamBio";
import { Reveal, SplitWords } from "./motion";

type TeamMember = {
  name: string;
  role: string;
  dept: string;
  photo: string;
  focus: string;
  bio?: string;
};

const team: TeamMember[] = [
  {
    name: "Erik O'Bryant",
    role: "Project & Software Development Lead",
    dept: "Biomedical Engineering",
    photo: erik,
    focus:
      "Project direction, system design and assembly, testing and data collection",
  },
  {
    name: "Tyler Santos",
    role: "Electrical Systems Lead",
    dept: "Electrical Engineering",
    photo: tyler,
    focus: "Custom PCB design, amplification circuitry, and power management",
  },
  {
    name: "Arjun Arora",
    role: "Electrical Systems Lead",
    dept: "Electrical Engineering",
    photo: arjun,
    focus: "Circuit Design, Embedded Systems, and Signal Processing",
  },
  {
    name: "Lucca Saraceno",
    role: "Mechanical Systems & Fabrication Lead",
    dept: "Biomedical Engineering",
    photo: lucca,
    focus: "Electrode design, 3D modeling, research, and fabrication",
    bio: "Lucca Saraceno is a biomedical engineering student at Arizona State University with a strong interest in neuroscience and neurotechnology. On the BlueMatter team, he works on the development and testing of electrode designs for a comfortable, non-invasive brain-computer interface. His interests center around combining engineering and neuroscience to develop technologies that can better interface with the human nervous system.",
  },
  {
    name: "Taylor Foster",
    role: "Human Systems & Algorithms Research Lead",
    dept: "Human Systems Engineering",
    photo: taylor,
    focus: "Machine learning research, market analysis, and documentation",
    bio: "Taylor Foster graduated from ASU with a masters in Humans Systems Engineering. Non-coincidentally, Taylor served as BlueMatter's Human Systems Lead. In this role, he provided valuable insights into how everyday people would interact with our tech, and steered us towards prioritizing a human-centric design. He was also invaluable in making our project presentable, from designing posters and slide-decks to getting our first website off the ground, he understood how to make these deliverables appealing to your everyday person. Additionally, Taylor had an affinity for dynamical systems, and he performed extensive research on its usage in BCIs.",
  },
  {
    name: "Saee Pangarkar",
    role: "Technical Research & Implementation Lead",
    dept: "Biomedical Engineering",
    photo: saee,
    focus: "AI model development, electrode research, and preprocessing",
    bio: "Saee Pangarkar graduated from ASU with a bachelors in Biomedical Engineering. On BlueMatter she served as the research lead, and in this role she found and reviewed countless article across a variety of topics. From de-noising techniques to AI algorithms, Saee helped us stay up-to-date on existing literature, ensuring that we didn't re-invent the wheel. Saee also worked to implement many of the things she researched, including signal artifact removal and brain mapping software.",
  },
  {
    name: "Nathan Narrik",
    role: "Biometrics & Machine Learning Lead",
    dept: "Computer Science",
    photo: nathan,
    focus: "EMG post-processing, data collection, and software development",
  },
  {
    name: "Shubhadip Saha",
    role: "Software Development & Design Lead",
    dept: "Computer Science, Human Systems Engineering",
    photo: shubhadip,
    focus: "Frontend design, user workflows, and software integration",
  },
  {
    name: "Ronak Bhatia",
    role: "Robotics Lead",
    dept: "Mechanical Engineering",
    photo: ronak,
    focus: "Robotic arm design, harness mounting system, and wearer control integration",
    bio: "Ronak Bhatia is a junior studying Mechanical Engineering at Barrett, The Honors College at ASU. He joined the Luminosity Lab as a Vanderploeg Luminosity Scholar. On Project BlueMatter, he is developing the team’s robotic arm, improving its design and creating a way to mount it to a harness so the wearer can control it.",
  },
];

export default function TeamSection() {
  const [preview, setPreview] = useState<{
    index: number;
    expanded: boolean;
    pinned: boolean;
  } | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const previewId = useId();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const clearTimers = useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const closePreview = useCallback(
    (restoreFocus = false) => {
      clearTimers();
      setPreview(null);
      if (restoreFocus && preview)
        triggers.current[preview.index]?.focus({ preventScroll: true });
    },
    [clearTimers, preview]
  );

  const keepPreview = () => window.clearTimeout(closeTimer.current);
  const leavePreview = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => {
      // Ignore a stale leave event if layout or spring motion put the pointer back on the card.
      if (document.getElementById(previewId)?.matches(":hover")) return;
      setPreview(current => (current?.pinned ? current : null));
    }, 350);
  };

  const movePortrait = (event: PointerEvent, index: number) => {
    if (event.pointerType === "touch" || preview?.pinned) return;
    // Once open, hold the image still as the pointer crosses into the biography.
    if (
      preview?.expanded &&
      (preview.index !== index ||
        !(event.target as Element).closest("[data-team-name]"))
    )
      return;
    cursorX.set(event.clientX);
    cursorY.set(event.clientY);
  };

  const enterRow = (event: PointerEvent, index: number) => {
    if (event.pointerType === "touch" || preview?.pinned) return;
    clearTimers();
    if (preview?.index === index && preview.expanded) return;
    cursorX.set(event.clientX);
    cursorY.set(event.clientY);
    setPreview({ index, expanded: false, pinned: false });
    if (team[index].bio)
      hoverTimer.current = window.setTimeout(() => {
        setPreview(current =>
          current?.index === index ? { ...current, expanded: true } : current
        );
      }, 5000);
  };

  const toggleBio = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    clearTimers();
    if (preview?.index === index && preview.pinned) {
      closePreview();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    cursorX.set(event.detail ? event.clientX : rect.right);
    cursorY.set(event.detail ? event.clientY : rect.top + rect.height / 2);
    setPreview({ index, expanded: true, pinned: true });
  };

  return (
    <section
      id="team"
      data-no-snap
      aria-labelledby="team-title"
      className="py-24 md:py-32"
    >
      <div className="container flex flex-col gap-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="flex flex-col gap-6">
            <h2
              id="team-title"
              className="type-h2 text-balance text-4xl text-paper md:text-6xl"
            >
              <SplitWords text="The minds behind it." />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-slate-light">
              A multidisciplinary team of Arizona State University engineers
              working across electrical, biomedical, and human systems
              engineering through The Luminosity Lab.
            </p>
          </Reveal>
        </div>

        <ul className="border-t border-ink-line">
          {team.map((m, i) => (
            <Reveal
              as="li"
              key={m.name}
              delay={i * 0.05}
              className="border-b border-ink-line"
            >
              <div
                onPointerEnter={event => enterRow(event, i)}
                onPointerMove={event => movePortrait(event, i)}
                onPointerLeave={leavePreview}
                className={`grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 py-6 transition-opacity duration-300 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,0.75fr)] md:gap-x-8 md:py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.4fr)_minmax(0,0.8fr)] ${
                  preview !== null && preview.index !== i ? "lg:opacity-35" : ""
                }`}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  decoding="async"
                  width={56}
                  height={56}
                  className="row-span-3 size-14 self-start rounded-md object-cover md:row-span-2 lg:hidden"
                />
                <h3 className="type-h3 flex min-w-0 items-center self-stretch text-2xl text-paper md:col-start-2 lg:col-start-1 lg:row-span-2 lg:text-4xl">
                  {m.bio ? (
                    <button
                      ref={node => {
                        triggers.current[i] = node;
                      }}
                      type="button"
                      data-team-name
                      aria-haspopup="dialog"
                      aria-expanded={preview?.index === i && preview.expanded}
                      aria-controls={
                        preview?.index === i && preview.expanded
                          ? previewId
                          : undefined
                      }
                      onClick={event => toggleBio(event, i)}
                      className="-my-6 flex w-full items-center rounded-sm py-6 text-left transition-colors hover:text-signal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal md:-my-8 md:py-8"
                    >
                      {m.name}
                    </button>
                  ) : (
                    m.name
                  )}
                </h3>
                <div className="col-start-2 flex min-w-0 flex-col gap-1 md:row-start-2 lg:row-span-2 lg:row-start-1">
                  <span className="font-semibold text-signal">{m.role}</span>
                  <span className="text-sm leading-relaxed text-slate-light">
                    {m.focus}
                  </span>
                </div>
                <span className="col-start-2 text-sm font-semibold text-slate md:col-start-3 md:row-span-2 md:row-start-1 md:text-right">
                  {m.dept}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
        {preview && (
          <TeamBio
            id={previewId}
            member={team[preview.index]}
            expanded={preview.expanded}
            pinned={preview.pinned}
            cursorX={cursorX}
            cursorY={cursorY}
            trigger={triggers.current[preview.index]}
            onClose={closePreview}
            onPointerEnter={keepPreview}
            onPointerLeave={leavePreview}
          />
        )}
      </div>
    </section>
  );
}
