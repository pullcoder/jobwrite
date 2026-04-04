-- profiles 테이블 (auth.users 확장)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  plan text not null default 'free', -- free, pro, premium
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- documents 테이블 (생성된 자소서)
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  company text not null,
  position text not null,
  category text not null,
  experience text not null,
  strength text,
  char_limit integer not null default 1000,
  content text not null,
  created_at timestamptz not null default now()
);

-- subscriptions 테이블 (구독 관리)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  plan text not null default 'free',
  status text not null default 'active', -- active, cancelled, expired
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  payment_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS 활성화
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.subscriptions enable row level security;

-- profiles RLS 정책
create policy "본인 프로필만 조회 가능" on public.profiles
  for select using (auth.uid() = id);

create policy "본인 프로필만 수정 가능" on public.profiles
  for update using (auth.uid() = id);

-- documents RLS 정책
create policy "본인 자소서만 조회 가능" on public.documents
  for select using (auth.uid() = user_id);

create policy "본인 자소서만 생성 가능" on public.documents
  for insert with check (auth.uid() = user_id);

create policy "본인 자소서만 삭제 가능" on public.documents
  for delete using (auth.uid() = user_id);

-- subscriptions RLS 정책
create policy "본인 구독만 조회 가능" on public.subscriptions
  for select using (auth.uid() = user_id);

-- 신규 유저 가입 시 자동으로 profiles 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at 자동 갱신 함수
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_subscriptions
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();
