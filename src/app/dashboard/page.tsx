"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Plus,
  ExternalLink,
  Code,
  Check,
  X,
  Star,
  Copy,
  Loader2,
  MessageSquare,
  Settings,
} from "lucide-react";
import SettingsModal from "@/components/SettingsModal";

// Types
interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { testimonials: number };
  testimonials?: Testimonial[];
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data.projects || []);
      if (data.projects?.length > 0) {
        setSelectedProject(data.projects[0]);
        fetchTestimonials(data.projects[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestimonials = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/testimonials`);
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProjectName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects([data.project, ...projects]);
        setSelectedProject(data.project);
        setNewProjectName("");
        setShowNewProject(false);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const updateTestimonialStatus = async (id: string, approved: boolean) => {
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, approved } : t
      ));
    } catch (error) {
      console.error("Failed to update testimonial:", error);
    }
  };

  const copyEmbedCode = () => {
    if (!selectedProject) return;
    
    const embedCode = `<div id="starboard-widget" data-slug="${selectedProject.slug}"></div>
<script src="${window.location.origin}/widget.js"></script>`;
    
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCollectUrl = () => {
    if (!selectedProject) return "";
    return `${window.location.origin}/collect/${selectedProject.slug}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Settings Modal */}
      {showSettings && selectedProject && (
        <SettingsModal
          project={selectedProject as any}
          onClose={() => setShowSettings(false)}
          onSave={(updated) => {
            setSelectedProject(updated as any);
            setProjects(projects.map(p => p.id === updated.id ? { ...p, ...updated } : p));
          }}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
            <Heart className="w-6 h-6 fill-brand-500" />
            starboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Free Plan</span>
            <Link href="/pricing" className="text-sm text-brand-600 hover:underline">
              Upgrade
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar - Projects */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Projects</h2>
                <button
                  onClick={() => setShowNewProject(true)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* New Project Input */}
              {showNewProject && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createProject()}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createProject}
                      className="flex-1 bg-brand-600 text-white text-sm py-1.5 rounded-lg"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowNewProject(false)}
                      className="flex-1 bg-gray-200 text-gray-700 text-sm py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Project List */}
              <ul className="space-y-1">
                {projects.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        fetchTestimonials(project.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedProject?.id === project.id
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium truncate">{project.name}</div>
                      <div className="text-xs text-gray-500">
                        {project._count?.testimonials || 0} testimonials
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {projects.length === 0 && !showNewProject && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No projects yet.
                  <br />
                  <button
                    onClick={() => setShowNewProject(true)}
                    className="text-brand-600 hover:underline"
                  >
                    Create your first project
                  </button>
                </p>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {selectedProject ? (
              <>
                {/* Project Header */}
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {selectedProject.name}
                      </h1>
                      <p className="text-gray-500 text-sm break-all">
                        slug: {selectedProject.slug}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <Link
                        href={`/preview/${selectedProject.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Preview
                      </Link>
                      <button
                        onClick={() => setShowEmbedCode(!showEmbedCode)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-sm"
                      >
                        <Code className="w-4 h-4" />
                        Embed
                      </button>
                    </div>
                  </div>

                  {/* Collect Link */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      📮 Collection Link
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={getCollectUrl()}
                        className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm truncate"
                      />
                      <a
                        href={getCollectUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Share this link with your customers to collect testimonials.
                    </p>
                  </div>

                  {/* Embed Code */}
                  {showEmbedCode && (
                    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-300">
                          Embed Code
                        </p>
                        <button
                          onClick={copyEmbedCode}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-sm text-green-400 overflow-x-auto">
{`<div id="starboard-widget" data-slug="${selectedProject.slug}"></div>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js"></script>`}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Testimonials */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">
                      Testimonials ({testimonials.length})
                    </h2>
                  </div>

                  {testimonials.length === 0 ? (
                    <div className="p-12 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No testimonials yet.
                        <br />
                        Share your collection link to get started!
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {testimonials.map((testimonial) => (
                        <li key={testimonial.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-900">
                                  {testimonial.name}
                                </span>
                                {testimonial.company && (
                                  <span className="text-sm text-gray-500">
                                    @ {testimonial.company}
                                  </span>
                                )}
                                {!testimonial.approved && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <p className="text-gray-700">{testimonial.content}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(testimonial.createdAt).toLocaleDateString("en-US")}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              {!testimonial.approved ? (
                                <button
                                  onClick={() => updateTestimonialStatus(testimonial.id, true)}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateTestimonialStatus(testimonial.id, false)}
                                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                  title="Unapprove"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Heart className="w-16 h-16 text-brand-200 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Create your first project
                </h2>
                <p className="text-gray-500 mb-6">
                  Start collecting testimonials from your customers.
                </p>
                <button
                  onClick={() => setShowNewProject(true)}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  New Project
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
