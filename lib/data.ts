import details from "@/details.json";

export type Project = {
  num: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  techStack: string[];
  github: string | null;
  live: string | null;
  image: string;
};

export const personal = details.personal;
export const skills = details.skills;

// details.json points at /images/projects/*, the actual files live in /public/projects/*
export const projects: Project[] = details.projects.map((p) => ({
  ...p,
  image: `/projects/${p.image.split("/").pop()}`,
}));
