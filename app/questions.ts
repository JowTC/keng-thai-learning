export type Question={id:string,prompt:string,choices:string[],answer:string,skill:string,hint:string,spell:string};
export type ConsonantInfo={letter:string,name:string,spoken:string,tone:'middle'|'high'|'low',rare?:boolean};
export type VowelInfo={form:string,name:string,example:string,rare?:boolean};

export const levels=[
  {name:'รู้จักตัวอักษร',sub:'พยัญชนะครบ 44 ตัว · สุ่มใหม่ทุกครั้ง',icon:'ก',color:'mint'},
  {name:'รู้จักสระ',sub:'สระครบ 32 รูปเสียง · ดูรูปและตัวอย่าง',icon:'า',color:'peach'},
  {name:'อ่านคำให้แม่น',sub:'ผสมคำ · ตัวสะกด · วรรณยุกต์',icon:'บ้าน',color:'lavender'},
  {name:'อ่านแล้วเข้าใจ',sub:'ประโยคสั้น · จับใจความ',icon:'☀',color:'yellow'},
];

export const thaiConsonants:ConsonantInfo[]=[
  {letter:'ก',name:'ไก่',spoken:'กอ ไก่',tone:'middle'},{letter:'ข',name:'ไข่',spoken:'ขอ ไข่',tone:'high'},{letter:'ฃ',name:'ขวด',spoken:'ขอ ขวด',tone:'high',rare:true},{letter:'ค',name:'ควาย',spoken:'คอ ควาย',tone:'low'},
  {letter:'ฅ',name:'คน',spoken:'คอ คน',tone:'low',rare:true},{letter:'ฆ',name:'ระฆัง',spoken:'คอ ระฆัง',tone:'low'},{letter:'ง',name:'งู',spoken:'งอ งู',tone:'low'},{letter:'จ',name:'จาน',spoken:'จอ จาน',tone:'middle'},
  {letter:'ฉ',name:'ฉิ่ง',spoken:'ฉอ ฉิ่ง',tone:'high'},{letter:'ช',name:'ช้าง',spoken:'ชอ ช้าง',tone:'low'},{letter:'ซ',name:'โซ่',spoken:'ซอ โซ่',tone:'low'},{letter:'ฌ',name:'เฌอ',spoken:'ชอ เฌอ',tone:'low'},
  {letter:'ญ',name:'หญิง',spoken:'ยอ หญิง',tone:'low'},{letter:'ฎ',name:'ชฎา',spoken:'ดอ ชฎา',tone:'middle'},{letter:'ฏ',name:'ปฏัก',spoken:'ตอ ปฏัก',tone:'middle'},{letter:'ฐ',name:'ฐาน',spoken:'ถอ ฐาน',tone:'high'},
  {letter:'ฑ',name:'มณโฑ',spoken:'ทอ มณโฑ',tone:'low'},{letter:'ฒ',name:'ผู้เฒ่า',spoken:'ทอ ผู้เฒ่า',tone:'low'},{letter:'ณ',name:'เณร',spoken:'นอ เณร',tone:'low'},{letter:'ด',name:'เด็ก',spoken:'ดอ เด็ก',tone:'middle'},
  {letter:'ต',name:'เต่า',spoken:'ตอ เต่า',tone:'middle'},{letter:'ถ',name:'ถุง',spoken:'ถอ ถุง',tone:'high'},{letter:'ท',name:'ทหาร',spoken:'ทอ ทหาร',tone:'low'},{letter:'ธ',name:'ธง',spoken:'ทอ ธง',tone:'low'},
  {letter:'น',name:'หนู',spoken:'นอ หนู',tone:'low'},{letter:'บ',name:'ใบไม้',spoken:'บอ ใบไม้',tone:'middle'},{letter:'ป',name:'ปลา',spoken:'ปอ ปลา',tone:'middle'},{letter:'ผ',name:'ผึ้ง',spoken:'ผอ ผึ้ง',tone:'high'},
  {letter:'ฝ',name:'ฝา',spoken:'ฝอ ฝา',tone:'high'},{letter:'พ',name:'พาน',spoken:'พอ พาน',tone:'low'},{letter:'ฟ',name:'ฟัน',spoken:'ฟอ ฟัน',tone:'low'},{letter:'ภ',name:'สำเภา',spoken:'พอ สำเภา',tone:'low'},
  {letter:'ม',name:'ม้า',spoken:'มอ ม้า',tone:'low'},{letter:'ย',name:'ยักษ์',spoken:'ยอ ยักษ์',tone:'low'},{letter:'ร',name:'เรือ',spoken:'รอ เรือ',tone:'low'},{letter:'ล',name:'ลิง',spoken:'ลอ ลิง',tone:'low'},
  {letter:'ว',name:'แหวน',spoken:'วอ แหวน',tone:'low'},{letter:'ศ',name:'ศาลา',spoken:'สอ ศาลา',tone:'high'},{letter:'ษ',name:'ฤๅษี',spoken:'สอ ฤๅษี',tone:'high'},{letter:'ส',name:'เสือ',spoken:'สอ เสือ',tone:'high'},
  {letter:'ห',name:'หีบ',spoken:'หอ หีบ',tone:'high'},{letter:'ฬ',name:'จุฬา',spoken:'ลอ จุฬา',tone:'low'},{letter:'อ',name:'อ่าง',spoken:'ออ อ่าง',tone:'middle'},{letter:'ฮ',name:'นกฮูก',spoken:'ฮอ นกฮูก',tone:'low'},
];

