'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/services/public/apiClient';
import { DEVICE_LIMIT_CODE, courseAccessService, type CustomerDevice } from '@/services/courses/courseAccessService';

export type CourseSessionState = { status: 'idle' | 'starting' | 'active' | 'limit' | 'revoked' | 'error'; sessionId?: string; devices?: CustomerDevice[]; message?: string };

// Reserva uma das vagas de aparelho do curso (o backend recusa com 409 DEVICE_LIMIT
// quando já há o máximo de sessões ativas) e mantém a sessão viva com heartbeat.
export function useCourseSession(courseId?: string) {
  const [state, setState] = useState<CourseSessionState>({ status: 'idle' });
  const sessionRef = useRef<string>();

  const start = useCallback(async () => {
    if (!courseId) return;
    setState({ status: 'starting' });
    try {
      const session = await courseAccessService.startSession(courseId);
      sessionRef.current = session.sessionId;
      setState({ status: 'active', sessionId: session.sessionId });
    } catch (error) {
      if (error instanceof ApiError && error.code === DEVICE_LIMIT_CODE) {
        const devices = (error.details as { devices?: CustomerDevice[] } | undefined)?.devices ?? await courseAccessService.devices().catch(() => []);
        setState({ status: 'limit', devices, message: error.message });
      } else setState({ status: 'error', message: error instanceof Error ? error.message : 'Não foi possível abrir a aula.' });
    }
  }, [courseId]);

  useEffect(() => { start(); }, [start]);

  useEffect(() => {
    if (state.status !== 'active' || !state.sessionId) return;
    const sessionId = state.sessionId;
    const beat = () => courseAccessService.heartbeat(sessionId).catch((error) => { if (error instanceof ApiError && (error.status === 409 || error.status === 410)) setState({ status: 'revoked', message: 'Esta sessão foi encerrada porque sua conta entrou em outro aparelho.' }); });
    const timer = setInterval(beat, 60_000);
    const end = () => { if (sessionRef.current) navigator.sendBeacon?.(`/api/me/course-sessions/${encodeURIComponent(sessionRef.current)}/end`); };
    window.addEventListener('pagehide', end);
    return () => { clearInterval(timer); window.removeEventListener('pagehide', end); courseAccessService.endSession(sessionId).catch(() => undefined); sessionRef.current = undefined; };
  }, [state.status, state.sessionId]);

  const freeDevice = useCallback(async (deviceId: string) => { await courseAccessService.revokeDevice(deviceId); await start(); }, [start]);
  return { ...state, retry: start, freeDevice };
}
