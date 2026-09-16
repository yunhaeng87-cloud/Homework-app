const KEY="homework_v1_db";
const initial={
 users:[
  {id:"t1",name:"Teacher",email:"teacher@example.com",password:"1234",role:"teacher"},
  {id:"s1",name:"Student A",email:"studentA@example.com",password:"1234",role:"student"},
  {id:"s2",name:"Student B",email:"studentB@example.com",password:"1234",role:"student"},
  {id:"s3",name:"Student C",email:"studentC@example.com",password:"1234",role:"student"}
 ],
 classes:[],
 schedules:[],
 memberships:[],
 homeworks:[],
 submissions:[]
};
let db=JSON.parse(localStorage.getItem(KEY)||"null")||initial;
let session=JSON.parse(localStorage.getItem("homework_session")||"null");

function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function uid(prefix){return prefix+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function setSession(u){session=u;localStorage.setItem("homework_session",JSON.stringify(u));render()}
function logout(){session=null;localStorage.removeItem("homework_session");render()}
function user(id){return db.users.find(x=>x.id===id)}
function cls(id){return db.classes.find(x=>x.id===id)}
function schedules(id){return db.schedules.filter(x=>x.classId===id)}
function membershipsForClass(id){return db.memberships.filter(x=>x.classId===id)}
function latestHomework(classId){return db.homeworks.filter(x=>x.classId===classId).sort((a,b)=>b.createdAt-a.createdAt)[0]}
function formatSchedule(c){let s=schedules(c.id);return s.length?s.map(x=>`${x.day} ${x.start}–${x.end}`).join(" / "):"시간 미정"}

function render(){
 const root=document.getElementById("app");
 if(!session){root.innerHTML=loginHTML();return}
 root.innerHTML=session.role==="teacher"?teacherHTML():studentHTML();
}

function loginHTML(){return `<div class="login"><div class="login-card">
 <div class="logo">📚 Homework</div><p class="muted" style="text-align:center">Teacher / Student 학습관리 시스템</p>
 <form onsubmit="login(event)">
  <div class="field"><label>Email</label><input id="email" type="email" required placeholder="teacher@example.com"></div>
  <div class="field"><label>Password</label><input id="password" type="password" required placeholder="1234"></div>
  <button class="primary full">로그인</button>
 </form>
 <div class="demo"><b>테스트 계정</b><br>교사: teacher@example.com / 1234<br>학생: studentA@example.com / 1234</div>
 </div></div>`}
function login(e){e.preventDefault();let u=db.users.find(x=>x.email===email.value&&x.password===password.value);if(!u){alert("로그인 정보가 올바르지 않습니다.");return}setSession(u)}

function header(title){return `<header class="topbar"><div class="brand">📚 Homework <span class="muted" style="font-size:13px">${title}</span></div><div class="top-actions"><span class="role badge">${esc(session.name)} · ${session.role==="teacher"?"교사":"학생"}</span><button class="secondary" onclick="logout()">로그아웃</button></div></header>`}

let teacherTab="dashboard";
function teacherHTML(){return `<div class="layout">${header("Teacher")}
<div class="container"><div class="nav">
 ${["dashboard","classes","homework","results"].map((x,i)=>`<button class="${teacherTab===x?"active":""}" onclick="teacherTab='${x}';render()">${["Dashboard","Class 관리","Homework","결과 확인"][i]}</button>`).join("")}
</div>${teacherContent()}</div></div>`}

function teacherContent(){
 if(teacherTab==="dashboard")return `<h2>Dashboard</h2><div class="grid">
  <div class="card"><div class="muted">Classes</div><h2>${db.classes.length}</h2></div>
  <div class="card"><div class="muted">Students</div><h2>${db.users.filter(x=>x.role==="student").length}</h2></div>
  <div class="card"><div class="muted">Homework</div><h2>${db.homeworks.length}</h2></div>
  <div class="card"><div class="muted">Submissions</div><h2>${db.submissions.length}</h2></div>
 </div>`;
 if(teacherTab==="classes")return classesPage();
 if(teacherTab==="homework")return homeworkPage();
 return resultsPage();
}

function classesPage(){return `<div class="row between"><h2>Class 관리</h2><button class="primary" onclick="showClassModal()">+ Class 등록</button></div>
<div class="grid">${db.classes.length?db.classes.map(c=>`<div class="card">
 <div class="row between"><h3>${esc(c.name)}</h3><span class="badge">${membershipsForClass(c.id).length}명</span></div>
 <p class="muted">🕒 ${esc(formatSchedule(c))}</p>
 <div>${membershipsForClass(c.id).map(m=>`<span class="student-chip">${esc(user(m.studentId)?.name||"")}</span>`).join("")||'<span class="muted">학생 없음</span>'}</div>
 <div class="row" style="margin-top:15px"><button class="secondary" onclick="showMemberModal('${c.id}')">학생 배정</button><button class="danger" onclick="deleteClass('${c.id}')">삭제</button></div>
 </div>`).join(""):`<div class="card empty">등록된 Class가 없습니다.</div>`}</div>`}

function showClassModal(){modal(`<h2>Class 등록</h2><form onsubmit="createClass(event)">
 <div class="field"><label>Class name</label><input id="cname" required placeholder="Class A"></div>
 <label><b>수업시간</b></label><div id="scheduleRows"></div>
 <button type="button" class="secondary" onclick="addScheduleRow()">+ 시간 추가</button>
 <div class="row" style="margin-top:20px;justify-content:flex-end"><button type="button" class="secondary" onclick="closeModal()">취소</button><button class="primary">저장</button></div>
 </form>`);addScheduleRow();addScheduleRow()}

function addScheduleRow(day="화요일",start="14:00",end="15:00"){document.getElementById("scheduleRows").insertAdjacentHTML("beforeend",`<div class="schedule-row">
 <select class="sday"><option>월요일</option><option>화요일</option><option>수요일</option><option>목요일</option><option>금요일</option><option>토요일</option><option>일요일</option></select>
 <input class="sstart" type="time" value="${start}"><input class="send" type="time" value="${end}">
 <button type="button" class="danger" onclick="this.parentElement.remove()">삭제</button></div>`);
 let rows=document.querySelectorAll(".schedule-row");rows[rows.length-1].querySelector(".sday").value=day}
function createClass(e){e.preventDefault();let c={id:uid("c"),name:cname.value,createdAt:Date.now()};db.classes.push(c);document.querySelectorAll(".schedule-row").forEach(r=>db.schedules.push({id:uid("sch"),classId:c.id,day:r.querySelector(".sday").value,start:r.querySelector(".sstart").value,end:r.querySelector(".send").value}));save();closeModal();render()}

function showMemberModal(classId){let c=cls(classId), selected=new Set(membershipsForClass(classId).map(x=>x.studentId));modal(`<h2>${esc(c.name)} · 학생 배정</h2>
 <div class="list">${db.users.filter(x=>x.role==="student").map(s=>`<label class="list-item"><input class="studentCheck" type="checkbox" value="${s.id}" ${selected.has(s.id)?"checked":""}> ${esc(s.name)} <span class="muted">${esc(s.email)}</span></label>`).join("")}</div>
 <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="secondary" onclick="closeModal()">취소</button><button class="primary" onclick="saveMembers('${classId}')">저장</button></div>`)}
function saveMembers(classId){db.memberships=db.memberships.filter(x=>x.classId!==classId);document.querySelectorAll(".studentCheck:checked").forEach(x=>db.memberships.push({id:uid("m"),classId,studentId:x.value}));save();closeModal();render()}
function deleteClass(id){if(!confirm("Class를 삭제할까요? 관련 Homework와 배정 정보도 삭제됩니다."))return;db.classes=db.classes.filter(x=>x.id!==id);db.schedules=db.schedules.filter(x=>x.classId!==id);db.memberships=db.memberships.filter(x=>x.classId!==id);db.homeworks=db.homeworks.filter(x=>x.classId!==id);save();render()}

function homeworkPage(){return `<div class="row between"><h2>Homework 관리</h2><button class="primary" onclick="showHomeworkModal()">+ Homework 등록</button></div>
<div class="grid">${db.classes.length?db.classes.map(c=>{let hs=db.homeworks.filter(h=>h.classId===c.id).sort((a,b)=>b.createdAt-a.createdAt);return `<div class="card"><h3>${esc(c.name)}</h3>${hs.length?`<div class="list">${hs.slice(0,5).map(h=>`<div class="list-item"><b>${esc(h.title)}</b><div class="muted">${esc(h.instruction)}</div><small>등록 ${new Date(h.createdAt).toLocaleString()}</small></div>`).join("")}</div>`:'<div class="empty">Homework 없음</div>'}</div>`}).join(""):'<div class="card empty">먼저 Class를 등록하세요.</div>'}</div>`}
function showHomeworkModal(){if(!db.classes.length){alert("먼저 Class를 등록해주세요.");return}modal(`<h2>Homework 등록</h2><form onsubmit="createHomework(event)">
 <div class="field"><label>Class</label><select id="hclass">${db.classes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></div>
 <div class="field"><label>Title</label><input id="htitle" required placeholder="My Weekend"></div>
 <div class="field"><label>Instruction</label><textarea id="hinstruction" required placeholder="Write 5 sentences about your weekend."></textarea></div>
 <div class="field"><label>Due Date</label><input id="hdue" type="date"></div>
 <div class="row" style="justify-content:flex-end"><button type="button" class="secondary" onclick="closeModal()">취소</button><button class="primary">등록</button></div>
 </form>`)}
function createHomework(e){e.preventDefault();db.homeworks.push({id:uid("h"),classId:hclass.value,title:htitle.value,instruction:hinstruction.value,dueDate:hdue.value,createdAt:Date.now()});save();closeModal();render()}

function resultsPage(){let rows=db.submissions.slice().sort((a,b)=>b.submittedAt-a.submittedAt);return `<h2>학생 결과 확인</h2>
<div class="list">${rows.length?rows.map(s=>`<div class="card"><div class="row between"><div><b>${esc(user(s.studentId)?.name)}</b> · ${esc(cls(s.classId)?.name)}</div><span class="badge">${s.type==="writing"?"Writing":"Speaking"}</span></div>
<p><b>${esc(s.homeworkTitle)}</b></p><div class="feedback">${esc(s.correctedText||s.aiFeedback||s.originalText||s.transcript||"결과 없음")}</div></div>`).join(""):`<div class="card empty">아직 제출된 결과가 없습니다.</div>`}</div>`}

function studentHTML(){let myClasses=db.memberships.filter(m=>m.studentId===session.id).map(m=>cls(m.classId)).filter(Boolean);return `<div class="layout">${header("Student")}
<div class="container"><h2>안녕하세요, ${esc(session.name)} 👋</h2>${myClasses.length?myClasses.map(c=>studentClass(c)).join(""):`<div class="card empty">배정된 Class가 없습니다. 교사에게 문의하세요.</div>`}</div></div>`}
function studentClass(c){let h=latestHomework(c.id);return `<div class="card" style="margin-bottom:18px"><div class="row between"><div><h3>${esc(c.name)}</h3><div class="muted">🕒 ${esc(formatSchedule(c))}</div></div><span class="badge">내 Class</span></div>
 ${h?`<hr><h3>📌 Latest Homework</h3><h2>${esc(h.title)}</h2><p>${esc(h.instruction)}</p><p class="muted">제출기한: ${h.dueDate||"없음"}</p><div class="row"><button class="primary" onclick="showSubmitModal('${h.id}','writing')">✏️ Writing</button><button class="secondary" onclick="showSubmitModal('${h.id}','speaking')">🎙️ Speaking</button></div>`:`<div class="empty">등록된 Homework가 없습니다.</div>`}
 </div>`}

function showSubmitModal(hid,type){let h=db.homeworks.find(x=>x.id===hid);modal(`<h2>${type==="writing"?"✏️ Writing":"🎙️ Speaking"}</h2><p class="muted">${esc(h.title)} · ${esc(h.instruction)}</p>
 ${type==="writing"?`<div class="field"><label>영어 문장</label><textarea id="submissionText" placeholder="Write your English sentences here..."></textarea></div><button class="primary full" onclick="analyzeWriting('${hid}')">AI 첨삭하기</button><div id="aiResult"></div>`:
 `<div class="field"><label>음성 파일</label><input id="audioFile" type="file" accept="audio/*"></div><p class="muted">1차 버전에서는 음성 파일 선택/제출 UI까지 제공하며, 실제 Speech-to-Text API 연결은 다음 단계에서 연결합니다.</p><button class="primary full" onclick="submitSpeaking('${hid}')">음성 제출</button>`}`)}

function analyzeWriting(hid){let text=document.getElementById("submissionText").value.trim();if(!text){alert("문장을 입력해주세요.");return}
 // Demo AI-like feedback. Replace with server API call in production.
 let corrections=text.replace(/\bI go\b/gi,"I went").replace(/\bI eat\b/gi,"I ate").replace(/\bI am go\b/gi,"I am going");
 let changed=corrections!==text;
 let feedback=changed?`원문:\\n${text}\\n\\n수정:\\n${corrections}\\n\\n💡 쉬운 설명:\\n과거에 일어난 일을 말할 때는 과거형을 사용해요.`:`문법상 큰 오류가 보이지 않아요. 👍\\n\\n더 자연스럽게 말하고 싶다면 문장을 조금 더 구체적으로 만들어 볼 수 있어요.`;
 document.getElementById("aiResult").innerHTML=`<div class="feedback">${esc(feedback)}</div><button class="primary full" style="margin-top:12px" onclick="submitWriting('${hid}',${JSON.stringify(corrections)},${JSON.stringify(feedback)})">제출하기</button>`}
function submitWriting(hid,corrected,feedback){let h=db.homeworks.find(x=>x.id===hid);db.submissions.push({id:uid("sub"),homeworkId:hid,homeworkTitle:h.title,classId:h.classId,studentId:session.id,type:"writing",originalText:document.getElementById("submissionText").value,correctedText:corrected,aiFeedback:feedback,submittedAt:Date.now()});save();closeModal();alert("Writing이 제출되었습니다.");render()}
function submitSpeaking(hid){let f=document.getElementById("audioFile").files[0];if(!f){alert("음성 파일을 선택해주세요.");return}let h=db.homeworks.find(x=>x.id===hid);db.submissions.push({id:uid("sub"),homeworkId:hid,homeworkTitle:h.title,classId:h.classId,studentId:session.id,type:"speaking",audioName:f.name,aiFeedback:"음성 파일이 제출되었습니다. Speech-to-Text + AI 첨삭 API 연결 후 자동 분석됩니다.",submittedAt:Date.now()});save();closeModal();alert("Speaking 파일이 제출되었습니다.");render()}

function modal(html){document.body.insertAdjacentHTML("beforeend",`<div id="modalBackdrop" class="modal-backdrop" onclick="if(event.target.id==='modalBackdrop')closeModal()"><div class="modal">${html}</div></div>`)}
function closeModal(){document.getElementById("modalBackdrop")?.remove()}
render();