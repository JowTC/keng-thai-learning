import {getStore} from '@netlify/blobs';
import {bank} from '../../questions';

export const dynamic='force-dynamic';
export const runtime='nodejs';

type Student={id:string;name:string;code:string};
type Attempt={id:string;student_id:string;level:number;answers:string;score:number;total:number;created:string};
type Assignment={id:string;student_id:string;level:number;note:string;created:string;completed:string|null};
type Session={role:'teacher'|'student';studentId:string|null;expires:number};
type ClassroomState={
  pin:string|null;salt:string|null;students:Student[];attempts:Attempt[];assignments:Assignment[];
  sessions:Record<string,Session>;throttle:{count:number;expires:number};
};

const fresh=():ClassroomState=>({pin:null,salt:null,students:[],attempts:[],assignments:[],sessions:{},throttle:{count:0,expires:0}});
let localState:ClassroomState=fresh();
const json=(data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
const hash=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
async function pinHash(pin:string,salt:string){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);
  return Array.from(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256))).map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
function sessionCookie(req:Request,value:string,maxAge=28800){return `thai_session=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(req.url).protocol==='https:'?'; Secure':''}`}
function isNetlify(){return Boolean(process.env.NETLIFY||process.env.NETLIFY_SITE_ID)}
async function readState(){
  let state:ClassroomState;
  if(isNetlify()){
    const stored=await getStore({name:'thai-classroom',consistency:'strong'}).get('state',{type:'json',consistency:'strong'}).catch(()=>null) as ClassroomState|null;
    state=stored||fresh();
  }else state=localState;
  // Read the seed at function runtime so Next.js does not inline a credential
  // into build output or its cache during deployment.
  const initialPin=Reflect.get(process.env,['INITIAL','TEACHER','PIN'].join('_')) as string|undefined;
  if(!state.pin&&initialPin&&/^\d{6,12}$/.test(initialPin)){
    state.salt=crypto.randomUUID();
    state.pin=await pinHash(initialPin,state.salt);
    await writeState(state);
  }
  return state;
}
async function writeState(state:ClassroomState){
  if(isNetlify())await getStore({name:'thai-classroom',consistency:'strong'}).setJSON('state',state);
  else localState=state;
}
async function getSession(req:Request,state:ClassroomState){
  const token=req.headers.get('cookie')?.match(/(?:^|;\s*)thai_session=([^;]+)/)?.[1];
  if(!token)return null;
  const key=await hash(token),session=state.sessions[key];
  if(!session||session.expires<=Date.now())return null;
  return {key,session};
}
async function makeSession(req:Request,state:ClassroomState,role:'teacher'|'student',studentId:string|null){
  for(const [key,value] of Object.entries(state.sessions))if(value.expires<=Date.now())delete state.sessions[key];
  const token=crypto.randomUUID()+crypto.randomUUID();
  state.sessions[await hash(token)]={role,studentId,expires:Date.now()+28800000};
  await writeState(state);
  return json({ok:true},200,{'Set-Cookie':sessionCookie(req,token)});
}

export async function GET(req:Request){
  try{
    const state=await readState();
    if(!state.pin)return json({signedIn:true,needsSetup:true});
    const active=await getSession(req,state);
    if(!active)return json({signedIn:true,needsSetup:false});
    if(active.session.role==='teacher')return json({signedIn:true,role:'teacher',students:state.students,attempts:state.attempts.slice(0,1000),assignments:state.assignments.slice(0,300)});
    const student=state.students.find(item=>item.id===active.session.studentId);
    if(!student)return json({error:'ไม่พบผู้เรียน'},403);
    return json({signedIn:true,role:'student',student:{id:student.id,name:student.name},attempts:state.attempts.filter(item=>item.student_id===student.id).slice(0,200),assignments:state.assignments.filter(item=>item.student_id===student.id).slice(0,100)});
  }catch(error){console.error('Classroom read failed',error);return json({error:'โหลดข้อมูลไม่ได้ กรุณาลองอีกครั้ง'},500)}
}

