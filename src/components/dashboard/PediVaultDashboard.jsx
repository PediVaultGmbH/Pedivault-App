import { useState, useEffect, useCallback } from 'react';
import '../../styles/dashboard.css';

import { STIKO } from '../../data/stiko';

import { getChildren, deleteChild } from '../../api/children.api';
import { getVaccineRecords, logVaccine } from '../../api/vaccines.api';
import { getGrowthEntries, addGrowthEntry } from '../../api/growth.api';
import { getRecords, uploadRecord } from '../../api/records.api';
import { getAppointments, bookAppointment, cancelAppointment as apiCancelAppt } from '../../api/appointments.api';
import { getMedications, addMedication } from '../../api/medications.api';

import { useToast } from '../../hooks/useToast';
import { getVaccStatus, findVaccId } from '../../utils/vaccineUtils';

import SvgDefs from './ui/SvgDefs';
import SkeletonHome from './ui/SkeletonHome';

import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import SearchPanel from './layout/SearchPanel';
import NotifPanel from './layout/NotifPanel';
import MobileNav from './layout/MobileNav';

import SignOutModal from './modals/SignOutModal';
import AddChildModal from './modals/AddChildModal';
import BookVisitModal from './modals/BookVisitModal';
import LogVaccineModal from './modals/LogVaccineModal';
import GrowthEntryModal from './modals/GrowthEntryModal';
import UploadRecordModal from './modals/UploadRecordModal';
import AddMedicationModal from './modals/AddMedicationModal';

import HomeModule from './modules/HomeModule';
import { GrowthModule } from './modules/GrowthModule';
import { VaccinesModule } from './modules/VaccinesModule';
import { RecordsModule } from './modules/RecordsModule';
import { AppointmentsModule } from './modules/AppointmentsModule';
import { MedicationsModule } from './modules/MedicationsModule';
import { ProfileModule } from './modules/ProfileModule';
import { AIAssistantModule } from './modules/AIAssistantModule';
import { SupportModule } from './modules/SupportModule';
import { AccountModule } from './modules/AccountModule';
import ComingSoon from './modules/ComingSoon';

