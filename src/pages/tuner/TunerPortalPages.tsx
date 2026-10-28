import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Eye, Star } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import {
  Appointment,
  formatMoney,
  loadState,
  saveState,
  seedTunerAppointments,
  seedTunerProjects,
  seedTunerRequests,
  TunerProject,
  TunerRequest,
} from '../../shared/portalStore';

const PROJECT_KEYS = { projects: 'tuner.projects', requests: 'tuner.requests', appointments: 'tuner.appointments' };

const projectStatusLabels: Record<TunerProject['status'], string> = {
  quote: 'Devis envoyé',
  accepted: 'Accepté',
  work_in_progress: 'En cours',
  quality_check: 'Contrôle qualité',
  completed: 'Terminé',
};

const requestStatusConfig: Record<TunerRequest['status'], { label: string; className: string }> = {
  new: { label: 'Nouvelle', className: 'bg-blue-100 text-blue-700' },
  quoted: { label: 'Devis envoyé', className: 'bg-purple-100 text-purple-700' },
  accepted: { label: 'Acceptée', className: 'bg-green-100 text-green-700' },
  declined: { label: 'Refusée', className: 'bg-red-100 text-red-700' },
};

export function TunerRequestsPage() {
  const [requests, setRequests] = useState<TunerRequest[]>([]);
  const [filter, setFilter] = useState<'all' | TunerRequest['status']>('all');

  useEffect(() => {
    setRequests(loadState(PROJECT_KEYS.requests, seedTunerRequests));
  }, []);

  const update = (id: number, patch: Partial<TunerRequest>) => {
    setRequests((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      saveState(PROJECT_KEYS.requests, next);
      return next;
    });
  };

  const visible = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  return (
    <main className="h-full overflow-y-auto"><div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Demandes de tuning</h1>
        <p className="mt-1 text-sm text-red-100">Répondez aux demandes des clients et convertissez-les en projets.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'quoted', 'accepted', 'declined'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f ? 'bg-red-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'Toutes' : requestStatusConfig[f].label}
            <span className="ml-1.5 text-xs opacity-70">
              {f === 'all' ? requests.length : requests.filter((r) => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Aucune demande dans cette catégorie.
          </div>
        )}
        {visible.map((req) => (
          <div key={req.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-900">{req.vehicle}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${requestStatusConfig[req.status].className}`}>
                    {requestStatusConfig[req.status].label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {req.service} • {req.customerName} • {req.city}
                </p>
                <p className="mt-2 text-sm text-slate-500">{req.message}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Budget estimé : {formatMoney(req.budget)} • Reçue le {new Date(req.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {req.status === 'new' && (
                  <>
                    <button
                      onClick={() => update(req.id, { status: 'quoted' })}
                      className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
                    >
                      Envoyer un devis
                    </button>
                    <button
                      onClick={() => update(req.id, { status: 'declined' })}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Refuser
                    </button>
                  </>
                )}
                {req.status === 'quoted' && (
                  <button
                    onClick={() => update(req.id, { status: 'accepted' })}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Marquer comme acceptée
                  </button>
                )}
                {req.status === 'accepted' && (
                  <Link
                    to="/tuner/projects"
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Voir le projet
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </main>
  );
}

export function TunerProjectsPage() {
  const [projects, setProjects] = useState<TunerProject[]>([]);

  useEffect(() => {
    setProjects(loadState(PROJECT_KEYS.projects, seedTunerProjects));
  }, []);

  const update = (id: number, patch: Partial<TunerProject>) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      saveState(PROJECT_KEYS.projects, next);
      return next;
    });
  };

  return (
    <main className="h-full overflow-y-auto"><div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Projets de tuning</h1>
        <p className="mt-1 text-sm text-red-100">Suivez l'avancement de vos projets.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">{project.vehicle}</h2>
                <p className="text-sm text-slate-600">{project.projectType}</p>
                <p className="mt-1 text-xs text-slate-400">Client : {project.customerName}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {projectStatusLabels[project.status]}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Avancement</span>
                <span>{project.progress}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Budget</span>
              <span className="font-semibold text-slate-900">{formatMoney(project.budget)}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/tuner/projects/${project.id}`}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Eye className="mr-1.5 inline-block h-4 w-4" />
                Détails
              </Link>
              {project.status !== 'completed' && (
                <button
                  onClick={() =>
                    update(project.id, { progress: Math.min(100, project.progress + 15) })
                  }
                  className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  + Progression
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
    </main>
  );
}

export function TunerProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<TunerProject[] | null>(null);

  useEffect(() => {
    setProjects(loadState(PROJECT_KEYS.projects, seedTunerProjects));
  }, []);

  const project = projects?.find((p) => p.id === Number(id));

  if (projects && !project) {
    return (
      <main className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">Projet introuvable.</p>
          <Link to="/tuner/projects" className="mt-4 inline-block text-sm font-medium text-red-600">
            ← Retour aux projets
          </Link>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-red-600" />
      </main>
    );
  }

  const advance = () => {
    const order: TunerProject['status'][] = ['quote', 'accepted', 'work_in_progress', 'quality_check', 'completed'];
    const idx = order.indexOf(project.status);
    const nextStatus = order[Math.min(order.length - 1, idx + 1)];
    const nextProgress = nextStatus === 'completed' ? 100 : Math.max(project.progress, (idx + 1) * 25);
    setProjects((prev) => {
      const next = (prev ?? []).map((p) =>
        p.id === project.id ? { ...p, status: nextStatus, progress: nextProgress } : p
      );
      saveState(PROJECT_KEYS.projects, next);
      return next;
    });
  };

  return (
    <main className="h-full overflow-y-auto"><div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.vehicle}</h1>
            <p className="mt-1 text-slate-600">{project.projectType}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
            {projectStatusLabels[project.status]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Budget" value={formatMoney(project.budget)} icon={<DollarSign className="h-5 w-5" />} color="green" />
          <StatCard title="Avancement" value={`${project.progress}%`} icon={<CheckCircle className="h-5 w-5" />} color="blue" />
          <StatCard
            title="Prochain RDV"
            value={new Date(project.nextAppointment).toLocaleDateString('fr-FR')}
            icon={<Clock className="h-5 w-5" />}
            color="orange"
          />
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">Client : {project.customerName}</p>
        </div>

        {project.status !== 'completed' && (
          <button
            onClick={advance}
            className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 sm:w-auto"
          >
            Faire avancer le projet
          </button>
        )}
      </div>
      </div>
    </main>
  );
}

export function TunerCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setAppointments(loadState(PROJECT_KEYS.appointments, seedTunerAppointments));
  }, []);

  const update = (id: number, status: Appointment['status']) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status } : a));
      saveState(PROJECT_KEYS.appointments, next);
      return next;
    });
  };

  const sorted = useMemo(
    () => [...appointments].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [appointments]
  );

  const statusStyle: Record<Appointment['status'], string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <main className="h-full overflow-y-auto"><div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="mt-1 text-sm text-red-100">Gérez vos rendez-vous clients.</p>
      </header>

      <div className="space-y-3">
        {sorted.map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-red-50 text-red-600">
                <span className="text-xs font-medium">{new Date(a.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                <span className="text-lg font-bold leading-none">{new Date(a.date).getDate()}</span>
                <span className="text-[10px]">{a.time}</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{a.vehicle}</p>
                <p className="text-sm text-slate-600">{a.service}</p>
                <p className="text-xs text-slate-400">{a.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[a.status]}`}>{a.status === 'scheduled' ? 'Planifié' : a.status === 'confirmed' ? 'Confirmé' : a.status === 'completed' ? 'Terminé' : 'Annulé'}</span>
              {(a.status === 'scheduled' || a.status === 'confirmed') && (
                <>
                  {a.status === 'scheduled' && (
                    <button
                      onClick={() => update(a.id, 'confirmed')}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Confirmer
                    </button>
                  )}
                  <button
                    onClick={() => update(a.id, 'completed')}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-900"
                  >
                    Terminer
                  </button>
                  <button
                    onClick={() => update(a.id, 'cancelled')}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
    </main>
  );
}

export function TunerPortfolioPage() {
  const navigate = useNavigate();
  const completed = loadState<TunerProject[]>(PROJECT_KEYS.projects, seedTunerProjects).filter(
    (p) => p.status === 'completed'
  );

  return (
    <main className="h-full overflow-y-auto"><div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="mt-1 text-sm text-red-100">Mettez en avant vos plus belles réalisations.</p>
          </div>
          <Star className="h-8 w-8 text-yellow-300" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {completed.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-900 to-red-950 text-5xl">
              🏁
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-slate-900">{p.vehicle}</h2>
              <p className="text-sm text-slate-600">{p.projectType}</p>
              <p className="mt-2 text-xs text-slate-400">Budget : {formatMoney(p.budget)}</p>
            </div>
          </div>
        ))}
        <button
          onClick={() => navigate('/tuner/gallery-upload')}
          className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-slate-500 transition hover:border-red-300 hover:text-red-600"
        >
          <span className="text-3xl">＋</span>
          <span className="text-sm font-medium">Ajouter des photos / vidéos</span>
        </button>
      </div>
      </div>
    </main>
  );
}
