-- Adinkra Fusion Kitchen — core schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);
create index customers_email_idx on customers (lower(email));
create index customers_phone_idx on customers (phone);

create table menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories (id) on delete set null,
  name text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  image_url text,
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index menu_items_category_idx on menu_items (category_id);

create sequence order_number_seq start 1001;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('AFK-' || nextval('order_number_seq')::text),
  customer_id uuid references customers (id) on delete set null,
  fulfillment_type text not null check (fulfillment_type in ('pickup', 'delivery')),
  status text not null default 'new'
    check (status in ('new', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
  pickup_date date,
  delivery_address text,
  delivery_city text,
  delivery_zip text,
  delivery_fee_cents int not null default 0,
  subtotal_cents int not null default 0,
  total_cents int not null default 0,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid')),
  notes text,
  created_at timestamptz not null default now()
);
create index orders_customer_idx on orders (customer_id);
create index orders_status_idx on orders (status);
create index orders_created_idx on orders (created_at desc);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  menu_item_id uuid references menu_items (id) on delete set null,
  name_snapshot text not null,
  price_cents_snapshot int not null,
  quantity int not null check (quantity > 0),
  notes text
);
create index order_items_order_idx on order_items (order_id);

create table settings (
  key text primary key,
  value jsonb not null
);

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contact', 'event')),
  name text not null,
  email text,
  phone text,
  event_type text,
  event_date date,
  guest_count int,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);
create index inquiries_created_idx on inquiries (created_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- Default settings
-- ─────────────────────────────────────────────────────────────────────────

insert into settings (key, value) values
  ('ordering_enabled', 'false'),
  ('pickup', jsonb_build_object(
    'venue', 'Frisco Fresh Market',
    'city', 'Frisco, TX',
    'schedule', 'Saturdays & Sundays',
    'hours', '10:00 AM – 4:00 PM'
  )),
  ('delivery', jsonb_build_object(
    'area', 'DFW Metroplex',
    'fee_cents', 800,
    'minimum_cents', 0
  ));

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────

alter table customers enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table settings enable row level security;
alter table inquiries enable row level security;

-- Public (anon) can browse the live menu and read settings.
create policy "public read available menu items" on menu_items
  for select using (is_available = true);
create policy "public read menu categories" on menu_categories
  for select using (true);
create policy "public read settings" on settings
  for select using (true);

-- Public can submit inquiries (contact / event forms), but not read them back.
create policy "public can submit inquiries" on inquiries
  for insert with check (true);

-- Authenticated (the admin user) has full access to everything.
create policy "admin full access customers" on customers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access menu_categories" on menu_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access menu_items" on menu_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access orders" on orders
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access order_items" on order_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access settings" on settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access inquiries" on inquiries
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────
-- create_order: the only way anon can write an order.
-- Runs as the function owner (bypassing RLS internally) so a single call can
-- upsert the customer, price the order from the *server-side* menu_items
-- table (never trusting client-submitted prices), and insert order + items
-- atomically. Grant EXECUTE to anon; the function body is the security
-- boundary, not table-level RLS.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function create_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_fulfillment_type text,
  p_pickup_date date,
  p_delivery_address text,
  p_delivery_city text,
  p_delivery_zip text,
  p_notes text,
  p_items jsonb -- [{ "menu_item_id": "uuid", "quantity": 1, "notes": "" }, ...]
)
returns table (order_id uuid, order_number text, total_cents int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_subtotal_cents int := 0;
  v_delivery_fee_cents int := 0;
  v_total_cents int := 0;
  v_item jsonb;
  v_menu_item menu_items%rowtype;
begin
  if p_fulfillment_type not in ('pickup', 'delivery') then
    raise exception 'invalid fulfillment_type';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'order must contain at least one item';
  end if;

  -- Upsert customer by email if provided, else always create a new record.
  if p_customer_email is not null and length(trim(p_customer_email)) > 0 then
    select id into v_customer_id from customers where lower(email) = lower(p_customer_email) limit 1;
  end if;

  if v_customer_id is null then
    insert into customers (name, email, phone)
    values (p_customer_name, nullif(p_customer_email, ''), nullif(p_customer_phone, ''))
    returning id into v_customer_id;
  else
    update customers
      set name = p_customer_name,
          phone = coalesce(nullif(p_customer_phone, ''), phone)
      where id = v_customer_id;
  end if;

  if p_fulfillment_type = 'delivery' then
    select coalesce((value ->> 'fee_cents')::int, 0) into v_delivery_fee_cents
      from settings where key = 'delivery';
  end if;

  -- Price every line item from the authoritative menu_items table.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_menu_item from menu_items
      where id = (v_item ->> 'menu_item_id')::uuid and is_available = true;

    if not found then
      raise exception 'menu item % is not available', (v_item ->> 'menu_item_id');
    end if;

    v_subtotal_cents := v_subtotal_cents
      + v_menu_item.price_cents * coalesce((v_item ->> 'quantity')::int, 1);
  end loop;

  v_total_cents := v_subtotal_cents + v_delivery_fee_cents;

  insert into orders (
    customer_id, fulfillment_type, pickup_date,
    delivery_address, delivery_city, delivery_zip, delivery_fee_cents,
    subtotal_cents, total_cents, notes
  ) values (
    v_customer_id, p_fulfillment_type, p_pickup_date,
    p_delivery_address, p_delivery_city, p_delivery_zip, v_delivery_fee_cents,
    v_subtotal_cents, v_total_cents, nullif(p_notes, '')
  ) returning id, orders.order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_menu_item from menu_items where id = (v_item ->> 'menu_item_id')::uuid;

    insert into order_items (order_id, menu_item_id, name_snapshot, price_cents_snapshot, quantity, notes)
    values (
      v_order_id,
      v_menu_item.id,
      v_menu_item.name,
      v_menu_item.price_cents,
      coalesce((v_item ->> 'quantity')::int, 1),
      nullif(v_item ->> 'notes', '')
    );
  end loop;

  return query select v_order_id, v_order_number, v_total_cents;
end;
$$;

grant execute on function create_order to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Storage: menu item photos
-- ─────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy "public read menu images" on storage.objects
  for select using (bucket_id = 'menu-images');

create policy "admin write menu images" on storage.objects
  for insert to authenticated with check (bucket_id = 'menu-images');

create policy "admin update menu images" on storage.objects
  for update to authenticated using (bucket_id = 'menu-images');

create policy "admin delete menu images" on storage.objects
  for delete to authenticated using (bucket_id = 'menu-images');
