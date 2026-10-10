'use client';

import {useEffect,useState} from 'react';
import {BookOpen,ChevronLeft,ChevronRight,Lightbulb,Sparkles,Volume2} from 'lucide-react';
import {thaiConsonants,thaiVowels} from './questions';
import {speakThaiSequence,stopThaiSpeech} from './speech';
import WritingPractice from './writing-practice';

type ReviewSection='consonants'|'vowels'|'tones';
type ReadingItem={text:string,parts:string[],guide:string,tip:string};

const consonantGroups=[
  {name:'อักษรกลาง',description:'จำ 9 ตัวนี้ก่อน ช่วยผันวรรณยุกต์ได้ง่ายขึ้น',tone:'middle',letters:thaiConsonants.filter(item=>item.tone==='middle')},
  {name:'อักษรสูง',description:'ออกเสียงเริ่มต้นชัด ลองสังเกต ข–ฃ และ ผ–ฝ',tone:'high',letters:thaiConsonants.filter(item=>item.tone==='high')},
  {name:'อักษรต่ำ',description:'กลุ่มใหญ่ที่สุด ค่อย ๆ จำจากตัวที่ใช้บ่อย',tone:'low',letters:thaiConsonants.filter(item=>item.tone==='low')},
];

const tones=[
  {mark:'–',name:'ไม่มีรูปวรรณยุกต์',example:'กา',help:'เริ่มอ่านจากเสียงพื้นฐานก่อน'},
  {mark:'◌่',name:'ไม้เอก',example:'ก่า',help:'เครื่องหมายขีดสั้นอยู่ด้านบน'},
  {mark:'◌้',name:'ไม้โท',example:'ก้า',help:'รูปร่างคล้ายเลข ๒ เล็ก ๆ'},
  {mark:'◌๊',name:'ไม้ตรี',example:'ก๊า',help:'ใช้กับคำบางกลุ่ม เช่น โต๊ะ'},
  {mark:'◌๋',name:'ไม้จัตวา',example:'ก๋า',help:'รูปร่างคล้ายเครื่องหมายบวก'},
] as const;

function practice(text:string,parts:string[],guide:string,tip:string):ReadingItem{return{text,parts,guide,tip}}

