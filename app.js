/* =========================================================
   Foodie — Production Application Engine
   ========================================================= */

// --- 1. FOODIE DATABASE ---
const CATEGORIES = [
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'chicken', name: 'Chicken', icon: '🍗' },
  { id: 'fries', name: 'Fries & Sides', icon: '🍟' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'sandwich', name: 'Sandwich', icon: '🥪' },
  { id: 'asian', name: 'Asian Bowl', icon: '🍜' },
  { id: 'deals', name: 'Super Deals', icon: '🏷️' },
];

const FOOD_ITEMS = [
  {
    id: 'f1',
    name: 'Margherita Classica',
    category: 'pizza',
    desc: 'San Marzano plum tomato sauce, fresh buffalo mozzarella, aromatic sweet basil, and extra virgin olive oil.',
    img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
    basePrice: 12.99,
    rating: 4.9,
    reviews: 342,
    prepTime: 15,
    cals: 260,
    ingredients: ['San Marzano Sauce', 'Fresh Mozzarella', 'Sweet Basil', 'Olive Oil', 'Sea Salt'],
    isVeg: true,
    isPopular: true,
  },
  {
    id: 'f2',
    name: 'Smash Angus Cheeseburger',
    category: 'burgers',
    desc: 'Two 100% prime angus beef smashed patties, double melted cheddar, caramelized onions, house secret sauce on buttered brioche.',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    basePrice: 11.99,
    rating: 4.95,
    reviews: 512,
    prepTime: 12,
    cals: 480,
    ingredients: ['Angus Beef', 'Aged Cheddar', 'Grilled Onion', 'Brioche Bun', 'Secret Sauce'],
    isPopular: true,
  },
  {
    id: 'f3',
    name: 'Double Pepperoni Feast',
    category: 'pizza',
    desc: 'Loaded with a double portion of crispy artisanal pepperoni cups, mozzarella blend, and zesty herb marinara.',
    img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80',
    basePrice: 15.49,
    rating: 4.92,
    reviews: 480,
    prepTime: 18,
    cals: 340,
    ingredients: ['Double Pepperoni', 'Aged Mozzarella', 'Oregano', 'Tomato Puree'],
    isSpicy: true,
    isPopular: true,
  },
  {
    id: 'f4',
    name: 'Smoky BBQ Crisp Chicken Pizza',
    category: 'pizza',
    desc: 'Tender grilled chicken chunks tossed in sweet hickory BBQ sauce, red onions, cilantro, and smoked gouda cheese.',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
    basePrice: 16.99,
    rating: 4.85,
    reviews: 290,
    prepTime: 20,
    cals: 320,
    ingredients: ['Grilled Chicken', 'Hickory BBQ', 'Smoked Gouda', 'Red Onion', 'Cilantro'],
    isPopular: true,
  },
  {
    id: 'f5',
    name: 'Golden Buttermilk Chicken Tenders',
    category: 'chicken',
    desc: '6 pieces of crispy golden chicken tenderloins fried to perfection, served with honey mustard and garlic dip.',
    img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    basePrice: 9.99,
    rating: 4.8,
    reviews: 210,
    prepTime: 10,
    cals: 350,
    ingredients: ['Chicken Tenderloin', 'Buttermilk Marinade', 'Honey Mustard Dip'],
    isPopular: true,
  },
  {
    id: 'f6',
    name: 'Truffle Parmesan Hand-Cut Fries',
    category: 'fries',
    desc: 'Crispy skin-on russet potato fries tossed in aromatic black truffle oil, freshly grated pecorino parmesan, and rosemary.',
    img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    basePrice: 6.99,
    rating: 4.88,
    reviews: 175,
    prepTime: 8,
    cals: 260,
    ingredients: ['Russet Potatoes', 'Truffle Oil', 'Pecorino Parmesan', 'Rosemary'],
    isVeg: true,
    isPopular: true,
  },
  {
    id: 'f7',
    name: 'Creamy Truffle Fettuccine Alfredo',
    category: 'pasta',
    desc: 'Fresh handmade pasta ribbons tossed in silky garlic cream parmesan sauce, sautéed cremini mushrooms, and Italian parsley.',
    img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=500&auto=format&fit=crop&q=80',
    basePrice: 13.50,
    rating: 4.8,
    reviews: 190,
    prepTime: 15,
    cals: 380,
    ingredients: ['Handmade Fettuccine', 'Heavy Cream', 'Parmesan', 'Garlic', 'Truffle Glaze'],
    isVeg: true,
  },
  {
    id: 'f8',
    name: 'Garden Veggie Supreme Pizza',
    category: 'pizza',
    desc: 'Portobello mushrooms, sweet bell peppers, red onions, Kalamata olives, cherry tomatoes, and baby spinach over garlic cream.',
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
    basePrice: 13.99,
    rating: 4.75,
    reviews: 160,
    prepTime: 15,
    cals: 240,
    ingredients: ['Portobello', 'Bell Peppers', 'Red Onion', 'Kalamata Olives', 'Spinach'],
    isVeg: true,
  },
  {
    id: 'f9',
    name: 'Fiery Mexican Diablo Pizza',
    category: 'pizza',
    desc: 'Spicy ground chorizo, jalapeño rings, chili flakes, red onions, sweet corn, and pepper jack cheese with chipotle drizzle.',
    img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500&auto=format&fit=crop&q=80',
    basePrice: 16.20,
    rating: 4.82,
    reviews: 240,
    prepTime: 20,
    cals: 330,
    ingredients: ['Chorizo', 'Jalapeño', 'Chipotle Sauce', 'Sweet Corn', 'Pepper Jack'],
    isSpicy: true,
    isPopular: true,
  },
  {
    id: 'f10',
    name: 'Classic Crispy Club Sandwich',
    category: 'sandwich',
    desc: 'Triple-decker toasted artisan sourdough with smoked turkey breast, crispy bacon, avocado, lettuce, tomato, and garlic aioli.',
    img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    basePrice: 10.99,
    rating: 4.78,
    reviews: 145,
    prepTime: 10,
    cals: 410,
    ingredients: ['Turkey Breast', 'Crispy Bacon', 'Avocado', 'Sourdough', 'Aioli'],
  },
  {
    id: 'f11',
    name: 'Spicy Teriyaki Ramen Bowl',
    category: 'asian',
    desc: 'Slow-cooked rich tonkotsu broth, wavy wheat noodles, glazed chicken chashu, soft-boiled ajitsuke egg, and chili garlic oil.',
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    basePrice: 14.50,
    rating: 4.9,
    reviews: 265,
    prepTime: 15,
    cals: 420,
    ingredients: ['Ramen Noodles', 'Tonkotsu Broth', 'Chicken Chashu', 'Ramen Egg', 'Chili Oil'],
    isSpicy: true,
    isPopular: true,
  },
  {
    id: 'f12',
    name: 'Molten Lava Belgian Chocolate Cake',
    category: 'desserts',
    desc: 'Warm Belgian dark chocolate cake with flowing liquid fudge core, served with a scoop of Madagascar vanilla bean gelato.',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
    basePrice: 6.99,
    rating: 4.96,
    reviews: 310,
    prepTime: 8,
    cals: 380,
    ingredients: ['Belgian Chocolate', 'Molten Fudge', 'Vanilla Gelato'],
    isVeg: true,
    isPopular: true,
  },
  {
    id: 'f13',
    name: 'Fresh Italian Wild Berry Mojito',
    category: 'drinks',
    desc: 'Sparkling mineral water infused with crushed strawberries, wild raspberries, fresh mint leaves, and a splash of lime juice.',
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
    basePrice: 4.99,
    rating: 4.7,
    reviews: 95,
    prepTime: 5,
    cals: 90,
    ingredients: ['Fresh Berries', 'Mint Leaves', 'Lime Juice', 'Sparkling Soda'],
    isVeg: true,
  },
  {
    id: 'f14',
    name: 'Family Feast Combo Box',
    category: 'deals',
    desc: 'Includes 1 Large Pizza of choice, 1 Smash Cheeseburger, 1 portion Truffle Fries, and 2 Fresh Berry Drinks.',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    basePrice: 28.99,
    rating: 4.94,
    reviews: 410,
    prepTime: 22,
    cals: 850,
    ingredients: ['Large Pizza', 'Smash Burger', 'Truffle Fries', '2 Drinks'],
    isPopular: true,
  },
];

