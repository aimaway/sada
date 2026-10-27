import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  AlertCircle,
  Plus,
  Eye,
  BarChart3,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { RevenueChart } from '../components/ui/RevenueChart';
import { useApp } from '../shared/context';

type DashboardData = {
  newRequests: number;
  activeProjects: number;
  completedProjects: number;
  upcomingAppointments: number;
  revenue: number;
  customerSatisfaction: number;
  revenueData: Array<{ date: string; revenue: number }>;
  currentProject: {
    id: number;
    vehicle: string;
    projectType: string;
    status: string;
    nextAppointment: string;
    budget: number;
  } | null;
  upcomingAppointmentsList: Array<{
    id: number;
    vehicle: string;
    service: string;
    date: string;
    time: string;
    customerName: string;
    status: string;
  }>;
};

export function TunerDashboard() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // TODO: Fetch real data from API
    // For now, use mock data
    const mockData: DashboardData = {
      newRequests: 8,
      activeProjects: 5,
      completedProjects: 47,
      upcomingAppointments: 3,
      revenue: 2850000, // 28,500 MAD in cents
      customerSatisfaction: 4.8,
      revenueData: [
        { date: '01/03', revenue: 180000 },
        { date: '02/03', revenue: 245000 },
        { date: '03/03', revenue: 198000 },
        { date: '04/03', revenue: 312000 },
        { date: '05/03', revenue: 267000 },
        { date: '06/03', revenue: 345000 },
        { date: '07/03', revenue: 298000 },
      ],
      currentProject: {
        id: 1,
        vehicle: 'BMW M3 2020',
        projectType: 'Stage 2 Tuning',
        status: 'work_in_progress',
        nextAppointment: '2024-03-18 14:00',
        budget: 850000,
      },
      upcomingAppointmentsList: [
        {
          id: 1,
          vehicle: 'Golf GTI 2019',
          service: 'Reprogrammation ECU',
          date: '2024-03-16',
          time: '10:00',
          customerName: 'Mohamed K.',
          status: 'confirmed',
        },
        {
          id: 2,
          vehicle: 'Clio RS 2018',
          service: 'Échappement sport',
          date: '2024-03-17',
          time: '14:30',
          customerName: 'Youssef B.',
          status: 'scheduled',
        },
        {
          id: 3,
          vehicle: 'Audi A4 2021',
          service: 'Diagnostic complet',
          date: '2024-03-18',
          time: '09:00',
          customerName: 'Karim L.',
          status: 'scheduled',
        },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(value / 100);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
          <p className="mt-4 text-sm text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-sm text-slate-600">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white sm:p-8">
          <p className="text-sm text-red-100">Espace professionnel</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Espace Tuner</h1>
          <p className="mt-2 max-w-2xl text-sm text-red-100">
            Gérez vos projets de tuning, vos rendez-vous et votre activité.
          </p>
        </header>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Nouvelles demandes"
            value={data.newRequests}
            subtitle="À traiter"
            icon={<Wrench className="h-5 w-5" />}
            color="blue"
          />
          <StatCard
            title="Projets actifs"
            value={data.activeProjects}
            subtitle="En cours"
            icon={<Clock className="h-5 w-5" />}
            color="purple"
          />
          <StatCard
            title="Projets terminés"
            value={data.completedProjects}
            subtitle="Total"
            icon={<CheckCircle className="h-5 w-5" />}
            color="green"
          />
          <StatCard
            title="Rendez-vous"
            value={data.upcomingAppointments}
            subtitle="À venir"
            icon={<Calendar className="h-5 w-5" />}
            color="orange"
          />
          <StatCard
            title="Revenus"
            value={formatMoney(data.revenue)}
            subtitle="Ce mois"
            icon={<DollarSign className="h-5 w-5" />}
            color="green"
          />
          <StatCard
            title="Satisfaction"
            value={`${data.customerSatisfaction}/5`}
            subtitle="Note moyenne"
            icon={<Star className="h-5 w-5" />}
            color="blue"
          />
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Revenue Chart */}
          <div className="xl:col-span-2">
            <RevenueChart data={data.revenueData} title="Évolution des revenus" />
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Actions rapides</h2>
            <div className="mt-4 grid gap-3">
              <Link
                to="/tuner/requests"
                className="rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Eye className="mr-2 inline-block h-4 w-4" />
                Voir les demandes
              </Link>
              <Link
                to="/tuner/projects"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Wrench className="mr-2 inline-block h-4 w-4" />
                Gérer les projets
              </Link>
              <Link
                to="/tuner/calendar"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Calendar className="mr-2 inline-block h-4 w-4" />
                Calendrier
              </Link>
              <Link
                to="/tuner/portfolio"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Star className="mr-2 inline-block h-4 w-4" />
                Portfolio
              </Link>
            </div>
          </div>
        </section>

        {/* Current Project */}
        {data.currentProject && (
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Projet en cours</h2>
              <Link
                to={`/tuner/projects/${data.currentProject.id}`}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Voir détails →
              </Link>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{data.currentProject.vehicle}</h3>
                  <p className="mt-1 text-sm text-slate-600">{data.currentProject.projectType}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Statut</p>
                      <p className="text-sm font-medium text-slate-900">
                        {data.currentProject.status === 'work_in_progress' ? 'En cours' : data.currentProject.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Prochain RDV</p>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(data.currentProject.nextAppointment).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Budget</p>
                      <p className="text-sm font-medium text-slate-900">
                        {formatMoney(data.currentProject.budget)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Appointments */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Prochains rendez-vous</h2>
            <Link
              to="/tuner/calendar"
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Voir tout →
            </Link>
          </div>

          <div className="space-y-3">
            {data.upcomingAppointmentsList.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                    <Calendar className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{appointment.vehicle}</p>
                    <p className="text-sm text-slate-600">{appointment.service}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {appointment.customerName} •{' '}
                      {new Date(appointment.date).toLocaleDateString('fr-FR')} à{' '}
                      {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {appointment.status === 'confirmed' ? 'Confirmé' : 'Planifié'}
                  </span>
                  <Link
                    to={`/tuner/appointments/${appointment.id}`}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
