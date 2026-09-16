# Homework App v2 Final — Supabase

GitHub Pages에서 바로 호스팅할 수 있는 Homework App 1차 실사용 프로토타입입니다.

## 포함 기능
- Supabase Auth 로그인
- `profiles.role`에 따른 Teacher / Student 화면 분리
- Teacher: Class 생성/삭제
- Teacher: Class별 학생 배정/해제
- Teacher: Homework 등록
- Teacher: 학생 제출 결과 확인
- Student: 본인 Class 확인
- Student: 본인 Class의 최신 Homework 1개 확인
- Student: Writing 제출
- Student: Speaking 제출 기록

## 1. config.js 설정
Supabase Dashboard의 Project Settings → API에서 **Publishable key**를 복사하여 `config.js`의 `SUPABASE_PUBLISHABLE_KEY`에 입력하세요.

브라우저 코드에는 Publishable key(또는 기존 anon key)만 사용하세요. Secret/service_role key는 넣지 마세요.

## 2. GitHub Pages 업로드
다음 파일을 repository 최상위에 업로드합니다.

- `index.html`
- `config.js`
- `README.md`

기존 `index.html`이 있다면 교체하세요.

## 3. Supabase DB
현재 앱은 기존에 생성한 다음 테이블을 사용합니다.

- profiles
- classes
- class_schedules
- class_students
- homeworks
- submissions

Teacher 계정은 `profiles.role = 'teacher'`, 학생 계정은 `profiles.role = 'student'`여야 합니다.

## 보안 메모
- 개인 이메일 주소를 코드에 하드코딩하지 않습니다.
- Publishable/anon key는 프런트엔드에 노출될 수 있지만 RLS가 반드시 활성화되어 있어야 합니다.
- Secret/service_role key는 절대 GitHub에 업로드하지 마세요.

## 다음 개발 단계
1. Class 일정 달력/반복 일정 UI + `class_schedules` 실제 저장
2. Supabase Storage에 Speaking 음성 파일 업로드
3. 서버 측 AI 호출(Gemini 등)
4. Writing 문법 첨삭 및 초등 고학년 수준 피드백
5. Speaking 음성 → 텍스트 → 문법 첨삭
6. 제출물/과제 단위의 상세 결과 화면
