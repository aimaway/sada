import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../shared/context';
import { Card, Button } from '../shared/components';
import { mockNotifications, mockLegalDocuments, getDaysUntilExpiry } from '../shared/unifiedMockData';
import { ArrowLeft, Bell, AlertTriangle, CheckCircle2, Clock, FileText, Settings, Filter } from 'lucide-react';

export function NotificationsScreen() {
  const { language, user } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'documents' | 'jobs'>('all');
  const [notifications, setNotifications] = useState(mockNotifications.filter(n => n.user_id === user?.id));

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'documents') return n.type === 'document_expiry';
    if (filter === 'jobs') return n.type === 'job_update' || n.type === 'offer_received';
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const documentExpiryCount = notifications.filter(n => n.type === 'document_expiry' && !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/customer/home')} className="p-1.5 -ms-1 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800 flex-1">
          {language === 'fr' ? 'Notifications' : 'الإشعارات'}
        </h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-xs text-emerald-600 font-medium">
            {language === 'fr' ? 'Tout marquer lu' : 'تحديد الكل كمقروء'}
          </button>
        )}
      </div>

      {/* Critical Alerts Banner */}
      {documentExpiryCount > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-amber-500 px-4 py-4 text-white">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-lg">
                {language === 'fr' 
                  ? `${documentExpiryCount} document${documentExpiryCount > 1 ? 's' : ''} à renouveler`
                  : `${documentExpiryCount} وثيقة${documentExpiryCount > 1 ? '' : ''} للتجديد`}
              </p>
              <p className="text-sm opacity-90 mt-1">
                {language === 'fr'
                  ? 'Assurance, contrôle technique, vignette - Évitez les amendes !'
                  : 'التأمين، الفحص التقني، الملصق - تجنب الغرامات!'}
              </p>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => navigate('/customer/documents')}>
                {language === 'fr' ? 'Voir les documents' : 'عرض الوثائق'} →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: language === 'fr' ? 'Toutes' : 'الكل', count: notifications.length },
          { id: 'unread', label: language === 'fr' ? 'Non lues' : 'غير مقروءة', count: unreadCount },
          { id: 'documents', label: language === 'fr' ? 'Documents' : 'وثائق', count: notifications.filter(n => n.type === 'document_expiry').length },
          { id: 'jobs', label: language === 'fr' ? 'Jobs' : 'أعمال', count: notifications.filter(n => n.type === 'job_update' || n.type === 'offer_received').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.id
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="px-4 py-4 space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              {language === 'fr' ? 'Aucune notification' : 'لا توجد إشعارات'}
            </p>
          </Card>
        ) : (
          filteredNotifications.map(notification => {
            const isDocumentExpiry = notification.type === 'document_expiry';
            const priorityColors = {
              high: 'border-red-200 bg-red-50',
              medium: 'border-amber-200 bg-amber-50',
              low: 'border-blue-200 bg-blue-50',
            };

            return (
              <Card
                key={notification.id}
                className={`p-4 border-2 transition-all ${
                  !notification.read ? priorityColors[notification.priority as keyof typeof priorityColors] : 'border-slate-100'
                } ${!notification.read ? 'shadow-md' : ''}`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (isDocumentExpiry) {
                    navigate('/customer/documents');
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    isDocumentExpiry ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{notification.body}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(notification.created_at).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Action button for document expiry */}
                    {isDocumentExpiry && !notification.read && (
                      <Button size="sm" className="mt-3" onClick={(e) => {
                        e.stopPropagation();
                        navigate('/customer/documents');
                      }}>
                        {language === 'fr' ? 'Voir le document' : 'عرض الوثيقة'} →
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Document Expiry Summary */}
      {filter === 'documents' && (
        <div className="px-4 pb-4">
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              {language === 'fr' ? 'Documents à renouveler' : 'وثائق للتجديد'}
            </h3>
            <div className="space-y-2">
              {mockLegalDocuments
                .filter(d => d.user_id === user?.id && d.status === 'expiring_soon')
                .map(doc => {
                  const expiry = getDaysUntilExpiry(doc.expiry_date);
                  return (
                    <div key={doc.id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                      <div className={`w-10 h-10 ${doc.color} rounded-lg flex items-center justify-center text-xl`}>
                        {doc.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {language === 'fr' ? doc.title : doc.title_ar}
                        </p>
                        <p className="text-xs text-slate-500">
                          {language === 'fr' ? `Expire le ${new Date(doc.expiry_date).toLocaleDateString('fr-FR')}` : `ينتهي في ${new Date(doc.expiry_date).toLocaleDateString('fr-FR')}`}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        expiry.urgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {expiry.text}
                      </span>
                    </div>
                  );
                })}
            </div>
            <Button fullWidth className="mt-3" onClick={() => navigate('/customer/documents')}>
              {language === 'fr' ? 'Gérer tous les documents' : 'إدارة جميع الوثائق'}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
