import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../api/client';

function buildSuggestedPrompts(childName, childData, t) {
  const ageStr = (() => {
    if (!childData?.dateOfBirth) return 'your child';
    const d = new Date(childData.dateOfBirth), now = new Date();
    let years  = now.getFullYear() - d.getFullYear();
    let months = now.getMonth()    - d.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0) return `${months}-month-old`;
    if (months >= 6) return `${years}½-year-old`;
    return `${years}-year-old`;
  })();

  const r = (key, vars={}) => t(key, t(key,'?')).replace('{name}', vars.name||childName).replace('{age}', vars.age||ageStr);
  return [
    { icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4zM14.5 5.5l4 4M12 8l-8 8 1 3 3 1 8-8"/></svg>, text:r('ai.q1') },
    { icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, text:r('ai.q2') },
    { icon:'🤒', text:r('ai.q3') },
    { icon:'😴', text:r('ai.q4', {age:ageStr}) },
    { icon:'🥦', text:r('ai.q5', {age:ageStr}) },
    { icon:'🧠', text:r('ai.q6', {age:ageStr}) },
    { icon:'🦷', text:r('ai.q7') },
    { icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>, text:r('ai.q8') },
  ];
}

export function AIAssistantModule({ activeChild, activeChildData, growthData, vaccineEntries = [], medications = [] }) {
  const { t } = useTranslation();
  const [messages,        setMessages]        = useState([]);
  const [input,           setInput]           = useState('');
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  const childName = activeChildData?.name?.split(' ')[0] || 'your child';
  const suggestedPrompts = buildSuggestedPrompts(childName, activeChildData, t);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role:'user', content:trimmed, ts:Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const data = await api.post('/ai/chat', {
        messages:     history,
        childContext: activeChildData,
      });
      const reply = data?.data?.reply || "I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { role:'assistant', content:reply, ts:Date.now() }]);
    } catch (e) {
      setError(e.message?.includes('fetch') ? 'Network error — check your connection and try again.' : (e.message || 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const clearChat = () => { setMessages([]); setError(null); };

  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**'))
        return <strong key={i} style={{ fontWeight:600, color:'var(--ink)' }}>{p.slice(2,-2)}</strong>;
      if (p.startsWith('*') && p.endsWith('*'))
        return <em key={i} style={{ fontStyle:'italic', color:'var(--ink-2)' }}>{p.slice(1,-1)}</em>;
      return p;
    });
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### '))
        return <div key={i} style={{ fontWeight:600, fontSize:'.66rem', color:'var(--ink)', margin:'6px 0 3px' }}>{renderInline(line.slice(4))}</div>;
      if (line.startsWith('## '))
        return <div key={i} style={{ fontWeight:700, fontSize:'.68rem', color:'var(--ink)', margin:'8px 0 3px' }}>{renderInline(line.slice(3))}</div>;
      if (line.startsWith('- ') || line.startsWith('* '))
        return <div key={i} style={{ display:'flex', gap:7, marginBottom:3, alignItems:'flex-start' }}>
          <span style={{ color:'var(--rose)', flexShrink:0, marginTop:1 }}>·</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>;
      if (/^\d+\.\s/.test(line))
        return <div key={i} style={{ display:'flex', gap:7, marginBottom:3, alignItems:'flex-start' }}>
          <span style={{ color:'var(--rose)', flexShrink:0, fontWeight:600, marginTop:1, minWidth:14 }}>{line.match(/^\d+/)[0]}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
        </div>;
      if (line.trim() === '') return <div key={i} style={{ height:7 }}/>;
      return <div key={i} style={{ marginBottom:3 }}>{renderInline(line)}</div>;
    });
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - var(--header-h))', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--line2)', background:'var(--white)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))', border:'1px solid var(--rose-lt)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/><path d="M10 16v3M14 16v3M7 19h10"/></svg>
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'.9rem', fontWeight:400, color:'var(--ink)' }}>PediVault <em style={{ color:'var(--rose)' }}>AI</em></div>
            <div style={{ fontSize:'.45rem', fontWeight:300, color:'var(--ink-3)' }}>{t('ai.subtitle','Paediatric health assistant')} · {childName}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {messages.length > 0 && (
            <button type="button" onClick={clearChat} style={{ height:28, padding:'0 11px', borderRadius:8, background:'var(--cream-2)', border:'1px solid var(--line2)', fontSize:'.5rem', fontWeight:500, color:'var(--ink-3)', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
              Clear
            </button>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:5, height:24, padding:'0 9px', borderRadius:20, background:'var(--green-bg)', border:'1px solid var(--green-lt)' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--green)', animation:'ping 2s ease-out infinite' }}/>
            <span style={{ fontSize:'.44rem', fontWeight:600, color:'var(--green)' }}>{t('ai.online','Online')}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px', scrollbarWidth:'thin', scrollbarColor:'var(--rose-lt) transparent' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>

          {/* Welcome state */}
          {messages.length === 0 && (
            <>
              <div style={{ background:'linear-gradient(135deg,var(--rose-pale))', border:'1px solid var(--rose-lt)', borderRadius:16, padding:'20px 22px', marginBottom:22, textAlign:'center' }}>
                <div style={{ width:52, height:52, borderRadius:15, background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))', border:'1px solid var(--rose-lt)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.7" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/><path d="M10 16v3M14 16v3M7 19h10"/></svg>
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', color:'var(--ink)', marginBottom:6 }}>
                  {t('ai.welcome','Hello! I\'m your PediVault AI assistant')}
                </div>
                <div style={{ fontSize:'.55rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.75, maxWidth:380, margin:'0 auto' }}>
                  {t('ai.contextInfo','I have full context of')} {childName}'s {t('ai.contextInfo2','health records — growth data, vaccine schedule, medications and more.')}
                </div>
                <div style={{ marginTop:12, display:'inline-flex', alignItems:'center', gap:5, fontSize:'.46rem', color:'var(--ink-3)', background:'var(--cream-2)', border:'1px solid var(--line2)', borderRadius:20, padding:'4px 10px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {t('ai.disclaimer','Not a substitute for medical advice')}
                </div>
              </div>
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:'.46rem', fontWeight:600, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:10 }}>{t('ai.suggested','Suggested questions')}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {suggestedPrompts.map((p, i) => (
                    <div key={i} onClick={() => sendMessage(p.text)} style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 13px', background:'var(--white)', border:'1px solid var(--line2)', borderRadius:12, cursor:'pointer', transition:'all .15s', userSelect:'none', animation:`fadeUp .25s ease ${i * .04}s both` }}>
                      <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{p.icon}</span>
                      <span style={{ fontSize:'.54rem', fontWeight:400, color:'var(--ink-2)', lineHeight:1.4 }}>{p.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Message thread */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', flexDirection:msg.role === 'user' ? 'row-reverse' : 'row', alignItems:'flex-start', gap:10, animation:'fadeUp .2s ease both' }}>
                <div style={{ width:30, height:30, borderRadius:9, flexShrink:0, background:msg.role === 'user' ? 'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))' : 'linear-gradient(135deg,#1a73e8,#0d47a1)', border:msg.role === 'user' ? '1px solid var(--rose-lt)' : 'none', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {msg.role === 'user'
                    ? <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'.7rem', color:'var(--rose)' }}>{childName[0]}</span>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/></svg>
                  }
                </div>
                <div style={{ maxWidth:'76%', background:msg.role === 'user' ? 'linear-gradient(135deg,var(--rose),#8A2846)' : 'var(--white)', color:msg.role === 'user' ? '#fff' : 'var(--ink)', borderRadius:msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding:'11px 14px', border:msg.role === 'user' ? 'none' : '1px solid var(--line2)', boxShadow:msg.role === 'user' ? '0 4px 16px rgba(155,58,86,.25)' : 'var(--shadow-card)', fontSize:'.6rem', lineHeight:1.65, fontWeight:300 }}>
                  {msg.role === 'assistant'
                    ? <div style={{ color:'var(--ink)' }}>{formatMessage(msg.content)}</div>
                    : msg.content}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <div style={{ display:'flex', alignItems:'flex-start', gap:10, animation:'fadeUp .2s ease both' }}>
                <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#1a73e8,#0d47a1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/></svg>
                </div>
                <div style={{ background:'var(--white)', border:'1px solid var(--line2)', borderRadius:'4px 16px 16px 16px', padding:'13px 16px', boxShadow:'var(--shadow-card)', display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#1a73e8', opacity:.7, animation:`ping ${0.6 + i * 0.15}s ease-in-out ${i * 0.15}s infinite` }}/>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 14px', background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.18)', borderRadius:12, fontSize:'.56rem', color:'var(--red)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
                <span style={{ marginLeft:'auto', cursor:'pointer', fontWeight:500, textDecoration:'underline' }} onClick={() => setError(null)}>{t('ai.dismiss','Dismiss')}</span>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div style={{ padding:'14px 24px 18px', borderTop:'1px solid var(--line2)', background:'var(--white)', flexShrink:0 }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          {messages.length > 0 && showSuggestions && (
            <div style={{ background:'var(--white)', border:'1px solid var(--line2)', borderRadius:14, padding:12, marginBottom:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, boxShadow:'0 8px 32px rgba(0,0,0,.1)', animation:'fadeUp .18s ease both' }}>
              {suggestedPrompts.map((p, i) => (
                <div key={p.text} onClick={() => { sendMessage(p.text); setShowSuggestions(false); }} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'var(--cream-2)', border:'1px solid var(--line2)', borderRadius:10, cursor:'pointer', transition:'background .15s' }}>
                  <span style={{ fontSize:'.9rem', flexShrink:0 }}>{p.icon}</span>
                  <span style={{ fontSize:'.5rem', color:'var(--ink-2)', lineHeight:1.4 }}>{p.text}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', alignItems:'flex-end', gap:9, background:'var(--cream-2)', border:'1.5px solid var(--line2)', borderRadius:14, padding:'8px 8px 8px 14px', transition:'border-color .15s,box-shadow .15s' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={t('ai.placeholder','Ask anything…').replace('{name}', childName)}
              style={{ flex:1, border:'none', outline:'none', background:'transparent', fontFamily:"'DM Sans',sans-serif", fontSize:'.64rem', color:'var(--ink)', resize:'none', lineHeight:1.5, overflow:'hidden', minHeight:24, maxHeight:120, paddingTop:4 }}
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:input.trim() && !loading ? 'var(--rose)' : 'var(--cream-2)', border:`1px solid ${input.trim() && !loading ? 'transparent' : 'var(--line2)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:input.trim() && !loading ? 'pointer' : 'default', transition:'all .18s', boxShadow:input.trim() && !loading ? '0 3px 10px rgba(155,58,86,.28)' : 'none' }}
            >
              {loading
                ? <div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid rgba(155,58,86,.3)', borderTopColor:'var(--rose)', animation:'pvSpin .7s linear infinite' }}/>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? 'white' : 'var(--ink-3)'} strokeWidth="2.2" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              }
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:7 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:'.43rem', fontWeight:300, color:'var(--ink-3)' }}>{t('ai.enterToSend','Enter to send · Shift+Enter for new line')}</span>
              {messages.length > 0 && (
                <button type="button" onClick={() => setShowSuggestions(s => !s)} style={{ height:20, padding:'0 8px', borderRadius:20, background:showSuggestions ? 'var(--rose-pale)' : 'var(--cream-2)', border:`1px solid ${showSuggestions ? 'var(--rose-lt)' : 'var(--line2)'}`, fontSize:'.43rem', fontWeight:500, color:showSuggestions ? 'var(--rose)' : 'var(--ink-3)', cursor:'pointer', transition:'all .15s' }}>
                  💡 {t('ai.suggestions','Suggestions')}
                </button>
              )}
            </div>
            <span style={{ fontSize:'.43rem', fontWeight:300, color:'var(--ink-3)' }}>{t('ai.poweredBy','Powered by Gemini · Always consult your paediatrician')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantModule;