export async function POST(req:Request){
  try{
    if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'คำขอไม่ถูกต้อง'},403);
    const raw=await req.text();
    if(raw.length>20000)return json({error:'ข้อมูลใหญ่เกินไป'},413);
    let body:any;
    try{body=JSON.parse(raw)}catch{return json({error:'ข้อมูลไม่ถูกต้อง'},400)}
    const state=await readState();
    const active=await getSession(req,state);

    if(body.action==='setup'){
      if(state.pin)return json({error:'ตั้งค่าห้องเรียนแล้ว'},409);
      if(!/^\d{6,12}$/.test(body.pin||''))return json({error:'ใช้ PIN ตัวเลข 6–12 หลัก'},400);
      state.salt=crypto.randomUUID();state.pin=await pinHash(body.pin,state.salt);
      return makeSession(req,state,'teacher',null);
    }
    if(!state.pin)return json({error:'กรุณาตั้งค่าห้องเรียนก่อน'},400);
    if(body.action==='login'){
      const now=Date.now();
      if(state.throttle.expires<now)state.throttle={count:1,expires:now+60000};else state.throttle.count+=1;
      await writeState(state);
      if(state.throttle.count>10)return json({error:'ลองหลายครั้งแล้ว กรุณารอ 1 นาที'},429);
      if(body.role==='teacher'){
        if(typeof body.pin!=='string'||body.pin.length>12||!state.salt||await pinHash(body.pin,state.salt)!==state.pin)return json({error:'PIN ไม่ถูกต้อง'},403);
        return makeSession(req,state,'teacher',null);
      }
      const student=state.students.find(item=>item.code===String(body.code||'').trim().toUpperCase());
      if(!student)return json({error:'ไม่พบรหัสนักเรียน กรุณาถามคุณครู'},403);
      return makeSession(req,state,'student',student.id);
    }
    if(body.action==='logout'){
      if(active){delete state.sessions[active.key];await writeState(state)}
      return json({ok:true},200,{'Set-Cookie':sessionCookie(req,'',0)});
    }
    if(!active)return json({error:'กรุณาเลือกผู้ใช้งานอีกครั้ง'},401);

    if(body.action==='addStudent'){
      if(active.session.role!=='teacher')return json({error:'เฉพาะคุณครู'},403);
      const name=String(body.name||'').trim();
      if(!name||name.length>60)return json({error:'กรอกชื่อ 1–60 ตัวอักษร'},400);
      const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code='';
      do{code=Array.from(crypto.getRandomValues(new Uint8Array(6))).map(value=>alphabet[value%alphabet.length]).join('')}while(state.students.some(item=>item.code===code));
      state.students.push({id:crypto.randomUUID(),name,code});
      await writeState(state);return json({ok:true});
    }
    if(body.action==='assign'){
      if(active.session.role!=='teacher')return json({error:'เฉพาะคุณครู'},403);
      if(!Number.isInteger(body.level)||body.level<0||body.level>3)return json({error:'ระดับไม่ถูกต้อง'},400);
      if(!state.students.some(item=>item.id===String(body.studentId)))return json({error:'ไม่พบผู้เรียน'},404);
      state.assignments.unshift({id:crypto.randomUUID(),student_id:body.studentId,level:body.level,note:String(body.note||'').slice(0,500),created:new Date().toISOString(),completed:null});
      state.assignments=state.assignments.slice(0,300);
      await writeState(state);return json({ok:true});
    }
    if(body.action==='attempt'){
      if(active.session.role!=='student'||!active.session.studentId)return json({error:'เฉพาะนักเรียน'},403);
      if(!Number.isInteger(body.level)||body.level<0||body.level>3||!Array.isArray(body.answers)||body.answers.length!==8||!/^[-a-f0-9]{36}$/.test(body.id||''))return json({error:'ผลเกมไม่ครบ กรุณาเล่นให้จบ'},400);
      const questions=bank[body.level],ids=new Set<string>(),answers=[];
      for(const answer of body.answers){
        const question=questions.find(item=>item.id===answer.id);
        if(!question||ids.has(answer.id)||!question.choices.includes(answer.chosen)||typeof answer.help!=='boolean'||!Number.isFinite(answer.ms)||answer.ms<0)return json({error:'ผลเกมไม่ถูกต้อง'},400);
        ids.add(answer.id);answers.push({id:question.id,prompt:question.prompt,skill:question.skill,expected:question.answer,chosen:answer.chosen,correct:answer.chosen===question.answer,help:answer.help,ms:Math.min(answer.ms,3600000)});
      }
      const score=answers.filter(answer=>answer.correct).length;
      if(!state.attempts.some(item=>item.id===body.id))state.attempts.unshift({id:body.id,student_id:active.session.studentId,level:body.level,answers:JSON.stringify(answers),score,total:answers.length,created:new Date().toISOString()});
      state.attempts=state.attempts.slice(0,1000);
      if(body.assignmentId){const assignment=state.assignments.find(item=>item.id===String(body.assignmentId)&&item.student_id===active.session.studentId&&item.level===body.level&&!item.completed);if(assignment)assignment.completed=new Date().toISOString()}
      await writeState(state);return json({ok:true,score,total:answers.length});
    }
    return json({error:'ไม่พบคำสั่ง'},400);
  }catch(error){console.error('Classroom update failed',error);return json({error:'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง'},500)}
}
