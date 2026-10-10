'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookMarked, BookOpen, ChartNoAxesCombined, Check, ChevronRight, GraduationCap, House, Leaf, Lightbulb, LockKeyhole, LogOut, Plus, RefreshCw, Sparkles, Star, Target, Users, Volume2, X } from 'lucide-react';
import { bank, levels, Question } from './questions';
import ReviewLibrary from './review-library';
import {speakThai,speakThaiSequence,stopThaiSpeech} from './speech';
type Answer = {
    id: string;
    chosen: string;
    correct?: boolean;
    expected?: string;
    skill?: string;
    help: boolean;
    ms: number;
    prompt?: string;
};
type Attempt = {
    id: string;
    student_id: string;
    level: number;
    answers: string;
    score: number;
    total: number;
    created: string;
};
type Student = {
    id: string;
    name: string;
    code?: string;
};
type Assignment = {
    id: string;
    student_id: string;
    level: number;
    note: string;
    created: string;
    completed: string | null;
};
type Data = {
    signedIn: boolean;
    needsSetup?: boolean;
    role?: string;
    students?: Student[];
    student?: Student;
    attempts?: Attempt[];
    assignments?: Assignment[];
};
type Game = {
    id: string;
    level: number;
    questions: Question[];
    index: number;
    answers: Answer[];
    choice: string | null;
    help: boolean;
    assignmentId?: string;
    done: boolean;
    saved: boolean;
};
const date = (s: string) => new Date(s).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
function allAnswers(attempts: Attempt[]) { return attempts.flatMap(a => JSON.parse(a.answers) as Answer[]); }
function shuffle<T>(v: T[]) { const a = [...v]; for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
} return a; }
function weaknesses(attempts: Attempt[]) { const map: Record<string, {
    total: number;
    wrong: number;
    help: number;
}> = {}; allAnswers(attempts).forEach(a => { const s = a.skill || ''; map[s] ??= { total: 0, wrong: 0, help: 0 }; map[s].total++; if (!a.correct)
    map[s].wrong++; if (a.help)
    map[s].help++; }); return Object.entries(map).filter(([, v]) => v.wrong || v.help).sort((a, b) => (b[1].wrong + b[1].help) / b[1].total - (a[1].wrong + a[1].help) / a[1].total); }