export const thaiVowels:VowelInfo[]=[
  {form:'-ะ',name:'อะ',example:'กะ'},{form:'-า',name:'อา',example:'กา'},{form:'-ิ',name:'อิ',example:'กิน'},{form:'-ี',name:'อี',example:'ดี'},
  {form:'-ึ',name:'อึ',example:'ตึก'},{form:'-ื',name:'อือ',example:'มือ'},{form:'-ุ',name:'อุ',example:'ลุก'},{form:'-ู',name:'อู',example:'ปู'},
  {form:'เ-ะ',name:'เอะ',example:'เตะ'},{form:'เ-',name:'เอ',example:'เท'},{form:'แ-ะ',name:'แอะ',example:'แกะ'},{form:'แ-',name:'แอ',example:'แพ'},
  {form:'โ-ะ',name:'โอะ',example:'โต๊ะ'},{form:'โ-',name:'โอ',example:'โต'},{form:'เ-าะ',name:'เอาะ',example:'เกาะ'},{form:'-อ',name:'ออ',example:'พอ'},
  {form:'เ-อะ',name:'เออะ',example:'เลอะ'},{form:'เ-อ',name:'เออ',example:'เจอ'},{form:'เ-ียะ',name:'เอียะ',example:'เพียะ'},{form:'เ-ีย',name:'เอีย',example:'เสีย'},
  {form:'เ-ือะ',name:'เอือะ',example:'เปือะ'},{form:'เ-ือ',name:'เอือ',example:'เรือ'},{form:'-ัวะ',name:'อัวะ',example:'ผัวะ'},{form:'-ัว',name:'อัว',example:'ตัว'},
  {form:'-ำ',name:'อำ',example:'ดำ'},{form:'ใ-',name:'ไอ ไม้ม้วน',example:'ใจ'},{form:'ไ-',name:'ไอ ไม้มลาย',example:'ไป'},{form:'เ-า',name:'เอา',example:'เขา'},
  {form:'ฤ',name:'รึ',example:'ฤดู'},{form:'ฤๅ',name:'รือ',example:'ฤๅษี',rare:true},{form:'ฦ',name:'ลึ',example:'ฦ',rare:true},{form:'ฦๅ',name:'ลือ',example:'ฦๅ',rare:true},
];

function around<T>(items:T[],index:number){
  const offsets=[0,1,Math.ceil(items.length/3),Math.ceil(items.length/2)];
  return offsets.map(offset=>items[(index+offset)%items.length]);
}

const consonantQuestions:Question[]=thaiConsonants.map((entry,index)=>({
  id:`c-${index}`,prompt:`ตัวไหนคือ ${entry.letter} ${entry.name}?`,choices:around(thaiConsonants,index).map(item=>item.letter),answer:entry.letter,
  skill:`พยัญชนะ ${entry.letter}`,hint:`ฟังชื่อ “${entry.spoken}” แล้วสังเกตรูปร่างของตัว ${entry.letter}`,spell:entry.spoken,
}));

