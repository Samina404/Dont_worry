# Supabase Setup for Social Space

To make the Social Space feature work, you need to create the `social_posts` table in your Supabase database.

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create the posts table
create table if not exists social_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamptz default now(),
  likes jsonb default '[]'::jsonb,
  user_email text,
  user_metadata jsonb
);

-- Enable Row Level Security (RLS)
alter table social_posts enable row level security;

-- Create policies
-- 1. Everyone can view posts
create policy "Public posts are viewable by everyone"
  on social_posts for select
  using ( true );

-- 2. Authenticated users can insert posts
create policy "Users can create posts"
  on social_posts for insert
  with check ( auth.uid() = user_id );

-- 3. Authenticated users can update posts (for likes)
-- Note: In a production app, you would want more granular control here, 
-- or use a separate 'likes' table to prevent overwriting.
create policy "Users can update posts"
  on social_posts for update
  using ( auth.role() = 'authenticated' );
```

## Real-time Setup

1. Go to your Supabase Dashboard.
2. Go to **Database** -> **Replication**.
3. Enable replication for the `social_posts` table.
   - Click the source toggle for `social_posts`.
   - This allows the app to receive real-time updates when new posts are added.
