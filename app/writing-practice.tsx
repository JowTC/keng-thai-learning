'use client';

import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import {ChevronLeft,ChevronRight,Eraser,PenLine,Shuffle,Volume2} from 'lucide-react';
import {thaiConsonants,thaiVowels} from './questions';
import {speakThaiSequence,stopThaiSpeech} from './speech';

type WritingMode='consonants'|'vowels';

export default function WritingPractice(){
  const [mode,setMode]=useState<WritingMode>('consonants');
  const [index,setIndex]=useState(0);
  const [message,setMessage]=useState('');
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const drawing=useRef(false);
  const lastPoint=useRef({x:0,y:0});
  const entries=useMemo(()=>mode==='consonants'
    ? thaiConsonants.map(item=>({glyph:item.letter,label:`${item.letter} ${item.name}`,speech:item.spoken,rare:item.rare}))
    : thaiVowels.map(item=>({glyph:item.form.replaceAll('-', '–'),label:`สระ${item.name}`,speech:`สระ ${item.name}. ตัวอย่าง ${item.example}`,rare:item.rare})),[mode]);
  const current=entries[index]||entries[0];

  const drawTemplate=useCallback(()=>{
    const canvas=canvasRef.current;
    if(!canvas||!current)return;
    const box=canvas.getBoundingClientRect();
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(box.width*ratio));
    canvas.height=Math.max(1,Math.round(box.height*ratio));
    const ctx=canvas.getContext('2d');
    if(!ctx)return;
    ctx.scale(ratio,ratio);
    ctx.clearRect(0,0,box.width,box.height);
    ctx.fillStyle='#fffdf8';
    ctx.fillRect(0,0,box.width,box.height);
    ctx.strokeStyle='#dbe5da';
    ctx.lineWidth=1.5;
    ctx.setLineDash([8,8]);
    for(const y of [box.height*.27,box.height*.52,box.height*.77]){
      ctx.beginPath();ctx.moveTo(18,y);ctx.lineTo(box.width-18,y);ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle='#eef2e9';
    for(const x of [box.width/3,box.width*2/3]){ctx.beginPath();ctx.moveTo(x,18);ctx.lineTo(x,box.height-18);ctx.stroke()}
    const size=Math.min(box.height*.56,box.width/(current.glyph.length>2?8:5));
    ctx.font=`700 ${size}px Sarabun, sans-serif`;
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillStyle='rgba(35,101,78,.13)';
    for(const x of [box.width/6,box.width/2,box.width*5/6])ctx.fillText(current.glyph,x,box.height*.53);
  },[current]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    drawTemplate();
    const observer=new ResizeObserver(drawTemplate);
    observer.observe(canvas);
    return()=>observer.disconnect();
  // current is the complete drawing template identity.
  },[drawTemplate]);
  useEffect(()=>()=>stopThaiSpeech(),[]);

  function point(event:ReactPointerEvent<HTMLCanvasElement>){
    const rect=event.currentTarget.getBoundingClientRect();
    return{x:event.clientX-rect.left,y:event.clientY-rect.top};
  }
  function begin(event:ReactPointerEvent<HTMLCanvasElement>){
    drawing.current=true;
    lastPoint.current=point(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event:ReactPointerEvent<HTMLCanvasElement>){
    if(!drawing.current)return;
    const canvas=canvasRef.current,ctx=canvas?.getContext('2d');
    if(!canvas||!ctx)return;
    const next=point(event);
    ctx.save();ctx.strokeStyle='#245f4b';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(lastPoint.current.x,lastPoint.current.y);ctx.lineTo(next.x,next.y);ctx.stroke();ctx.restore();
    lastPoint.current=next;
  }
  function end(){drawing.current=false}
  function chooseMode(next:WritingMode){setMode(next);setIndex(0);setMessage('')}
  function step(amount:number){setIndex(value=>(value+amount+entries.length)%entries.length);setMessage('')}
  function random(){setIndex(value=>{if(entries.length<2)return value;let next=value;while(next===value)next=Math.floor(Math.random()*entries.length);return next});setMessage('')}
  function listen(){
    setMessage('');
    speakThaiSequence([{text:current.speech,rate:.48},{text:current.speech,rate:.56}],()=>setMessage('อุปกรณ์นี้ยังไม่พร้อมอ่านเสียง ลองอ่านกับคุณครูนะ'));
  }

  return <section className="writing-lab card">
    <div className="section-heading"><div><span className="eyebrow"><PenLine size={15}/> ฝึกเขียนด้วยนิ้วหรือปากกา</span><h2>ลากตามรอย แล้วเขียนซ้ำให้คล่องมือ</h2><p>ครอบคลุมพยัญชนะ 44 ตัวและสระ 32 รูปเสียง ใช้ได้บน iPad</p></div><span className="pill">{index+1}/{entries.length}</span></div>
    <div className="writing-mode" role="tablist" aria-label="เลือกชุดฝึกเขียน">
      <button role="tab" aria-selected={mode==='consonants'} className={mode==='consonants'?'active':''} onClick={()=>chooseMode('consonants')}>พยัญชนะ 44 ตัว</button>
      <button role="tab" aria-selected={mode==='vowels'} className={mode==='vowels'?'active':''} onClick={()=>chooseMode('vowels')}>สระ 32 รูปเสียง</button>
    </div>
    <div className="writing-toolbar">
      <button className="icon-button" aria-label="ตัวก่อนหน้า" onClick={()=>step(-1)}><ChevronLeft/></button>
      <label>เลือกตัวที่ต้องการฝึก<select value={index} onChange={event=>{setIndex(Number(event.target.value));setMessage('')}}>{entries.map((entry,i)=><option value={i} key={entry.label}>{entry.label}{entry.rare?' · พบน้อย':''}</option>)}</select></label>
      <button className="icon-button" aria-label="ตัวถัดไป" onClick={()=>step(1)}><ChevronRight/></button>
      <button className="secondary" onClick={random}><Shuffle size={18}/> สุ่มตัวใหม่</button>
      <button className="secondary" onClick={listen}><Volume2 size={18}/> ฟังชื่อ</button>
    </div>
    <div className="writing-target"><span>กำลังฝึก</span><strong>{current.glyph}</strong><b>{current.label}</b>{current.rare&&<small>ตัวนี้พบไม่บ่อย แต่มีให้ฝึกครบ</small>}</div>
    <div className="writing-canvas-wrap">
      <canvas ref={canvasRef} aria-label={`พื้นที่ฝึกเขียน ${current.label}`} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onPointerLeave={end}/>
      <span className="canvas-help">ลากตามรอยจางจากหัวตัวอักษร แล้วลองเขียนซ้ำทั้ง 3 ช่อง</span>
    </div>
    <div className="writing-footer"><p><b>คำแนะนำ:</b> ให้คุณครูช่วยดูจุดเริ่มและทิศทางเส้น เพราะแต่ละตัวมีลำดับการเขียนต่างกัน</p><button className="secondary" onClick={drawTemplate}><Eraser size={18}/> ล้างแล้วเขียนใหม่</button></div>
    {message&&<p className="reading-message" role="status">{message}</p>}
  </section>
}