const vowelQuestions:Question[]=thaiVowels.map((entry,index)=>({
  id:`v-${index}`,prompt:`รูปใดคือสระ${entry.name}?`,choices:around(thaiVowels,index).map(item=>item.form),answer:entry.form,
  skill:`สระ${entry.name}`,hint:`สระ${entry.name} เขียนเป็น ${entry.form} เช่นคำว่า “${entry.example}”`,spell:`สระ ${entry.name}. รูป ${entry.form}. ตัวอย่าง ${entry.example}`,
}));

type WordDrill={word:string;spell:string;skill:string;hint:string};
const wordDrills:WordDrill[]=[
  {word:'กา',spell:'กอ อา กา',skill:'สระอา',hint:'ลากเสียงสระอาให้ยาวหนึ่งจังหวะ'},{word:'ตา',spell:'ตอ อา ตา',skill:'สระอา',hint:'อ่านพยัญชนะก่อน แล้วต่อด้วยเสียงอา'},
  {word:'มี',spell:'มอ อี มี',skill:'สระอี',hint:'สระอีอยู่ด้านบนและออกเสียงยาว'},{word:'ดี',spell:'ดอ อี ดี',skill:'สระอี',hint:'ลากเสียงอีให้ชัด'},
  {word:'ปู',spell:'ปอ อู ปู',skill:'สระอู',hint:'สระอูอยู่ด้านล่างและออกเสียงยาว'},{word:'ดู',spell:'ดอ อู ดู',skill:'สระอู',hint:'ห่อริมฝีปากเล็กน้อยเมื่อออกเสียงอู'},
  {word:'เก',spell:'กอ เอ เก',skill:'สระเอ',hint:'สระเอเขียนหน้า แต่อ่านพยัญชนะก่อน'},{word:'โต',spell:'ตอ โอ โต',skill:'สระโอ',hint:'สระโออยู่ด้านหน้าพยัญชนะ'},
  {word:'แพ',spell:'พอ แอ แพ',skill:'สระแอ',hint:'สระแอเขียนอยู่หน้าพยัญชนะ'},{word:'พอ',spell:'พอ ออ พอ',skill:'สระออ',hint:'สระออเขียนหลังพยัญชนะ'},
  {word:'มือ',spell:'มอ อือ มือ',skill:'สระอือ',hint:'คำไม่มีตัวสะกดจึงมี อ ปิดท้ายรูปสระ'},{word:'เรือ',spell:'รอ เอือ เรือ',skill:'สระเอือ',hint:'มอง เ–ือ เป็นสระชุดเดียว'},
  {word:'เสีย',spell:'สอ เอีย เสีย',skill:'สระเอีย',hint:'มอง เ–ีย เป็นสระชุดเดียว'},{word:'ตัว',spell:'ตอ อัว ตัว',skill:'สระอัว',hint:'สระอัวอยู่ด้านบนและด้านหลังพยัญชนะ'},
  {word:'ใจ',spell:'จอ ไอ ใจ',skill:'สระใอ',hint:'ใ ไม้ม้วน เขียนอยู่ด้านหน้า'},{word:'ไป',spell:'ปอ ไอ ไป',skill:'สระไอ',hint:'ไ ไม้มลาย เขียนอยู่ด้านหน้า'},
  {word:'ดำ',spell:'ดอ อำ ดำ',skill:'สระอำ',hint:'สระอำมีวงกลมด้านบนและลากลงด้านหลัง'},{word:'เขา',spell:'ขอ เอา เขา',skill:'สระเอา',hint:'มอง เ–า เป็นสระชุดเดียว'},
  {word:'กิน',spell:'กอ อิ นอ กิน',skill:'ตัวสะกด',hint:'น เป็นตัวสะกดท้ายคำ'},{word:'ดิน',spell:'ดอ อิ นอ ดิน',skill:'ตัวสะกด',hint:'ปิดท้ายเสียง น สั้นและชัด'},
  {word:'ลิง',spell:'ลอ อิ งอ ลิง',skill:'ตัวสะกด',hint:'ปลายเสียงเป็น ง'},{word:'จาน',spell:'จอ อา นอ จาน',skill:'ตัวสะกด',hint:'ลากสระอาแล้วปิดด้วยเสียง น'},
  {word:'กาง',spell:'กอ อา งอ กาง',skill:'ตัวสะกด',hint:'คำนี้ลงท้ายด้วย ง'},{word:'ลาม',spell:'ลอ อา มอ ลาม',skill:'ตัวสะกด',hint:'ปิดริมฝีปากเมื่อจบเสียง ม'},
  {word:'นก',spell:'นอ โอะ กอ นก',skill:'สระลดรูป',hint:'มีเสียงสระโอะ แม้ไม่เห็นรูปสระ'},{word:'มด',spell:'มอ โอะ ดอ มด',skill:'สระลดรูป',hint:'สระโอะลดรูปอยู่ระหว่าง ม และ ด'},
  {word:'กบ',spell:'กอ โอะ บอ กบ',skill:'สระลดรูป',hint:'สระโอะลดรูปและลงท้ายด้วย บ'},{word:'ลม',spell:'ลอ โอะ มอ ลม',skill:'สระลดรูป',hint:'สระโอะลดรูปและลงท้ายด้วย ม'},
  {word:'ป่า',spell:'ปอ อา ไม้เอก ป่า',skill:'ไม้เอก',hint:'มองรูปไม้เอกด้านบน'},{word:'ป้า',spell:'ปอ อา ไม้โท ป้า',skill:'ไม้โท',hint:'มองรูปไม้โทด้านบน'},
  {word:'โต๊ะ',spell:'ตอ โอะ ไม้ตรี โต๊ะ',skill:'ไม้ตรี',hint:'คำนี้มีรูปไม้ตรี'},{word:'ก๋วย',spell:'กอ อัว ยอ ไม้จัตวา ก๋วย',skill:'ไม้จัตวา',hint:'คำนี้มีรูปไม้จัตวา'},
  {word:'บ้าน',spell:'บอ อา นอ ไม้โท บ้าน',skill:'วรรณยุกต์และตัวสะกด',hint:'อ่าน บาน ก่อนแล้วเติมไม้โท'},{word:'แก้ว',spell:'กอ แอ วอ ไม้โท แก้ว',skill:'วรรณยุกต์และตัวสะกด',hint:'ว เป็นตัวสะกดและมีไม้โท'},
  {word:'ข้าว',spell:'ขอ อา วอ ไม้โท ข้าว',skill:'วรรณยุกต์และตัวสะกด',hint:'แยก ขาว ก่อน แล้วเติมไม้โท'},{word:'กล้วย',spell:'กลอ อัว ยอ ไม้โท กล้วย',skill:'คำควบกล้ำ',hint:'ออกเสียง กล ให้ติดกัน'},
  {word:'ปลา',spell:'ปอ ลอ อา ปลา',skill:'คำควบกล้ำ',hint:'ออกเสียง ปล ให้ติดกัน'},{word:'ครู',spell:'คอ รอ อู ครู',skill:'คำควบกล้ำ',hint:'ออกเสียง คร ให้ติดกัน'},
  {word:'กราบ',spell:'กอ รอ อา บอ กราบ',skill:'คำควบกล้ำ',hint:'ออกเสียง กร แล้วปิดท้ายด้วย บ'},{word:'พร้อม',spell:'พอ รอ ออ มอ ไม้โท พร้อม',skill:'คำควบกล้ำ',hint:'ออกเสียง พร ให้ติดกัน แล้วสังเกตไม้โท'},
];

