import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ARTICLE_CONTENT_DE } from '../../../i18n/locales/support_de';
import Modal from '../ui/Modal';
import { FAQ_ITEMS, EMERGENCY_NUMBERS, HELP_TOPICS } from '../../../data/supportData';
import XBtn from '../ui/XBtn';

function TopicModal({topic, onClose}) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const titleT = (title) => {
    if (i18n.language !== 'de') return title;
    const titles = t('support.titles', {returnObjects: true});
    return (titles && titles[title]) ? titles[title] : title;
  };
  const [activeArticle, setActiveArticle] = useState(null);

  /* Article content map — keyed by article title */
  const ARTICLE_CONTENT = {
    /* ── GETTING STARTED ── */
    'Adding your first child profile':
      'Tap the + button next to the child tabs in the header. A modal opens asking for: full name, date of birth (used to auto-calculate age and match STIKO vaccine schedule), gender, and blood group. All fields except blood group are required. Once saved, a colour-coded tab appears with your child\'s initial. Every module — Growth, Vaccines, Records, Medications and Appointments — instantly switches to show that child\'s data. You can add up to 5 children on the free plan.',

    'Uploading your first health record':
      'Navigate to Records in the sidebar. Tap "Upload Document" in the top right. Choose a document type: Lab Report, Prescription, Scan / X-Ray, Vaccination Certificate, Allergy Report, Discharge Summary, or Other. Drop your PDF or image file into the upload zone, or tap to browse. Add a descriptive name, select the relevant date, and optionally add tags (e.g. "Fever", "MMR"). Tap Upload. The file is encrypted with AES-256 before leaving your device and stored on EU servers.',

    'Navigating the dashboard':
      'The Home dashboard is your child\'s daily health summary. At the top: stat cards showing total vaccines logged, growth entries, records uploaded, and upcoming appointments. Below that: an overdue vaccine alert if any STIKO doses are past due, followed by your next two upcoming visits. The Quick Add row lets you log a vaccine, record a measurement, or upload a document in one tap. Recent Activity at the bottom shows the last 5 health events. Use the sidebar (or bottom tabs on mobile) to navigate to any module.',

    'Setting up vaccine tracking':
      'PediVault automatically loads the official STIKO 2026 immunisation schedule based on your child\'s date of birth. Go to the Vaccines module to see all doses colour-coded: green (done), amber (due soon — within 4 weeks), red (overdue), and grey (not yet due). To record a completed vaccine, tap "Log Vaccine", choose the vaccine name and dose number, enter the date given, the administering doctor, and the clinic. The status updates immediately. You can also upload your child\'s Impfpass (yellow booklet) as a record in the Records module.',

    'Logging a growth measurement':
      'Go to Growth in the sidebar and tap "Add Entry". Enter the measurement date, weight in kilograms (e.g. 12.4), height in centimetres, and optionally head circumference. Tap Save. The WHO standard percentile chart updates instantly — you\'ll see a new data point plotted on the curve. The chart shows Weight-for-Age, Height-for-Age, and Head Circumference tracks separately. Use the tab selector at the top of the chart. PediVault calculates and displays your child\'s percentile rank so you can compare to the WHO population benchmark.',

    'Booking your first appointment':
      'Tap "+ Book Visit" in the top-right header button, or go to the Appointments module and tap the same button. Select the appointment type: U-Untersuchung (U1–U9), General Check-up, Vaccination, Specialist Referral, or Emergency. Enter the doctor\'s name, clinic name, date and time. Add any notes (e.g. "Bring Impfpass", "Ask about iron levels"). Tap Confirm. The booking appears in the Appointments module under Upcoming. You can cancel any booking by tapping it and selecting Cancel Appointment.',

    'Understanding the home dashboard':
      'Four stat cards at the top show live counts: vaccines logged, growth entries, uploaded records, and booked appointments. The "Due Soon" banner shows overdue or imminent STIKO vaccines with a direct link to the Vaccines module. "Upcoming Visits" lists your next two appointments with date, time and doctor. Quick Add cards let you jump directly to adding a vaccine, growth entry, record, or appointment. Recent Activity shows a timestamped log of everything added across all modules for the active child. The dashboard is always filtered to the child currently selected in the header tabs.',

    'Using the AI Assistant':
      'The AI Assistant uses your child\'s full health context — growth percentiles, vaccine schedule, allergies, conditions and medications — to give personalised answers. Example questions: "Is Aanya up to date on her vaccines?", "What does a weight in the 23rd percentile mean?", "My child has a fever of 38.9°C — what should I do?", "What foods are good for iron-deficiency anaemia?". The assistant follows STIKO guidelines and German paediatric standards. It always recommends consulting your Kinderarzt for medical decisions. Conversations are not stored after the session ends.',

    'Switching between children':
      'Tap any child tab in the header to switch. The active child is shown with a coloured dot and highlighted tab. On phones under 480px, the child tabs collapse and are replaced by circular initial buttons (e.g. "A" for Aanya, "R" for Rohan) in the header. All modules instantly reload for the selected child — including their individual Growth chart, Vaccine status, Records, Medications and Appointments. Added children (via the + button) can be removed from their Profile page using the "Remove child" button (only available for manually added children, not the two default profiles).',

    'Downloading records as PDF':
      'Open the Records module and tap any record card to expand it. Tap the Download button (arrow icon). The record saves as a PDF to your device\'s default download location. On mobile, the browser download sheet appears. You can then share the PDF via WhatsApp, email, AirDrop, or print it to bring to a clinic appointment. The PDF preserves the original file format — a photo scanned as JPEG will be embedded in a PDF wrapper. Lab reports and prescriptions originally uploaded as PDFs are downloaded as-is.',

    'Setting up emergency contacts':
      'Go to Profile in the sidebar and tap the Emergency tab. You\'ll see pre-loaded emergency contacts for Germany: 112 (Ambulance / Fire / Police), 116 117 (Medical on-call), 0800 111 0111 (Crisis line), and 0800 1110333 (Poison control). Each number has a direct Call button. To view your personal emergency contacts (family members, your Kinderarzt), scroll down — they are listed under "Emergency Contacts". Full editing of personal contacts is available after connecting to your account (backend feature coming soon).',

    'Managing medications':
      'Go to Medications in the sidebar and tap "Add Medication". Enter: medication name (e.g. Amoxicillin), type (Antibiotic, Antihistamine, Probiotic, etc.), dosage (e.g. 5 ml or 400 IU), frequency (Once daily, Twice daily, etc.), duration (3 days, 7 days, etc.), start date, prescribing doctor, and optional notes (e.g. "Take with food"). Tap Add Medication. Active courses appear highlighted in the Active section. When a course is finished, tap "✓ Done" to archive it. Archived medications move to the Completed section and remain in your records.',

    /* ── HEALTH RECORDS ── */
    'Supported file types for uploads':
      'PediVault accepts: PDF documents (lab reports, prescriptions, referral letters, discharge summaries), JPEG and PNG images (photos of documents, X-rays, scans), and DOC/DOCX Word documents. Maximum file size is 25 MB per file on the free plan and 100 MB on Premium. For best results, scan physical documents in good lighting at 300 DPI or higher. Photos of documents taken with a smartphone camera are accepted but may have lower text readability. We recommend using a scanning app (e.g. Adobe Scan, Microsoft Lens) for crisp, searchable PDFs.',

    'Organising records by category':
      'Every record has a category tag: Lab Report, Prescription, Scan / X-Ray, Vaccination Certificate, Allergy Report, Discharge Summary, or Other. Use the filter tabs at the top of the Records module to view only one category at a time. You can also add custom tags (e.g. "Ear Infection", "2024 Annual Check") when uploading. Use the search bar to find records by name, tag, date or doctor. Records are sorted by date by default — newest first. Tap the Sort button to switch to oldest first or alphabetical.',

    'Sharing records with your doctor':
      'Open any record and tap the Download button to save it as a PDF. You can then: share via WhatsApp (tap Share → WhatsApp), send by email (tap Share → Mail), AirDrop to a clinic iPad, or print directly from your phone. For U-Untersuchung check-ups, bring the downloaded growth report and vaccination summary. For specialist referrals, download the relevant lab report or scan and attach it to your appointment message. PediVault does not connect directly to hospital systems or your Krankenkasse — sharing is always manual and in your control.',

    'Searching and filtering records':
      'The Records module has a live search bar at the top. Type any part of the record name, tag, doctor name, or date to filter results instantly. Use the category filter tabs (All, Lab Report, Prescription, Scan, etc.) to narrow by type. Sort options: Newest First (default), Oldest First, A–Z by name. Active filters are shown as highlighted tabs. To clear all filters, tap the active tab again or delete the search text. On mobile, the search bar is accessible by tapping the magnifying glass icon in the top-right header.',

    'Understanding record security':
      'Every file uploaded to PediVault is encrypted with AES-256 before it leaves your device. The encrypted file is transmitted over TLS 1.3 and stored on servers in Frankfurt, Germany — never outside the EU. PediVault staff cannot view the contents of your files. Only you, with your account credentials, can decrypt and access your records. We undergo annual independent security audits (ISO 27001 aligned). In the unlikely event of a data breach, you will be notified within 72 hours in compliance with DSGVO Article 33.',

    'Exporting all your data':
      'To export everything: go to Support → App & Account → Privacy & Data, or contact support@pedivault.de requesting a full data export. We will prepare a ZIP archive containing: all your uploaded files (original format), all structured data (growth entries, vaccine records, medications, appointments) as a JSON file, and your account details. Export is delivered within 30 days as required by DSGVO Article 20. The JSON file can be imported into another health app or opened in any spreadsheet application.',

    'Correcting an uploaded record':
      'To correct a record name or tags: open the record in the Records module, tap the edit (pencil) icon in the top right of the expanded card, update the name, category, date or tags, then tap Save. To replace the file itself (e.g. you uploaded the wrong scan): delete the existing record by tapping the trash icon and confirming deletion, then re-upload the correct file. Deleted records are permanently removed and cannot be recovered. To correct a growth entry or vaccine log, open the respective module and tap the entry to edit it.',

    'Storage limits on free vs premium':
      'Free plan: 500 MB total storage, maximum 2 children, 25 MB per file. Premium plan (€4.99/month or €44.99/year): 50 GB total storage, up to 5 children, 100 MB per file, advanced analytics, vaccination certificate export, and priority support. Your current usage is shown at the bottom of the Records module. When you approach the 500 MB limit, a banner appears with an option to upgrade. Files are never deleted when you reach the limit — uploads are simply paused until you upgrade or free space.',

    'Deleting individual records':
      'Open the Records module and tap the record you want to delete. In the expanded detail view, tap the Delete (trash) icon. A confirmation dialog appears with the record name — tap "Yes, delete" to permanently remove it. Deleted records cannot be recovered. If you accidentally delete a record, you will need to re-upload the original file. For safety, we recommend downloading a local copy of important records before deleting. Batch deletion (selecting multiple records) is available on the Premium plan.',

    /* ── VACCINE TRACKER ── */
    'How the STIKO schedule works':
      'STIKO (Ständige Impfkommission) is Germany\'s Standing Committee on Vaccination, part of the Robert Koch Institute. They publish an annual immunisation schedule recommending when each vaccine should be given, based on clinical evidence and epidemiology. The schedule is divided by age (in months and years) and specifies primary series doses plus boosters. PediVault uses the 2026 STIKO schedule. Vaccines shown as standard (covered by all GKV) are marked in green. Recommended but individually paid (SIKO) vaccines are marked in blue. Travel vaccines are not included.',

    'Logging a completed vaccination':
      'Go to the Vaccines module and tap "Log Vaccine". Select the vaccine from the dropdown (all STIKO 2026 vaccines are listed). Choose the dose number (Dose 1, Dose 2, Booster, etc.). Enter the date administered, the administering doctor\'s name, and the clinic. Optionally add a batch number (from the vaccine vial label — useful for recall notifications). Tap Save. The vaccine card turns green immediately and the dose is marked as complete. If you administered a vaccine before installing PediVault, enter the historical date — the system accepts any past date.',

    'What "Overdue" means for vaccines':
      'A vaccine shows as Overdue (red) when your child\'s age has passed the STIKO maximum recommended age for that dose and it has not been logged as given. This does not mean your child is in danger — many overdue vaccines can still be given as catch-up doses. Contact your Kinderarzt to discuss a catch-up schedule. PediVault uses your child\'s exact date of birth to calculate overdue status — no manual age entry is needed. Overdue vaccines appear at the top of the list and trigger a summary alert on the Home dashboard.',

    'Generating a vaccination summary PDF':
      'In the Vaccines module, tap the Export button (document icon) in the top-right corner. PediVault generates a formatted PDF showing: all logged vaccines with date, doctor and clinic, all pending doses with their recommended timing, and your child\'s name and date of birth. This PDF is accepted by most Kinderarzt offices and schools (Kita registration often requires proof of MMR vaccination). The PDF is saved to your device and can be shared or printed. A Premium plan allows export of an official-format vaccination certificate.',

    'Catch-up schedules after missed doses':
      'If your child has missed doses (shown as Overdue in red), do not panic — most vaccines can be given as catch-up. The STIKO publishes catch-up recommendations for each vaccine. As a general rule: for primary series vaccines (DTaP, Hib, HepB, IPV, PCV), the series can be resumed from where it was left off — you do not need to restart from Dose 1. Minimum intervals between catch-up doses apply. Your Kinderarzt will calculate the correct catch-up schedule. In PediVault, once catch-up doses are logged, the overdue status clears automatically.',

    'Influenza — annual vaccine guidance':
      'The STIKO recommends annual influenza vaccination for: children under 2 years, children with chronic conditions (asthma, diabetes, heart disease, immunodeficiency), and all household contacts of high-risk individuals. The influenza vaccine is renewed each autumn (October–November) as the strain composition changes each year. PediVault tracks influenza vaccinations but does not auto-reset them annually — you need to log each year\'s dose separately. The nasal spray flu vaccine (Fluenz Tetra) is approved for children aged 2–17 and is an alternative to the injection.',

    'U-Untersuchungen and vaccines':
      'U-Untersuchungen (U1–U9) are statutory development check-ups covered by all GKV. At several U-appointments, vaccines are routinely offered: U3 (4–6 weeks): first vaccinations discussion. U4 (3–4 months): DTaP, Hib, IPV, HepB, PCV, Rota (doses 1–2). U5 (6–7 months): DTaP, Hib, IPV, HepB, PCV, Rota (dose 2–3). U6 (10–12 months): PCV, MenC booster. U7 (21–24 months): MMR, Varicella boosters. U9 (60–64 months): MMR, Varicella, DTaP-IPV boosters before school entry. PediVault links vaccine records to U-appointments when you book the appointment as type "U-Untersuchung".',

    /* ── ACCOUNT & PRIVACY ── */
    'Changing your password':
      'Go to Support → App & Account → Account & Profile. Tap "Change Password". Enter your current password, then your new password twice (minimum 8 characters, at least one uppercase letter, one number). Tap Save. You will receive a confirmation email. If you have forgotten your current password, tap "Forgot password?" on the Sign In screen and follow the email reset link. Password reset links expire after 15 minutes. After changing your password, all other logged-in sessions are automatically signed out for security.',

    'Two-factor authentication setup':
      'Two-factor authentication (2FA) adds a second verification step at login. To enable: go to Account & Profile → Security → Enable 2FA. Choose your method: SMS code to your registered phone number, or an authenticator app (Google Authenticator, Authy). For the authenticator app, scan the QR code shown, enter the 6-digit code to confirm, then save your 10 backup codes somewhere safe. 2FA is strongly recommended for accounts containing medical data. Once enabled, every sign-in requires your password plus the 6-digit code. You can disable 2FA at any time from the same settings screen.',

    'Data encryption and security':
      'PediVault uses a defence-in-depth security model. At rest: all files and structured data are encrypted with AES-256. In transit: all connections use TLS 1.3 with certificate pinning on mobile. Authentication tokens: stored in httpOnly cookies with SameSite=Strict and 90-day rotation. Passwords: hashed with bcrypt (cost factor 12), never stored in plaintext. Infrastructure: hosted on AWS Frankfurt (eu-central-1) with daily encrypted backups retained for 90 days. We do not use third-party analytics, advertising SDKs, or tracking pixels. Our full security policy is available at pedivault.de/security.',

    'GDPR / DSGVO compliance overview':
      'PediVault is fully compliant with the EU General Data Protection Regulation (GDPR / DSGVO). As a German company processing special category health data (Article 9), we apply the highest protection standards. Your rights: Right to access (Article 15) — request a copy of all your data. Right to rectification (Article 16) — correct inaccurate data. Right to erasure (Article 17) — delete your account and all data. Right to portability (Article 20) — export your data in machine-readable format. Right to object (Article 21) — opt out of any processing. To exercise any right, email datenschutz@pedivault.de.',

    'Deleting your account':
      'To permanently delete your account: go to Support → App & Account → Account & Profile → Delete Account. Enter your password to confirm. Your account, all child profiles, all uploaded records, all structured data (growth, vaccines, medications, appointments), and your email address are permanently deleted within 30 days in compliance with DSGVO. Backups are purged within 90 days. This action is irreversible. Before deleting: download your records and export your data (Support → Privacy & Data → Export). Once deleted, your email address can be re-used to create a new account.',

    'Accessing your data export':
      'To request your full data export: email datenschutz@pedivault.de with subject "Data Export Request" and your registered email address, or use the in-app request (Support → Privacy & Data). We will prepare a ZIP archive within 30 days containing: all your uploaded files in original format, a JSON file with all structured data (growth entries, vaccine logs, medications, appointments, profile data), and a PDF summary of your account activity. The export link is valid for 7 days after delivery. Data exports are provided free of charge under DSGVO Article 20.',

    'Managing linked devices':
      'PediVault tracks which devices are signed into your account. To view: go to Account & Profile → Security → Active Sessions. You\'ll see a list of devices with: device type (iPhone, Mac, Chrome on Windows etc.), approximate location (city), last active time, and whether it\'s the current session. To sign out a specific device remotely, tap "Sign out" next to it. To sign out all other devices at once, tap "Sign out all other sessions". We recommend reviewing this list periodically and signing out any devices you no longer use or don\'t recognise.',

    'Privacy settings overview':
      'Privacy settings in PediVault are kept minimal by design — we collect the minimum data necessary to operate the service. You can control: Crash reporting (on by default — helps us fix bugs, sends no personal data), Usage analytics (off by default — anonymous usage patterns only), Email notifications (on by default — appointment reminders, security alerts), and Marketing emails (off by default). No data is ever sold or shared with advertisers, insurers or employers. The AI Assistant does not store conversation history between sessions. Your health data is never used to train AI models.',

    /* ── AI ASSISTANT ── */
    'How the AI Assistant uses your data':
      'When you open a conversation, PediVault sends a secure, session-only context to the AI that includes: your child\'s name, age and gender, current weight and height percentile, overdue and upcoming vaccines, active medications, known allergies and conditions, and upcoming appointments. This context allows the AI to give personalised, relevant answers without you needing to explain your situation each time. The context is sent only for the duration of your session. Conversations and context are not stored after you close the chat — each session starts fresh. Anthropic (who powers the AI) does not retain or use your data for training.',

    'What the AI can and cannot do':
      'The AI Assistant CAN: explain medical terms and conditions in plain language, tell you if your child is on track with the STIKO vaccine schedule, describe what to expect at U-Untersuchungen, suggest questions to ask your Kinderarzt, explain growth percentile charts, provide evidence-based guidance on common childhood illnesses (fever, cough, rashes), and help you understand lab results. The AI CANNOT: diagnose medical conditions, prescribe medications, replace a paediatrician\'s examination, access real-time medical databases or news, make legal or insurance decisions, or access your health data between sessions.',

    'Data privacy and AI responses':
      'The AI Assistant is powered by Claude, developed by Anthropic. PediVault sends your child\'s health context to Anthropic\'s API only during active conversations and only for generating the response. Anthropic\'s API is used under a zero-data-retention agreement — no conversation data is logged or used for model training. Your child\'s name, DOB and health records never appear in Anthropic\'s training datasets. All API calls are made over encrypted connections. If you prefer not to share any health context with the AI, you can ask general paediatric questions without opening the in-app chat — the AI will respond with general (non-personalised) guidance.',

    'Getting the best answers from AI':
      'Tips for better AI responses: Be specific — instead of "my child is sick", say "my 3-year-old has had a fever of 38.5°C for 2 days with no other symptoms". Ask follow-up questions — the AI remembers the full conversation within a session. Use it to prepare for appointments — "What questions should I ask the Kinderarzt about iron deficiency?". Ask for explanations — "Can you explain what ferritin levels mean?". Use suggested prompts on the home screen to get started quickly. The AI responds in the language you write in — German or English both work. It follows German healthcare terminology and STIKO guidelines by default.',

    'Disabling the AI Assistant':
      'If you prefer not to use the AI Assistant, you can simply not open it — no AI processing occurs unless you actively start a conversation. The AI module does not run in the background and does not analyse your records passively. To remove the AI Assistant from the sidebar (Premium plan): go to Account & Profile → Preferences → Modules → uncheck "AI Assistant". The module will be hidden from navigation. To re-enable, go to the same settings and check the box again. Disabling the module does not delete any previous conversations (which are already session-only and not stored).',

    /* ── BILLING & PLANS ── */
    'PediVault Free vs Pro — comparison':
      'Free plan: 500 MB storage, 2 children, 25 MB per file, STIKO vaccine tracking, growth charts, appointments, medications, records, AI Assistant (10 messages/day), email support with 5-day response time. Premium plan (€4.99/month): Everything in Free, plus — 50 GB storage, 5 children, 100 MB per file, AI Assistant unlimited messages, vaccination certificate PDF export, advanced growth analytics with trend alerts, priority support (same-day response), family sharing (share access with a partner), and data backup guarantees. Annual plan (€44.99/year) saves 25% vs monthly. Both plans include the same core health record features.',

    'Upgrading to Pro':
      'To upgrade: go to Support → Subscription & Payments → Upgrade to Premium, or tap the upgrade banner when you approach your storage limit. Choose monthly (€4.99) or annual (€44.99 — saves €15). Enter your payment details (credit card, PayPal, or SEPA direct debit for German bank accounts). Tap Subscribe. Your account upgrades immediately — no waiting. All your existing data, records and child profiles carry over. Your Premium features activate within 60 seconds. You can cancel at any time and your Premium access continues until the end of your billing period. No partial refunds for unused months.',

    'Cancelling your subscription':
      'To cancel: go to Support → Subscription & Payments → Manage Subscription → Cancel. Your Premium access continues until the end of your current billing period (you will not be charged again). After cancellation, your account reverts to the Free plan. If your storage usage exceeds 500 MB, you will not lose any files — you simply cannot upload new files until you free space or re-subscribe. Your records, child profiles and all health data are retained indefinitely. Cancellation takes effect immediately — you will not receive a refund for the remaining days of the current period.',

    'Accepted payment methods':
      'PediVault accepts: Visa and Mastercard (credit and debit), PayPal, SEPA Direct Debit (for German and EU bank accounts — IBAN entry, 2-day processing), Apple Pay (on iOS and Safari), and Google Pay (on Android and Chrome). All payments are processed by Stripe, a PCI DSS Level 1 certified payment processor. PediVault never stores your full card number. For SEPA mandates, you\'ll receive a mandate reference by email. Invoices are emailed automatically each month and are available for download in the Billing section. All prices include German VAT (19%).',

    'Requesting a refund':
      'PediVault offers a 14-day money-back guarantee on new Premium subscriptions (EU Consumer Rights Directive). To request a refund within 14 days of subscribing: email billing@pedivault.de with your account email and "Refund Request" in the subject line. Refunds are processed within 5–10 business days to your original payment method. After 14 days, refunds are not available for partial billing periods — your access continues to the end of the paid period. For billing errors (duplicate charges, wrong amount), contact billing@pedivault.de immediately with your invoice number and we will resolve it within 2 business days.',

    'Family plan pricing':
      'The Family plan allows two parent/guardian accounts to share access to the same children\'s health records. Price: €7.99/month or €71.99/year (€3.99 per account vs €4.99 standalone — 20% saving). Each account has individual login credentials and full access to all shared children\'s records. Both accounts can add records, log vaccines, and book appointments. Notifications can be customised per account. The Family plan is ideal for co-parents, separated families, or parents who travel for work. To set up: subscribe to Premium and invite your partner from Account & Profile → Family Sharing. They receive an email invitation to join.',
  };

  const getContent = (title) => (i18n.language === 'de' && ARTICLE_CONTENT_DE[title]) ? ARTICLE_CONTENT_DE[title] : (ARTICLE_CONTENT[title] || null);

  const filtered = topic ? topic.items.filter(a=>a.title.toLowerCase().includes(search.toLowerCase())) : [];

  return (
    <Modal open={!!topic} onClose={()=>{ onClose(); setActiveArticle(null); setSearch(''); }} maxWidth={520}>
      {topic && (
      <div>
        <div style={{padding:'24px 24px 0'}}>
          <XBtn onClick={()=>{ if(activeArticle) setActiveArticle(null); else onClose(); }}/>

          {/* Breadcrumb when viewing article */}
          {activeArticle ? (
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <button type="button" onClick={()=>setActiveArticle(null)} style={{display:'flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'pointer',color:'var(--ink-3)',fontSize:'.52rem',padding:0}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                {topic.label}
              </button>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              <span style={{fontSize:'.52rem',color:'var(--ink)',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:200}}>{titleT(activeArticle.title)}</span>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:4}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${topic.color}18`,border:`1px solid ${topic.color}28`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {topic.icon}
              </div>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'var(--ink)'}}>{topic.label}</div>
                <div style={{fontSize:'.46rem',color:'var(--ink-3)'}}>{topic.articles} articles</div>
              </div>
            </div>
          )}
        </div>

        {/* ARTICLE DETAIL VIEW */}
        {activeArticle ? (
          <div style={{padding:'0 24px 24px'}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',color:'var(--ink)',marginBottom:6,marginTop:4,lineHeight:1.3}}>{titleT(activeArticle.title)}</div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:topic.color}}/>
              <span style={{fontSize:'.46rem',color:topic.color,fontWeight:600}}>{topic.label}</span>
              <span style={{color:'var(--line)',fontSize:'.5rem'}}>·</span>
              <span style={{fontSize:'.46rem',color:'var(--ink-3)'}}>{activeArticle.time} read</span>
              <span style={{color:'var(--line)',fontSize:'.5rem'}}>·</span>
              <span style={{fontSize:'.46rem',color:'var(--ink-3)'}}>{activeArticle.views} views</span>
            </div>
            {getContent(activeArticle.title) ? (
              <>
                <div style={{
                  fontSize:'.62rem',fontWeight:300,color:'var(--ink)',lineHeight:1.9,
                  borderLeft:`3px solid ${topic.color}`,paddingLeft:14,marginBottom:16,
                }}>
                  {getContent(activeArticle.title)}
                </div>
                <div style={{padding:'12px 14px',background:`${topic.color}08`,border:`1px solid ${topic.color}20`,borderRadius:10,display:'flex',gap:10,alignItems:'flex-start'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={topic.color} strokeWidth="1.8" strokeLinecap="round" style={{flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <div>
                    <div style={{fontSize:'.52rem',fontWeight:600,color:topic.color,marginBottom:2}}>{t('support.stillQuestions','Still have questions?')}</div>
                    <div style={{fontSize:'.48rem',fontWeight:300,color:'var(--ink-3)'}}>Email us at <strong style={{color:'var(--ink)'}}>support@pedivault.de</strong> or use the Send Feedback form below.</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{textAlign:'center',padding:'24px 0',color:'var(--ink-3)',fontSize:'.6rem'}}>Content loading…</div>
            )}
          </div>
        ) : (
          /* ARTICLE LIST VIEW */
          <>
            <div style={{padding:'12px 24px 0'}}>
              <div style={{position:'relative'}}>
                <svg style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('support.searchInArticles','Search within articles…')}
                  style={{width:'100%',height:36,padding:'0 12px 0 34px',borderRadius:10,border:'1.5px solid var(--line2)',background:'var(--cream-2)',fontFamily:"'DM Sans',sans-serif",fontSize:'.6rem',color:'var(--ink)',outline:'none',boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{maxHeight:320,overflowY:'auto',padding:'8px 0'}}>
              {filtered.map((a,i)=>(
                <div key={i}
                  onClick={()=>setActiveArticle(a)}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'11px 24px',borderBottom:i<filtered.length-1?'1px solid var(--line2)':'none',cursor:'pointer',transition:'background .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--cream-2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{width:24,height:24,borderRadius:8,background:`${topic.color}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'.52rem',fontWeight:600,color:topic.color}}>{a.n}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'.62rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{titleT(a.title)}</div>
                    <div style={{fontSize:'.46rem',color:'var(--ink-3)'}}>{a.time} read · {a.views} views</div>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={topic.color} strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              ))}
              {filtered.length===0&&<div style={{padding:'24px',textAlign:'center',fontSize:'.6rem',color:'var(--ink-3)'}}>No articles match "{search}"</div>}
            </div>
          </>
        )}

        <div style={{padding:'12px 24px',borderTop:'1px solid var(--line2)',display:'flex',gap:10}}>
          {activeArticle
            ? <button type="button" className="fb fb-p" style={{flex:1}} onClick={()=>setActiveArticle(null)}>{t('support.backToList','← Back to list')}</button>
            : <>
                <button type="button" className="fb fb-g" style={{flex:1}} onClick={()=>{onClose();setSearch('');}}>{t('common.close','Close')}</button>
                <button type="button" style={{flex:1,height:38,background:topic.color,color:'#fff',border:'none',borderRadius:10,fontSize:'.6rem',fontWeight:500,cursor:'pointer',transition:'opacity .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.opacity='.88'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                  Browse All →
                </button>
              </>
          }
        </div>
      </div>
      )}
    </Modal>
  );
}

