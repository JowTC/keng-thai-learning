'use client';

type SpeechOptions={rate?:number,pitch?:number,onError?:()=>void,onEnd?:()=>void};
type SpeechStep={text:string,rate?:number,pause?:number};
let activeSequence=0;

function thaiVoice(){
  const voices=window.speechSynthesis.getVoices();
  return voices.find(voice=>voice.lang.toLowerCase()==='th-th')||voices.find(voice=>voice.lang.toLowerCase().startsWith('th'));
}

function utterance(text:string,options:SpeechOptions){
  const voice=new SpeechSynthesisUtterance(text);
  voice.lang='th-TH';
  voice.rate=options.rate??.58;
  voice.pitch=options.pitch??.95;
  voice.volume=1;
  const selected=thaiVoice();
  if(selected)voice.voice=selected;
  return voice;
}

export function speakThai(text:string,options:SpeechOptions={}){
  if(!('speechSynthesis' in window)){options.onError?.();return false}
  const sequence=++activeSequence;
  window.speechSynthesis.cancel();
  const voice=utterance(text,options);
  voice.onerror=()=>options.onError?.();
  voice.onend=()=>{if(sequence===activeSequence)options.onEnd?.()};
  window.speechSynthesis.speak(voice);
  return true;
}

export function speakThaiSequence(steps:SpeechStep[],onError?:()=>void){
  if(!('speechSynthesis' in window)){onError?.();return false}
  const sequence=++activeSequence;
  window.speechSynthesis.cancel();
  let index=0;
  const next=()=>{
    if(sequence!==activeSequence)return;
    const step=steps[index++];
    if(!step)return;
    const voice=utterance(step.text,{rate:step.rate});
    voice.onerror=()=>onError?.();
    voice.onend=()=>window.setTimeout(next,step.pause??280);
    window.speechSynthesis.speak(voice);
  };
  next();
  return true;
}

export function stopThaiSpeech(){
  activeSequence++;
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
}
