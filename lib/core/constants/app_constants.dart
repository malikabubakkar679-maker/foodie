class AppConstants {
  AppConstants._();

  static const String appName = 'Foodie';
  static const String appTagline = 'Delicious Food, One Tap Away';
  static const String currencySymbol = '\$';

  // Delivery & Calculation constants
  static const double standardDeliveryFee = 3.99;
  static const double taxRate = 0.08; // 8%
  static const double freeDeliveryThreshold = 35.00;

  // Coupon codes
  static const Map<String, double> validCoupons = {
    'FOODIE50': 0.50, // 50% off
    'WELCOME20': 0.20, // 20% off
    'FREESHIP': 3.99, // Free delivery flat
  };

  // Preference keys
  static const String prefKeyOnboardingSeen = 'foodie_onboarding_seen';
  static const String prefKeyIsLoggedIn = 'foodie_is_logged_in';
  static const String prefKeyUserEmail = 'foodie_user_email';
  static const String prefKeyUserName = 'foodie_user_name';
}