const wordQuestions:Question[]=wordDrills.map((entry,index)=>({
  id:`w-${index}`,prompt:`คำใดสะกดว่า “${entry.spell}”?`,choices:around(wordDrills,index).map(item=>item.word),answer:entry.word,skill:entry.skill,hint:entry.hint,spell:entry.spell,
}));

type StoryDrill={text:string;answer:string;choices:string[];skill:string;hint:string};
const stories:StoryDrill[]=[
  {text:'ตาดูปู\nใครดูปู?',answer:'ตา',choices:['ตา','ปู','ยาย','แม่'],skill:'หาใคร',hint:'ดูคำที่อยู่หน้าคำว่า “ดู”'},
  {text:'แม่มีแมว\nแม่มีอะไร?',answer:'แมว',choices:['ปลา','แมว','นก','ปู'],skill:'หาอะไร',hint:'อ่านคำที่อยู่หลังคำว่า “มี”'},
  {text:'นกอยู่บนต้นไม้\nนกอยู่ที่ไหน?',answer:'บนต้นไม้',choices:['ในน้ำ','บนต้นไม้','ในบ้าน','บนโต๊ะ'],skill:'หาที่ไหน',hint:'ข้อความหลังคำว่า “อยู่” บอกตำแหน่ง'},
  {text:'เก้ากินข้าวแล้วดื่มน้ำ\nเก้าทำอะไรก่อน?',answer:'กินข้าว',choices:['ดื่มน้ำ','นอน','กินข้าว','เล่น'],skill:'ลำดับเหตุการณ์',hint:'สิ่งที่อยู่ก่อนคำว่า “แล้ว” เกิดขึ้นก่อน'},
  {text:'ฝนตก แม่จึงกางร่ม\nแม่กางร่มเพราะอะไร?',answer:'ฝนตก',choices:['แดดออก','ฝนตก','หนาว','หิว'],skill:'เหตุและผล',hint:'ข้อความแรกบอกเหตุ'},
  {text:'พ่ออ่านหนังสือในบ้าน\nพ่อทำอะไร?',answer:'อ่านหนังสือ',choices:['วิ่ง','กินข้าว','อ่านหนังสือ','ปลูกต้นไม้'],skill:'หาการกระทำ',hint:'มองหาคำที่บอกสิ่งที่พ่อกำลังทำ'},
  {text:'มานีรดน้ำต้นไม้ทุกเช้า\nมานีรดน้ำเมื่อไร?',answer:'ตอนเช้า',choices:['ตอนเช้า','ตอนเที่ยง','ตอนเย็น','กลางคืน'],skill:'หาเมื่อไร',hint:'คำท้ายประโยคบอกช่วงเวลา'},
  {text:'ปูอยู่ในนา ปลาอยู่ในน้ำ\nอะไรอยู่ในนา?',answer:'ปู',choices:['ปลา','ปู','แมว','นก'],skill:'หาอะไร',hint:'อ่านส่วนแรกของประโยค'},
  {text:'น้องใส่รองเท้าก่อนไปโรงเรียน\nน้องใส่อะไร?',answer:'รองเท้า',choices:['หมวก','เสื้อ','รองเท้า','ถุงมือ'],skill:'หาอะไร',hint:'คำที่ตามหลัง “ใส่” คือคำตอบ'},
  {text:'แมวนอนใต้โต๊ะ\nแมวนอนที่ไหน?',answer:'ใต้โต๊ะ',choices:['บนโต๊ะ','ใต้โต๊ะ','ในตู้','บนหลังคา'],skill:'หาที่ไหน',hint:'มองคำบอกตำแหน่ง'},
  {text:'ยายทำขนมให้หลาน\nใครทำขนม?',answer:'ยาย',choices:['ยาย','หลาน','แม่','พ่อ'],skill:'หาใคร',hint:'ผู้ทำอยู่ต้นประโยค'},
  {text:'พ่อปลูกต้นไม้หลังบ้าน\nพ่อปลูกอะไร?',answer:'ต้นไม้',choices:['ดอกไม้','ต้นไม้','ผัก','ข้าว'],skill:'หาอะไร',hint:'คำที่ตามหลัง “ปลูก” คือคำตอบ'},
  {text:'ปลาอยู่ในน้ำเพราะปลาต้องว่ายน้ำ\nปลาอยู่ที่ไหน?',answer:'ในน้ำ',choices:['บนฟ้า','ในน้ำ','บนดิน','ในรัง'],skill:'หาที่ไหน',hint:'อ่านข้อความช่วงแรก'},
  {text:'วันนี้อากาศร้อน น้องจึงดื่มน้ำ\nน้องดื่มน้ำเพราะอะไร?',answer:'อากาศร้อน',choices:['หิวข้าว','อากาศร้อน','ฝนตก','ง่วงนอน'],skill:'เหตุและผล',hint:'ข้อความก่อนคำว่า “จึง” บอกเหตุ'},
  {text:'มะลิตื่นนอน อาบน้ำ แล้วกินข้าว\nมะลิทำอะไรเป็นอย่างที่สอง?',answer:'อาบน้ำ',choices:['ตื่นนอน','อาบน้ำ','กินข้าว','ไปโรงเรียน'],skill:'ลำดับเหตุการณ์',hint:'เรียงการกระทำจากซ้ายไปขวา'},
  {text:'ลูกบอลสีแดงอยู่ข้างเก้าอี้\nลูกบอลสีอะไร?',answer:'สีแดง',choices:['สีฟ้า','สีแดง','สีเขียว','สีขาว'],skill:'หารายละเอียด',hint:'สีอยู่หลังคำว่า “ลูกบอล”'},
  {text:'วันอาทิตย์ครอบครัวไปสวนสัตว์\nครอบครัวไปวันไหน?',answer:'วันอาทิตย์',choices:['วันจันทร์','วันศุกร์','วันเสาร์','วันอาทิตย์'],skill:'หาเมื่อไร',hint:'คำต้นประโยคบอกวัน'},
  {text:'นกบินสูง แต่ไก่เดินอยู่บนดิน\nสัตว์ตัวใดบินสูง?',answer:'นก',choices:['ปลา','แมว','ไก่','นก'],skill:'เปรียบเทียบข้อมูล',hint:'อ่านส่วนก่อนคำว่า “แต่”'},
  {text:'แม่ซื้อกล้วยและส้มจากตลาด\nแม่ไม่ได้ซื้ออะไร?',answer:'มะม่วง',choices:['กล้วย','ส้ม','มะม่วง','ผลไม้'],skill:'แยกข้อมูล',hint:'เลือกสิ่งที่ไม่ได้อยู่ในประโยค'},
  {text:'เด็ก ๆ เก็บของเล่นก่อนนอน\nเด็ก ๆ เก็บของเล่นเมื่อไร?',answer:'ก่อนนอน',choices:['ก่อนนอน','ตอนเช้า','หลังตื่น','ตอนเที่ยง'],skill:'หาเมื่อไร',hint:'คำท้ายประโยคบอกเวลา'},
  {text:'เมฆสีดำลอยมา ไม่นานฝนก็ตก\nอะไรเกิดขึ้นทีหลัง?',answer:'ฝนตก',choices:['แดดออก','เมฆลอยมา','ฝนตก','ลมสงบ'],skill:'ลำดับเหตุการณ์',hint:'เหตุการณ์หลังอยู่ช่วงท้ายประโยค'},
  {text:'ดอกไม้ได้รับน้ำจึงเติบโต\nอะไรช่วยให้ดอกไม้เติบโต?',answer:'น้ำ',choices:['ลม','น้ำ','ก้อนหิน','ของเล่น'],skill:'เหตุและผล',hint:'สิ่งที่ดอกไม้ได้รับอยู่ก่อนคำว่า “จึง”'},
  {text:'ต้นกล้าแบ่งขนมให้น้อง\nต้นกล้ามีนิสัยอย่างไร?',answer:'มีน้ำใจ',choices:['มีน้ำใจ','ขี้เกียจ','ใจร้อน','ขี้ลืม'],skill:'สรุปความหมาย',hint:'การแบ่งของให้ผู้อื่นแสดงถึงนิสัยใด'},
  {text:'หลังฝนหยุด เด็ก ๆ เห็นรุ้งบนฟ้า\nเด็ก ๆ เห็นอะไร?',answer:'รุ้ง',choices:['ดาว','ดวงจันทร์','รุ้ง','เมฆดำ'],skill:'หาอะไร',hint:'มองคำที่ตามหลัง “เห็น”'},
];

const storyQuestions:Question[]=stories.map((entry,index)=>({
  id:`s-${index}`,prompt:entry.text,choices:entry.choices,answer:entry.answer,skill:entry.skill,hint:entry.hint,spell:entry.answer.split(' ').join('. เว้นจังหวะ. '),
}));

export const bank:Question[][]=[consonantQuestions,vowelQuestions,wordQuestions,storyQuestions];
