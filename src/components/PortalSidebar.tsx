import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../shared/context';
import { getPortalConfig } from '../shared/portalConfig';
import {
  ArrowLeft, ChevronRight, LogOut, Trash2, Menu, X, Settings,
} from 'lucide-react';

/**
 * Standard shell shown for every role (customer, mechanic, seller, tuner, admin).
 * It is the destination of the "Réglages" button: on first connection the user lands
 * on their role's main list (orders / jobs / requests), and from the sidebar they can
 * navigate to any other section or account settings.
 *
 * - Desktop (>=1024px): permanent left sidebar, scrollable content slot on the right.
 * - Mobile: a drawer opened via the hamburger / settings button.
 *
 * `autoShell` (default true) detects pages that render their own full-screen root
 * (`min-h-screen …`) and wraps them in an independent scroll container so they keep
 * working inside the shell without double-scroll glitches. New portal pages should
 * simply return a normal `<div className="p-4 md:p-6">…</div>` block instead.
 */
const SELF_SCROLLING = /className="[^"]*min-h-screen[^"]*bg-slate-50/;

export function PortalSidebar({
  children,
  title,
  backRoute,
  autoShell = true,
}: {
  children?: React.ReactNode;
  title?: string;
  backRoute?: string;
  autoShell?: boolean;
}) {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const config = getPortalConfig(user?.role);
  const [open, setOpen] = useState(false);

  // Use the router location (always in sync) instead of window.location
  const currentPath = useLocation().pathname;
  const isItemActive = (route: string) =>
    route.startsWith('/tuner/projects') || route.startsWith('/seller/orders')
      ? currentPath === route || currentPath.startsWith(route + '/')
      : currentPath === route;

  const panel = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Brand / user block */}
      <div className={`bg-gradient-to-br ${config.gradient} px-4 py-5`}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
            {config.avatarEmoji}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-sm font-bold">{user?.full_name || config.roleLabel}</p>
            <p className="text-xs opacity-80">{config.roleLabel}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={() => { setOpen(false); navigate(config.landingRoute); }}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-white/15 px-3 py-2 text-left text-sm font-medium hover:bg-white/25"
        >
          <span>{config.landingLabel}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {config.sections.map((section) => (
          <div key={section.id} className="mb-5">
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.route);
                return (
                  <button
                    key={item.id}
                    onClick={() => { setOpen(false); navigate(item.route); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-white/15 font-semibold text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-medium">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-white/10 px-3 py-3">
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-red-300 hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
        <button
          onClick={() => {
            if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
              alert('Compte supprimé (simulation)');
              navigate('/');
            }
          }}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs text-slate-400 hover:bg-white/10 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop permanent sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">{panel}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">{panel}</aside>
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          {backRoute && (
            <button onClick={() => navigate(backRoute)} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="flex-1 truncate text-base font-semibold text-slate-900">
            {title || `${config.roleLabel} — Espace ${config.roleLabel}`}
          </h1>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Réglages</span>
          </button>
        </header>

        {autoShell && SELF_SCROLLING.test(String(children)) ? (
          // Legacy full-screen page: give it its own scroll container inside the shell.
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        ) : (
          <main className="flex-1 overflow-y-auto">{children}</main>
        )}
      </div>
    </div>
  );
}
