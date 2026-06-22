-- Supabase Schema for Chatbot Functionality

-- Enable pgvector extension for RAG (Retrieval-Augmented Generation)
create extension if not exists vector;

-- Users (if your project doesn't already have auth)
create table if not exists chat_users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  created_at timestamptz default now()
);

-- Conversations
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references chat_users(id) on delete cascade,
  summary text,
  created_at timestamptz default now()
);
create index if not exists conversations_user_id_idx on conversations(user_id);

-- Chat Messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now()
);
create index if not exists chat_messages_conv_id_idx on chat_messages(conversation_id);

-- Knowledge Chunks (for providing context to the AI)
create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536),
  source_file text,
  created_at timestamptz default now()
);

-- Similarity search function (cosine distance) for RAG
create or replace function match_chunks(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  source_file text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    source_file,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_chunks
  order by embedding <=> query_embedding
  limit match_count;
$$;