export default function Classroom() {
    const [data, setData] = useState<Data | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [role, setRole] = useState('student'), [pin, setPin] = useState(''), [confirmPin, setConfirmPin] = useState(''), [code, setCode] = useState(''), [tab, setTab] = useState('home'), [selected, setSelected] = useState(''), [name, setName] = useState(''), [add, setAdd] = useState(false), [assign, setAssign] = useState(false), [assignLevel, setAssignLevel] = useState(0), [note, setNote] = useState(''), [notice, setNotice] = useState(''), [game, setGame] = useState<Game | null>(null), [exit, setExit] = useState(false);
    const started = useRef(0), saving = useRef(false), chosen = useRef(false);
    async function load() { const res = await fetch('/api/classroom', { cache: 'no-store' }); const d = await res.json() as Data & {
        error?: string;
    }; if (!res.ok)
        throw Error(d.error || 'โหลดข้อมูลไม่ได้'); setData(d); return d; }
    useEffect(() => { load().catch(e => setError(e.message)); }, []);
    useEffect(() => () => stopThaiSpeech(), []);
    async function api(body: unknown) { const res = await fetch('/api/classroom', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const d = await res.json() as {
        error?: string;
    }; if (!res.ok)
        throw Error(d.error || 'เกิดข้อผิดพลาด'); return d; }
    async function action(body: unknown, after?: () => void) { setBusy(true); setError(''); try {
        await api(body);
        await load();
        after?.();
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    const students = data?.students || [], student = students.find(s => s.id === selected) || students[0], attempts = (data?.attempts || []).filter(a => data?.role === 'student' || a.student_id === student?.id), assignments = (data?.assignments || []).filter(a => data?.role === 'student' || a.student_id === student?.id), answers = allAnswers(attempts), weak = weaknesses(attempts), correct = answers.filter(a => a.correct).length, independent = answers.filter(a => a.correct && !a.help).length, accuracy = answers.length ? Math.round(correct / answers.length * 100) : 0;
    const totalRounds = (data?.attempts || []).length;
    function start(level: number, assignmentId?: string) { setError(''); chosen.current = false; started.current = performance.now(); setGame({ id: crypto.randomUUID(), level, questions: shuffle(bank[level]).slice(0, 8).map(q => ({ ...q, choices: shuffle(q.choices) })), index: 0, answers: [], choice: null, help: false, assignmentId, done: false, saved: false }); }
    function choose(value: string) {
        if (!game || game.choice || chosen.current)
            return;
        chosen.current = true;
        const q = game.questions[game.index];
        const isCorrect = value === q.answer;
        setGame({ ...game, choice: value, answers: [...game.answers, { id: q.id, chosen: value, help: game.help, ms: Math.round(performance.now() - started.current), correct: isCorrect }] });
        speakAnswer(q, isCorrect);
    }
    async function save(g: Game) { if (saving.current)
        return; saving.current = true; setBusy(true); setError(''); try {
        await api({ action: 'attempt', id: g.id, level: g.level, answers: g.answers, assignmentId: g.assignmentId });
        setGame(v => v ? { ...v, saved: true } : v);
        await load();
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        saving.current = false;
        setBusy(false);
    } }
    function next() { if (!game)
        return; if (game.index === game.questions.length - 1) {
        const done = { ...game, done: true };
        setGame(done);
        void save(done);
    }
    else {
        chosen.current = false;
        started.current = performance.now();
        setGame({ ...game, index: game.index + 1, choice: null, help: false });
    } }
    function audioError() { setNotice('เสียงอ่านไม่พร้อมใช้งาน ลองให้คุณครูช่วยอ่านช้า ๆ ทีละส่วน'); }
    function speak(q: Question) {
        if (game && !game.choice)
            setGame({ ...game, help: true });
        speakThai(q.prompt.replace('\n', '. '), { rate: .54, pitch: .94, onError: audioError });
    }
    function speakAnswer(q: Question, isCorrect = true) {
        speakThaiSequence([
            { text: isCorrect ? 'ถูกต้อง' : `คำตอบที่ถูกคือ ${q.answer}`, rate: .62, pause: 320 },
            { text: `สะกดว่า ${q.spell}`, rate: .5, pause: 420 },
            { text: `อ่านรวมว่า ${q.answer}`, rate: .58 }
        ], audioError);
    }
    const lessonCards = (play: boolean) => <div className="lesson-grid">{levels.map((l, i) => { const ls = attempts.filter(a => a.level === i); const latest = ls[0]; return <article className={'lesson ' + l.color} key={l.name}><div className="lesson-top"><span className="label">ด่าน {String(i + 1).padStart(2, '0')}</span><span>{i === 0 ? 'เริ่มต้น' : i === 1 ? 'พื้นฐาน' : i === 2 ? 'ต่อยอด' : 'ท้าทาย'}</span></div><div className="glyph">{l.icon}</div><h3>{l.name}</h3><p>{l.sub}</p><div className="lesson-bottom"><span>{latest ? `ล่าสุด ${latest.score}/${latest.total} ข้อ` : `สุ่ม 8 ข้อจาก ${bank[i].length} ข้อ`}</span>{play ? <button className="circle" aria-label={'เริ่ม ' + l.name} onClick={() => start(i)}><ArrowRight size={22}/></button> : <span className="pill">{ls.length} รอบ</span>}</div></article>; })}</div>;
    return <div className="app"><header className="topbar"><a href="/" className="brand"><span className="brand-icon">ก<span>✦</span></span><div>เก่งไทย<small>เรียนทีละนิด เก่งขึ้นทุกวัน</small></div></a><div className="top-right"><span className="connection"><i /> ห้องเรียนภาษาไทย</span>{data?.role && <><span className="role-badge">{data.role === 'teacher' ? 'พื้นที่คุณครู' : 'พื้นที่นักเรียน'}</span><button className="icon-button" aria-label="ออกจากระบบ" onClick={() => { if (game && !game.saved) {
        setExit(true);
        return;
    } action({ action: 'logout' }, () => { setGame(null); setPin(''); setCode(''); }); }}><LogOut size={20}/></button></>}</div></header>
    {error && <div className="alert" role="alert">{error}<button onClick={() => setError('')} aria-label="ปิดข้อความ"><X size={18}/></button></div>}{notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="ปิดข้อความ"><X size={18}/></button></div>}
        {!data ? <main className="loading"><Leaf size={40}/><h2>{error ? 'ยังโหลดห้องเรียนไม่ได้' : 'กำลังเปิดห้องเรียน…'}</h2>{error && <button onClick={() => load().catch(e => setError(e.message))}>ลองอีกครั้ง</button>}</main> : !data.role ? <main className="entrance"><section className="welcome"><span className="eyebrow"><Sparkles size={16}/> พื้นที่เล็ก ๆ ของการเรียนรู้</span><h1>ภาษาไทย<br />ค่อย ๆ ฝึก <em>ก็เก่งได้</em></h1><p>เล่นให้สนุก ฝึกให้ตรงจุด<br />ทุกก้าวเล็ก ๆ คือความก้าวหน้าของเรา</p><div className="letter-art" aria-hidden="true"><div className="tile one">ก<span>ไก่</span></div><div className="tile two">ข<span>ไข่</span></div><div className="tile three">ค<span>ควาย</span></div><span className="art-star">✧</span><span className="art-dot">✦</span></div><div className="welcome-foot"><span><Check size={16}/> 4 ระดับการเรียนรู้</span><span><Check size={16}/> ฝึกตามจังหวะของตัวเอง</span></div></section><section className="login-card"><div className="small-icon"><BookOpen /></div><h2>{data.needsSetup ? 'เปิดห้องเรียนของคุณครู' : 'วันนี้พร้อมเรียนรู้หรือยัง?'}</h2><p>{data.needsSetup ? 'ตั้ง PIN สำหรับเข้าดูผลและจัดการนักเรียน' : 'เลือกพื้นที่ของคุณ แล้วมาเริ่มกันเลย'}</p>{!data.signedIn ? <><p className="info">เข้าสู่ระบบเพื่อเปิดห้องเรียนส่วนตัว ข้อมูลการฝึกจะถูกบันทึกข้ามอุปกรณ์</p><a className="primary full" href="/signin-with-chatgpt?return_to=/" target="_top">เข้าสู่ระบบด้วย ChatGPT <ArrowRight size={18}/></a></> : <form onSubmit={e => { e.preventDefault(); if (data.needsSetup && pin !== confirmPin) {
            setError('PIN ทั้งสองช่องไม่ตรงกัน');
            return;
        } action({ action: data.needsSetup ? 'setup' : 'login', role, pin, code }, () => { setPin(''); setConfirmPin(''); setCode(''); }); }}>{!data.needsSetup && <div className="role-toggle"><button type="button" className={role === 'student' ? 'active' : ''} onClick={() => { setRole('student'); setError(''); }}><GraduationCap />นักเรียน</button><button type="button" className={role === 'teacher' ? 'active' : ''} onClick={() => { setRole('teacher'); setError(''); }}><ChartNoAxesCombined />คุณครู</button></div>}{data.needsSetup || role === 'teacher' ? <><label htmlFor="pin">PIN คุณครู</label><input id="pin" type="password" inputMode="numeric" pattern="[0-9]{6,12}" minLength={6} maxLength={12} required value={pin} onChange={e => setPin(e.target.value)} placeholder="ตัวเลข 6–12 หลัก" autoComplete="off"/>{data.needsSetup && <><label htmlFor="confirm">ยืนยัน PIN</label><input id="confirm" type="password" inputMode="numeric" required value={confirmPin} onChange={e => setConfirmPin(e.target.value)} maxLength={12}/></>}<p className="field-help"><LockKeyhole size={14}/> เก็บ PIN ไว้กับคุณครู ใช้ทุกครั้งที่เข้าดูผล</p></> : <><label htmlFor="code">รหัสนักเรียนจากคุณครู</label><input id="code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="เช่น ABC234" maxLength={6} minLength={6} required autoComplete="off" autoCapitalize="characters"/><p className="field-help">ยังไม่มีรหัส? ให้คุณครูเพิ่มชื่อในห้องเรียนก่อนนะ</p></>}<button className="primary full" disabled={busy}>{busy ? 'กำลังเปิดห้องเรียน…' : data.needsSetup ? 'สร้างห้องเรียน' : role === 'teacher' ? 'เข้าสู่พื้นที่คุณครู' : 'เริ่มเรียนรู้'}<ArrowRight size={20}/></button></form>}<div className="login-footer"><Leaf size={16}/> ไม่ต้องรีบ แค่ลองทำทีละนิด</div><a className="review-guest-link" href="/review"><BookMarked size={18}/> เปิดคลังทบทวนโดยไม่ต้องเข้าสู่ระบบ</a></section></main> : game ? <main className="game-wrap">{game.done ? <section className="result card"><span className="celebrate">✦</span><span className="eyebrow">เยี่ยมเลย เล่นจบแล้ว!</span><h1>อีกหนึ่งก้าวของเรา</h1><p>ด่าน {game.level + 1} · {levels[game.level].name}</p><div className="big-score">{game.answers.filter(a => a.correct).length}<small>/ 8 ข้อ</small></div><p>ทำถูกเองโดยไม่ใช้ตัวช่วย {game.answers.filter(a => a.correct && !a.help).length} ข้อ</p><div className="info">{game.saved ? 'บันทึกผลแล้ว คุณครูดูผลรอบนี้ได้เลย' : busy ? 'กำลังส่งผลให้คุณครู…' : 'ผลยังไม่ถูกบันทึก กรุณากดส่งอีกครั้ง'}</div>{!game.saved && !busy && <button className="primary" onClick={() => save(game)}>ส่งผลอีกครั้ง</button>}{game.saved && <div className="row center"><button className="secondary" onClick={() => setGame(null)}>กลับหน้าการเรียนรู้</button><button className="primary" onClick={() => start(game.level)}>ฝึกอีกครั้ง <RefreshCw size={18}/></button></div>}</section> : <><div className="game-heading"><button className="secondary" onClick={() => setExit(true)}><X size={18}/> ออกจากเกม</button><span>ด่าน {game.level + 1} · {levels[game.level].name}</span><b>{game.index + 1} / 8</b></div><div className="progress"><i style={{ width: ((game.index + 1) / 8 * 100) + '%' }}/></div><section className="question card"><span className="eyebrow">ค่อย ๆ ดู แล้วเลือกคำตอบที่ใช่</span><h1>{game.questions[game.index].prompt}</h1><div className="question-tools"><button className="text-button" onClick={() => speak(game.questions[game.index])} disabled={!!game.choice}><Volume2 size={19}/> ฟังคำถาม</button><button className="text-button" disabled={!!game.choice} onClick={() => setGame({ ...game, help: true })}><Lightbulb size={19}/> ขอคำใบ้</button></div>{game.help && !game.choice && <div className="hint">{game.questions[game.index].hint}<small>รอบนี้จะบันทึกว่าใช้ตัวช่วย</small></div>}<div className={'answers ' + (game.level === 0 ? 'letter-answers' : '')}>{game.questions[game.index].choices.map((c, i) => <button key={c} disabled={!!game.choice} className={game.choice ? (c === game.questions[game.index].answer ? 'correct' : c === game.choice ? 'incorrect' : 'muted') : ''} onClick={() => choose(c)}><span>{i + 1}</span>{c}{game.choice && c === game.questions[game.index].answer && <Check size={24}/>}</button>)}</div>{game.choice && <div className="feedback" aria-live="polite"><div><b>{game.choice === game.questions[game.index].answer ? 'ถูกต้องเลย!' : 'ลองจำไปด้วยกันนะ'}</b><p>{game.questions[game.index].hint}</p><button className="text-button answer-audio" onClick={() => speakAnswer(game.questions[game.index], game.choice === game.questions[game.index].answer)}><Volume2 size={18}/> ฟังสะกดอีกครั้ง</button></div><button className="primary" onClick={next}>{game.index === 7 ? 'ดูผลของเรา' : 'ข้อต่อไป'}<ArrowRight size={18}/></button></div>}</section><p className="game-note">ฝึกได้เต็มที่ ไม่ต้องแข่งกับเวลา · หลังตอบ ระบบจะสะกดคำตอบที่ถูกให้อัตโนมัติ</p></>}</main> : <div className="workspace"><aside className="sidebar"><span className="nav-label">{data.role === 'teacher' ? 'ห้องเรียนของคุณครู' : 'การเรียนรู้ของเรา'}</span><button className={tab === 'home' ? 'nav active' : 'nav'} onClick={() => setTab('home')}><House size={20}/>{data.role === 'teacher' ? 'ภาพรวมห้องเรียน' : 'เส้นทางการเรียนรู้'}</button><button className={tab === 'review' ? 'nav active' : 'nav'} onClick={() => setTab('review')}><BookMarked size={20}/>คลังทบทวน</button><button className={tab === 'results' ? 'nav active' : 'nav'} onClick={() => setTab('results')}><ChartNoAxesCombined size={20}/>{data.role === 'teacher' ? 'ผลและจุดที่ควรฝึก' : 'ผลการฝึกของฉัน'}</button><button className={tab === 'assignments' ? 'nav active' : 'nav'} onClick={() => setTab('assignments')}><BookOpen size={20}/>การบ้าน<span className="nav-count">{assignments.filter(a => !a.completed).length}</span></button><div className="sidebar-tip"><div>✧</div><b>เก่งขึ้นในแบบของเรา</b><p>ฝึกสั้น ๆ สม่ำเสมอ<br />เห็นความก้าวหน้าทีละนิด</p></div><div className="sidebar-bottom"><span className="avatar">{data.role === 'teacher' ? 'ค' : data.student?.name.slice(0, 1)}</span><div>{data.role === 'teacher' ? 'คุณครู' : data.student?.name}<small>{data.role === 'teacher' ? 'ดูแลและวางแผนการเรียนรู้' : 'วันนี้ลองอีกนิดนะ'}</small></div></div></aside><main className="dashboard"><div className="breadcrumb">ห้องเรียน <ChevronRight size={14}/>{tab === 'home' ? 'ภาพรวม' : tab === 'review' ? 'คลังทบทวน' : tab === 'results' ? 'ผลการฝึก' : 'การบ้าน'}</div><div className="page-heading"><div><span className="eyebrow">{data.role === 'teacher' ? 'TEACHER SPACE' : 'MY LEARNING SPACE'}</span><h1>{tab === 'home' ? (data.role === 'teacher' ? 'ทุกก้าวเล็ก ๆ มองเห็นได้' : `สวัสดี ${data.student?.name} 👋`) : tab === 'review' ? 'คลังทบทวนและฝึกอ่าน' : tab === 'results' ? 'รู้จุดที่เก่ง เห็นจุดที่ควรฝึก' : 'การบ้านที่พอดีกับเรา'}</h1><p>{tab === 'review' ? 'เปิดดูพยัญชนะ สระ วรรณยุกต์ และฝึกอ่านได้ทุกเมื่อ' : data.role === 'teacher' ? 'เปลี่ยนผลการเล่น ให้เป็นแผนการสอนที่ตรงจุด' : 'วันนี้มาเรียนรู้กันอีกนิด เลือกด่านแล้วเริ่มได้เลย'}</p></div><div className="row"><button className="icon-button" aria-label="อัปเดตผล" onClick={() => load().catch(e => setError(e.message))}><RefreshCw size={19}/></button>{data.role === 'teacher' && <button className="primary" onClick={() => setAdd(true)}><Plus size={18}/>เพิ่มนักเรียน</button>}</div></div>
        {data.role === 'teacher' && <section className="student-strip"><div className="row"><span className="avatar peach">{student?.name.slice(0, 1) || 'ค'}</span><div><label htmlFor="student-select">กำลังดูข้อมูลของ</label>{students.length ? <select id="student-select" value={student?.id} onChange={e => setSelected(e.target.value)}>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select> : <b>ยังไม่มีนักเรียนในห้อง</b>}</div></div>{student && <div className="student-code">รหัสเข้าเรียน <b>{student.code}</b></div>}<span className="pill">{students.length} คนในห้องเรียน</span></section>}
        {tab === 'home' && <><section className="hero-panel"><div><span className="eyebrow"><Leaf size={15}/> {data.role === 'teacher' ? 'เริ่มจากสิ่งที่น้องทำได้' : 'ภารกิจเล็ก ๆ ของวันนี้'}</span><h2>{data.role === 'teacher' ? (attempts.length ? `เรียนรู้แล้ว ${attempts.length} รอบ ไปต่อด้วยกัน` : 'พร้อมค้นหาจุดเริ่มต้นของน้อง') : 'ฝึกวันละนิด ภาษาไทยก็สนุกได้'}</h2><p>{data.role === 'teacher' ? (weak.length ? `ลองทบทวนเรื่อง ${weak[0][0]} แล้วติดตามผลในรอบถัดไป` : 'ให้น้องเริ่มจากด่านแรก แล้วใช้ผลจริงวางแผนการสอน') : 'เริ่มจากตัวอักษร ค่อย ๆ ผสมคำ แล้วอ่านเรื่องราวด้วยตัวเอง'}</p><button className="primary" disabled={data.role === 'teacher' && !student} onClick={() => data.role === 'teacher' ? setTab('results') : start(0)}>{data.role === 'teacher' ? 'ดูผลเพื่อวางแผน' : 'เริ่มด่านแรก'}<ArrowRight size={18}/></button></div><div className="hero-art" aria-hidden="true"><span>ก</span><span>า</span><i>✦</i><b>เรียน • เล่น • เติบโต</b></div></section><div className="stats"><Stat icon={<BookOpen />} title="รอบที่ฝึกจบ" value={String(attempts.length)} suffix="รอบ"/><Stat icon={<Target />} title="ตอบถูกทั้งหมด" value={answers.length ? String(accuracy) : '—'} suffix="%"/><Stat icon={<Star />} title="ถูกโดยไม่ใช้ตัวช่วย" value={answers.length ? String(independent) : '—'} suffix="ข้อ"/><Stat icon={<Lightbulb />} title="จุดที่ควรทบทวน" value={String(weak.length)} suffix="เรื่อง"/></div><div className="section-heading"><div><h2>เส้นทางการเรียนรู้</h2><p>จากง่ายไปยาก · เลือกฝึกซ้ำได้ทุกด่าน</p></div><span className="pill">4 ระดับ</span></div>{lessonCards(data.role === 'student')}<div className="note-panel"><Lightbulb size={22}/><p><b>ดูความก้าวหน้ามากกว่าคะแนน</b><br />เกมวัดการเลือกคำตอบและการใช้ตัวช่วย ครูควรฟังการอ่านออกเสียงและสังเกตลำดับการเขียนเพิ่มเติม</p></div></>}
        {tab === 'results' && <>{!attempts.length ? <Empty title="ยังไม่มีผลการฝึก" text={data.role === 'teacher' ? 'เพิ่มนักเรียน แล้วให้น้องใช้รหัสเข้าไปเล่นเกม ผลจริงจะแสดงที่นี่' : 'เล่นเกมให้จบหนึ่งรอบ แล้วกลับมาดูความก้าวหน้าของเรา'} action={data.role === 'student' ? () => start(0) : undefined}/> : <><div className="stats"><Stat icon={<BookOpen />} title="รอบที่ฝึกจบ" value={String(attempts.length)} suffix="รอบ"/><Stat icon={<Target />} title="ความถูกต้อง" value={String(accuracy)} suffix="%"/><Stat icon={<Star />} title="ทำถูกด้วยตัวเอง" value={String(independent)} suffix={'/ ' + answers.length + ' ข้อ'}/><Stat icon={<Lightbulb />} title="ใช้ตัวช่วย" value={String(answers.filter(a => a.help).length)} suffix="ข้อ"/></div><div className="analysis-grid"><section className="card"><div className="section-heading"><h2>ความแม่นยำแยกตามทักษะ</h2><Target size={20}/></div>{levels.map((l, i) => { const a = attempts.filter(v => v.level === i), n = a.reduce((s, v) => s + v.total, 0), c = a.reduce((s, v) => s + v.score, 0); return <div className="skill-row" key={l.name}><div><b>{l.name}</b><span>{n ? `${Math.round(c / n * 100)}% · ${n} ข้อ` : 'ยังไม่ได้ฝึก'}</span></div><div className={'bar ' + l.color}><i style={{ width: (n ? c / n * 100 : 0) + '%' }}/></div></div>; })}<p className="field-help">คำนวณจากรอบที่แสดงล่าสุด คะแนนรวมทั้งข้อที่ใช้และไม่ใช้ตัวช่วย</p></section><section className="card insight"><span className="eyebrow"><Sparkles size={16}/> ข้อสังเกตสำหรับการฝึก</span><h2>{weak.length ? 'ลองเริ่มทบทวนตรงนี้' : 'ทำได้ดีแล้ว ลองคำใหม่ดูนะ'}</h2>{weak.slice(0, 4).map(([s, v]) => <div className="weak-item" key={s}><b>{s}</b><span>ผิด {v.wrong}/{v.total} ข้อ · ใช้ตัวช่วย {v.help} ข้อ</span></div>)}<p>{weak.length ? `ฝึกเรื่อง ${weak[0][0]} ทีละน้อย แล้วใช้ตัวอย่างใหม่ตรวจว่านำไปใช้ได้หรือไม่` : 'ลองแบบฝึกในระดับถัดไป และให้น้องอ่านออกเสียงกับคุณครู'}</p>{data.role === 'teacher' && <button className="primary" onClick={() => { setAssignLevel(weak.length ? Math.max(0, bank.findIndex(qs => qs.some(q => q.skill === weak[0][0]))) : Math.min(3, (attempts[0]?.level || 0) + 1)); setNote(weak.length ? `ทบทวนเรื่อง ${weak[0][0]} และอ่านออกเสียงกับคุณครู` : 'ลองฝึกเพิ่มเติมและอ่านออกเสียงกับคุณครู'); setAssign(true); }}>มอบหมายการบ้าน <ArrowRight size={18}/></button>}<small>เป็นข้อสังเกตจากแบบฝึกชุดนี้ ไม่ใช่การวินิจฉัยความสามารถทั้งหมด</small></section></div><section className="card"><div className="section-heading"><h2>ประวัติการฝึก</h2><span className="pill">{attempts.length} รอบ</span></div>{attempts.map(a => <details className="attempt" key={a.id}><summary><div><b>{levels[a.level].name}</b><small>{date(a.created)}</small></div><span className="score-pill">{a.score}/{a.total} ข้อ</span><ChevronRight size={18}/></summary><div className="attempt-answers">{(JSON.parse(a.answers) as Answer[]).map((v, i) => <div key={v.id}><span className={v.correct ? 'ok-dot' : 'bad-dot'}>{v.correct ? '✓' : '•'}</span><div><b>{i + 1}. {v.prompt?.replace('\n', ' · ')}</b><p>ตอบ: {v.chosen} · คำตอบ: {v.expected} {v.help ? '· ใช้ตัวช่วย' : '· ไม่ใช้ตัวช่วย'} · {Math.round(v.ms / 1000)} วินาที</p></div></div>)}</div></details>)}</section></>}</>}
        {tab === 'assignments' && <><div className="section-heading"><h2>การบ้านของ{data.role === 'teacher' ? (student?.name || 'นักเรียน') : 'ฉัน'}</h2>{data.role === 'teacher' && <button className="primary" disabled={!student} onClick={() => { setNote(''); setAssign(true); }}><Plus size={18}/>มอบหมายการบ้าน</button>}</div>{!assignments.length ? <Empty title="ยังไม่มีการบ้าน" text={data.role === 'teacher' ? 'เลือกทักษะที่อยากให้น้องฝึก แล้วเพิ่มคำแนะนำสั้น ๆ' : 'ระหว่างรอคุณครู เลือกฝึกเกมที่ชอบได้เลย'}/> : <div className="assignment-list">{assignments.map(a => <article className="card assignment" key={a.id}><div className={'assignment-icon ' + levels[a.level].color}>{levels[a.level].icon}</div><div><span className="eyebrow">ด่าน {a.level + 1} · {a.completed ? 'ฝึกจบแล้ว' : 'รอฝึก'}</span><h3>{levels[a.level].name}</h3><p>{a.note || 'ฝึกให้จบหนึ่งรอบ ค่อย ๆ ทำได้เลย'}</p><small>มอบหมาย {date(a.created)}</small></div>{a.completed ? <span className="pill"><Check size={16}/>เสร็จแล้ว</span> : data.role === 'student' ? <button className="primary" onClick={() => start(a.level, a.id)}>เริ่มฝึก<ArrowRight size={18}/></button> : <span className="pill">รอผลการฝึก</span>}</article>)}</div>}</>}
        {tab === 'review' && <ReviewLibrary />}
        <footer className="footer">เก่งไทย · พื้นที่เรียนรู้ที่เติบโตไปด้วยกัน <span>{data.role === 'teacher' ? `${totalRounds} รอบที่บันทึกในห้องเรียน` : 'ฝึกได้ทุกวัน ตามจังหวะของเรา'}</span></footer></main></div>}
    {add && <Modal title="เพิ่มนักเรียนในห้อง" onClose={() => setAdd(false)}><form onSubmit={e => { e.preventDefault(); action({ action: 'addStudent', name }, () => { setAdd(false); setName(''); setNotice('เพิ่มนักเรียนแล้ว ใช้รหัสที่แสดงบนหน้าครูเพื่อเข้าเล่น'); }); }}><label htmlFor="name">ชื่อเล่นนักเรียน</label><input id="name" autoFocus required maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="เช่น น้องเก้า"/><p className="field-help">ระบบจะสร้างรหัสเข้าเรียนเฉพาะคน ไม่ต้องใช้ชื่อจริง</p><button className="primary full" disabled={busy}>เพิ่มนักเรียน <Plus size={18}/></button></form></Modal>}
    {assign && <Modal title={'มอบหมายการบ้านให้ ' + student?.name} onClose={() => setAssign(false)}><form onSubmit={e => { e.preventDefault(); action({ action: 'assign', studentId: student?.id, level: assignLevel, note }, () => { setAssign(false); setTab('assignments'); setNotice('มอบหมายการบ้านแล้ว'); }); }}><label htmlFor="level">ระดับที่ให้ฝึก</label><select id="level" value={assignLevel} onChange={e => setAssignLevel(Number(e.target.value))}>{levels.map((l, i) => <option key={l.name} value={i}>{i + 1}. {l.name}</option>)}</select><label htmlFor="note">คำแนะนำจากคุณครู</label><textarea id="note" value={note} onChange={e => setNote(e.target.value)} maxLength={500} placeholder="เช่น ค่อย ๆ ดูจุดต่างของ ผ และ ฝ"/><button className="primary full" disabled={busy}>มอบหมายการบ้าน <ArrowRight size={18}/></button></form></Modal>}
    {exit && <Modal title="พักเกมไว้ก่อนหรือเปล่า?" onClose={() => setExit(false)}><p>รอบนี้ยังเล่นไม่จบ ผลจะยังไม่ถูกบันทึก หากออกจะต้องเริ่มรอบใหม่</p><div className="row"><button className="secondary" onClick={() => { window.speechSynthesis?.cancel(); setGame(null); setExit(false); }}>ออกจากเกม</button><button className="primary" onClick={() => setExit(false)}>เล่นต่อ</button></div></Modal>}
    </div>;
}
function Stat({ icon, title, value, suffix }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    suffix: string;
}) { return <div className="stat"><div className="stat-label">{title}{icon}</div><strong>{value}<small>{suffix}</small></strong></div>; }
function Empty({ title, text, action }: {
    title: string;
    text: string;
    action?: () => void;
}) { return <section className="empty card"><div className="small-icon"><BookOpen size={28}/></div><h2>{title}</h2><p>{text}</p>{action && <button className="primary" onClick={action}>เริ่มฝึกด่านแรก <ArrowRight size={18}/></button>}</section>; }
function Modal({ title, children, onClose }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) { const ref = useRef<HTMLDialogElement>(null); useEffect(() => { const previous = document.activeElement as HTMLElement | null; ref.current?.showModal(); return () => { previous?.focus(); }; }, []); return <dialog ref={ref} className="modal" onCancel={e => { e.preventDefault(); onClose(); }}><div className="section-heading"><h2>{title}</h2><button className="icon-button" aria-label="ปิดหน้าต่าง" onClick={onClose}><X /></button></div>{children}</dialog>; }
