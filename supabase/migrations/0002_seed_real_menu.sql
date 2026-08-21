-- Adinkra Fusion Kitchen — real menu seed, transcribed from Chef Eric's
-- printed menu (Cold Salads / Salsas / Beverages / Pepper Sauces).
-- Run after 0001_init.sql. Safe to run once on a fresh project — re-running
-- will create duplicate categories/items since there's no unique constraint
-- on name (menu items are managed by name in the admin UI going forward).
--
-- Photos were not included in this seed — add them per item in
-- Admin → Menu (they upload straight to the menu-images storage bucket).
--
-- Ordering stays OFF (see `ordering_enabled` in 0001_init.sql) until you
-- flip it on in Admin → Menu, even after this seed runs.

with cats as (
  insert into menu_categories (name, sort_order) values
    ('Cold Salads', 0),
    ('Salsas', 1),
    ('Beverages', 2),
    ('Pepper Sauces', 3)
  returning id, name
)
insert into menu_items (category_id, name, description, price_cents, sort_order)
select cats.id, v.name, v.description, v.price_cents, v.sort_order
from (
  values
    ('Cold Salads', 'Soya Smoked Chicken Salad',
      'Smoked chicken blended with a signature blend of Ghanaian soya spices, fresh herbs, and vegetables — Chef Eric''s signature recipe for a savory, smoky twist on classic chicken salad.',
      1200, 0),
    ('Cold Salads', 'Surf & Turf',
      'A bold Cajun-inspired combination of savory chicken and seasoned seafood blended with vegetables, herbs, and creamy dressing — bringing the flavors of a seafood boil to a chilled salad.',
      1200, 1),
    ('Cold Salads', 'Roasted Sweet Potato & Chickpea Salad',
      'Roasted sweet potatoes and hearty chickpeas tossed with fresh herbs, vegetables, and a flavorful house dressing for a satisfying sweet-and-savory plant-based salad.',
      1000, 2),
    ('Cold Salads', 'Jerk Pasta',
      'A bold Caribbean-inspired pasta salad tossed with savory jerk seasonings, fresh vegetables, and tender seasoned mushrooms crafted to deliver the hearty, satisfying bite and rich flavor of steak — 100% plant-based.',
      1000, 3),

    ('Salsas', 'Green Apple Jalapeño Salsa',
      'Crisp green apples paired with fresh jalapeños, herbs, and seasonings for a refreshing balance of sweet, tart, and spicy.',
      600, 0),
    ('Salsas', 'Tropical Salsa',
      'A bright, fruit-forward salsa combining tropical flavors with fresh herbs and a touch of spice for the perfect sweet-and-savory bite.',
      600, 1),
    ('Salsas', 'Watermelon Refresher Salsa',
      'Juicy watermelon combined with fresh herbs and complementary seasonings for a cool, refreshing salsa with a light sweet-and-savory finish.',
      600, 2),

    ('Beverages', 'Hibiscus Drink (Sobolo)',
      'Refreshing West African-inspired hibiscus beverage infused with ginger and aromatic spices for a naturally bold, tart, and slightly spicy finish.',
      500, 0),
    ('Beverages', 'Spicy Pineapple Ginger',
      'Sweet pineapple meets fresh ginger and a touch of heat in this vibrant tropical drink — refreshing at first sip with a spicy finish.',
      500, 1),

    ('Pepper Sauces', 'Shito',
      'A rich Ghanaian-style pepper sauce slowly developed with peppers, aromatics, spices, and savory ingredients for a deep, smoky flavor and lingering heat.',
      1200, 0),
    ('Pepper Sauces', 'Green Pepper Sauce',
      'A vibrant blend of fresh green peppers, herbs, aromatics, and spices delivering a bright, savory heat.',
      1000, 1),
    ('Pepper Sauces', 'Yellow Pepper Sauce',
      'A flavorful golden pepper sauce with aromatic spices and a smooth heat that complements everything from meats and seafood to vegetables.',
      1000, 2)
) as v(category_name, name, description, price_cents, sort_order)
join cats on cats.name = v.category_name;
