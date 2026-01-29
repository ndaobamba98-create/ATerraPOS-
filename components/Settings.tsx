
import React, { useState } from 'react';
import { Product, ERPConfig, UserRole, ViewType, RolePermission, User, POSLocations, POSLocationCategory, AppTheme } from '../types';
import { 
  Save, Plus, Trash2, Building2, Layers, ShieldCheck, X, 
  FileText, Hash, Info, Printer, DollarSign, BellRing, Users, UserPlus, 
  Mail, Phone, MapPin, Percent, Tag, Bell, Check, QrCode, PackageCheck, Shield, CheckSquare, Square, Edit3, Key, Utensils, Globe,
  ChevronDown, Palette, Wifi, Clock
} from 'lucide-react';

interface Props {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  config: ERPConfig;
  onUpdateConfig: (config: ERPConfig) => void;
  posLocations: POSLocations;
  onUpdateLocations: (locations: POSLocations) => void;
  rolePermissions: RolePermission[];
  onUpdatePermissions: (perms: RolePermission[]) => void;
  notify: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  userPermissions: ViewType[];
  t: (key: any) => string;
  currentUser: User;
  allUsers: User[];
  onUpdateUsers: (users: User[]) => void;
}

const PROFILE_COLORS = [
  'from-slate-700 to-slate-900',
  'from-emerald-600 to-emerald-800',
  'from-purple-600 to-purple-800',
  'from-blue-600 to-blue-800',
  'from-rose-600 to-rose-800',
  'from-amber-600 to-amber-800'
];

const THEMES: { id: AppTheme; color: string; label: string }[] = [
  { id: 'purple', color: 'bg-purple-600', label: 'Améthyste' },
  { id: 'emerald', color: 'bg-emerald-600', label: 'Émeraude' },
  { id: 'blue', color: 'bg-blue-600', label: 'Océan' },
  { id: 'rose', color: 'bg-rose-600', label: 'Rubis' },
  { id: 'amber', color: 'bg-amber-500', label: 'Ambre' },
  { id: 'slate', color: 'bg-slate-600', label: 'Acier' },
];

const TIMEZONES = [
  'Africa/Nouakchott', 'Africa/Dakar', 'Africa/Casablanca', 'Europe/Paris', 'America/New_York', 'UTC'
];

const Settings: React.FC<Props> = ({ config, onUpdateConfig, posLocations, onUpdateLocations, rolePermissions, onUpdatePermissions, notify, currentUser, allUsers, onUpdateUsers, t }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'localization' | 'zones' | 'users' | 'access'>('general');
  const [formConfig, setFormConfig] = useState<ERPConfig>(config);
  const [newItemName, setNewItemName] = useState<Record<string, string>>({});
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState<Partial<User>>({ name: '', role: 'waiter', password: '', color: PROFILE_COLORS[1] });

  const handleSaveConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateConfig(formConfig);
    notify("Succès", "Configuration mise à jour.", 'success');
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-24 pr-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t('settings')}</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Localisation & Paramètres Système</p>
        </div>
        <button onClick={handleSaveConfig} className="bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center hover:bg-emerald-700 transition-all">
          <Save size={18} className="mr-2"/> {t('save')}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm min-h-[600px] overflow-hidden flex flex-col">
        <div className="border-b dark:border-slate-800 flex bg-slate-50/50 dark:bg-slate-800/20">
            {[
              { id: 'general', label: 'Entreprise', icon: Building2 },
              { id: 'localization', label: 'Régional & Heure', icon: Globe },
              { id: 'billing', label: 'Facturation', icon: FileText },
              { id: 'users', label: 'Collaborateurs', icon: Users },
              { id: 'zones', label: 'Tables', icon: Utensils },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest flex items-center transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-purple-600 border-b-4 border-purple-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon size={14} className="mr-2"/> {tab.label}
              </button>
            ))}
        </div>

        <div className="p-12">
          {activeTab === 'general' && (
            <div className="space-y-12 animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Nom Entreprise</label>
                    <input value={formConfig.companyName} onChange={e => setFormConfig({...formConfig, companyName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Slogan</label>
                    <input value={formConfig.companySlogan} onChange={e => setFormConfig({...formConfig, companySlogan: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400">Thème Visuel</label>
                  <div className="flex space-x-3">
                    {THEMES.map(theme => (
                      <button key={theme.id} onClick={() => setFormConfig({...formConfig, theme: theme.id})} className={`w-12 h-12 rounded-2xl ${theme.color} border-4 ${formConfig.theme === theme.id ? 'border-white shadow-xl scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`} />
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'localization' && (
            <div className="space-y-12 animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center"><Clock size={12} className="mr-2"/> Fuseau Horaire (Odoo standard)</label>
                    <select value={formConfig.timezone} onChange={e => setFormConfig({...formConfig, timezone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none appearance-none">
                      {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center"><Globe size={12} className="mr-2"/> Langue du Système</label>
                    <select value={formConfig.language} onChange={e => setFormConfig({...formConfig, language: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none appearance-none uppercase text-xs">
                      <option value="fr">Français (FR)</option>
                      <option value="en">English (US)</option>
                      <option value="ar">العربية (AR)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Code Devise ISO</label>
                    <input value={formConfig.currency} onChange={e => setFormConfig({...formConfig, currency: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Symbole Affiché</label>
                    <input value={formConfig.currencySymbol} onChange={e => setFormConfig({...formConfig, currencySymbol: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
               </div>
               <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-center space-x-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-600 shadow-sm"><Info size={24}/></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Le format des dates et des nombres s'adaptera automatiquement aux normes de la région choisie.</p>
               </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Préfixe Facture</label>
                  <input value={formConfig.invoicePrefix} onChange={e => setFormConfig({...formConfig, invoicePrefix: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Numéro Suivant</label>
                  <input type="number" value={formConfig.nextInvoiceNumber} onChange={e => setFormConfig({...formConfig, nextInvoiceNumber: parseInt(e.target.value) || 1})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" />
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