const readingLevels:{name:string,badge:string,description:string,items:ReadingItem[]}[]=[
  {name:'ลากเสียงให้ชัด',badge:'เริ่มต้น',description:'20 แบบฝึก · เสียงยาวและคำพยางค์เดียว',items:[
    practice('อา',['อ','า'],'ออ + สระอา → อา','ลากเสียงยาวหนึ่งจังหวะ แล้วอ่านซ้ำอีกครั้ง'),
    practice('อี',['อ','ี'],'ออ + สระอี → อี','ยิ้มเล็กน้อยขณะออกเสียง อี'),
    practice('อู',['อ','ู'],'ออ + สระอู → อู','ห่อริมฝีปากแล้วลากเสียง อู'),
    practice('เอ',['เ','อ'],'ออ + สระเอ → เอ','จำว่าสระเอเขียนอยู่หน้าพยัญชนะ'),
    practice('โอ',['โ','อ'],'ออ + สระโอ → โอ','ห่อปากกลมและลากเสียง โอ'),
    practice('กา',['ก','า'],'กอ + อา → กา','แตะเสียง ก แล้วต่อด้วยเสียง อา'),
    practice('ตา',['ต','า'],'ตอ + อา → ตา','มอง ต ก่อน แล้วลากเสียงสระอา'),
    practice('มา',['ม','า'],'มอ + อา → มา','แตะเสียง ม เบา ๆ แล้วต่อด้วย อา'),
    practice('นา',['น','า'],'นอ + อา → นา','อ่านช้า ๆ แล้วลองต่อเป็น “ตา มา นา”'),
    practice('ปา',['ป','า'],'ปอ + อา → ปา','ปิดริมฝีปากตอนเริ่มเสียง ป'),
    practice('ยา',['ย','า'],'ยอ + อา → ยา','ออกเสียง ย ให้ต่อกับ อา โดยไม่หยุด'),
    practice('ขา',['ข','า'],'ขอ + อา → ขา','เป่าลมเบา ๆ ตอนออกเสียง ข'),
    practice('มี',['ม','ี'],'มอ + อี → มี','ลากเสียง อี ให้ชัด'),
    practice('ดี',['ด','ี'],'ดอ + อี → ดี','อ่าน ดอ–อี แล้วรวบเป็น ดี'),
    practice('ตี',['ต','ี'],'ตอ + อี → ตี','เทียบเสียงกับ ดี แล้วเปลี่ยนพยัญชนะต้น'),
    practice('สี',['ส','ี'],'สอ + อี → สี','ปล่อยลมผ่านฟันตอนออกเสียง ส'),
    practice('ดู',['ด','ู'],'ดอ + อู → ดู','อ่านเสียง อู ยาวพอดี'),
    practice('ปู',['ป','ู'],'ปอ + อู → ปู','ปิดริมฝีปากก่อนเริ่มคำ'),
    practice('งู',['ง','ู'],'งอ + อู → งู','ออกเสียง ง ต่อเนื่องแล้วตามด้วย อู'),
    practice('โต',['ต','โ-'],'ตอ + โอ → โต','สระโออยู่หน้า ต แต่อ่านพยัญชนะก่อน'),
  ]},
  {name:'สระอยู่รอบพยัญชนะ',badge:'พื้นฐาน',description:'20 แบบฝึก · สระหน้า หลัง บน ล่าง และสระประสม',items:[
    practice('เขา',['ข','เ-า'],'ขอ + เอา → เขา','แม้ เ จะอยู่ข้างหน้า ให้ออกเสียง ข ก่อน'),
    practice('เรา',['ร','เ-า'],'รอ + เอา → เรา','ใช้แม่แบบเดียวกับคำว่า “เขา”'),
    practice('เงา',['ง','เ-า'],'งอ + เอา → เงา','มองสระ เ–า เป็นชุดเดียวกัน'),
    practice('เบา',['บ','เ-า'],'บอ + เอา → เบา','อ่านแยก บอ–เอา แล้วค่อยรวบคำ'),
    practice('เสา',['ส','เ-า'],'สอ + เอา → เสา','ยืดเสียง เอา เล็กน้อย'),
    practice('ไป',['ป','ไ-'],'ปอ + ไอ → ไป','ไ อยู่หน้า ป แต่ประสมเสียงเป็น ปอ–ไอ'),
    practice('ไฟ',['ฟ','ไ-'],'ฟอ + ไอ → ไฟ','ปล่อยลมตอนเสียง ฟ แล้วต่อด้วย ไอ'),
    practice('ใจ',['จ','ใ-'],'จอ + ใอ → ใจ','ใ และ ไ ออกเสียง “ไอ” เหมือนกัน'),
    practice('ใบ',['บ','ใ-'],'บอ + ใอ → ใบ','อ่าน บอ–ใอ แล้วปิดเสียงสั้น'),
    practice('ใส',['ส','ใ-'],'สอ + ใอ → ใส','เริ่มด้วยเสียง ส ที่มีลม'),
    practice('มือ',['ม','-ื','อ'],'มอ + อือ → มือ','สระอือมี อ ปิดท้ายเมื่อไม่มีตัวสะกด'),
    practice('ถือ',['ถ','-ื','อ'],'ถอ + อือ → ถือ','เทียบกับ มือ แล้วเปลี่ยนพยัญชนะต้น'),
    practice('คือ',['ค','-ื','อ'],'คอ + อือ → คือ','ลากเสียง อือ ให้ชัดก่อนอ่านรวม'),
    practice('เรือ',['ร','เ-ือ'],'รอ + เอือ → เรือ','มองสระทั้งชุด เ–ือ เป็นชิ้นเดียว'),
    practice('เสือ',['ส','เ-ือ'],'สอ + เอือ → เสือ','เทียบกับ “เรือ” แล้วเปลี่ยนพยัญชนะต้น'),
    practice('ตัว',['ต','-ัว'],'ตอ + อัว → ตัว','สระอัวล้อมอยู่ด้านบนและด้านหลัง'),
    practice('หัว',['ห','-ัว'],'หอ + อัว → หัว','เป่าลมเบา ๆ ตอนเริ่มเสียง ห'),
    practice('บัว',['บ','-ัว'],'บอ + อัว → บัว','อ่านสระอัวเป็นเสียงเดียว'),
    practice('ดำ',['ด','-ำ'],'ดอ + อำ → ดำ','สระอำมีทั้งวงกลมด้านบนและลากเสียง อำ'),
    practice('ทำ',['ท','-ำ'],'ทอ + อำ → ทำ','เทียบเสียงกับ ดำ แล้วเปลี่ยนพยัญชนะต้น'),
  ]},
  {name:'ผสมตัวสะกดและวรรณยุกต์',badge:'ต่อยอด',description:'20 แบบฝึก · เสียงต้น สระ ตัวสะกด และรูปวรรณยุกต์',items:[
    practice('กิน',['ก','-ิ','น'],'กอ + อิ + นอ → กิน','ปิดท้ายด้วยเสียง น สั้นและชัด'),
    practice('ดิน',['ด','-ิ','น'],'ดอ + อิ + นอ → ดิน','ออกเสียงตัวสะกด น เพียงสั้น ๆ'),
    practice('บิน',['บ','-ิ','น'],'บอ + อิ + นอ → บิน','อ่าน บิ ก่อน แล้วเติมเสียง น'),
    practice('ลิง',['ล','-ิ','ง'],'ลอ + อิ + งอ → ลิง','ปลายเสียงเป็น ง ไม่ใช่ น'),
    practice('ลม',['ล','โ-ะ','ม'],'ลอ + โอะ + มอ → ลม','สระโอะลดรูปจึงไม่เห็นรูปสระ'),
    practice('นก',['น','โ-ะ','ก'],'นอ + โอะ + กอ → นก','ปิดท้ายด้วยเสียง ก สั้น ๆ'),
    practice('มด',['ม','โ-ะ','ด'],'มอ + โอะ + ดอ → มด','สระโอะซ่อนอยู่ระหว่าง ม และ ด'),
    practice('กบ',['ก','โ-ะ','บ'],'กอ + โอะ + บอ → กบ','ปิดริมฝีปากเมื่อจบเสียง บ'),
    practice('จาน',['จ','-า','น'],'จอ + อา + นอ → จาน','ลากสระอาแล้วปิดด้วย น'),
    practice('กาง',['ก','-า','ง'],'กอ + อา + งอ → กาง','ปลายเสียงเป็น ง และยังได้ยินเสียงยาว'),
    practice('ลาม',['ล','-า','ม'],'ลอ + อา + มอ → ลาม','ปิดริมฝีปากเมื่อจบเสียง ม'),
    practice('บ้าน',['บ','-า','น','้'],'บอ + อา + นอ + ไม้โท → บ้าน','อ่าน “บาน” ก่อน แล้วจึงเติมเสียงไม้โท'),
    practice('ป่า',['ป','-า','่'],'ปอ + อา + ไม้เอก → ป่า','มองไม้เอกด้านบนก่อนผันเสียง'),
    practice('ป้า',['ป','-า','้'],'ปอ + อา + ไม้โท → ป้า','เทียบรูปไม้โทกับไม้เอกในคำก่อนหน้า'),
    practice('แมว',['ม','แ-','ว'],'มอ + แอ + วอ → แมว','ว เป็นตัวสะกด เสียงจบจะสั้นลง'),
    practice('แก้ว',['ก','แ-','ว','้'],'กอ + แอ + วอ + ไม้โท → แก้ว','แยกอ่าน “แกว” ก่อนเติมไม้โท'),
    practice('กล้วย',['กล','-ัว','ย','้'],'กลอ + อัว + ยอ + ไม้โท → กล้วย','ควบ กล ให้ติดกัน แล้วอ่านสระอัว'),
    practice('สวย',['ส','-ัว','ย'],'สอ + อัว + ยอ → สวย','อ่าน สอ–อัว–ยอ ช้า ๆ ก่อน'),
    practice('ดาว',['ด','-า','ว'],'ดอ + อา + วอ → ดาว','ลาก อา แล้วปิดด้วยเสียง วอ'),
    practice('ข้าว',['ข','-า','ว','้'],'ขอ + อา + วอ + ไม้โท → ข้าว','แยก “ขาว” ก่อน แล้วเติมรูปไม้โท'),
  ]},
  {name:'อ่านเป็นวลีและประโยค',badge:'ท้าทาย',description:'20 แบบฝึก · แบ่งวรรค อ่านคล่อง และเข้าใจความหมาย',items:[
    practice('ตา มา นา',['ตา','มา','นา'],'ตา | มา | นา','เว้นหนึ่งจังหวะระหว่างคำ แล้วค่อยอ่านรวดเดียว'),
    practice('ปู อยู่ นา',['ปู','อยู่','นา'],'ปูอยู่ | นา','จับคำที่บอกว่าใคร แล้วตามด้วยสถานที่'),
    practice('แม่ มี แมว',['แม่','มี','แมว'],'แม่มี | แมว','อ่านกลุ่ม “แม่มี” ให้ติดกัน'),
    practice('พ่อ ดู ปู',['พ่อ','ดู','ปู'],'พ่อดู | ปู','ลองอ่านรวดเดียวหลังจากอ่านแยกคำ'),
    practice('ปลา อยู่ ใน น้ำ',['ปลา','อยู่','ใน','น้ำ'],'ปลาอยู่ | ในน้ำ','แบ่งเป็นสองช่วงตามความหมาย'),
    practice('นก บิน บน ฟ้า',['นก','บิน','บน','ฟ้า'],'นกบิน | บนฟ้า','เน้นคำกริยา “บิน” ให้ชัด'),
    practice('ตา พา ไป นา',['ตา','พา','ไป','นา'],'ตาพาไป | นา','อ่านสามคำแรกติดกันแล้วหยุดสั้น ๆ'),
    practice('มานี มี ปลา ตัว โต',['มานี','มี','ปลา','ตัว','โต'],'มานีมีปลา | ตัวโต','แบ่งตรงคำที่เริ่มบอกรูปร่าง'),
    practice('เขา พา ตา มา ที่ นา',['เขา','พา','ตา','มา','ที่','นา'],'เขาพาตา | มาที่นา','แบ่งเป็นสองช่วงตามความหมาย'),
    practice('แม่ พา น้อง ไป ตลาด',['แม่','พา','น้อง','ไป','ตลาด'],'แม่พาน้อง | ไปตลาด','อ่านชื่อผู้ทำก่อน แล้วตามด้วยสิ่งที่ทำ'),
    practice('คุณตา ปลูก กล้วย หลัง บ้าน',['คุณตา','ปลูก','กล้วย','หลัง','บ้าน'],'คุณตาปลูกกล้วย | หลังบ้าน','วงคำ “กล้วย” แล้วสะกดแยกถ้ายังติด'),
    practice('ฝน ตก แม่ กาง ร่ม',['ฝน','ตก','แม่','กาง','ร่ม'],'ฝนตก | แม่กางร่ม','หยุดสั้น ๆ ระหว่างเหตุและผล'),
    practice('น้อง อ่าน หนังสือ ทุก วัน',['น้อง','อ่าน','หนังสือ','ทุก','วัน'],'น้องอ่านหนังสือ | ทุกวัน','อ่านคำสามพยางค์ “หนัง–สือ” ช้า ๆ'),
    practice('เรา ไป เที่ยว ทะเล',['เรา','ไป','เที่ยว','ทะเล'],'เราไปเที่ยว | ทะเล','แบ่งคำ “ทะ–เล” แล้วอ่านรวม'),
    practice('เช้า นี้ อากาศ สดใส',['เช้า','นี้','อากาศ','สดใส'],'เช้านี้ | อากาศสดใส','อ่านคำยาวทีละช่วงแล้วเชื่อมประโยค'),
    practice('เด็ก ดี ช่วย แม่ ทำ งาน',['เด็ก','ดี','ช่วย','แม่','ทำ','งาน'],'เด็กดีช่วยแม่ | ทำงาน','อ่านกลุ่มคำที่มีความหมายร่วมกัน'),
    practice('พ่อ อ่าน ข่าว อยู่ ใน บ้าน',['พ่อ','อ่าน','ข่าว','อยู่','ใน','บ้าน'],'พ่ออ่านข่าว | อยู่ในบ้าน','หยุดหายใจสั้น ๆ ตรงเครื่องหมายแบ่งวลี'),
    practice('แมว สี ขาว นอน บน เสื่อ',['แมว','สี','ขาว','นอน','บน','เสื่อ'],'แมวสีขาว | นอนบนเสื่อ','สังเกตคำสระเอือในคำว่า “เสื่อ”'),
    practice('หลัง ฝน ตก เรา เห็น รุ้ง',['หลัง','ฝน','ตก','เรา','เห็น','รุ้ง'],'หลังฝนตก | เราเห็นรุ้ง','อ่านเหตุการณ์แรกก่อน แล้วจึงอ่านสิ่งที่เห็น'),
    practice('มานะ ตื่น เช้า เพื่อ ไป โรงเรียน',['มานะ','ตื่น','เช้า','เพื่อ','ไป','โรงเรียน'],'มานะตื่นเช้า | เพื่อไปโรงเรียน','แบ่งประโยคยาวเป็นสองช่วงแล้วอ่านรวม'),
  ]},
];
const totalReadingExercises=readingLevels.reduce((total,level)=>total+level.items.length,0);
export default function ReviewLibrary(){
  const [section,setSection]=useState<ReviewSection>('consonants');
  const [level,setLevel]=useState(0);
  const [item,setItem]=useState(0);
  const [showGuide,setShowGuide]=useState(true);
  const [message,setMessage]=useState('');
  const current=readingLevels[level].items[item];

  useEffect(()=>()=>stopThaiSpeech(),[]);
  function chooseLevel(next:number){setLevel(next);setItem(0);setShowGuide(true);setMessage('')}
  function move(step:number){const length=readingLevels[level].items.length;setItem(value=>(value+step+length)%length);setShowGuide(true);setMessage('')}
  function audioError(){setMessage('อุปกรณ์นี้ยังไม่พร้อมอ่านเสียง ลองอ่านกับคุณครูนะ')}
  function listenWord(){setMessage('');speakThaiSequence([{text:current.text,rate:.5,pause:450},{text:current.text,rate:.58}],audioError)}
  function listenSpelling(){
    setMessage('');
    const spelling=current.guide.replaceAll(' + ','. ').replaceAll(' | ','. เว้นจังหวะ. ').replace(' → ','. อ่านรวมว่า ');
    speakThaiSequence([{text:spelling,rate:.46,pause:500},{text:`อ่านรวมว่า ${current.text}`,rate:.56}],audioError);
  }

  return <div className="review-library">
    <section className="review-intro">
      <div><span className="eyebrow"><Sparkles size={15}/> คลังทบทวนภาษาไทย</span><h2>เปิดดูได้ทุกเมื่อ ค่อย ๆ จำทีละกลุ่ม</h2><p>แตะเลือกหัวข้อเพื่อทบทวนรูปร่าง ชื่อ และตัวอย่าง ก่อนเริ่มฝึกอ่าน</p></div>
      <div className="review-intro-art" aria-hidden="true"><span>ก</span><span>า</span><span>◌่</span></div>
    </section>

    <section className="reference-card card">
      <div className="review-tabs" role="tablist" aria-label="หัวข้อทบทวน">
        <button role="tab" aria-selected={section==='consonants'} className={section==='consonants'?'active':''} onClick={()=>setSection('consonants')}>พยัญชนะ <small>44 ตัว</small></button>
        <button role="tab" aria-selected={section==='vowels'} className={section==='vowels'?'active':''} onClick={()=>setSection('vowels')}>สระ <small>32 รูปเสียง</small></button>
        <button role="tab" aria-selected={section==='tones'} className={section==='tones'?'active':''} onClick={()=>setSection('tones')}>วรรณยุกต์ <small>4 รูป</small></button>
      </div>

      {section==='consonants'&&<div className="consonant-sections">{consonantGroups.map(group=><section key={group.name} className="letter-group"><div className="letter-group-heading"><div><span className={'group-dot '+group.tone}/><h3>{group.name}</h3></div><p>{group.description}</p></div><div className="letter-grid">{group.letters.map(entry=><article className="letter-chip" key={entry.letter}><strong>{entry.letter}</strong><span>{entry.name}</span>{entry.rare&&<small>ไม่ค่อยใช้</small>}</article>)}</div></section>)}</div>}

      {section==='vowels'&&<div><div className="reference-tip"><Lightbulb size={19}/><p><b>เครื่องหมาย – คือที่วางพยัญชนะ</b><br/>เช่น เ–า เมื่อนำ ข มาใส่ จะเป็นคำว่า “เขา”</p></div><div className="vowel-grid">{thaiVowels.map(entry=><article className="vowel-chip" key={entry.form+'-'+entry.name}><strong>{entry.form}</strong><span>เสียง {entry.name}</span><small>{entry.rare?'พบน้อยในปัจจุบัน':`เช่น ${entry.example}`}</small></article>)}</div></div>}

      {section==='tones'&&<div><div className="reference-tip"><Lightbulb size={19}/><p><b>รูปวรรณยุกต์กับเสียงวรรณยุกต์ไม่ใช่สิ่งเดียวกันเสมอ</b><br/>ตอนเริ่มต้นให้จำรูปร่างและชื่อก่อน แล้วฝึกผันเสียงกับคุณครู</p></div><div className="tone-grid">{tones.map(t=><article className="tone-chip" key={t.name}><strong>{t.mark}</strong><div><h3>{t.name}</h3><span>ตัวอย่าง {t.example}</span><small>{t.help}</small></div></article>)}</div></div>}
    </section>

    <section className="reading-lab card">
      <div className="section-heading"><div><span className="eyebrow"><BookOpen size={15}/> ฝึกอ่านพร้อมแนะแนว</span><h2>จากเสียงง่าย ไปสู่คำผสมและประโยค</h2><p>เลือกตามระดับที่พร้อม ไม่มีการจับเวลาและไม่บันทึกคะแนน</p></div><span className="pill">{totalReadingExercises} แบบฝึก · 4 ระดับ</span></div>
      <div className="reading-levels" role="tablist" aria-label="ระดับฝึกอ่าน">{readingLevels.map((entry,index)=><button key={entry.name} role="tab" aria-selected={level===index} className={level===index?'active':''} onClick={()=>chooseLevel(index)}><span>{index+1}</span><div><b>{entry.badge}</b><small>{entry.name}</small></div></button>)}</div>
      <div className="reading-stage">
        <div className="reading-stage-top"><div><span className="eyebrow">ระดับ {level+1} · {readingLevels[level].badge}</span><h3>{readingLevels[level].name}</h3><p>{readingLevels[level].description}</p></div><span className="pill">คำที่ {item+1}/{readingLevels[level].items.length}</span></div>
        <div className="reading-word" aria-live="polite">{current.text}</div>
        <div className="word-parts" aria-label="ส่วนประกอบของคำ">{current.parts.map((part,index)=><span key={part+index}>{part}</span>)}</div>
        <div className="reading-actions"><button className="secondary" onClick={listenWord}><Volume2 size={19}/> ฟังเสียงช้า ชัด</button><button className="secondary" onClick={listenSpelling}><BookOpen size={19}/> ฟังสะกดทีละส่วน</button><button className="secondary" aria-pressed={showGuide} onClick={()=>setShowGuide(value=>!value)}><Lightbulb size={19}/> {showGuide?'ซ่อนคำแนะนำ':'ดูวิธีอ่าน'}</button></div>
        {message&&<p className="reading-message" role="status">{message}</p>}
        {showGuide&&<div className="reading-guide"><span>อ่านทีละส่วน</span><b>{current.guide}</b><p>{current.tip}</p></div>}
        <div className="reading-nav"><button className="icon-button" aria-label="คำก่อนหน้า" onClick={()=>move(-1)}><ChevronLeft/></button><div className="reading-dots">{readingLevels[level].items.map((_,index)=><button key={index} aria-label={'ไปคำที่ '+(index+1)} className={item===index?'active':''} onClick={()=>{setItem(index);setShowGuide(true)}}/>)}</div><button className="primary" onClick={()=>move(1)}>คำถัดไป <ChevronRight size={18}/></button></div>
      </div>
      <div className="practice-note"><Lightbulb size={20}/><p><b>ฝึกครั้งละ 5–10 นาทีพอ</b><br/>ถ้าคำไหนยังติด ให้กลับไปดูสระของคำนั้น แล้วอ่านแยกส่วนก่อนอ่านรวมอีกครั้ง</p></div>
    </section>
    <WritingPractice />
  </div>
}