const PIZZA_SIZES = [
  { id: 'small', name: 'Small', inches: '10" (6 slices)', extra: 0.0 },
  { id: 'medium', name: 'Medium', inches: '12" (8 slices)', extra: 3.50 },
  { id: 'large', name: 'Large', inches: '14" (10 slices)', extra: 6.00 },
];

const CRUST_OPTIONS = [
  { name: 'Classic Hand Tossed', desc: 'Crispy stone-baked base', extra: 0.0 },
  { name: 'Thin & Crispy', desc: 'Ultra crunchy gourmet crust', extra: 1.50 },
  { name: 'Cheese Burst', desc: 'Stuffed with molten mozzarella', extra: 3.00 },
  { name: 'Garlic Herb Butter', desc: 'Infused with roasted garlic', extra: 2.50 },
];

const TOPPING_OPTIONS = [
  { id: 't1', name: 'Extra Mozzarella', price: 1.50, icon: '🧀' },
  { id: 't2', name: 'Crisp Pepperoni', price: 2.00, icon: '🥩' },
  { id: 't3', name: 'Portobello Mushrooms', price: 1.20, icon: '🍄' },
  { id: 't4', name: 'Black Olives', price: 1.00, icon: '🫒' },
  { id: 't5', name: 'Spicy Jalapeños', price: 1.00, icon: '🌶️' },
  { id: 't6', name: 'Grilled Chicken', price: 2.50, icon: '🍗' },
  { id: 't7', name: 'Fresh Sweet Basil', price: 0.80, icon: '🌿' },
];

// --- 2. GLOBAL STATE STORE ---
const state = {
  user: {
    isLoggedIn: true, // Default mock logged in state
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  activeCategory: 'all',
  searchQuery: '',
  favorites: new Set(['f1', 'f2', 'f3', 'f6']),
  cart: [],
  appliedCoupon: null,
  addresses: [
    { id: 'a1', title: 'Home', full: '742 Evergreen Terrace, Apt 4B, Brooklyn, NY', phone: '+1 555 987-6543', isDefault: true },
    { id: 'a2', title: 'Work', full: '450 Lexington Ave, Suite 1800, New York, NY', phone: '+1 555 432-1098', isDefault: false },
  ],
  selectedAddressId: 'a1',
  orders: [
    {
      id: 'ord_101',
      orderNum: 'FD-8492',
      items: [{ name: 'Double Pepperoni Feast', size: 'Medium (12")', qty: 1, price: 18.99 }],
      total: 21.49,
      status: 'Out for Delivery',
      step: 2,
      date: 'Today, 20 mins ago',
      driver: 'Alex Rodriguez',
      driverPhone: '+1 (555) 234-8901',
    },
    {
      id: 'ord_102',
      orderNum: 'FD-7821',
      items: [{ name: 'Smash Angus Cheeseburger', size: 'Regular', qty: 2, price: 23.98 }, { name: 'Truffle Fries', size: 'Standard', qty: 1, price: 6.99 }],
      total: 30.97,
      status: 'Delivered',
      step: 3,
      date: 'Aug 25, 2026',
      driver: 'Marco Bellini',
    }
  ],
  activeTrackingOrder: null,
  // Customizer state
  activeDetailFood: null,
  selectedSize: 'small',
  selectedCrustIndex: 0,
  selectedToppingIds: new Set(),
  detailQty: 1,
  // Filters
  filterVeg: false,
  filterSpicy: false,
  filterMaxPrice: 35,
  filterMinRating: 0,
};

// --- 3. APP INITIALIZATION & FLOW ---

document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  setupOnboarding();
  renderCategories();
  renderHomeFoods();
  updateWishlistBadges();
  updateCartCounters();
  setupGlobalEvents();
});

function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const onboarding = document.getElementById('onboarding-screen');
  const mainApp = document.getElementById('main-app-container');

  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.classList.add('hidden');
      // Show onboarding if first time, or show main app
      const seenOnboarding = localStorage.getItem('foodie_seen_onboard');
      if (seenOnboarding) {
        mainApp.classList.remove('hidden');
      } else {
        onboarding.classList.remove('hidden');
      }
    }, 450);
  }, 1600);
}

