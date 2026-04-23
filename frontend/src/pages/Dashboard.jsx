import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Briefcase, CheckCircle2, TrendingUp, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../hooks/useApp'
import { projectsAPI } from '../services/api'
import { Card, CardBody } from '../components/Card'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { ProjectForm } from '../components/ProjectForm'
import { EmptyState } from '../components/EmptyState'
import { CardSkeleton, GridSkeleton } from '../components/SkeletonLoaders'

export const Dashboard = () => {
  const navigate = useNavigate()
  const { projects, setProjects, showSuccess, showError } = useApp()
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [fetching, setFetching] = useState(true)   // local — only blocks this page
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      setFetching(true)
      setLoadError('')
      const response = await projectsAPI.getAll()
      setProjects(response.data || [])
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load projects'
      setLoadError(message)
      showError(message)
    } finally {
      setFetching(false)
    }
  }

  const handleCreateProject = async (formData) => {
    try {
      setSaving(true)
      await projectsAPI.create(formData)
      showSuccess('Project created successfully!')
      setShowProjectModal(false)
      fetchProjects()
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  // Derive stats directly — no separate state needed
  const completedCount = projects.filter(p => p.isCompleted).length
  const activeCount = projects.filter(p => !p.isCompleted).length
  const stats = [
    { icon: Briefcase, label: 'Total Projects',   value: projects.length, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { icon: Zap,        label: 'Active Projects',  value: activeCount,     color: 'bg-gradient-to-br from-yellow-500 to-orange-600' },
    { icon: CheckCircle2, label: 'Completed',      value: completedCount,  color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
  ]

  return (
    <motion.div className="space-y-8">
      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {loadError}
        </div>
      )}

      {/* Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <CardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <Card hoverable>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`p-3 rounded-lg ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Projects section */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
            {!fetching && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} in total
              </p>
            )}
          </div>
          <Button icon={Plus} onClick={() => setShowProjectModal(true)}>
            New Project
          </Button>
        </motion.div>

        {fetching ? (
          <GridSkeleton count={6} />
        ) : projects.length === 0 ? (
          <EmptyState
            icon="projects"
            title="No projects yet"
            description="Create your first project to start managing your team's work"
            action={() => setShowProjectModal(true)}
            actionLabel="Create Project"
            size="lg"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="cursor-pointer group"
                >
                  <Card
                    hoverable
                    className={`h-full flex flex-col ${project.isCompleted ? 'border-green-300 dark:border-green-700' : ''}`}
                  >
                    <CardBody className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className={`font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                            project.isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {project.name}
                          </h3>
                        </div>
                        <div className={`ml-2 p-2 rounded-lg ${
                          project.isCompleted
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'
                        }`}>
                          {project.isCompleted
                            ? <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                            : <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          }
                        </div>
                      </div>

                      {/* Completed badge */}
                      {project.isCompleted && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full mb-3 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                        {project.description || 'No description'}
                      </p>

                      {/* Progress bar */}
                      {project.userStoriesCount > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Stories done</span>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {Math.round(
                                ((project.userStories?.filter(s => s.status === 'Done').length || 0) / project.userStoriesCount) * 100
                              )}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.round(
                                  ((project.userStories?.filter(s => s.status === 'Done').length || 0) / project.userStoriesCount) * 100
                                )}%`,
                              }}
                              transition={{ delay: 0.5, duration: 1 }}
                              className={`h-full ${project.isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{project.userStoriesCount || 0} user stories</span>
                        <span>{project.tasksCount || 0} tasks</span>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowProjectModal(false)}
          isLoading={saving}
        />
      </Modal>
    </motion.div>
  )
}
