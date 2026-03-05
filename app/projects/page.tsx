'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Filter } from 'lucide-react';
import { Section, SectionTitle, Card } from '@/components/UI';
import { projects, categories } from '@/data/projects';

export default function ProjectsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProjects =
        selectedCategory === 'All'
            ? projects
            : projects.filter((p) => p.category === selectedCategory);

    return (
        <div className="min-h-screen py-16">
            <Section>
                <SectionTitle subtitle="Engineering intelligence platforms and automation tools">
                    My Projects
                </SectionTitle>

                {/* Category Filter */}
                <div className="flex items-center gap-4 mb-12 flex-wrap justify-center">
                    <Filter className="w-5 h-5 text-foreground/70" />
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-card text-foreground hover:bg-card-hover'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            layout
                        >
                            <Card className="h-full flex flex-col">
                                {/* Project Image Placeholder */}
                                <div className="h-48 bg-linear-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                    <span className="text-6xl">
                                        {project.category === 'Frontend' && '💻'}
                                        {project.category === 'GIS' && '🗺️'}
                                        {project.category === 'Automation' && '⚙️'}
                                        {project.category === 'Engineering' && '🔧'}
                                        {project.category === 'Python' && '🐍'}
                                    </span>
                                </div>

                                {/* Category Badge */}
                                <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm mb-2 w-fit">
                                    {project.category}
                                </div>

                                {/* Project Title */}
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p className="text-foreground/70 mb-4 grow">
                                    {project.longDescription}
                                </p>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-card rounded text-xs text-foreground/80"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-4 mt-auto">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                                        >
                                            <Github className="w-4 h-4" />
                                            Code
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Demo
                                        </a>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* No results message */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-foreground/70 text-lg">
                            No projects found in this category.
                        </p>
                    </div>
                )}
            </Section>
        </div>
    );
}
