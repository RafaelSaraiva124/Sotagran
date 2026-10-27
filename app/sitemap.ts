import type { MetadataRoute } from "next";

import { PROJECTS } from "@/lib/projects";

const SITE_URL = "https://www.serragran.pt";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ["", "/projetos", "/contactos"];

    const projectRoutes = PROJECTS.map((project) => `/projetos/${project.id}`);

    return [...routes, ...projectRoutes].map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.8,
    }));
}
