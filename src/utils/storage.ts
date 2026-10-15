import { TeacherWorkspace, InitiativeGuidance } from '../types';
import { INITIAL_WORKSPACE, INITIAL_GUIDANCE } from '../data/initialData';

const WORKSPACES_STORAGE_KEY = 'nojoum_altamayyuz_workspaces_v2';
const CURRENT_WORKSPACE_KEY = 'nojoum_altamayyuz_current_ws_id_v2';
const GUIDANCE_STORAGE_KEY = 'nojoum_altamayyuz_guidance_v2';

export function loadWorkspaces(): TeacherWorkspace[] {
  try {
    const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    if (!raw) {
      saveWorkspaces([INITIAL_WORKSPACE]);
      return [INITIAL_WORKSPACE];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Migrate and ensure 2026 / 2027 school year, sections and subjects exist
      const migrated = parsed.map((ws: TeacherWorkspace) => ({
        ...ws,
        schoolYear: ws.schoolYear?.includes('2024') || !ws.schoolYear ? '2026 / 2027 م' : ws.schoolYear,
        availableSections: ws.availableSections && ws.availableSections.length > 0 ? ws.availableSections : ['1', '2', '3', '4'],
        availableSubjects: ws.availableSubjects && ws.availableSubjects.length > 0 ? ws.availableSubjects : INITIAL_WORKSPACE.availableSubjects
      }));
      return migrated;
    }
    return [INITIAL_WORKSPACE];
  } catch (e) {
    console.error('Error loading workspaces from localStorage', e);
    return [INITIAL_WORKSPACE];
  }
}

export function saveWorkspaces(workspaces: TeacherWorkspace[]): void {
  try {
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
  } catch (e) {
    console.error('Error saving workspaces to localStorage', e);
  }
}

export function loadCurrentWorkspaceId(): string {
  try {
    const id = localStorage.getItem(CURRENT_WORKSPACE_KEY);
    if (id) return id;
    return INITIAL_WORKSPACE.id;
  } catch {
    return INITIAL_WORKSPACE.id;
  }
}

export function saveCurrentWorkspaceId(id: string): void {
  try {
    localStorage.setItem(CURRENT_WORKSPACE_KEY, id);
  } catch (e) {
    console.error('Error saving current workspace id', e);
  }
}

export function loadGuidance(): InitiativeGuidance[] {
  try {
    const raw = localStorage.getItem(GUIDANCE_STORAGE_KEY);
    if (!raw) return INITIAL_GUIDANCE;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_GUIDANCE;
  } catch {
    return INITIAL_GUIDANCE;
  }
}

export function saveGuidance(guidance: InitiativeGuidance[]): void {
  try {
    localStorage.setItem(GUIDANCE_STORAGE_KEY, JSON.stringify(guidance));
  } catch (e) {
    console.error('Error saving guidance', e);
  }
}

/**
 * Export a single workspace as a downloadable JSON file
 */
export function exportWorkspaceJSON(workspace: TeacherWorkspace) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspace, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const cleanName = `${workspace.teacherName || 'معلمة'}_${workspace.grade || 'صف'}_${workspace.section || 'شعبة'}`.replace(/\s+/g, '_');
  downloadAnchor.setAttribute("download", `نسخة_نجوم_التميز_${cleanName}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Play a cheerful Web Audio celebratory chime
 */
export function playChime(type: 'star' | 'gift' | 'attendance' | 'tada' = 'star') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'star') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    } else if (type === 'tada' || type === 'gift') {
      const notes = [392, 523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.45);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // Audio context may be muted or blocked by browser policy
  }
}

const INVITE_LINKS_KEY = 'nojoum_altamayyuz_invite_links_v1';

export function loadInviteLinks(): any[] {
  try {
    const raw = localStorage.getItem(INVITE_LINKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInviteLinks(links: any[]): void {
  try {
    localStorage.setItem(INVITE_LINKS_KEY, JSON.stringify(links));
  } catch (e) {
    console.error('Error saving invite links', e);
  }
}

export function getGeneralDirectUrl(baseUrlOverride?: string): string {
  if (baseUrlOverride && baseUrlOverride.trim()) {
    const trimmed = baseUrlOverride.trim();
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
  }
  return window.location.origin + window.location.pathname;
}

export function generateTeacherInviteUrl(
  teacherName: string,
  schoolName: string,
  grade: string,
  section: string,
  year: string = '2026 / 2027 م',
  baseUrlOverride?: string
): string {
  const base = getGeneralDirectUrl(baseUrlOverride);
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const params = new URLSearchParams({
    mode: 'teacher_setup',
    teacher: teacherName.trim(),
    school: schoolName.trim(),
    grade: grade.trim(),
    section: section.trim(),
    year: year.trim(),
    author: 'الأستاذة باسمة الحكمانية'
  });
  return `${cleanBase}/?${params.toString()}`;
}

export function parseTeacherInviteFromUrl(): {
  teacher: string;
  school: string;
  grade: string;
  section: string;
  year: string;
} | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const teacher = params.get('teacher');
    const grade = params.get('grade');
    if (!teacher || !grade) return null;

    return {
      teacher: teacher.trim(),
      school: (params.get('school') || 'مدرسة الحلقة الأولى').trim(),
      grade: grade.trim(),
      section: (params.get('section') || '1').trim(),
      year: (params.get('year') || '2026 / 2027 م').trim(),
    };
  } catch {
    return null;
  }
}