export function SupportModule({onNav, showToast=()=>{}}) {
  const { t } = useTranslation();
  const faqT = (i, field) => {
    const keys = {
      q: ['faq_q1','faq_q2','faq_q3','faq_q4','faq_q5','faq_q6','faq_q7','faq_q8'],
      a: ['faq_a1','faq_a2','faq_a3','faq_a4','faq_a5','faq_a6','faq_a7','faq_a8'],
      tag: ['faq_tag1','faq_tag2','faq_tag3','faq_tag4','faq_tag5','faq_tag6','faq_tag7','faq_tag1'],
    };
    return t(`support.${keys[field][i]}`, '');
  };
  const emergT = (i, field) => {
    const keys = {
      label: ['emerg1_label','emerg2_label','emerg3_label','emerg4_label'],
      sub:   ['emerg1_sub','emerg2_sub','emerg3_sub','emerg4_sub'],
    };
    return t(`support.${keys[field][i]}`, '');
  };
  const topicLabel = (id) => ({
    'started':  t('support.topicStarted','Getting Started'),
    'records':  t('support.topicRecords','Health Records'),
    'vaccines': t('support.topicVaccines','Vaccine Tracker'),
    'account':  t('support.topicAccount','Account & Privacy'),
    'privacy':  t('support.topicAccount','Account & Privacy'),
    'ai':       t('support.topicAI','AI Assistant'),
    'billing':  t('support.topicBilling','Billing & Plans'),
  }[id] || id);
  const [openFaq,    setOpenFaq]    = useState(null);
  const [filter,     setFilter]     = useState('all');
  const [feedback,   setFeedback]   = useState({type:'Bug',message:'',rating:0});
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTopic,setActiveTopic]= useState(null);
  const [search,     setSearch]     = useState('');

  const tags = ['all', ...new Set(FAQ_ITEMS.map(f=>f.tag))];
  const faqVisible = FAQ_ITEMS.filter(f=>(filter==='all'||f.tag===filter)&&(!search||f.q.toLowerCase().includes(search.toLowerCase())));

  const submitFeedback = () => {
    if(!feedback.message.trim()) return;
    setSubmitting(true);
    setTimeout(()=>{ setSubmitting(false); setSubmitted(true); },1200);
  };

  return (
    <div className="pv-page" style={{animation:'fadeUp .3s ease both'}}>

      {/* Topic modal */}
      <TopicModal topic={activeTopic} onClose={()=>setActiveTopic(null)}/>

      {/* ── HERO ── */}
      <div style={{background:'linear-gradient(135deg,var(--rose-pale),var(--jc,#FFF5EC),var(--cream-2))',border:'1px solid var(--rose-lt)',borderRadius:20,padding:'28px 28px 24px',marginBottom:20,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-30,right:-30,width:160,height:160,borderRadius:'50%',background:'radial-gradient(ellipse,var(--rose-lt) 0%,transparent 70%)',opacity:.5,pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.6rem',fontWeight:300,color:'var(--ink)',marginBottom:6}}>{t('support.title','How can we help?').split(' ').slice(0,-1).join(' ')} <em style={{color:'var(--rose)',fontStyle:'italic'}}>{t('support.title','help?').split(' ').slice(-1)[0]}</em></div>
          <div style={{fontSize:'.58rem',fontWeight:300,color:'var(--ink-3)',marginBottom:18}}>{t('support.subtitle','Search articles, browse FAQs, or reach our support team')}</div>
          <div style={{position:'relative',maxWidth:520}}>
            <svg style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)'}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('support.searchPlaceholder','Search help articles…')}
              style={{width:'100%',height:42,padding:'0 36px 0 38px',borderRadius:50,border:'1.5px solid var(--line2)',background:'rgba(255,255,255,.9)',fontFamily:"'DM Sans',sans-serif",fontSize:'.66rem',color:'var(--ink)',outline:'none',boxSizing:'border-box',transition:'border-color .2s,box-shadow .2s'}}
              onFocus={e=>{e.target.style.borderColor='var(--rose)';e.target.style.boxShadow='0 0 0 3px var(--rose-pale)'}}
              onBlur={e=>{e.target.style.borderColor='var(--line2)';e.target.style.boxShadow='none'}}/>
            {search&&<button type="button" onClick={()=>setSearch('')} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--ink-3)',fontSize:'1rem',lineHeight:1}}>×</button>}
          </div>
        </div>
        {/* Status */}
        <div style={{marginTop:14,display:'flex',alignItems:'center',gap:8,fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>
          <div style={{display:'flex',alignItems:'center',gap:6,background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:20,padding:'3px 10px'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',animation:'ping 2s ease-out infinite'}}/>
            <span style={{fontSize:'.48rem',fontWeight:500,color:'var(--green)'}}>{t('support.allSystems','All systems operational')}</span>
          </div>
          <span style={{fontSize:'.46rem',fontWeight:600,color:'var(--green)',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:4,padding:'1px 6px'}}>LIVE</span>
          <span style={{marginLeft:4}}>{t('support.liveStatus','PediVault services are running normally')}</span>
        </div>
      </div>

      {/* ── BROWSE BY TOPIC ── */}
      <div className="sh" style={{marginBottom:14}}><div className="sh-title">{t('support.browseByTopic','Browse by Topic')}</div></div>
      <div className="pv-topics-grid">
        {HELP_TOPICS.map((topic,i)=>(
          <div key={topic.id}
            className="card"
            onClick={()=>setActiveTopic(topic)}
            style={{cursor:'pointer',padding:'18px 16px',position:'relative',overflow:'hidden',animation:`fadeUp .25s ease ${i*.05}s both`}}>
            <button type="button" onClick={e=>{e.stopPropagation();setActiveTopic(topic);}} style={{position:'absolute',top:12,right:12,width:22,height:22,borderRadius:6,background:`${topic.color}15`,border:`1px solid ${topic.color}25`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} aria-label={`Browse ${topic.label}`}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={topic.color} strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <div className="icon-hover" style={{width:44,height:44,borderRadius:13,background:`${topic.color}12`,border:`1px solid ${topic.color}20`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
              {topic.icon}
            </div>
            <div style={{fontSize:'.66rem',fontWeight:600,color:'var(--ink)',marginBottom:3}}>{topicLabel(topic.id)}</div>
            <div style={{fontSize:'.48rem',fontWeight:300,color:'var(--ink-3)'}}>{topic.articles} {t('support.articles','articles')}</div>
          </div>
        ))}
      </div>

      {/* ── EMERGENCY NUMBERS ── */}
      <div className="sh"><div className="sh-title">{t('support.emergencyNumbers','Emergency Numbers')}</div></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
        {EMERGENCY_NUMBERS.map((e,i)=>(
          <a key={i} href={`tel:${e.number.replace(/\\s/g,'')}`} style={{
            display:'flex',alignItems:'center',gap:11,padding:'12px 14px',
            background:'var(--white)',borderRadius:13,
            border:`1.5px solid ${e.color}28`,borderLeft:`3px solid ${e.color}`,
            textDecoration:'none',transition:'transform .18s ease,box-shadow .18s ease',
            animation:`fadeUp .25s ease ${i*.05}s both`,
          }}
          onMouseEnter={ev=>{ev.currentTarget.style.transform='translateY(-2px)';ev.currentTarget.style.boxShadow=`0 6px 20px ${e.color}20`}}
          onMouseLeave={ev=>{ev.currentTarget.style.transform='';ev.currentTarget.style.boxShadow=''}}>
            <div className="icon-hover" style={{width:36,height:36,borderRadius:10,background:`${e.color}12`,border:`1px solid ${e.color}28`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              {e.icon}
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:'.78rem',fontWeight:700,color:e.color,fontFamily:"'Playfair Display',serif",marginBottom:1}}>{e.number}</div>
              <div style={{fontSize:'.56rem',fontWeight:600,color:'var(--ink)',marginBottom:1}}>{emergT(EMERGENCY_NUMBERS.indexOf(e),'label')||e.label}</div>
              <div style={{fontSize:'.44rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.4}}>{emergT(EMERGENCY_NUMBERS.indexOf(e),'sub')||e.sub}</div>
            </div>
          </a>
        ))}
      </div>

      {/* ── FAQ ── */}
      <div className="sh" style={{marginBottom:12}}>
        <div className="sh-title">{t('support.faq','Frequently Asked Questions')}</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:'.48rem',fontWeight:300,color:'var(--ink-3)'}}>{FAQ_ITEMS.length} {t('support.articles','articles')}</span>
          <button type="button" onClick={()=>setFilter('all')} style={{fontSize:'.46rem',fontWeight:500,color:'var(--rose)',background:'none',border:'none',cursor:'pointer',padding:0}}>{t('support.viewAll','VIEW ALL')}</button>
        </div>
      </div>
      <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:12}}>
        {tags.map(ftag=>(
          <div key={ftag} onClick={()=>setOpenFaq(null)||setFilter(ftag)} style={{height:24,padding:'0 10px',borderRadius:20,cursor:'pointer',userSelect:'none',fontSize:'.5rem',fontWeight:filter===ftag?600:400,color:filter===ftag?'#fff':'var(--ink-2)',background:filter===ftag?'var(--rose)':'var(--cream-2)',border:`1px solid ${filter===ftag?'transparent':'var(--line2)'}`,transition:'all .15s',display:'inline-flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>{ftag==='all'?`${t('home.viewAll','All')} (${FAQ_ITEMS.length})`:t('support.faq_tag_'+ftag.toLowerCase(),ftag)}</div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:0,borderRadius:14,overflow:'hidden',boxShadow:'var(--shadow-card)',marginBottom:20}}>
        {faqVisible.map((item,i)=>{
          const isOpen=openFaq===i;
          return (
            <div key={i} style={{borderBottom:i<faqVisible.length-1?'1px solid var(--line2)':'none',background:isOpen?'var(--cream-2)':'var(--white)',transition:'background .15s',animation:`fadeUp .2s ease ${i*.03}s both`}}>
              <div onClick={()=>setOpenFaq(isOpen?null:i)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 17px',cursor:'pointer',userSelect:'none'}}>
                <div style={{width:30,height:30,borderRadius:9,background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {item.icon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'.63rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{faqT(faqVisible.indexOf(item),'q')||item.q}</div>
                  <span style={{fontSize:'.43rem',fontWeight:600,color:'var(--blue)',background:'var(--blue-bg)',border:'1px solid var(--blue-lt)',borderRadius:20,padding:'1px 6px'}}>{faqT(faqVisible.indexOf(item),'tag')||item.tag}</span>
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" style={{flexShrink:0,transform:isOpen?'rotate(180deg)':'none',transition:'transform .2s'}}><path d="M6 9l6 6 6-6"/></svg>
              </div>
              {isOpen&&(
                <div style={{padding:'0 17px 14px 59px',fontSize:'.57rem',fontWeight:300,color:'var(--ink-2)',lineHeight:1.75}}>
                  {faqT(faqVisible.indexOf(item),'a')||item.a}
                  <div style={{marginTop:10,display:'flex',alignItems:'center',gap:7}}>
                    <span style={{fontSize:'.46rem',color:'var(--ink-3)'}}>{t('support.wasHelpful','Was this helpful?')}</span>
                    {[t('common.yes','Yes'), t('common.no','No')].map((lbl,j)=>(
                      <button key={j} type="button" style={{display:'flex',alignItems:'center',gap:4,height:22,padding:'0 9px',borderRadius:20,border:'1px solid var(--line2)',background:'var(--cream-2)',cursor:'pointer',fontSize:'.46rem',color:'var(--ink-3)',transition:'all .15s',justifyContent:'center',lineHeight:1}} onMouseEnter={e=>{e.currentTarget.style.background='var(--rose-pale)';e.currentTarget.style.borderColor='var(--rose-lt)';e.currentTarget.style.color='var(--rose)'}} onMouseLeave={e=>{e.currentTarget.style.background='var(--cream-2)';e.currentTarget.style.borderColor='var(--line2)';e.currentTarget.style.color='var(--ink-3)'}}>{lbl}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {faqVisible.length===0&&<div style={{padding:'28px',textAlign:'center',fontSize:'.6rem',color:'var(--ink-3)'}}>No results — <button type="button" onClick={()=>{setFilter('all');setSearch('')}} style={{color:'var(--rose)',background:'none',border:'none',cursor:'pointer',fontWeight:500}}>clear filter</button></div>}
      </div>

      {/* ── CONTACT + FEEDBACK ── */}
      <div className="sh"><div className="sh-title">{t('support.contactUs','Contact Us')}</div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:20}}>
        {[
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label:t('support.emailSupport','Email Support'), sub:'support@pedivault.de', action:()=>window.open('mailto:support@pedivault.de'), color:'var(--blue)'},
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/><path d="M10 16v3M14 16v3M7 19h10"/></svg>, label:t('nav.ai_assist','AI Assistant'), sub:t('ai.subtitle','Ask health questions'), action:()=>onNav('ai-assist'), color:'var(--rose)'},
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>, label:t('support.documentation','Documentation'), sub:'docs.pedivault.de', action:()=>window.open('https://docs.pedivault.de','_blank','noopener'), color:'var(--green)'},
        ].map((c,i)=>(
          <div key={i} onClick={c.action} style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'14px 8px',background:'var(--white)',borderRadius:14,border:'1px solid var(--line2)',textDecoration:'none',textAlign:'center',transition:'transform .18s ease,box-shadow .18s ease',cursor:'pointer'}}
            onMouseEnter={ev=>{ev.currentTarget.style.transform='translateY(-2px)';ev.currentTarget.style.boxShadow='var(--shadow-hover)'}}
            onMouseLeave={ev=>{ev.currentTarget.style.transform='';ev.currentTarget.style.boxShadow=''}}>
            <div className="icon-hover" style={{width:40,height:40,borderRadius:12,background:`${c.color}12`,border:`1px solid ${c.color}20`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8}}>
              {c.icon}
            </div>
            <span style={{fontSize:'.56rem',fontWeight:600,color:'var(--ink)',marginBottom:3}}>{c.label}</span>
            <span style={{fontSize:'.46rem',fontWeight:300,color:'var(--ink-3)'}}>{c.sub}</span>
          </div>
        ))}
      </div>

      {/* ── APP INFO CARDS ── */}
      <div className="sh"><div className="sh-title">{t('support.appAccount','App & Account')}</div></div>
      <div style={{display:'flex',flexDirection:'column',gap:0,borderRadius:14,overflow:'hidden',boxShadow:'var(--shadow-card)',marginBottom:20}}>
        {[
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,   label:t('support.accountProfile','Konto & Profil'), sub:t('support.accountProfileSub','Name, email, password, preferences'),       action:()=>onNav('account')},
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,                             label:t('support.privacyData','Privacy & Data'), sub:t('support.privacyDataSub','DSGVO rights, data export, deletion'),        legalHash:'privacy'},
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label:t('support.subscription','Subscription & Payments'), sub:t('support.subscriptionSub','Free plan · Upgrade to Premium €4.99/mo'), badge:'FREE'},
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, label:t('support.termsOfUse','Terms of Use'), sub:t('support.termsSub','Usage rules and medical disclaimer'),        legalHash:'terms'},
          {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,                       label:t('support.aboutApp','About PediVault'), sub:'Version 1.0.0 · PediVault GmbH Berlin'},
        ].map((item,i,arr)=>(
          <div key={i}
            onClick={()=>{
              if(item.action) { item.action(); return; }
              if(item.legalHash) {
                /* Open legal info in an in-app overlay — never navigate away */
                const url = `pedivault-legal.html#${item.legalHash}`;
                const w = window.open(url,'pedivault_legal','noopener,width=900,height=700,scrollbars=yes');
                if(!w) showToast('Please allow pop-ups to view legal documents');
              }
            }}
            style={{display:'flex',alignItems:'center',gap:14,padding:'13px 16px',background:'var(--white)',borderBottom:i<arr.length-1?'1px solid var(--line2)':'none',cursor:'pointer',transition:'background .15s'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--cream-2)'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--white)'}>
            <div className="icon-hover" style={{width:36,height:36,borderRadius:10,background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{item.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'.64rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{item.label}</div>
              <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>{item.sub}</div>
            </div>
            {item.badge && <span style={{fontSize:'.42rem',fontWeight:600,color:'var(--green)',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:20,padding:'2px 7px'}}>{item.badge}</span>}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        ))}
      </div>

      {/* ── FEEDBACK ── */}
      <div className="sh"><div className="sh-title">{t('support.sendFeedback','Send Feedback')}</div></div>
      <div className="card" style={{marginBottom:16}}>
        {submitted ? (
          <div style={{textAlign:'center',padding:'16px 0'}}>
            <div style={{width:52,height:52,borderRadius:16,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'.95rem',color:'var(--ink)',marginBottom:6}}>{t('support.thankYou','Thank you! 🌸')}</div>
            <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)'}}>{t('support.thankYouSub','Your feedback helps us improve PediVault.')}</div>
            <button type="button" onClick={()=>{setSubmitted(false);setFeedback({type:'Bug',message:'',rating:0});}} style={{marginTop:14,height:30,padding:'0 16px',borderRadius:9,background:'var(--cream-2)',border:'1px solid var(--line2)',fontSize:'.54rem',color:'var(--ink-2)',cursor:'pointer'}}>{t('support.sendAnother','Send another')}</button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <div style={{fontSize:'.46rem',fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:7}}>{t('support.feedbackType','Type')}</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {[t('support.bug','Bug'), t('support.featureRequest','Feature Request'), t('support.question','Question'), t('support.compliment','Compliment')].map(ftype=>(
                  <div key={ftype} onClick={()=>setFeedback(f=>({...f,type:ftype}))} style={{height:26,padding:'0 12px',borderRadius:20,cursor:'pointer',userSelect:'none',fontSize:'.52rem',fontWeight:feedback.type===ftype||feedback.type===ftype?600:400,color:feedback.type===ftype?'#fff':'var(--ink-2)',background:feedback.type===ftype?'var(--rose)':'var(--cream-2)',border:`1px solid ${feedback.type===ftype?'transparent':'var(--line2)'}`,transition:'all .15s',display:'inline-flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>{ftype}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:'.46rem',fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:7}}>{t('support.feedbackExperience','Overall experience')}</div>
              <div style={{display:'flex',gap:8}}>
                {[1,2,3,4,5].map(n=>(
                  <div key={n} onClick={()=>setFeedback(f=>({...f,rating:n}))} style={{width:32,height:32,borderRadius:9,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',background:feedback.rating>=n?'var(--amber-bg)':'var(--cream-2)',border:`1px solid ${feedback.rating>=n?'var(--amber-lt)':'var(--line2)'}`,transform:feedback.rating>=n?'scale(1.1)':'scale(1)'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback.rating>=n?'var(--amber)':'none'} stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:'.46rem',fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:7}}>{t('support.feedbackMessage','Message')}</div>
              <textarea value={feedback.message} onChange={e=>setFeedback(f=>({...f,message:e.target.value}))} placeholder={t('support.feedbackPlaceholder','Tell us what\'s working well...')} rows={4} style={{width:'100%',border:'1.5px solid var(--line2)',borderRadius:10,padding:'10px 12px',fontFamily:"'DM Sans',sans-serif",fontSize:'.6rem',color:'var(--ink)',resize:'vertical',outline:'none',background:'var(--cream-2)',boxSizing:'border-box',lineHeight:1.55,transition:'border-color .2s'}} onFocus={e=>e.target.style.borderColor='var(--rose)'} onBlur={e=>e.target.style.borderColor='var(--line2)'}/>
            </div>
            <button type="button" onClick={submitFeedback} disabled={!feedback.message.trim()||submitting} style={{height:38,borderRadius:10,border:'none',cursor:feedback.message.trim()&&!submitting?'pointer':'default',background:feedback.message.trim()?'var(--rose)':'var(--cream-2)',color:feedback.message.trim()?'#fff':'var(--ink-3)',fontSize:'.6rem',fontWeight:500,display:'flex',alignItems:'center',justifyContent:'center',gap:7,boxShadow:feedback.message.trim()?'0 2px 10px rgba(155,58,86,.28)':'none',transition:'all .2s',lineHeight:1}}>
              {submitting?<><div style={{width:13,height:13,borderRadius:'50%',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',animation:'pvSpin .7s linear infinite'}}/> {t('support.sending','Sending…')}</>:<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg> {t('support.sendButton','Send feedback')}</>}
            </button>
          </div>
        )}
      </div>

      {/* DSGVO footer */}
      <div className="card" style={{background:'linear-gradient(135deg,var(--cream-2),rgba(253,250,248,.8))'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
          <div style={{width:32,height:32,borderRadius:9,background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:'.6rem',fontWeight:600,color:'var(--rose)',marginBottom:4}}>{t('support.privacyLegal','Privacy >Privacy & Legal</div> Legal')}</div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {[{label:t('support.privacyPolicy','Privacy Policy'),hash:'privacy'},{label:t('support.termsLink','Terms of Use'),hash:'terms'},{label:t('support.gdpr','DSGVO / GDPR'),hash:'privacy'},{label:t('support.faqLink','FAQ'),hash:'faq'},{label:t('support.imprint','Impressum'),hash:'imprint'}].map((l,i)=>(
                <button key={i} type="button" onClick={()=>{ const w=window.open(`pedivault-legal.html#${l.hash}`,'pedivault_legal','noopener,width=900,height=700,scrollbars=yes'); if(!w) showToast('Please allow pop-ups to view legal documents'); }} style={{fontSize:'.5rem',fontWeight:400,color:'var(--rose)',background:'none',border:'none',borderBottom:'1px solid var(--rose-lt)',padding:0,cursor:'pointer',transition:'color .15s'}}>{l.label}</button>
              ))}
            </div>
            <div style={{marginTop:8,fontSize:'.46rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.6}}>PediVault GmbH · Alexanderplatz 1, 10178 Berlin · HRB 123456 · Version 1.0.0</div>
          </div>
        </div>
      </div>

    </div>
  );
}


