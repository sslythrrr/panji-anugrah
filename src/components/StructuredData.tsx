import { Helmet } from "react-helmet-async";

interface Project {
  id: number;
  title: string;
  period: string;
  categories: string[];
  description: string;
  highlights: string[];
  tags: string[];
  github: string;
  liveDemo?: string;
  images?: string[];
}

interface StructuredDataProps {
  project?: Project;
  type?: "portfolio" | "project";
}

const StructuredData = ({ project, type = "portfolio" }: StructuredDataProps) => {
  if (type === "project" && project) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "name": project.title,
      "description": project.description,
      "dateCreated": project.period.split(" - ")[0],
      "keywords": project.tags.join(", "),
      "programmingLanguage": project.tags[0],
      "codeRepository": project.github,
      "image": project.images?.[0] ? "https://panjianugrah.me/profile.png" : undefined,
      "author": {
        "@type": "Person",
        "name": "Tubagus Panji Anugrah",
        "url": "https://panjianugrah.me",
        "sameAs": [
          "https://github.com/sslythrrr",
          "https://linkedin.com/in/panji-anugrah"
        ]
      },
      "about": project.highlights,
      "applicationCategory": project.categories.join(", ")
    };

    return (
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
    );
  }

  const portfolioData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Tubagus Panji Anugrah",
    "jobTitle": "Software Engineer",
    "description": "CS Graduate specializing in Software Dev (Mobile/Web), QA Automation, & Data Science. Building scalable systems that solve real problems. See my work!",
    "url": "https://panjianugrah.me",
    "image": "https://panjianugrah.me/profile.png",
    "sameAs": [
      "https://github.com/sslythrrr",
      "https://linkedin.com/in/panji-anugrah",
      "https://instagram.com/tubaguspn"
    ],
    "knowsAbout": [
      "Mobile Development",
      "Web Development",
      "Data Science",
      "Machine Learning",
      "Deep Learning",
      "Android",
      "React",
      "Python",
      "Kotlin",
      "Flutter",
      "Node.Js",
      "TypeScript"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "West Java",
      "addressCountry": "Indonesia"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(portfolioData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
