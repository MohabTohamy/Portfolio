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
                    <Filter className="w-5 h-5 text-gray-400" />
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                                ? 'bg-white text-black shadow-lg shadow-white/20'
                                : 'bg-card text-white hover:bg-card-hover border border-white/10 hover:border-white/20'
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
                                <div className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-sm mb-3 w-fit border border-white/20 font-medium">
                                    {project.category}
                                </div>

                                {/* Project Title */}
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-300 mb-4 grow leading-relaxed text-sm">
                                    {project.longDescription}
                                </p>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 bg-white/5 border border-white/20 rounded-md text-xs text-gray-300 font-medium"
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
                                            className="flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors font-medium"
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
                                            className="flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors font-medium"
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
