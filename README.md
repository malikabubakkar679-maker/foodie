# 🍕 Crust & Co. — Complete Flutter Pizza Ordering App

A **production-grade, full-featured Flutter Pizza Ordering application** built with Material 3, clean multi-tier architecture, warm food-delivery design system, full state management (`Provider`), and complete end-to-end user journey.

---

## 📱 Features & Highlights

- **✨ Warm Pizza Design System**: Custom curated warm palette (`#FF5722` terracotta orange, golden cheese, soft cream background `#FBF9F6`), rounded card surfaces, and micro-interactions.
- **🍕 Circular Category Scroll**: Horizontally scrollable circular food categories (Pizza, Burgers, Pasta, Chicken, Drinks, Desserts) with selection highlight.
- **🔥 2-Column Responsive Product Grid**: Pizza cards with high-res food images, heart favorite toggle, rating, prep time, price, and floating (+) quick-add action.
- **🛠️ Multi-Level Customizer**:
  - Size selection: Small (10"), Medium (12"), Large (14") with live price differences.
  - Crust selection: Classic Hand Tossed, Thin & Crispy, Cheese Burst, Garlic Butter Crust.
  - Extra Toppings multi-select: Mozzarella, Pepperoni, Mushrooms, Olives, Jalapeños, Grilled Chicken, Fresh Basil with individual prices.
  - Special cooking instructions.
- **🛒 Dynamic Cart & Promo Codes**:
  - Live item quantity steppers and customized choices breakdown.
  - Realtime discount calculation with promo codes: `PIZZA50` (50% off), `CHEESE20` (20% off), `FREESHIP` (Free Delivery).
  - Bill breakdown (Subtotal, Delivery Fee, Tax, Discount, Total).
- **📦 Checkout & Address Management**:
  - Saved delivery addresses selector (Home, Work, Other) + Add/Edit address modal.
  - Delivery Timing (ASAP 25-35 mins vs Scheduled with time picker).
  - Multiple payment methods (Credit/Debit Card, Google/Apple Pay, Pizza Wallet, Cash on Delivery).
- **🛵 Live Order Tracking Simulation**:
  - Simulated real-time status timeline: `Order Placed` ➔ `Baking & Preparing` ➔ `Out for Delivery` ➔ `Delivered`.
  - Simulated GPS Delivery Map with moving driver pin.
  - Driver contact card with Call & Message actions.
- **📋 Order History & Instant Reorder**:
  - Tabbed status filters (All, Active, Past).
  - One-tap "Reorder Items" action and digital receipts.
- **❤️ Favorites Wishlist**:
  - Saved pizzas with instant cart ordering.
- **👤 Profile & Settings**:
  - User profile management, saved cards, push notification preferences, and currency/language options.

---

## 📂 Project Architecture

```text
lib/
├── main.dart
├── core/
│   ├── constants/
│   │   └── app_constants.dart
│   ├── theme/
│   │   ├── app_colors.dart
│   │   └── app_theme.dart
│   └── utils/
│       ├── currency_formatter.dart
│       └── custom_page_route.dart
├── data/
│   ├── mock_categories.dart
│   ├── mock_orders.dart
│   ├── mock_pizzas.dart
│   └── mock_promos.dart
├── models/
│   ├── address_model.dart
│   ├── cart_item.dart
│   ├── category_item.dart
│   ├── order_model.dart
│   ├── pizza_item.dart
│   └── user_model.dart
├── providers/
│   ├── address_provider.dart
│   ├── auth_provider.dart
│   ├── cart_provider.dart
│   ├── order_provider.dart
│   └── pizza_provider.dart
├── routes/
│   └── app_routes.dart
├── screens/
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── signup_screen.dart
│   ├── cart/
│   │   └── cart_screen.dart
│   ├── checkout/
│   │   └── checkout_screen.dart
│   ├── details/
│   │   └── pizza_details_screen.dart
│   ├── favorites/
│   │   └── favorites_screen.dart
│   ├── home/
│   │   └── home_screen.dart
│   ├── main_shell_screen.dart
│   ├── onboarding/
│   │   └── onboarding_screen.dart
│   ├── order/
│   │   ├── order_confirmation_screen.dart
│   │   ├── order_history_screen.dart
│   │   └── order_tracking_screen.dart
│   ├── profile/
│   │   ├── payment_methods_screen.dart
│   │   ├── profile_screen.dart
│   │   ├── saved_addresses_screen.dart
│   │   └── settings_screen.dart
│   ├── search/
│   │   └── search_screen.dart
│   └── splash/
│       └── splash_screen.dart
└── widgets/
    ├── app_header.dart
    ├── circular_category_list.dart
    ├── custom_bottom_nav.dart
    ├── custom_button.dart
    ├── empty_state_widget.dart
    ├── filter_bottom_sheet.dart
    ├── food_network_image.dart
    ├── location_greeting.dart
    ├── pizza_card.dart
    ├── promo_banner_slider.dart
    ├── quantity_stepper.dart
    └── search_bar_widget.dart
```

---

## 🚀 How to Run

1. **Install Dependencies**:
   ```bash
   flutter pub get
   ```

2. **Run on Connected Device / Simulator**:
   ```bash
   flutter run
   ```

3. **Run on Web**:
   ```bash
   flutter run -d chrome
   ```
