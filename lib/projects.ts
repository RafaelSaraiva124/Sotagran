export type Project = {
    id: string;
    number: string;
    title: string;
    category: string;
    location: string;
    year: string;
    image: string;
    description: string;
    materials: string[];
};

export const PROJECTS: Project[] = [
    {
        id: "project-01",
        number: "01",
        title: "Projeto Residencial",
        category: "Interiores",
        location: "Portugal",
        year: "2026",
        image: "/media/projects/project-01.jpg",
        description:
            "Aplicação de pedra natural num projeto residencial, onde o material assume um papel central na identidade do espaço.",
        materials: ["Granito", "Acabamento polido"],
    },
    {
        id: "project-02",
        number: "02",
        title: "Projeto Residencial",
        category: "Exteriores",
        location: "Portugal",
        year: "2026",
        image: "/media/projects/project-02.jpg",
        description:
            "Uma solução em pedra natural pensada para integrar materialidade, resistência e expressão arquitetónica.",
        materials: ["Granito", "Acabamento personalizado"],
    },
    {
        id: "project-03",
        number: "03",
        title: "Espaço Interior",
        category: "Interiores",
        location: "Portugal",
        year: "2026",
        image: "/media/projects/project-03.jpg",
        description:
            "Pedra natural utilizada como elemento de destaque na construção de um espaço interior.",
        materials: ["Granito", "Acabamento personalizado"],
    },
];

export const PROJECT_CATEGORIES = ["Todos", "Interiores", "Exteriores"];

export function getProjectById(id: string): Project | undefined {
    return PROJECTS.find((project) => project.id === id);
}
