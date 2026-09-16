# Homework App v1

## 실행
`index.html`을 브라우저에서 열면 됩니다.

## 테스트 계정
- Teacher: teacher@example.com / 1234
- Student A: studentA@example.com / 1234
- Student B: studentB@example.com / 1234
- Student C: studentC@example.com / 1234

## v1 기능
### Teacher
- 로그인/권한 분리
- Class 생성/삭제
- Class별 요일/시간 설정
- 학생 배정
- Homework 등록
- Class별 최근 Homework 확인
- 학생 제출 결과 확인

### Student
- 본인 Class 확인
- Class별 최신 Homework 1개 확인
- Writing 입력 및 1차 첨삭 데모
- Speaking 음성 파일 선택/제출 UI

## 데이터
현재는 브라우저 `localStorage`를 사용합니다. 여러 기기에서 공유되는 실제 서비스가 아닙니다.

## 다음 단계
1. Supabase Auth 로그인
2. Supabase DB로 users/classes/homeworks/submissions 이전
3. Supabase Storage로 음성파일 저장
4. 서버 API에서 Gemini API 연결
5. Speech-to-Text 연결
6. AI 첨삭 결과 저장 및 교사 화면 표시
