import { User, Project, ProjectType, ProjectDeliverable, PhaseTemplate, AdminStats } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('xion_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An unexpected server error occurred.');
  }
  return data as T;
}

export const api = {
  // Auth & Profile
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string; user: User }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ user: User }>(res);
  },

  async updateProfile(name: string, username?: string, avatarUrl?: string) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name, username, avatarUrl }),
    });
    return handleResponse<{ user: User; message: string }>(res);
  },

  async checkUsername(username: string) {
    const res = await fetch(`${API_BASE}/users/check-username?username=${encodeURIComponent(username)}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ available: boolean; isCurrent?: boolean; reason?: string }>(res);
  },

  async searchUsers(query: string) {
    const res = await fetch(`${API_BASE}/users/search?query=${encodeURIComponent(query)}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ users: User[] }>(res);
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ stats: AdminStats; recentProjects: Project[]; recentUsers: User[] }>(res);
  },

  async resetUserPassword(userId: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/admin/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ userId, newPassword }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Users Management
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ users: User[] }>(res);
  },

  async createUser(data: { name: string; email: string; password: string; role: string }) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ user: User; message: string }>(res);
  },

  async updateUser(id: string, data: Partial<User>) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ user: User }>(res);
  },

  async deleteUser(id: string) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ projects: Project[] }>(res);
  },

  async createProject(data: { name: string; description?: string; techStack?: string; githubUrl?: string; demoUrl?: string; targetDate?: string; type?: ProjectType; memberIds?: string[] }) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ project: Project; message: string }>(res);
  },

  async getProjectDetails(id: string) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ project: Project; progressSummary: any }>(res);
  },

  async updateProject(id: string, data: Partial<Project>) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ project: Project; message: string }>(res);
  },

  async addProjectMembers(id: string, memberIds: string[]) {
    const res = await fetch(`${API_BASE}/projects/${id}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ memberIds }),
    });
    return handleResponse<{ message: string }>(res);
  },

  async removeProjectMember(id: string, userId: string) {
    const res = await fetch(`${API_BASE}/projects/${id}/members/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async archiveProject(id: string, archive: boolean) {
    const res = await fetch(`${API_BASE}/projects/${id}/archive`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ archive }),
    });
    return handleResponse<{ project: Project; message: string }>(res);
  },

  async deleteProject(id: string) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async leaveProject(id: string) {
    const res = await fetch(`${API_BASE}/projects/${id}/leave`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Deliverables
  async getMyWork(status: string = 'ALL', sortBy: string = 'createdAt') {
    const res = await fetch(`${API_BASE}/deliverables/my-work?status=${status}&sortBy=${sortBy}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ deliverables: ProjectDeliverable[] }>(res);
  },

  async updateDeliverable(id: string, data: Partial<ProjectDeliverable>) {
    const res = await fetch(`${API_BASE}/deliverables/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ deliverable: ProjectDeliverable; message: string }>(res);
  },

  // Development Guide
  async getGuide() {
    const res = await fetch(`${API_BASE}/guide`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ phases: PhaseTemplate[] }>(res);
  },

  // Project Invites & Notifications
  async sendProjectInvite(projectId: string, username: string) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/invites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ username }),
    });
    return handleResponse<{ message: string; invite: any }>(res);
  },

  async getProjectInvites(projectId: string) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/invites`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ invites: any[] }>(res);
  },

  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ notifications: any[]; pendingInvites: any[]; unreadCount: number }>(res);
  },

  async respondToInvite(inviteId: string, action: 'ACCEPT' | 'DECLINE') {
    const res = await fetch(`${API_BASE}/invites/${inviteId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ action }),
    });
    return handleResponse<{ message: string }>(res);
  },

  async markNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async clearNotifications() {
    const res = await fetch(`${API_BASE}/notifications/clear`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },
};
