type Project = {
  id: number;
  title: string;
  description: string;
  imageFolder?: string;
  numberImages?: number;
  githubLink?: string;
  youtubeLink?: string;
  demoLink?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "vulkan-renderer",
    description:
      "A proof-of-concept transitioning Met.3D's graphics rendering from OpenGL to Vulkan. Created as part of my bachelor’s thesis exploring modern rendering techniques.",
    imageFolder: "/vulkan-renderer",
    numberImages: 5,
    githubLink: "https://github.com/JcK-l/vulkan-renderer",
  },
  {
    id: 2,
    title: "tornado-vis",
    description:
      "A Qt application that brings tornado data to life with isolines, streamlines, and detailed visualizations. A whirlwind of science and programming.",
    imageFolder: "/tornado-vis",
    numberImages: 4,
    githubLink: "https://github.com/JcK-l/tornado-vis",
  },
  {
    id: 3,
    title: "proud-detectives",
    description:
      "An Android app inspired by Cluedo, combining mystery and strategy to test your detective skills. Developed collaboratively in just two weeks.",
    imageFolder: "/proud-detectives",
    numberImages: 12,
    githubLink: "https://github.com/JcK-l/proud-detectives",
    youtubeLink: "https://www.youtube.com/watch?v=c1fAM1WMQbg",
  },
  {
    id: 4,
    title: "simple-lights",
    description:
      "A straightforward WebGL project with forward rendering for lights. Future plans? Clustered shading to take it up a notch.",
    imageFolder: "/simple-lights",
    numberImages: 3,
    githubLink: "https://github.com/JcK-l/simple-lights",
    demoLink: "https://jck-l.github.io/simple-lights/",
  },
  {
    id: 5,
    title: "homework-latex",
    description:
      "A public LaTeX template I created to simplify writing homework during university. Clean, structured, and ready for math-heavy assignments.",
    imageFolder: "/homework-latex",
    numberImages: 2,
    githubLink: "https://github.com/JcK-l/homework-latex",
  },
  {
    id: 6,
    title: "jckl.dev",
    description:
      "The website you're on right now. Dive in, explore, and maybe uncover a secret or two along the way.",
    imageFolder: "/jckl-website",
    numberImages: 1,
    githubLink: "https://github.com/JcK-l/jckl.dev",
  },
];