export default function PediVaultDashboard({ onSignOut, activeChild, onChildSelect, userName = 'Lena', userProfile = null }) {
  const [active, setActive]           = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [modal, setModal]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const { toasts, show: showToast, dismiss: dismissToast } = useToast();

  const [apiChildren, setApiChildren]     = useState([]);
  const [childIdMap, setChildIdMap]       = useState({});
  const [extraChildren, setExtraChildren] = useState([]);

  const [growthEntries,   setGrowthEntries]   = useState({});
  const [vaccineEntries,  setVaccineEntries]   = useState({});
  const [bookings,        setBookings]         = useState({});
  const [uploadedRecords, setUploadedRecords]  = useState({});
  const [medications,     setMedications]      = useState({});

  const processAndStore = useCallback((activeKey, vaccines, growth, records, appts, meds) => {
    if (vaccines.status === 'fulfilled') {
      const raw = vaccines.value?.data || [];
      const transformed = {};
      raw.forEach(r => {
        const id = r.vaccineId || findVaccId(r.vaccineName);
        if (id) transformed[id] = [...(transformed[id] || []), { dose: r.dose, date: r.date, by: r.doctor || r.clinic || 'Self-recorded' }];
      });
      setVaccineEntries(prev => ({ ...prev, [activeKey]: raw, [`${activeKey}_transformed`]: transformed }));
    }
    if (growth.status === 'fulfilled') {
      const entries = (growth.value?.data || []).map(e => ({ ...e, weight: e.weightKg, height: e.heightCm, by: e.measuredBy || 'Self-recorded' }));
      setGrowthEntries(prev => ({ ...prev, [activeKey]: entries }));
    }
    if (records.status === 'fulfilled') {
      setUploadedRecords(prev => ({ ...prev, [activeKey]: records.value?.data || [] }));
    }
    if (appts.status === 'fulfilled') {
      const list = (appts.value?.data || []).map(a => ({ ...a, _id: a.id }));
      setBookings(prev => ({ ...prev, [activeKey]: list }));
    }
    if (meds.status === 'fulfilled') {
      setMedications(prev => ({ ...prev, [activeKey]: meds.value?.data || [] }));
    }
  }, []);

  useEffect(() => {
    getChildren()
      .then(res => {
        const list = res.data || [];
        setApiChildren(list);
        const map = {};
        list.forEach(c => { map[c.id] = c.id; });
        setChildIdMap(map);

        const backendId = activeChild;
        if (!backendId || !backendId.includes('-')) { setLoading(false); return; }

        Promise.allSettled([
          getVaccineRecords(backendId),
          getGrowthEntries(backendId),
          getRecords(backendId),
          getAppointments(backendId),
          getMedications(backendId),
        ]).then(([vaccines, growth, records, appts, meds]) => {
          processAndStore(activeChild, vaccines, growth, records, appts, meds);
        }).finally(() => setLoading(false));
      })
      .catch(err => { console.warn('Could not load children:', err.message); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const backendId = activeChild;
    if (!backendId || !backendId.includes('-')) return;
    setLoading(true);
    Promise.allSettled([
      getVaccineRecords(backendId),
      getGrowthEntries(backendId),
      getRecords(backendId),
      getAppointments(backendId),
      getMedications(backendId),
    ]).then(([vaccines, growth, records, appts, meds]) => {
      processAndStore(activeChild, vaccines, growth, records, appts, meds);
    }).finally(() => setLoading(false));
  }, [activeChild, childIdMap, processAndStore]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [active]);

  const navigate   = useCallback(mod => { setActive(mod); setSidebarOpen(false); setSearchOpen(false); setNotifOpen(false); }, []);
  const showModal  = useCallback(m   => { setModal(m);    setSearchOpen(false);  setNotifOpen(false);  }, []);
  const closeModal = useCallback(()  => setModal(null), []);

  const handleChildAdded = useCallback((childData) => {
    const id = childData.id || (childData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now());
    setApiChildren(prev => [...prev, { id, name: childData.name, color: childData.color || '#C47A92', gender: childData.gender, dateOfBirth: childData.dob || childData.dateOfBirth }]);
    setChildIdMap(prev => ({ ...prev, [id]: id }));
    onChildSelect(id);
    showToast(`${childData.name} added — switched to their records`);
  }, [onChildSelect, showToast]);

  const handleMarkComplete = useCallback((medId) => {
    setMedications(prev => {
      const cur = prev[activeChild] || [];
      const exists = cur.find(m => m.id === medId);
      if (exists) return { ...prev, [activeChild]: cur.map(m => m.id === medId ? { ...m, status: 'COMPLETED' } : m) };
      return { ...prev, [activeChild]: [...cur, { id: medId, status: 'COMPLETED', _baseOverride: true }] };
    });
    showToast('Medication marked as completed ✓');
  }, [activeChild, showToast]);

  const handleCancelBooking = useCallback(async (appt) => {
    const apptId = appt._id || appt.id;
    try { await apiCancelAppt(activeChild, apptId); } catch (_) {}
    setBookings(prev => {
      const cur = prev[activeChild] || [];
      return { ...prev, [activeChild]: cur.filter(b => b._id !== apptId && b.id !== apptId) };
    });
    showToast('Appointment cancelled');
  }, [activeChild, showToast]);

  const handleChildSelect = (child) => {
    onChildSelect(child);
    const found = apiChildren.find(c => c.id === child);
    showToast(`Switched to ${found?.name || child}'s records`);
  };

  const childDob   = apiChildren.find(c => c.id === activeChild)?.dateOfBirth;
  const childAgeMo = (() => {
    if (!childDob) return 43;
    const d = new Date(childDob), now = new Date();
    return (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
  })();

  const transformedVacc = vaccineEntries[`${activeChild}_transformed`] || {};
  const allDoses = apiChildren.length > 0 ? STIKO.flatMap(v => v.doses.map(d => ({ vacc: v, dose: d, ...getVaccStatus(v.id, d, transformedVacc, childAgeMo) }))) : [];
  const vaccStats = {
    done:    allDoses.filter(d => d.status === 'done').length,
    overdue: allDoses.filter(d => d.status === 'overdue').length,
    dueSoon: allDoses.filter(d => d.status === 'due-soon').length,
    total:   allDoses.length,
    pct:     allDoses.length > 0 ? Math.round(allDoses.filter(d => d.status === 'done').length / allDoses.length * 100) : 0,
  };
  const overdueList = allDoses.filter(d => d.status === 'overdue').map(d => ({ name: d.vacc.name, dose: d.dose.dose }));

  const fmtRel = dateStr => {
    if (!dateStr) return 'Just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7)  return `${days} days ago`;
    if (days < 14) return '1 week ago';
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const recentActivity = [
    ...(growthEntries[activeChild]   || []).map(e => ({ dot: 'var(--green)',    name: `Growth recorded — ${e.weight || e.weightKg}kg · ${e.height || e.heightCm || '—'}cm`, sub: `${e.by || 'Self-recorded'} · ${fmtRel(e.date)}`,    tag: 'Growth',  tc: 'lbl-green', ts: e.date ? new Date(e.date).getTime() : Date.now() })),
    ...(vaccineEntries[activeChild]  || []).map(e => ({ dot: 'var(--rose-mid)', name: `${e.vaccineName || e.name} ${e.dose} logged`,                                        sub: `${e.doctor || 'Self-recorded'} · ${fmtRel(e.date)}`, tag: 'Vaccine', tc: 'lbl-rose',  ts: new Date(e.date || Date.now()).getTime() })),
    ...(uploadedRecords[activeChild] || []).map(e => ({ dot: 'var(--blue)',     name: `${e.name} uploaded`,                                                                  sub: `${e.source || '—'} · ${fmtRel(e.createdAt)}`,        tag: 'Record',  tc: 'lbl-blue',  ts: new Date(e.createdAt || Date.now()).getTime() })),
  ].sort((a, b) => b.ts - a.ts).slice(0, 6);

  const upcomingVisits = (bookings[activeChild] || [])
    .filter(b => b.status !== 'CANCELLED')
    .map(b => {
      const d = b.date ? new Date(b.date) : new Date();
      return { day: String(d.getDate()), mon: d.toLocaleDateString('en-DE', { month: 'short' }), name: b.type || 'Appointment', sub: b.doctor || '—', tags: [{ cls: 'lbl-blue', t: b.time || 'TBC' }] };
    }).slice(0, 3);

  const currentBackendId = activeChild || apiChildren[0]?.id || '';

  return (
    <div className="pv-shell">
      <SvgDefs />
      <div className={`pv-sb-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
      {(searchOpen || notifOpen) && <div style={{ position: 'fixed', inset: 0, zIndex: 25 }} onClick={() => { setSearchOpen(false); setNotifOpen(false); }} />}

      <Sidebar active={active} onNav={navigate} onSignOut={() => showModal('signout')} open={sidebarOpen} extraChildren={extraChildren} apiChildren={apiChildren} userName={userName} />

      <div className="pv-main">
        <Header
          active={active} activeChild={activeChild}
          onChildSelect={handleChildSelect}
          extraChildren={extraChildren}
          apiChildren={apiChildren}
          onSearch={() => { setSearchOpen(o => !o); setNotifOpen(false); }}
          onNotif={() => { setNotifOpen(o => !o); setSearchOpen(false); }}
          onBook={() => showModal('book')}
          onAddChild={() => showModal('addchild')}
          showToast={showToast}
          onBurger={() => setSidebarOpen(o => !o)}
          onSignOut={() => showModal('signout')}
        />
        <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} onNav={navigate} />
        <NotifPanel  open={notifOpen}  onClose={() => setNotifOpen(false)} />

        {loading ? (
          <SkeletonHome />
        ) : apiChildren.length === 0 ? (
          <div className="pv-page" style={{animation:'fadeUp .3s ease both',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh',textAlign:'center',padding:'40px 20px'}}>
            <div style={{width:80,height:80,borderRadius:24,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',border:'2px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:24,boxShadow:'0 8px 32px rgba(155,58,86,.15)'}}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.6" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.6rem',color:'var(--ink)',marginBottom:8,letterSpacing:'-.02em'}}>Welcome to PediVault 🌸</div>
            <div style={{fontSize:'.64rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.8,maxWidth:340,marginBottom:32}}>
              Your child's complete health record — vaccines, growth, appointments, and more. Let's start by adding your first child.
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12,width:'100%',maxWidth:320,marginBottom:32}}>
              {[
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>, text:'Track STIKO 2026 vaccine schedule'},
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, text:'Monitor growth with WHO percentiles'},
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, text:'Store medical records securely'},
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="6" height="10" rx="1"/><rect x="9" y="4" width="6" height="16" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/></svg>, text:'Blockchain-verified vaccine certificates'},
              ].map((f,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'var(--white)',border:'1px solid var(--line2)',borderRadius:12,textAlign:'left'}}>
                  <div style={{width:32,height:32,borderRadius:9,background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{f.icon}</div>
                  <span style={{fontSize:'.6rem',color:'var(--ink-2)'}}>{f.text}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={()=>showModal('addchild')} style={{height:48,padding:'0 36px',borderRadius:14,border:'none',background:'var(--rose)',color:'#fff',fontSize:'.72rem',fontWeight:600,cursor:'pointer',boxShadow:'0 4px 20px rgba(155,58,86,.32)',display:'flex',alignItems:'center',gap:10}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Add your first child
            </button>
            <div style={{fontSize:'.52rem',color:'var(--ink-3)',marginTop:16}}>Takes less than 2 minutes · GDPR compliant · Data stays yours</div>
          </div>
        ) : active === 'home' ? (
          <HomeModule
  activeChild={activeChild}
  activeChildData={apiChildren.find(c => c.id === activeChild) || null}
  growthData={(growthEntries[activeChild] || [])[0] || null}
  onNav={navigate} showModal={showModal}
  vaccStats={vaccStats} overdueList={overdueList}
  growthCount={(growthEntries[activeChild]   || []).length}
  vaccineCount={(vaccineEntries[activeChild] || []).length}
  recordCount={(uploadedRecords[activeChild] || []).length}
  bookingCount={(bookings[activeChild]       || []).length}
  recentActivity={recentActivity}
  upcomingVisits={upcomingVisits}
/>
        ) : active === 'growth' ? (
          <GrowthModule key={`growth-${activeChild}`} activeChild={activeChild} showModal={showModal} extraEntries={growthEntries[activeChild] || []} />
        ) : active === 'vaccines' ? (
          <VaccinesModule key={`vaccines-${activeChild}`} activeChild={activeChild} showModal={showModal} extraVaccines={vaccineEntries[activeChild] || []} childDob={apiChildren.find(c => c.id === activeChild)?.dateOfBirth} />
        ) : active === 'records' ? (
          <RecordsModule key={`records-${activeChild}`} activeChild={activeChild} showModal={showModal} extraRecords={uploadedRecords[activeChild] || []} />
        ) : active === 'appointments' ? (
          <AppointmentsModule key={`appts-${activeChild}`} activeChild={activeChild} showModal={showModal} newBookings={bookings[activeChild] || []} onCancelBooking={handleCancelBooking} />
        ) : active === 'medications' ? (
          <MedicationsModule key={`meds-${activeChild}`} activeChild={activeChild} showModal={showModal} extraMeds={medications[activeChild] || []} onMarkComplete={handleMarkComplete} />
        ) : active === 'profile' ? (
         <ProfileModule key={`profile-${activeChild}`} activeChild={activeChild} showModal={showModal} apiChildren={apiChildren} onDeleteChild={async (id) => {
          try { await deleteChild(id); } catch (_) {}
          setApiChildren(prev => prev.filter(c => c.id !== id));
          setExtraChildren(prev => prev.filter(c => c.id !== id));
          const remaining = apiChildren.filter(c => c.id !== id);
          onChildSelect(remaining[0]?.id || '');
          showToast('Child removed from account');
        }} />
        ) : active === 'ai-assist' ? (
          <AIAssistantModule
         key={`ai-${activeChild}`}
        activeChild={activeChild}
          activeChildData={apiChildren.find(c => c.id === activeChild) || null}
          growthData={(growthEntries[activeChild] || [])[0] || null}
          vaccineEntries={vaccineEntries[activeChild] || []}
          medications={medications[activeChild] || []}
          />
        ) : active === 'support' ? (
          <SupportModule onNav={navigate} showToast={showToast} />
        ) : active === 'account' ? (
          <AccountModule userName={userName} userProfile={userProfile} onSignOut={() => showModal('signout')} />
        ) : (
          <ComingSoon module={active} />
        )}
      </div>

      <MobileNav active={active} onNav={navigate} onSignOut={() => showModal('signout')} />

      <SignOutModal  open={modal === 'signout'}  onClose={closeModal} onConfirm={() => { closeModal(); onSignOut(); }} />
      <AddChildModal open={modal === 'addchild'} onClose={closeModal} onSuccess={showToast} onChildAdded={handleChildAdded} />

      <BookVisitModal open={modal === 'book'} onClose={closeModal} onSuccess={async (entry) => {
        if (!entry || typeof entry !== 'object') return;
        try {
          const res = await bookAppointment(currentBackendId, { type: entry.type, doctor: entry.doctor, date: entry.date, time: entry.time, notes: entry.notes });
          const saved = { ...(res.data || entry), _id: (res.data || entry).id || `booking-${Date.now()}` };
          setBookings(prev => ({ ...prev, [activeChild]: [...(prev[activeChild] || []), saved] }));
          showToast('Appointment booked ✓');
        } catch (err) { showToast(err.message || 'Failed to book appointment'); }
      }} />

      <LogVaccineModal open={modal === 'vaccine'} onClose={closeModal} onSuccess={async (entry) => {
        if (!entry || typeof entry !== 'object') return;
        try {
         const res = await logVaccine(currentBackendId, {
         vaccineId:   entry.name,
         vaccineName: entry.displayName || entry.name,
         dose:        entry.dose,
         date:        entry.date,
         doctor:      entry.by,
         notes:       entry.lot ? `Lot: ${entry.lot} | Site: ${entry.site}` : entry.site,
         });
          const saved = res.data || entry;
          setVaccineEntries(prev => ({ ...prev, [activeChild]: [...(prev[activeChild] || []), saved] }));
          showToast(`${entry.name} ${entry.dose} logged ✓`);
        } catch (err) { showToast(err.message || 'Failed to log vaccine'); }
      }} />

      <GrowthEntryModal open={modal === 'growth'} onClose={closeModal} onSuccess={async (entry) => {
        if (!entry || typeof entry !== 'object') return;
        try {
          const res = await addGrowthEntry(currentBackendId, {
            date:       entry.date,
            weightKg:   entry.weight,
            heightCm:   entry.height,
            headCm:     entry.head,
            measuredBy: entry.by,
          });
          const saved = { ...(res.data || entry), weight: (res.data || entry).weightKg || entry.weight, height: (res.data || entry).heightCm || entry.height };
          setGrowthEntries(prev => ({ ...prev, [activeChild]: [...(prev[activeChild] || []), saved] }));
          showToast(`Growth recorded — ${saved.weight}kg · ${saved.height || '—'}cm ✓`);
        } catch (err) { showToast(err.message || 'Failed to save growth entry'); }
      }} />

      <UploadRecordModal open={modal === 'record'} onClose={closeModal} onSuccess={async (entry) => {
        if (!entry || typeof entry !== 'object') return;
        try {
          const typeMap = { 'Lab Report':'LAB_REPORT', 'Prescription':'PRESCRIPTION', 'Vaccination Certificate':'VACCINATION_CARD', 'Scan / X-ray':'SCAN', 'Discharge Summary':'OTHER', 'Other':'OTHER' };
          const res = await uploadRecord(currentBackendId, {
            name:   entry.name,
            type:   typeMap[entry.type] || 'OTHER',
            source: entry.source,
            notes:  entry.date ? `Document date: ${entry.date}` : null,
          });
          const saved = res.data || entry;
          setUploadedRecords(prev => ({ ...prev, [activeChild]: [...(prev[activeChild] || []), saved] }));
          showToast(`${entry.name || 'Record'} uploaded ✓`);
        } catch (err) { showToast(err.message || 'Failed to upload record'); }
      }} />

      <AddMedicationModal open={modal === 'medication'} onClose={closeModal} onSuccess={async (entry) => {
        if (!entry || typeof entry !== 'object') return;
        try {
          const typeMap = { 'Antibiotic':'ANTIBIOTIC', 'Painkiller':'PAINKILLER', 'Vitamin':'VITAMIN', 'Antihistamine':'ALLERGY', 'Probiotic':'OTHER', 'Antiviral':'OTHER', 'Steroid':'OTHER', 'Other':'OTHER' };
          const res = await addMedication(currentBackendId, {
            name:         entry.name,
            dosage:       entry.dosage,
            frequency:    entry.frequency,
            startDate:    entry.startDate || new Date().toISOString().split('T')[0],
            prescribedBy: entry.doctor,
            type:         typeMap[entry.type] || 'OTHER',
            notes:        entry.notes,
          });
          const saved = res.data || entry;
          setMedications(prev => ({ ...prev, [activeChild]: [...(prev[activeChild] || []), saved] }));
          showToast(`${entry.name} ${entry.dosage} added ✓`);
        } catch (err) { showToast(err.message || 'Failed to add medication'); }
      }} />

      <div className="pv-toast-wrap" role="status" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`pv-toast${t.visible ? ' show' : ''}`} onClick={() => dismissToast(t.id)}>
            <span style={{ flex: 1 }}>{t.msg}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