function setupOnboarding() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.onboarding-slide');
  const dots = document.querySelectorAll('.pagination-dots .p-dot');
  const btnNext = document.getElementById('btn-onboarding-next');
  const btnSkip = document.getElementById('btn-skip-onboarding');

  function showSlide(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    if (idx === slides.length - 1) {
      btnNext.textContent = 'Get Started 🍔';
    } else {
      btnNext.textContent = 'Next →';
    }
  }

  function finishOnboarding() {
    localStorage.setItem('foodie_seen_onboard', 'true');
    document.getElementById('onboarding-screen').classList.add('hidden');
    document.getElementById('main-app-container').classList.remove('hidden');
    showToast('Welcome to Foodie! Start discovering delicious meals.');
  }

  btnNext?.addEventListener('click', () => {
    currentSlide++;
    if (currentSlide >= slides.length) {
      finishOnboarding();
    } else {
      showSlide(currentSlide);
    }
  });

  btnSkip?.addEventListener('click', finishOnboarding);
}

// --- 4. NAVIGATION & VIEWS ---

function navigateToPage(pageName) {
  // Update desktop navigation links
  document.querySelectorAll('.desktop-nav-links .nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-nav') === pageName);
  });

  // Update mobile bottom nav buttons
  document.querySelectorAll('.mobile-bottom-nav .mob-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-nav') === pageName);
  });

  // Switch active page view
  document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));

  if (pageName === 'home') document.getElementById('view-home').classList.add('active');
  else if (pageName === 'search') {
    document.getElementById('view-search').classList.add('active');
    renderSearchResults();
  }
  else if (pageName === 'wishlist') {
    document.getElementById('view-wishlist').classList.add('active');
    renderWishlist();
  }
  else if (pageName === 'orders') {
    document.getElementById('view-orders').classList.add('active');
    renderOrdersList('all');
  }
  else if (pageName === 'chat') document.getElementById('view-chat').classList.add('active');
  else if (pageName === 'profile') document.getElementById('view-profile').classList.add('active');
  else if (pageName === 'cart') openCartDrawer();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 5. CATEGORIES & FOOD ITEMS RENDERING ---

function renderCategories() {
  const track = document.getElementById('category-scroll-track');
  const chipsTrack = document.getElementById('search-chips-track');
  if (!track) return;

  track.innerHTML = `
    <button class="category-card-btn ${state.activeCategory === 'all' ? 'active' : ''}" onclick="selectCategoryFilter('all')">
      <span class="cat-icon">🔥</span>
      <span class="cat-name">All Foods</span>
    </button>
  ` + CATEGORIES.map(cat => `
    <button class="category-card-btn ${state.activeCategory === cat.id ? 'active' : ''}" onclick="selectCategoryFilter('${cat.id}')">
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-name">${cat.name}</span>
    </button>
  `).join('');

  if (chipsTrack) {
    chipsTrack.innerHTML = `
      <button class="filter-tag-pill ${state.activeCategory === 'all' ? 'active' : ''}" onclick="selectCategoryFilter('all')">🔥 All</button>
    ` + CATEGORIES.map(cat => `
      <button class="filter-tag-pill ${state.activeCategory === cat.id ? 'active' : ''}" onclick="selectCategoryFilter('${cat.id}')">${cat.icon} ${cat.name}</button>
    `).join('');
  }
}

function selectCategoryFilter(catId) {
  state.activeCategory = catId;
  renderCategories();
  renderHomeFoods();
  renderSearchResults();

  const title = document.getElementById('food-grid-title');
  if (title) {
    if (catId === 'all') title.textContent = 'Popular Near You 🔥';
    else {
      const cat = CATEGORIES.find(c => c.id === catId);
      title.textContent = `${cat ? cat.name : catId} Menu`;
    }
  }
}

function getFilteredFoods() {
  return FOOD_ITEMS.filter(item => {
    if (state.activeCategory !== 'all' && item.category !== state.activeCategory) return false;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.desc.toLowerCase().includes(q);
      const matchIng = item.ingredients.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIng) return false;
    }
    if (state.filterVeg && !item.isVeg) return false;
    if (state.filterSpicy && !item.isSpicy) return false;
    if (item.basePrice > state.filterMaxPrice) return false;
    if (item.rating < state.filterMinRating) return false;
    return true;
  });
}

