import { publicApiDelete, publicApiGet, publicApiPost } from '../public/apiClient';
import { mapCourseFromApi } from '../store/storeService';
import type { OnlineCourse } from '../store/types';

export type CourseAccess = { id: string; code: string; course: OnlineCourse; status: 'ATIVO' | 'EXPIRADO' | 'REVOGADO'; progressPercent: number; lastLessonId?: string; startedAt?: string; expiresAt?: string | null };
export type ClassroomLesson = { id: string; title: string; durationMinutes?: number; completed: boolean; description?: string; materials?: Array<{ label: string; url: string }> };
export type Classroom = { access: CourseAccess; modules: Array<{ id: string; title: string; lessons: ClassroomLesson[] }> };
export type Playback = { url: string; kind: 'mp4' | 'hls' | 'embed'; expiresAt?: string };
export type DeviceSession = { sessionId: string; heartbeatSeconds: number };
export type CustomerDevice = { id: string; name: string; lastSeenAt: string; current: boolean; watching?: string | null };

export const DEVICE_LIMIT_CODE = 'DEVICE_LIMIT';
export const SESSION_REVOKED_CODE = 'SESSION_REVOKED';

type Raw = Record<string, unknown>;
const unwrap = <T>(payload: unknown): T => (payload && typeof payload === 'object' && 'data' in payload ? (payload as { data: T }).data : payload as T);
const mapAccess = (raw: Raw): CourseAccess => ({ id: String(raw.id ?? ''), code: String(raw.code ?? raw.codigo ?? raw.token ?? ''), course: mapCourseFromApi((raw.course ?? raw.curso ?? {}) as Raw), status: (String(raw.status ?? 'ATIVO') as CourseAccess['status']), progressPercent: Number(raw.progressPercent ?? raw.progresso ?? 0), lastLessonId: raw.lastLessonId ? String(raw.lastLessonId) : undefined, startedAt: raw.startedAt as string | undefined, expiresAt: (raw.expiresAt ?? null) as string | null });

// O aparelho é identificado pelo backend via cookie httpOnly (cg_device), criado no primeiro
// POST de sessão; o front só manda um nome amigável para a lista de dispositivos.
export function describeDevice() {
  const ua = navigator.userAgent;
  const os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad/i.test(ua) ? 'iPhone/iPad' : /Windows/i.test(ua) ? 'Windows' : /Mac/i.test(ua) ? 'Mac' : /Linux/i.test(ua) ? 'Linux' : 'Dispositivo';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Navegador';
  return `${browser} no ${os}`;
}

export const courseAccessService = {
  myCourses: async () => unwrap<Raw[]>(await publicApiGet('/api/me/courses')).map(mapAccess),
  classroom: async (slug: string): Promise<Classroom> => { const data = unwrap<Raw>(await publicApiGet(`/api/me/courses/${encodeURIComponent(slug)}`)); return { access: mapAccess((data.access as Raw) ?? data), modules: (data.modules ?? []) as Classroom['modules'] }; },
  redeem: async (code: string) => mapAccess(unwrap<Raw>(await publicApiPost('/api/me/courses/redeem', { code: code.trim().toUpperCase() }))),
  startSession: async (courseId: string) => unwrap<DeviceSession>(await publicApiPost(`/api/me/courses/${encodeURIComponent(courseId)}/sessions`, { deviceName: describeDevice() })),
  heartbeat: (sessionId: string) => publicApiPost<unknown>(`/api/me/course-sessions/${encodeURIComponent(sessionId)}/heartbeat`, {}),
  endSession: (sessionId: string) => publicApiDelete<unknown>(`/api/me/course-sessions/${encodeURIComponent(sessionId)}`),
  playback: async (lessonId: string, sessionId: string) => unwrap<Playback>(await publicApiGet(`/api/me/lessons/${encodeURIComponent(lessonId)}/playback?sessionId=${encodeURIComponent(sessionId)}`)),
  saveProgress: (lessonId: string, body: { seconds: number; completed: boolean }) => publicApiPost<unknown>(`/api/me/lessons/${encodeURIComponent(lessonId)}/progress`, body),
  devices: async () => unwrap<CustomerDevice[]>(await publicApiGet('/api/me/devices')),
  revokeDevice: (deviceId: string) => publicApiDelete<unknown>(`/api/me/devices/${encodeURIComponent(deviceId)}`)
};
