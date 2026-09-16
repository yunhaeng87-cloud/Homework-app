# Homework App v2 - Supabase 연결 버전

## 1. 먼저 Supabase에서 profiles에 email/name을 보강하세요
현재 v1 DB의 profiles에는 name/role만 있습니다. 학생 선택 화면을 편하게 쓰려면 아래 SQL을 한 번 실행하는 것을 권장합니다.

```sql
alter table public.profiles add column if not exists email text;
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id;
```

그 다음 새 사용자 생성 트리거를 아래처럼 교체하면 이후 가입/생성 사용자도 email이 저장됩니다.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''),'@',1), 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.email
  );
  return new;
end;
$$;
```

## 2. config.js 설정
Supabase Dashboard → Project Settings → API에서:
- Project URL
- Publishable key (또는 legacy anon key)

를 복사해 config.js에 입력합니다.

## 3. GitHub Pages
index.html, config.js를 repository 최상위에 업로드/교체합니다.

## 현재 v2
- Supabase Auth 로그인
- Teacher/Student role 분리
- Class 생성/삭제
- 학생 Class 배정/해제
- Homework 등록
- 학생: 본인 Class의 최신 Homework 확인
- Writing/Speaking 제출 기록
- Teacher: 제출 결과 확인

## 다음 단계
- class_schedules를 달력/반복 일정 UI와 실제 DB로 연결
- Storage 음성 업로드
- Gemini 서버 연동
- Speech-to-Text → 문법/초등 고학년 수준 첨삭
- 최신 Homework를 "과제 단위"로 정확히 제한
