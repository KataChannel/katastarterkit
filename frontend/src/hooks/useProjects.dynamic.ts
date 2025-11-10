/**
 * ============================================================================
 * PROJECT MANAGEMENT HOOKS - DYNAMIC GRAPHQL VERSION
 * ============================================================================
 * 
 * Migrated from Apollo Client to Dynamic GraphQL
 * Uses universal hooks for better performance and type safety
 * 
 * @author Senior Full-Stack Engineer
 * @version 2.0.0 - Dynamic GraphQL Migration
 */

import { useMemo } from 'react';
import {
  useFindMany,
  useFindUnique,
  useCreateOne,
  useUpdateOne,
  useDeleteOne,
} from './useDynamicGraphQL';

// ==================== TYPE DEFINITIONS ====================

export interface Project {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  members?: ProjectMember[];
  tasks?: Task[];
  chatMessages?: any[];
  _count?: {
    tasks: number;
    chatMessages: number;
    members: number;
  };
}

export interface ProjectMember {
  id: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'WORK' | 'PERSONAL' | 'SHOPPING' | 'HEALTH' | 'OTHER';
  dueDate?: string;
  completedAt?: string;
  assignedTo?: string[];
  mentions?: string[];
  tags?: string[];
  projectId?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  avatar?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  avatar?: string;
  isArchived?: boolean;
}

export interface AddMemberInput {
  userId: string;
  role: 'admin' | 'member';
}

export interface UpdateMemberRoleInput {
  memberId: string;
  role: 'admin' | 'member';
}

// ==================== QUERY HOOKS ====================

/**
 * Hook: Get all user's projects (for Sidebar)
 * 
 * @example
 * const { data: projects, loading, refetch } = useMyProjects(false);
 */
export const useMyProjects = (includeArchived = false) => {
  const where = useMemo(() => {
    if (includeArchived) {
      return undefined; // Get all projects
    }
    return { isArchived: { equals: false } }; // Only active projects
  }, [includeArchived]);

  const { data, loading, error, refetch } = useFindMany<Project>('project', {
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          tasks: true,
          chatMessages: true,
        },
      },
    },
  });

  return {
    data: { myProjects: data || [] },
    loading,
    error,
    refetch,
  };
};

/**
 * Hook: Get project details
 * 
 * @example
 * const { data: project, loading } = useProject(projectId);
 */
export const useProject = (projectId: string | null) => {
  const { data, loading, error, refetch } = useFindUnique<Project>(
    'project',
    projectId || '',
    {
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            chatMessages: true,
          },
        },
      },
    },
    { skip: !projectId }
  );

  return {
    data: data ? { project: data } : undefined,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook: Get project members (for @mention, member management)
 * 
 * @example
 * const { data: members, loading } = useProjectMembers(projectId);
 */
export const useProjectMembers = (projectId: string | null) => {
  const { data, loading, error, refetch } = useFindMany<ProjectMember>('projectMember', {
    where: {
      projectId: { equals: projectId },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  }, {
    skip: !projectId,
  });

  return {
    data: { projectMembers: data || [] },
    loading,
    error,
    refetch,
  };
};

// ==================== MUTATION HOOKS ====================

/**
 * Hook: Create new project
 * 
 * @example
 * const [createProject, { loading }] = useCreateProject();
 * await createProject({ 
 *   variables: { 
 *     input: { name: "New Project", description: "..." } 
 *   } 
 * });
 */
export const useCreateProject = () => {
  const [createOne, { data, loading, error }] = useCreateOne<Project>('project', {
    refetchQueries: ['FindManyProject'], // Auto refetch project list after create
  });

  const createProject = async (options: { variables: { input: CreateProjectInput } }) => {
    const result = await createOne({
      data: options.variables.input,
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            chatMessages: true,
          },
        },
      },
    });

    return { data: { createProject: result } };
  };

  return [createProject, { loading, error }] as const;
};

/**
 * Hook: Update existing project
 * 
 * @example
 * const [updateProject] = useUpdateProject();
 * await updateProject({ 
 *   variables: { 
 *     id: "uuid", 
 *     input: { name: "Updated Name" } 
 *   } 
 * });
 */
export const useUpdateProject = () => {
  const [updateOne, { data, loading, error }] = useUpdateOne<Project>('project', {
    refetchQueries: ['FindManyProject'], // Auto refetch project list after update
  });

  const updateProject = async (options: { 
    variables: { 
      id: string; 
      input: UpdateProjectInput 
    } 
  }) => {
    const result = await updateOne({
      where: options.variables.id,
      data: options.variables.input,
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        isArchived: true,
        updatedAt: true,
      },
    });

    return { data: { updateProject: result } };
  };

  return [updateProject, { loading, error }] as const;
};

/**
 * Hook: Delete/Archive project
 * 
 * @example
 * const [deleteProject] = useDeleteProject();
 * await deleteProject({ variables: { id: "uuid" } });
 */
export const useDeleteProject = () => {
  const [deleteOne, { data, loading, error }] = useDeleteOne<Project>('project', {
    refetchQueries: ['FindManyProject'], // Auto refetch project list after delete
  });

  const deleteProject = async (options: { variables: { id: string } }) => {
    const result = await deleteOne({
      where: options.variables.id,
      select: {
        id: true,
        name: true,
      },
    });

    return { data: { deleteProject: result } };
  };

  return [deleteProject, { loading, error }] as const;
};

/**
 * Hook: Add member to project
 * Note: This requires custom backend mutation, not covered by Dynamic GraphQL CRUD
 * We'll keep using the custom GraphQL mutation for this
 */
export const useAddMember = () => {
  // This will be implemented with custom mutation
  // For now, return placeholder
  const addMember = async () => {
    throw new Error('useAddMember: Not implemented yet - requires custom mutation');
  };

  return [addMember, { loading: false, error: null }] as const;
};

/**
 * Hook: Remove member from project
 * Note: This requires custom backend mutation
 */
export const useRemoveMember = () => {
  const removeMember = async () => {
    throw new Error('useRemoveMember: Not implemented yet - requires custom mutation');
  };

  return [removeMember, { loading: false, error: null }] as const;
};

/**
 * Hook: Update member role
 * Note: This requires custom backend mutation
 */
export const useUpdateMemberRole = () => {
  const updateRole = async () => {
    throw new Error('useUpdateMemberRole: Not implemented yet - requires custom mutation');
  };

  return [updateRole, { loading: false, error: null }] as const;
};

// ==================== EXPORT ALL ====================

export default {
  // Queries
  useMyProjects,
  useProject,
  useProjectMembers,
  // Mutations
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddMember,
  useRemoveMember,
  useUpdateMemberRole,
};
