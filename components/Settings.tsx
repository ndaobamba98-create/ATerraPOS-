
import React, { useState } from 'react';
import { Product, ERPConfig, UserRole, ViewType, RolePermission, User, POSLocations, POSLocationCategory, AppTheme } from '../types';
import { 
  Save, Plus, Trash2, Building2, Layers, ShieldCheck, X, 
  FileText, Hash, Info, Printer, DollarSign, BellRing, Users, UserPlus, 
  Mail, Phone, MapPin, Percent, Tag, Bell, Check, QrCode, PackageCheck, Shield, CheckSquare, Square, Edit3, Key, Utensils, Globe,
  ChevronDown, Palette, Wifi, Clock, UserCircle
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

const Settings: React.FC<Props> = ({ config, onUpdateConfig, posLocations, onUpdateLocations, notify, allUsers, onUpdateUsers, t }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'billing' | 'users' | 'zones' | 'regional'>('company');
  const [formConfig, setFormConfig] = useState<ERPConfig>(config);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const handleSaveAll = () => {
    onUpdateConfig(formConfig);
    notify("Succès", "Configuration globale mise à jour.", 'success');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.name || !editingUser?.password) return;

    const initials = editingUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const newUser = {
      ...editingUser,
      id: editingUser.id || `U-${Date.now()}`,
      initials,
      color: editingUser.color || PROFILE_COLORS[0],
      role: editingUser.role || 'waiter'
    } as User;

    if (allUsers.find(u => u.id === newUser.id)) {
      onUpdateUsers(allUsers.map(u => u.id === newUser.id ? newUser : u));
    } else {
      onUpdateUsers([...allUsers, newUser]);
    }

    setIsUserModalOpen(false);
    setEditingUser(null);
    notify("Utilisateurs", "Compte mis à jour avec succès.", "success");
  };

  const deleteUser = (id: string) => {
    if (allUsers.length <= 1) return notify("Erreur", "Impossible de supprimer le dernier utilisateur.", "warning");
    if (confirm("Supprimer cet utilisateur ?")) {
      onUpdateUsers(allUsers.filter(u => u.id !== id));
    }
  };

  const updateZoneItems = (catId: string, items: string[]) => {
    const updated = {
      ...posLocations,
      categories: posLocations.categories.map(c => c.id === catId ? { ...c, items } : c)
    };
    onUpdateLocations(updated);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-24 pr-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-xl"><Shield size={32}/></div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Panneau de Contrôle</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Configuration système & Administration</p>
           </div>
        </div>
        <button onClick={handleSaveAll} className="bg-purple-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-purple-700 active:scale-95 transition-all flex items-center">
          <Save size={20} className="mr-3"/> Enregistrer les modifications
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* Navigation Latérale Interne */}
        <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/30 border-r border-slate-100 dark:border-slate-800 p-8 space-y-2">
           {[
             { id: 'company', label: 'Société', icon: Building2 },
             { id: 'billing', label: 'Facturation', icon: FileText },
             { id: 'users', label: 'Utilisateurs', icon: Users },
             { id: 'zones', label: 'Zones & Tables', icon: Utensils },
             { id: 'regional', label: 'Régional', icon: Globe },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full flex items-center p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-md translate-x-2' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
             >
               <tab.icon size={18} className="mr-4" />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Contenu de l'onglet */}
        <div className="flex-1 p-12 overflow-y-auto scrollbar-hide">
          
          {/* ONGLET SOCIÉTÉ */}
          {activeTab === 'company' && (
            <div className="space-y-12 animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center">
                      <Info size={14} className="mr-2" /> Identité Visuelle
                    </h3>
                    <div className="space-y-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Nom de l'établissement</label>
                         <input value={formConfig.companyName} onChange={e => setFormConfig({...formConfig, companyName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-purple-500" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Slogan Publicitaire</label>
                         <input value={formConfig.companySlogan} onChange={e => setFormConfig({...formConfig, companySlogan: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-purple-500" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center">
                      <MapPin size={14} className="mr-2" /> Coordonnées
                    </h3>
                    <div className="space-y-4">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Adresse physique</label>
                         <input value={formConfig.address} onChange={e => setFormConfig({...formConfig, address: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-purple-500" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Téléphone</label>
                            <input value={formConfig.phone} onChange={e => setFormConfig({...formConfig, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Registre (RC)</label>
                            <input value={formConfig.registrationNumber} onChange={e => setFormConfig({...formConfig, registrationNumber: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none" />
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-6 pt-10 border-t dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center">
                    <Palette size={14} className="mr-2" /> Personnalisation de l'interface
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {THEMES.map(theme => (
                      <button 
                        key={theme.id} 
                        onClick={() => setFormConfig({...formConfig, theme: theme.id})}
                        className={`px-6 py-4 rounded-2xl flex items-center space-x-3 border-2 transition-all ${formConfig.theme === theme.id ? 'bg-white dark:bg-slate-800 border-purple-500 shadow-lg scale-105' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${theme.color} shadow-sm`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{theme.label}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* ONGLET FACTURATION */}
          {activeTab === 'billing' && (
            <div className="space-y-12 animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center space-x-3 text-purple-400">
                           <Hash size={20}/>
                           <h4 className="text-[10px] font-black uppercase tracking-widest">Séquences Documentaires</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase opacity-40">Préfixe Facture</label>
                              <input value={formConfig.invoicePrefix} onChange={e => setFormConfig({...formConfig, invoicePrefix: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-purple-500" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase opacity-40">Prochain Numéro</label>
                              <input type="number" value={formConfig.nextInvoiceNumber} onChange={e => setFormConfig({...formConfig, nextInvoiceNumber: parseInt(e.target.value) || 1})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-purple-500" />
                           </div>
                        </div>
                     </div>

                     <div className="p-8 bg-white dark:bg-slate-800 border-2 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center space-x-3 text-slate-400">
                           <Percent size={20}/>
                           <h4 className="text-[10px] font-black uppercase tracking-widest">Fiscalité</h4>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-500">Taux de Taxe Global (%)</label>
                           <input type="number" value={formConfig.taxRate} onChange={e => setFormConfig({...formConfig, taxRate: parseFloat(e.target.value) || 0})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-black text-xl text-purple-600 outline-none" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center">
                       <Printer size={14} className="mr-2" /> Options du ticket
                     </h3>
                     <div className="grid grid-cols-1 gap-3">
                        {[
                          { key: 'showQrCodeOnInvoice', label: 'Afficher le QR Code de validation', icon: QrCode },
                          { key: 'showAddressOnInvoice', label: 'Imprimer l\'adresse sur le reçu', icon: MapPin },
                          { key: 'showPhoneOnInvoice', label: 'Imprimer le téléphone', icon: Phone },
                          { key: 'autoPrintReceipt', label: 'Impression automatique après encaissement', icon: Printer },
                        ].map(opt => (
                          <button 
                            key={opt.key}
                            onClick={() => setFormConfig({...formConfig, [opt.key]: !formConfig[opt.key as keyof ERPConfig]})}
                            className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formConfig[opt.key as keyof ERPConfig] ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 text-purple-700' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400'}`}
                          >
                            <div className="flex items-center space-x-4">
                               <opt.icon size={18} />
                               <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                            </div>
                            {formConfig[opt.key as keyof ERPConfig] ? <CheckSquare size={20} /> : <Square size={20} />}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* ONGLET UTILISATEURS */}
          {activeTab === 'users' && (
            <div className="space-y-8 animate-fadeIn">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Collaborateurs enregistrés</h3>
                  <button onClick={() => { setEditingUser({ role: 'waiter', color: PROFILE_COLORS[1] }); setIsUserModalOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-black transition-all">
                    <UserPlus size={16} className="mr-2" /> Nouvel Accès
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allUsers.map(user => (
                    <div key={user.id} className="bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 p-6 rounded-[2.5rem] flex flex-col items-center text-center group relative hover:shadow-xl transition-all">
                       <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-2xl font-black shadow-lg mb-4`}>
                          {user.initials}
                       </div>
                       <h4 className="font-black uppercase text-sm">{user.name}</h4>
                       <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mt-1">{user.role}</p>
                       
                       <div className="mt-6 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 hover:text-blue-600"><Edit3 size={16}/></button>
                          <button onClick={() => deleteUser(user.id)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 hover:text-rose-600"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* ONGLET ZONES */}
          {activeTab === 'zones' && (
            <div className="space-y-12 animate-fadeIn">
               {posLocations.categories.map(cat => (
                 <div key={cat.id} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-purple-600">
                             <Utensils size={20} />
                          </div>
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">{cat.name}</h4>
                       </div>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{cat.items.length} Emplacements</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                       {cat.items.map((item, idx) => (
                         <div key={idx} className="bg-white dark:bg-slate-900 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3 group">
                            <span className="text-[10px] font-black uppercase">{item}</span>
                            <button onClick={() => updateZoneItems(cat.id, cat.items.filter(i => i !== item))} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                         </div>
                       ))}
                       <button onClick={() => {
                         const name = prompt("Nom de l'emplacement (ex: Table 15) :");
                         if (name) updateZoneItems(cat.id, [...cat.items, name]);
                       }} className="px-5 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:border-purple-500 hover:text-purple-600 transition-all flex items-center space-x-2">
                          <Plus size={14}/>
                          <span className="text-[10px] font-black uppercase">Nouveau</span>
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* ONGLET RÉGIONAL */}
          {activeTab === 'regional' && (
            <div className="space-y-12 animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 flex items-center"><Clock size={12} className="mr-2"/> Fuseau Horaire</label>
                    <select value={formConfig.timezone} onChange={e => setFormConfig({...formConfig, timezone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none appearance-none">
                      <option value="Africa/Nouakchott">Nouakchott (GMT)</option>
                      <option value="Africa/Dakar">Dakar (GMT)</option>
                      <option value="Europe/Paris">Paris (GMT+1)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2 flex items-center"><Globe size={12} className="mr-2"/> Langue par défaut</label>
                    <select value={formConfig.language} onChange={e => setFormConfig({...formConfig, language: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-none outline-none appearance-none uppercase text-xs">
                      <option value="fr">Français (FR)</option>
                      <option value="en">English (US)</option>
                      <option value="ar">العربية (AR)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Symbole Monétaire</label>
                    <input value={formConfig.currencySymbol} onChange={e => setFormConfig({...formConfig, currencySymbol: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-2xl outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
               </div>
               
               <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 flex items-center space-x-6">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-blue-600 shadow-sm"><Info size={28}/></div>
                  <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed">
                    Les changements régionaux affectent le formatage des dates, des nombres et la langue de l'interface pour tous les utilisateurs.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL UTILISATEUR */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden animate-scaleIn">
             <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center space-x-4">
                   <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg"><UserCircle size={24}/></div>
                   <h3 className="text-xl font-black uppercase tracking-tighter">{editingUser.id ? 'Profil Agent' : 'Nouvel Agent'}</h3>
                </div>
                <button onClick={() => setIsUserModalOpen(false)}><X size={28} className="text-slate-400 hover:text-rose-500"/></button>
             </div>
             <form onSubmit={handleAddUser} className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Identifiant public</label>
                   <input required value={editingUser.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black outline-none border-2 border-transparent focus:border-purple-500 transition-all uppercase" placeholder="NOM DE L'AGENT" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Code d'accès secret</label>
                   <input required type="password" value={editingUser.password || ''} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-center tracking-[0.5em] outline-none border-2 border-transparent focus:border-purple-500 transition-all" placeholder="••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Niveau d'accès</label>
                      <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-[10px] uppercase outline-none">
                         <option value="waiter">Serveur/se</option>
                         <option value="cashier">Caissier/ère</option>
                         <option value="manager">Manager</option>
                         <option value="admin">Administrateur</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Couleur Profil</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {PROFILE_COLORS.map(c => (
                          <button key={c} type="button" onClick={() => setEditingUser({...editingUser, color: c})} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} border-2 ${editingUser.color === c ? 'border-purple-500 scale-110' : 'border-transparent'}`} />
                        ))}
                      </div>
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center space-x-3 mt-4">
                  <Check size={18} />
                  <span>Enregistrer l'agent</span>
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
