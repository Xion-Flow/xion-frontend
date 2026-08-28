export type Role = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface ProjectInvite {
  id: string;
  projectId: string;
  inviterId: string;
  inviteeId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  project?: {
    id: string;
    name: string;
    description?: string | null;
    techStack?: string | null;
  };
  inviter?: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string | null;
  };
  invitee?: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: string | null;
  isRead: boolean;
  createdAt: string;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED';

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: Role;
  joinedAt: string;
  user: User;
}

export type PhaseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type DeliverableStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface ProjectDeliverable {
  id: string;
  projectPhaseId: string;
  deliverableTemplateId?: string | null;
  name: string;
  description: string;
  isRequired: boolean;
  order: number;
  status: DeliverableStatus;
  assignedToId?: string | null;
  assignedTo?: User | null;
  dueDate?: string | null;
  documentUrl?: string | null;
  notes?: string | null;
  completedAt?: string | null;
  projectPhase?: {
    id: string;
    name: string;
    projectId: string;
    project?: {
      id: string;
      name: string;
      techStack?: string;
    };
  };
}

export interface ProjectPhase {
  id: string;
  projectId: string;
  phaseTemplateId?: string | null;
  name: string;
  description: string;
  objective?: string | null;
  order: number;
  status: PhaseStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  deliverables: ProjectDeliverable[];
}

export type ProjectType = 'PERSONAL' | 'TEAM';

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  techStack?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  targetDate?: string | null;
  status: ProjectStatus;
  type: ProjectType;
  createdById: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
  phases?: ProjectPhase[];
  progress?: number;
  currentPhase?: {
    id: string;
    name: string;
    order: number;
  } | null;
  deliverablesCount?: number;
  completedDeliverablesCount?: number;
}

export interface PhaseTemplate {
  id: string;
  name: string;
  description: string;
  objective: string;
  order: number;
  activities: string[];
  deliverables: {
    id: string;
    name: string;
    description: string;
    isRequired: boolean;
    order: number;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalDeliverables: number;
  completedDeliverables: number;
  totalPhases: number;
  completionRate: number;
}
