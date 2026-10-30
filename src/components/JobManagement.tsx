import React, { useEffect, useState } from 'react';
import { useToast } from '../shared/notify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Camera, DollarSign, MessageCircle } from 'lucide-react';

// Mock data for demo
const mockJobs = [
  {
    id: 'job1',
    status: 'accepted',
    client: 'Amine K.',
    vehicle: 'Dacia Logan 2019',
    scenario: 'battery',
    icon: '🔋',
    agreedPrice: 250,
    acceptedAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    startedAt: null,
    autoCloseDeadline: new Date(Date.now() + 22 * 3600000).toISOString(), // 22 hours left
    quoteUpdatePending: false,
    disputeOpen: false,
  },
  {
    id: 'job2',
    status: 'in_progress',
    client: 'Sara M.',
    vehicle: 'Peugeot 208 2020',
    scenario: 'tire',
    icon: '🛞',
    agreedPrice: 350,
    acceptedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    startedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    autoCloseDeadline: new Date(Date.now() + 19 * 3600000).toISOString(),
    quoteUpdatePending: false,
    disputeOpen: false,
  },
];

export const JobManagement: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(mockJobs);

  // Auto-close simulation (in production, this would be a background worker)
  useEffect(() => {
    const interval = setInterval(() => {
      jobs.forEach((job) => {
        if (job.status === 'in_progress' && !job.quoteUpdatePending && !job.disputeOpen) {
          const timeLeft = new Date(job.autoCloseDeadline).getTime() - Date.now();
          if (timeLeft <= 0) {
            // Auto-close job
            setJobs((prev) =>
              prev.map((j) =>
                j.id === job.id ? { ...j, status: 'auto_closed', autoClosed: true } : j
              )
            );
            toast(`Job ${job.id} auto-clôturé après 24h`);
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [jobs]);

  const getTimeLeft = (deadline: string) => {
    const timeLeft = Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 3600000));
    return timeLeft;
  };

  const getTimeColor = (hoursLeft: number) => {
    if (hoursLeft <= 1) return 'text-red-600 bg-red-50';
    if (hoursLeft <= 4) return 'text-orange-600 bg-orange-50';
    return 'text-slate-600 bg-slate-50';
  };

  const handleStartJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: 'in_progress', startedAt: new Date().toISOString() } : j
      )
    );
  };

  const handleCloseJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'completed' } : j))
    );
    toast('Job clôturé avec succès !');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Gestion des Jobs</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Auto-close Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Clôture automatique après 24h</p>
              <p className="text-xs text-blue-700 mt-1">
                Si vous ne clôturez pas un job dans les 24h suivant le début, il sera automatiquement marqué comme terminé et la commission sera prélevée.
              </p>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucun job en cours</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const hoursLeft = getTimeLeft(job.autoCloseDeadline);
              const timeColor = getTimeColor(hoursLeft);

              return (
                <div key={job.id} className="bg-white rounded-2xl p-4 border border-slate-200">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{job.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800">{job.client}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          job.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          job.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                          job.status === 'auto_closed' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {job.status === 'accepted' && 'Accepté'}
                          {job.status === 'in_progress' && 'En cours'}
                          {job.status === 'completed' && 'Terminé'}
                          {job.status === 'auto_closed' && 'Auto-clôturé'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{job.vehicle}</p>
                    </div>
                  </div>

                  {/* Auto-close Countdown */}
                  {job.status === 'in_progress' && (
                    <div className={`mb-3 p-3 rounded-xl ${timeColor}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Clôture auto dans
                        </span>
                        <span className="text-lg font-bold">{hoursLeft}h</span>
                      </div>
                      {hoursLeft <= 4 && (
                        <p className="text-xs mt-1">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Rappel : clôturez le job pour éviter l'auto-clôture
                        </p>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-600">Prix convenu</span>
                    <span className="text-lg font-bold text-slate-800">{job.agreedPrice} MAD</span>
                  </div>

                  {/* Actions */}
                  {job.status === 'accepted' && (
                    <button
                      onClick={() => handleStartJob(job.id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                    >
                      Démarrer l'intervention
                    </button>
                  )}

                  {job.status === 'in_progress' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/provider/job/${job.id}/diagnosis`)}
                        className="py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700"
                      >
                        <Camera className="w-4 h-4 inline mr-1" />
                        Diagnostic
                      </button>
                      <button
                        onClick={() => handleCloseJob(job.id)}
                        className="py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Clôturer
                      </button>
                    </div>
                  )}

                  {job.status === 'auto_closed' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-sm text-red-700">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Ce job a été auto-clôturé. La commission a été prélevée.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