function renderHomeFoods() {
  const grid = document.getElementById('home-food-grid');
  if (!grid) return;

  const items = getFilteredFoods();
  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px 20px;">
        <div style="font-size:46px;">🍔</div>
        <h3 style="margin-top:10px;">No meals found</h3>
        <p style="color:var(--text-muted); font-size:13px; margin:4px 0 16px;">Try adjusting your categories or price filters.</p>
        <button class="btn-primary" onclick="resetAllFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="food-card" onclick="openFoodDetailModal('${item.id}')">
      <div class="food-card-thumb-wrap">
        <img class="food-card-thumb" src="${item.img}" alt="${item.name}" loading="lazy">
        <button class="btn-card-fav-heart" onclick="event.stopPropagation(); toggleWishlistFavorite('${item.id}')">
          ${state.favorites.has(item.id) ? '❤️' : '🤍'}
        </button>
        ${item.isVeg ? '<span class="food-card-diet-tag veg">🌱 Veg</span>' : ''}
        ${item.isSpicy ? '<span class="food-card-diet-tag spicy">🌶️ Spicy</span>' : ''}
      </div>
      <div class="food-card-title">${item.name}</div>
      <div class="food-card-desc">${item.desc}</div>
      <div class="food-card-rating-line">
        <span class="star">⭐</span>
        <strong>${item.rating.toFixed(1)}</strong>
        <span class="meta-time">• ${item.prepTime} mins</span>
      </div>
      <div class="food-card-bottom">
        <div class="food-card-price">$${item.basePrice.toFixed(2)}</div>
        <button class="btn-card-add-food" onclick="event.stopPropagation(); quickAddFoodToCart('${item.id}')" title="Quick Add">+</button>
      </div>
    </div>
  `).join('');
}

// --- 6. FOOD DETAIL & PIZZA SIZE MORPHING INTERACTION ---

function openFoodDetailModal(foodId) {
  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  state.activeDetailFood = food;
  state.selectedSize = 'small';
  state.selectedCrustIndex = 0;
  state.selectedToppingIds.clear();
  state.detailQty = 1;

  document.getElementById('detail-food-img').src = food.img;
  document.getElementById('detail-food-name').textContent = food.name;
  document.getElementById('detail-food-rating').textContent = food.rating.toFixed(1);
  document.getElementById('detail-food-reviews').textContent = `(${food.reviews} reviews)`;
  document.getElementById('detail-time-pill').textContent = `⏱️ ${food.prepTime} mins`;
  document.getElementById('detail-cals-pill').textContent = `🔥 ${food.cals} kcal`;
  document.getElementById('detail-tag-pill').textContent = food.isVeg ? '🌱 Vegetarian' : food.isSpicy ? '🌶️ Spicy' : '⭐ Foodie Special';
  document.getElementById('detail-food-desc').textContent = food.desc;
  document.getElementById('btn-detail-fav-toggle').textContent = state.favorites.has(food.id) ? '❤️' : '🤍';

  // Sizing Wrapper Reset
  const morphWrapper = document.getElementById('food-morph-wrapper');
  morphWrapper.className = 'food-morph-wrapper size-small';

  // Render Ingredients
  const ingList = document.getElementById('detail-ingredients-list');
  ingList.innerHTML = food.ingredients.map(ing => `<span class="ing-tag">${ing}</span>`).join('');

  // Reset Size Cards
  document.querySelectorAll('.size-pill-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-size') === 'small');
  });

  // Render Crusts
  const crustGroup = document.getElementById('detail-crust-options');
  crustGroup.innerHTML = CRUST_OPTIONS.map((c, idx) => `
    <div class="crust-item-row ${idx === 0 ? 'active' : ''}" onclick="selectFoodCrust(${idx})">
      <div>
        <strong>${c.name}</strong>
        <p style="font-size:11.5px; color:var(--text-muted);">${c.desc}</p>
      </div>
      <span style="font-weight:800; font-size:12.5px;">${c.extra > 0 ? `+$${c.extra.toFixed(2)}` : 'Free'}</span>
    </div>
  `).join('');

  // Render Toppings
  const toppingsGroup = document.getElementById('detail-toppings-options');
  toppingsGroup.innerHTML = TOPPING_OPTIONS.map(t => `
    <button type="button" class="topping-btn" id="top-btn-${t.id}" onclick="toggleDetailTopping('${t.id}')">
      <span>${t.icon}</span> ${t.name} (+$${t.price.toFixed(2)})
    </button>
  `).join('');

  updateDetailDynamicPrice();
  document.getElementById('modal-food-detail').classList.add('active');
}

function closeFoodDetailModal() {
  document.getElementById('modal-food-detail').classList.remove('active');
}

// CRUCIAL: Pizza Size Interaction (Small, Medium, Large scaling without overflow)
function selectFoodSize(sizeId) {
  state.selectedSize = sizeId;

  // Update Size Pills Active Class
  document.querySelectorAll('.size-pill-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-size') === sizeId);
  });

  // Morph Food Image Size Smoothly
  const morphWrapper = document.getElementById('food-morph-wrapper');
  morphWrapper.className = `food-morph-wrapper size-${sizeId}`;

  updateDetailDynamicPrice();
}

function selectFoodCrust(idx) {
  state.selectedCrustIndex = idx;
  document.querySelectorAll('#detail-crust-options .crust-item-row').forEach((row, i) => {
    row.classList.toggle('active', i === idx);
  });
  updateDetailDynamicPrice();
}

function toggleDetailTopping(toppingId) {
  if (state.selectedToppingIds.has(toppingId)) {
    state.selectedToppingIds.delete(toppingId);
  } else {
    state.selectedToppingIds.add(toppingId);
  }
  const btn = document.getElementById(`top-btn-${toppingId}`);
  if (btn) btn.classList.toggle('active', state.selectedToppingIds.has(toppingId));
  updateDetailDynamicPrice();
}

function updateDetailDynamicPrice() {
  if (!state.activeDetailFood) return;
  const base = state.activeDetailFood.basePrice;
  const sizeObj = PIZZA_SIZES.find(s => s.id === state.selectedSize) || PIZZA_SIZES[0];
  const crustObj = CRUST_OPTIONS[state.selectedCrustIndex];
  let toppingsExtra = 0;
  state.selectedToppingIds.forEach(id => {
    const t = TOPPING_OPTIONS.find(x => x.id === id);
    if (t) toppingsExtra += t.price;
  });

  const unitPrice = base + sizeObj.extra + crustObj.extra + toppingsExtra;
  const totalPrice = unitPrice * state.detailQty;

  document.getElementById('detail-dynamic-price').textContent = `$${unitPrice.toFixed(2)}`;
  document.getElementById('detail-qty-count').textContent = state.detailQty;
  document.getElementById('detail-btn-total-price').textContent = `$${totalPrice.toFixed(2)}`;
}

// Add Customized Item to Cart
function addDetailCustomizedItemToCart() {
  if (!state.activeDetailFood) return;
  const sizeObj = PIZZA_SIZES.find(s => s.id === state.selectedSize) || PIZZA_SIZES[0];
  const crustObj = CRUST_OPTIONS[state.selectedCrustIndex];
  const toppings = Array.from(state.selectedToppingIds).map(id => TOPPING_OPTIONS.find(t => t.id === id));
  const notes = document.getElementById('detail-special-notes').value.trim();

  let unitPrice = state.activeDetailFood.basePrice + sizeObj.extra + crustObj.extra;
  toppings.forEach(t => unitPrice += t.price);

  state.cart.push({
    id: `cart_${Date.now()}`,
    food: state.activeDetailFood,
    size: sizeObj,
    crust: crustObj,
    toppings: toppings,
    qty: state.detailQty,
    unitPrice: unitPrice,
    notes: notes,
  });

  closeFoodDetailModal();
  updateCartCounters();
  showToast(`Added ${state.detailQty}× ${state.activeDetailFood.name} to your Cart! 🛍️`);
}

function quickAddFoodToCart(foodId) {
  const item = FOOD_ITEMS.find(f => f.id === foodId);
  if (!item) return;

  state.cart.push({
    id: `cart_${Date.now()}`,
    food: item,
    size: PIZZA_SIZES[0],
    crust: CRUST_OPTIONS[0],
    toppings: [],
    qty: 1,
    unitPrice: item.basePrice,
    notes: '',
  });

  updateCartCounters();
  showToast(`Added ${item.name} to Cart! 🍔`);
}

function updateCartCounters() {
  const totalCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const hBadge = document.getElementById('header-cart-count');
  const mBadge = document.getElementById('mob-cart-badge');
  if (hBadge) hBadge.textContent = totalCount;
  if (mBadge) mBadge.textContent = totalCount;
}

// --- 7. CART DRAWER & PRICING ---

function openCartDrawer() {
  renderCartDrawerItems();
  document.getElementById('drawer-cart').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('drawer-cart').classList.remove('active');
}

function renderCartDrawerItems() {
  const list = document.getElementById('cart-drawer-items-list');
  const footer = document.getElementById('cart-drawer-footer');
  if (!list) return;

  if (state.cart.length === 0) {
    list.innerHTML = `
      <div style="text-align:center; padding: 50px 20px;">
        <div style="font-size:52px;">🛍️</div>
        <h3 style="margin-top:14px;">Your Cart is Empty</h3>
        <p style="color:var(--text-muted); font-size:13px; margin:6px 0 18px;">Explore the menu and add your favorite meals!</p>
        <button class="btn-primary" onclick="closeCartDrawer(); navigateToPage('home')">Browse Menu</button>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  list.innerHTML = state.cart.map(item => `
    <div class="cart-card-item">
      <img src="${item.food.img}" alt="${item.food.name}">
      <div class="cart-card-info">
        <div class="cart-title-row">
          <span>${item.food.name}</span>
          <button style="border:none; background:none; color:var(--accent-red); cursor:pointer; font-weight:800;" onclick="removeCartDrawerItem('${item.id}')">✕</button>
        </div>
        <div class="cart-card-opts">${item.size.name} • ${item.crust.name}</div>
        ${item.toppings.length > 0 ? `<div style="font-size:11px; color:var(--foodie-amber-dark); font-weight:700;">+ ${item.toppings.map(t => t.name).join(', ')}</div>` : ''}
        <div class="cart-card-bottom">
          <strong style="font-size:15px;">$${(item.unitPrice * item.qty).toFixed(2)}</strong>
          <div class="stepper-controller">
            <button class="btn-step" onclick="changeCartDrawerQty('${item.id}', -1)">-</button>
            <span class="step-num">${item.qty}</span>
            <button class="btn-step plus" onclick="changeCartDrawerQty('${item.id}', 1)">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  renderDrawerBill();
}

function changeCartDrawerQty(itemId, delta) {
  const item = state.cart.find(i => i.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(i => i.id !== itemId);
  }
  updateCartCounters();
  renderCartDrawerItems();
}

function removeCartDrawerItem(itemId) {
  state.cart = state.cart.filter(i => i.id !== itemId);
  updateCartCounters();
  renderCartDrawerItems();
  showToast('Item removed from cart');
}

function renderDrawerBill() {
  const summaryBox = document.getElementById('drawer-bill-summary');
  if (!summaryBox) return;

  const subtotal = state.cart.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);
  const deliveryFee = subtotal >= 35 || state.appliedCoupon === 'FREESHIP' ? 0.0 : 3.99;
  let discount = 0;
  if (state.appliedCoupon === 'FOODIE50') discount = subtotal * 0.5;
  if (state.appliedCoupon === 'WELCOME20') discount = subtotal * 0.2;
  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  summaryBox.innerHTML = `
    <div class="bill-line-row"><span>Subtotal:</span><strong>$${subtotal.toFixed(2)}</strong></div>
    <div class="bill-line-row"><span>Delivery Fee:</span><strong style="color:${deliveryFee === 0 ? 'var(--accent-green)' : 'inherit'}">${deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</strong></div>
    ${discount > 0 ? `<div class="bill-line-row" style="color:var(--accent-green);"><span>Discount (${state.appliedCoupon}):</span><strong>-$${discount.toFixed(2)}</strong></div>` : ''}
    <div class="bill-line-row"><span>Estimated Tax (8%):</span><strong>$${tax.toFixed(2)}</strong></div>
    <div class="bill-line-row total"><span>Total to Pay:</span><strong style="color:var(--foodie-amber-dark); font-size:18px;">$${total.toFixed(2)}</strong></div>
  `;
}

function handleApplyCoupon() {
  const input = document.getElementById('drawer-coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (code === 'FOODIE50' || code === 'WELCOME20' || code === 'FREESHIP') {
    state.appliedCoupon = code;
    renderDrawerBill();
    showToast(`Coupon "${code}" applied successfully! 🎉`);
  } else {
    showToast('Invalid coupon code. Try FOODIE50 or WELCOME20');
  }
}

// --- 8. AUTHENTICATION-BASED ORDERING RULE ---

function handleProceedToCheckout() {
  // CRITICAL RULE: A user must be logged in before placing an order.
  if (!state.user.isLoggedIn) {
    closeCartDrawer();
    openAuthModal('Please sign in or create an account to proceed with your order.');
    return;
  }

  closeCartDrawer();
  openCheckoutModal();
}

function openAuthModal(customMessage) {
  if (customMessage) {
    document.getElementById('auth-main-subtext').textContent = customMessage;
  }
  document.getElementById('modal-auth').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('modal-auth').classList.remove('active');
}

// --- 9. CHECKOUT & ORDER SUBMISSION ---

function openCheckoutModal() {
  renderCheckoutAddresses();
  renderCheckoutSummary();
  document.getElementById('modal-checkout').classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('modal-checkout').classList.remove('active');
}

function renderCheckoutAddresses() {
  const container = document.getElementById('checkout-address-options');
  if (!container) return;

  container.innerHTML = state.addresses.map(a => `
    <div class="crust-item-row ${a.id === state.selectedAddressId ? 'active' : ''}" onclick="selectCheckoutAddress('${a.id}')">
      <div>
        <strong>📍 ${a.title} ${a.isDefault ? '<span style="font-size:10px; background:var(--foodie-yellow); padding:2px 6px; border-radius:4px;">Default</span>' : ''}</strong>
        <p style="font-size:12px; color:var(--text-muted);">${a.full}</p>
      </div>
      <span>${a.id === state.selectedAddressId ? '✓' : ''}</span>
    </div>
  `).join('');
}

function selectCheckoutAddress(addrId) {
  state.selectedAddressId = addrId;
  renderCheckoutAddresses();
}

function renderCheckoutSummary() {
  const prev = document.getElementById('checkout-items-preview');
  const bill = document.getElementById('checkout-bill-breakdown');
  if (!prev || !bill) return;

  prev.innerHTML = state.cart.map(i => `
    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
      <span>${i.qty}× ${i.food.name} (${i.size.name})</span>
      <strong>$${(i.unitPrice * i.qty).toFixed(2)}</strong>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);
  const deliveryFee = subtotal >= 35 || state.appliedCoupon === 'FREESHIP' ? 0.0 : 3.99;
  let discount = 0;
  if (state.appliedCoupon === 'FOODIE50') discount = subtotal * 0.5;
  if (state.appliedCoupon === 'WELCOME20') discount = subtotal * 0.2;
  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  bill.innerHTML = `
    <div style="border-top: 1px solid var(--border-light); padding-top: 10px; margin-top: 8px;">
      <div class="bill-line-row"><span>Total Amount to Pay:</span><strong style="color:var(--foodie-amber-dark); font-size:16px;">$${total.toFixed(2)}</strong></div>
    </div>
  `;

  document.getElementById('checkout-final-total-btn').textContent = `$${total.toFixed(2)}`;
}

function handleFinalOrderSubmit() {
  if (state.cart.length === 0) return;

  const orderNum = `FD-${Math.floor(1000 + Math.random() * 9000)}`;
  const subtotal = state.cart.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);
  const total = parseFloat(document.getElementById('checkout-final-total-btn').textContent.replace('$', ''));
  const addr = state.addresses.find(a => a.id === state.selectedAddressId) || state.addresses[0];

  const newOrder = {
    id: `ord_${Date.now()}`,
    orderNum: orderNum,
    items: state.cart.map(i => ({ name: i.food.name, size: i.size.name, qty: i.qty, price: i.unitPrice * i.qty })),
    total: total,
    status: 'Order Confirmed',
    step: 0,
    date: 'Just now',
    driver: 'Alex Rodriguez',
    driverPhone: '+1 (555) 234-8901',
    address: addr.full,
  };

  state.orders.unshift(newOrder);
  state.activeTrackingOrder = newOrder;
  state.cart = [];
  state.appliedCoupon = null;
  updateCartCounters();

  closeCheckoutModal();

  // Show Success Modal
  document.getElementById('success-order-num-text').textContent = `#${orderNum}`;
  document.getElementById('success-order-receipt-box').innerHTML = `
    <div style="font-size:13.5px; font-weight:800; margin-bottom:6px;">Order Summary:</div>
    ${newOrder.items.map(i => `<div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;"><span>${i.qty}× ${i.name}</span><strong>$${i.price.toFixed(2)}</strong></div>`).join('')}
    <div style="display:flex; justify-content:space-between; font-size:14px; font-weight:900; border-top:1px solid var(--border-light); padding-top:6px; margin-top:6px;"><span>Total:</span><span style="color:var(--foodie-amber-dark);">$${total.toFixed(2)}</span></div>
  `;
  document.getElementById('modal-order-success').classList.add('active');

  // Trigger simulated live GPS tracking advancement
  simulateOrderProgression(newOrder.id);
}

function closeOrderSuccessModal() {
  document.getElementById('modal-order-success').classList.remove('active');
  navigateToPage('home');
}

// --- 10. LIVE GPS ORDER TRACKING SIMULATION ---

function simulateOrderProgression(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  setTimeout(() => {
    order.status = 'Preparing & Baking';
    order.step = 1;
    updateLiveTrackingUI();
  }, 6000);

  setTimeout(() => {
    order.status = 'Out for Delivery';
    order.step = 2;
    updateLiveTrackingUI();
  }, 14000);

  setTimeout(() => {
    order.status = 'Delivered';
    order.step = 3;
    updateLiveTrackingUI();
  }, 24000);
}

function openLiveTrackingModal(orderId) {
  const order = state.orders.find(o => o.id === orderId) || state.orders[0];
  state.activeTrackingOrder = order;
  updateLiveTrackingUI();
  document.getElementById('modal-order-success').classList.remove('active');
  document.getElementById('modal-order-tracking').classList.add('active');
}

function closeTrackingModal() {
  document.getElementById('modal-order-tracking').classList.remove('active');
}

function updateLiveTrackingUI() {
  const order = state.activeTrackingOrder;
  if (!order) return;

  document.getElementById('tracking-modal-order-id').textContent = `Track #${order.orderNum}`;
  document.getElementById('tracking-live-status-pill').textContent = order.status;
  document.getElementById('tracking-driver-name').textContent = order.driver;

  const pin = document.getElementById('map-rider-pin');
  if (pin) {
    if (order.step === 0) { pin.style.top = '35px'; pin.style.left = '50px'; }
    else if (order.step === 1) { pin.style.top = '60px'; pin.style.left = '110px'; }
    else if (order.step === 2) { pin.style.top = '90px'; pin.style.left = '180px'; }
    else { pin.style.top = '120px'; pin.style.left = '250px'; }
  }

  for (let i = 0; i < 4; i++) {
    const el = document.getElementById(`t-step-${i}`);
    if (!el) continue;
    el.className = 't-step';
    if (i < order.step) el.classList.add('done');
    else if (i === order.step) el.classList.add('active');
  }
}

