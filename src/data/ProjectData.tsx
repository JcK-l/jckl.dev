type Project = {
  id: number;
  title: string;
  description: string;
  imageFolder?: string;
  numberImages?: number;
  githubLink?: string;
}

export const projects: Project[] = [
  { id: 1, title: "vulkan-renderer", 
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,", 
    imageFolder: "/vulkan-renderer", numberImages:3, githubLink:"https://github.com/JcK-l/vulkan-renderer" },
  { id: 2, title: "Project 1", description: "Description 1" },
  { id: 3, title: "Project 2", description: "Description 2" },
  { id: 4, title: "Project 3", description: "Description 3" },
  { id: 5, title: "Project 5", description: "Description 5"},
];
