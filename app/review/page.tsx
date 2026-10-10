import {ArrowLeft,Leaf} from 'lucide-react';
import ReviewLibrary from '../review-library';

export default function ReviewPage(){
  return <div className="app review-page">
    <header className="topbar">
      <a href="/" className="brand"><span className="brand-icon">ก<span>✦</span></span><div>เก่งไทย<small>คลังทบทวนภาษาไทย</small></div></a>
      <a href="/" className="secondary"><ArrowLeft size={18}/> กลับหน้าห้องเรียน</a>
    </header>
    <main className="dashboard">
      <div className="review-page-heading"><span className="eyebrow"><Leaf size={15}/> ทบทวนได้ทุกวัน</span><h1>พยัญชนะ สระ วรรณยุกต์ และฝึกอ่าน</h1><p>หน้านี้เปิดได้โดยไม่ต้องเข้าสู่ระบบ และไม่เก็บคะแนนหรือข้อมูลส่วนตัว</p></div>
      <ReviewLibrary />
      <footer className="footer">เก่งไทย · ฝึกสั้น ๆ สม่ำเสมอ แล้วค่อย ๆ อ่านคล่องขึ้น</footer>
    </main>
  </div>
}