// --- 11. WISHLIST / FAVORITES ---

function toggleWishlistFavorite(foodId) {
  if (state.favorites.has(foodId)) {
    state.favorites.delete(foodId);
    showToast('Removed from your Wishlist');
  } else {
    state.favorites.add(foodId);
    showToast('Added to your Wishlist ❤️');
  }
  updateWishlistBadges();
  renderHomeFoods();
  renderSearchResults();
  renderWishlist();
}

function updateWishlistBadges() {
  const count = state.favorites.size;
  const navBadge = document.getElementById('badge-nav-favs');
  if (navBadge) navBadge.textContent = count;
}

function renderWishlist() {
  const container = document.getElementById('wishlist-content-area');
  if (!container) return;

  const favFoods = FOOD_ITEMS.filter(f => state.favorites.has(f.id));
  if (favFoods.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px;">
        <div style="font-size:52px;">❤️</div>
        <h3 style="margin-top:12px;">Your Wishlist is Empty</h3>
        <p style="color:var(--text-muted); font-size:13px; margin:6px 0 18px;">Click the heart icon on any meal to save it here for fast reordering.</p>
        <button class="btn-primary" onclick="navigateToPage('home')">Explore Food</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="food-items-grid">
      ${favFoods.map(item => `
        <div class="food-card" onclick="openFoodDetailModal('${item.id}')">
          <div class="food-card-thumb-wrap">
            <img class="food-card-thumb" src="${item.img}" alt="${item.name}">
            <button class="btn-card-fav-heart" onclick="event.stopPropagation(); toggleWishlistFavorite('${item.id}')">❤️</button>
          </div>
          <div class="food-card-title">${item.name}</div>
          <div class="food-card-desc">${item.desc}</div>
          <div class="food-card-bottom">
            <div class="food-card-price">$${item.basePrice.toFixed(2)}</div>
            <button class="btn-card-add-food" onclick="event.stopPropagation(); quickAddFoodToCart('${item.id}')">+</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// --- 12. SEARCH VIEW ---

function renderSearchResults() {
  const grid = document.getElementById('search-food-grid');
  const countText = document.getElementById('search-results-count-text');
  if (!grid) return;

  const items = getFilteredFoods();
  if (countText) countText.textContent = `Showing ${items.length} dishes`;

  grid.innerHTML = items.map(item => `
    <div class="food-card" onclick="openFoodDetailModal('${item.id}')">
      <div class="food-card-thumb-wrap">
        <img class="food-card-thumb" src="${item.img}" alt="${item.name}">
        <button class="btn-card-fav-heart" onclick="event.stopPropagation(); toggleWishlistFavorite('${item.id}')">
          ${state.favorites.has(item.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="food-card-title">${item.name}</div>
      <div class="food-card-bottom">
        <div class="food-card-price">$${item.basePrice.toFixed(2)}</div>
        <button class="btn-card-add-food" onclick="event.stopPropagation(); quickAddFoodToCart('${item.id}')">+</button>
      </div>
    </div>
  `).join('');
}

// --- 13. ORDERS VIEW ---

function renderOrdersList(filter) {
  const container = document.getElementById('orders-list-wrapper');
  if (!container) return;

  let list = state.orders;
  if (filter === 'active') list = list.filter(o => o.status !== 'Delivered');
  if (filter === 'completed') list = list.filter(o => o.status === 'Delivered');

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:50px 20px;">
        <div style="font-size:46px;">📋</div>
        <h3 style="margin-top:12px;">No Orders in this view</h3>
        <p style="color:var(--text-muted); font-size:13px; margin:6px 0 16px;">Place a delicious meal order now!</p>
        <button class="btn-primary" onclick="navigateToPage('home')">Order Now</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(order => `
    <div style="background:white; border:1.5px solid var(--border-light); border-radius:var(--radius-lg); padding:18px; margin-bottom:14px; box-shadow:var(--shadow-subtle);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size:16px;">#${order.orderNum}</strong>
        <span class="badge-vip" style="background:var(--foodie-yellow-soft); color:var(--text-dark);">${order.status}</span>
      </div>
      <div style="font-size:12px; color:var(--text-muted); margin:4px 0 12px;">${order.date}</div>
      <div style="font-size:13.5px; margin-bottom:14px;">
        ${order.items.map(i => `<div>${i.qty}× ${i.name}</div>`).join('')}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:12px;">
        <div>Total: <strong style="color:var(--foodie-amber-dark); font-size:16px;">$${order.total.toFixed(2)}</strong></div>
        <button class="btn-primary" style="padding:8px 16px; font-size:13px;" onclick="openLiveTrackingModal('${order.id}')">
          Track Live 🛵
        </button>
      </div>
    </div>
  `).join('');
}

// --- 14. CUSTOMER SUPPORT CHATBOT ---

function sendQuickChatMessage(text) {
  const input = document.getElementById('chat-input-text');
  if (input) {
    input.value = text;
    handleChatSubmit(new Event('submit'));
  }
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input-text');
  const feed = document.getElementById('chat-messages-feed');
  if (!input || !feed) return;

  const msg = input.value.trim();
  if (!msg) return;

  // Add User bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `<p>${msg}</p><span class="chat-time">Just now</span>`;
  feed.appendChild(userBubble);
  input.value = '';
  feed.scrollTop = feed.scrollHeight;

  // Automated friendly bot response
  setTimeout(() => {
    let reply = "Thanks for reaching out! Our Foodie team is currently looking into this for you.";
    const lower = msg.toLowerCase();

    if (lower.includes('order') || lower.includes('where')) {
      reply = `Your active order #FD-8492 is currently Out for Delivery with courier Alex Rodriguez. Estimated arrival is in 15-20 minutes! 🛵`;
    } else if (lower.includes('pizza') || lower.includes('recommend')) {
      reply = `We highly recommend our Double Pepperoni Feast or Margherita Classica! Handcrafted with stone-oven crusts. 🍕`;
    } else if (lower.includes('code') || lower.includes('coupon') || lower.includes('discount')) {
      reply = `You can use promo code FOODIE50 for 50% OFF your order or FREESHIP for zero delivery fee! 🏷️`;
    }

    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = `<p>${reply}</p><span class="chat-time">Just now</span>`;
    feed.appendChild(botBubble);
    feed.scrollTop = feed.scrollHeight;
  }, 700);
}

// --- 15. FILTER MODAL ---

function openFilterModal() {
  document.getElementById('modal-filter').classList.add('active');
}

function closeFilterModal() {
  document.getElementById('modal-filter').classList.remove('active');
}

function toggleVegFilter() {
  state.filterVeg = !state.filterVeg;
  document.getElementById('filter-veg-btn').classList.toggle('active', state.filterVeg);
}

function toggleSpicyFilter() {
  state.filterSpicy = !state.filterSpicy;
  document.getElementById('filter-spicy-btn').classList.toggle('active', state.filterSpicy);
}

function applyFiltersAndClose() {
  state.filterMaxPrice = parseFloat(document.getElementById('filter-price-slider').value);
  state.filterMinRating = parseFloat(document.getElementById('filter-rating-slider').value);
  closeFilterModal();
  renderHomeFoods();
  renderSearchResults();
  showToast('Filters updated!');
}

function resetAllFilters() {
  state.filterVeg = false;
  state.filterSpicy = false;
  state.filterMaxPrice = 35;
  state.filterMinRating = 0;
  state.searchQuery = '';
  state.activeCategory = 'all';

  document.getElementById('filter-veg-btn').classList.remove('active');
  document.getElementById('filter-spicy-btn').classList.remove('active');
  document.getElementById('filter-price-slider').value = 35;
  document.getElementById('filter-max-price-label').textContent = '$35.00';
  document.getElementById('filter-rating-slider').value = 0;
  document.getElementById('filter-min-rating-label').textContent = 'Any Rating';

  closeFilterModal();
  renderCategories();
  renderHomeFoods();
  renderSearchResults();
}

// --- 16. TOAST HELPER ---

function showToast(message) {
  const toast = document.getElementById('toast-box');
  if (!toast) return;
  toast.innerHTML = `<span>🍔</span> ${message}`;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 2400);
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

function handleForgotPassword(e) {
  e.preventDefault();
  showToast('Password reset link sent to your registered email!');
}

// --- 17. GLOBAL EVENT LISTENERS ---

function setupGlobalEvents() {
  // Navigation Links (Desktop & Mobile)
  document.querySelectorAll('.nav-link, .mob-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-nav');
      if (target) navigateToPage(target);
    });
  });

  // Header icon shortcuts
  document.getElementById('brand-home-link')?.addEventListener('click', () => navigateToPage('home'));
  document.getElementById('btn-header-search')?.addEventListener('click', () => navigateToPage('search'));
  document.getElementById('btn-header-chat')?.addEventListener('click', () => navigateToPage('chat'));
  document.getElementById('btn-header-cart')?.addEventListener('click', openCartDrawer);
  document.getElementById('btn-header-avatar')?.addEventListener('click', () => navigateToPage('profile'));
  document.getElementById('btn-see-all-foods')?.addEventListener('click', () => navigateToPage('search'));

  // Hero Search trigger
  document.getElementById('hero-search-input')?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    navigateToPage('search');
    const dInput = document.getElementById('dedicated-search-input');
    if (dInput) dInput.value = state.searchQuery;
    renderSearchResults();
  });

  // Dedicated search input
  document.getElementById('dedicated-search-input')?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderSearchResults();
    document.getElementById('search-suggestions-box').style.display = state.searchQuery ? 'none' : 'block';
  });

  document.getElementById('btn-clear-search-view')?.addEventListener('click', () => {
    const input = document.getElementById('dedicated-search-input');
    if (input) input.value = '';
    state.searchQuery = '';
    renderSearchResults();
    document.getElementById('search-suggestions-box').style.display = 'block';
  });

  document.querySelectorAll('.craving-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-val');
      const input = document.getElementById('dedicated-search-input');
      if (input) input.value = val;
      state.searchQuery = val;
      renderSearchResults();
      document.getElementById('search-suggestions-box').style.display = 'none';
    });
  });

  // Promo claim
  document.getElementById('btn-claim-promo-code')?.addEventListener('click', () => {
    state.appliedCoupon = 'FOODIE50';
    showToast('Promo code "FOODIE50" applied! 50% discount activated.');
    openCartDrawer();
  });

  // Food detail stepper
  document.getElementById('btn-detail-qty-plus')?.addEventListener('click', () => {
    state.detailQty++;
    updateDetailDynamicPrice();
  });
  document.getElementById('btn-detail-qty-minus')?.addEventListener('click', () => {
    if (state.detailQty > 1) {
      state.detailQty--;
      updateDetailDynamicPrice();
    }
  });
  document.getElementById('btn-detail-add-cart')?.addEventListener('click', addDetailCustomizedItemToCart);
  document.getElementById('btn-detail-fav-toggle')?.addEventListener('click', () => {
    if (state.activeDetailFood) {
      toggleWishlistFavorite(state.activeDetailFood.id);
      document.getElementById('btn-detail-fav-toggle').textContent = state.favorites.has(state.activeDetailFood.id) ? '❤️' : '🤍';
    }
  });

  // Cart actions
  document.getElementById('btn-clear-entire-cart')?.addEventListener('click', () => {
    state.cart = [];
    state.appliedCoupon = null;
    updateCartCounters();
    renderCartDrawerItems();
  });
  document.getElementById('btn-cart-proceed-checkout')?.addEventListener('click', handleProceedToCheckout);

  // Checkout actions
  document.getElementById('btn-submit-final-order')?.addEventListener('click', handleFinalOrderSubmit);
  document.getElementById('btn-success-track-live')?.addEventListener('click', () => {
    if (state.activeTrackingOrder) openLiveTrackingModal(state.activeTrackingOrder.id);
  });

  // Filters Modal
  document.getElementById('btn-open-filter-modal')?.addEventListener('click', openFilterModal);
  document.getElementById('filter-price-slider')?.addEventListener('input', (e) => {
    document.getElementById('filter-max-price-label').textContent = `$${parseFloat(e.target.value).toFixed(2)}`;
  });
  document.getElementById('filter-rating-slider')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('filter-min-rating-label').textContent = val > 0 ? `${val.toFixed(1)}+ ⭐` : 'Any Rating';
  });

  // Orders tab filter buttons
  document.querySelectorAll('.order-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderOrdersList(btn.getAttribute('data-filter'));
    });
  });

  // Chat form submit
  document.getElementById('chat-input-form')?.addEventListener('submit', handleChatSubmit);

  // Auth toggle
  document.getElementById('btn-toggle-auth-mode')?.addEventListener('click', () => {
    const isLogin = !document.getElementById('form-auth-login').classList.contains('hidden');
    document.getElementById('form-auth-login').classList.toggle('hidden', isLogin);
    document.getElementById('form-auth-register').classList.toggle('hidden', !isLogin);
    document.getElementById('auth-main-heading').textContent = isLogin ? 'Create Foodie Account' : 'Welcome to Foodie';
    document.getElementById('auth-switch-text').textContent = isLogin ? 'Already have an account?' : 'Don’t have an account yet?';
    document.getElementById('btn-toggle-auth-mode').textContent = isLogin ? 'Sign In' : 'Create Account';
  });

  document.getElementById('form-auth-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.user.isLoggedIn = true;
    closeAuthModal();
    showToast('Signed in successfully! Welcome back, Alex.');
    openCheckoutModal();
  });

  document.getElementById('form-auth-register')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.user.isLoggedIn = true;
    closeAuthModal();
    showToast('Account created successfully! Welcome to Foodie.');
    openCheckoutModal();
  });

  document.getElementById('btn-profile-logout')?.addEventListener('click', () => {
    state.user.isLoggedIn = false;
    showToast('Logged out of Foodie.');
    navigateToPage('home');
  });
}
