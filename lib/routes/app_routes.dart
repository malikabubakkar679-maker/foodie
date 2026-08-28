import 'package:flutter/material.dart';
import '../core/utils/custom_page_route.dart';
import '../models/order_model.dart';
import '../models/pizza_item.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/signup_screen.dart';
import '../screens/cart/cart_screen.dart';
import '../screens/details/pizza_details_screen.dart';
import '../screens/checkout/checkout_screen.dart';
import '../screens/favorites/favorites_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/main_shell_screen.dart';
import '../screens/onboarding/onboarding_screen.dart';
import '../screens/order/order_confirmation_screen.dart';
import '../screens/order/order_history_screen.dart';
import '../screens/order/order_tracking_screen.dart';
import '../screens/profile/payment_methods_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/profile/saved_addresses_screen.dart';
import '../screens/profile/settings_screen.dart';
import '../screens/search/search_screen.dart';
import '../screens/splash/splash_screen.dart';

class AppRoutes {
  AppRoutes._();

  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String signup = '/signup';
  static const String mainShell = '/main';
  static const String home = '/home';
  static const String search = '/search';
  static const String pizzaDetails = '/pizza-details';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String orderConfirmation = '/order-confirmation';
  static const String orderTracking = '/order-tracking';
  static const String orderHistory = '/order-history';
  static const String favorites = '/favorites';
  static const String profile = '/profile';
  static const String savedAddresses = '/saved-addresses';
  static const String paymentMethods = '/payment-methods';
  static const String settings = '/settings';

  static Route<dynamic> onGenerateRoute(RouteSettings routeSettings) {
    switch (routeSettings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());

      case onboarding:
        return FadeScalePageRoute(page: const OnboardingScreen());

      case login:
        return SlidePageRoute(page: const LoginScreen());

      case signup:
        return SlidePageRoute(page: const SignupScreen());

      case mainShell:
        final initialIndex = routeSettings.arguments as int? ?? 0;
        return MaterialPageRoute(builder: (_) => MainShellScreen(initialIndex: initialIndex));

      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());

      case search:
        return SlidePageRoute(page: const SearchScreen());

      case pizzaDetails:
        final pizza = routeSettings.arguments as PizzaItem;
        return SlidePageRoute(page: PizzaDetailsScreen(pizza: pizza));

      case cart:
        return SlidePageRoute(page: const CartScreen());

      case checkout:
        return SlidePageRoute(page: const CheckoutScreen());

      case orderConfirmation:
        final order = routeSettings.arguments as OrderModel;
        return FadeScalePageRoute(page: OrderConfirmationScreen(order: order));

      case orderTracking:
        final order = routeSettings.arguments as OrderModel;
        return SlidePageRoute(page: OrderTrackingScreen(order: order));

      case orderHistory:
        return SlidePageRoute(page: const OrderHistoryScreen());

      case favorites:
        return SlidePageRoute(page: const FavoritesScreen());

      case profile:
        return SlidePageRoute(page: const ProfileScreen());

      case savedAddresses:
        return SlidePageRoute(page: const SavedAddressesScreen());

      case paymentMethods:
        return SlidePageRoute(page: const PaymentMethodsScreen());

      case settings:
        return SlidePageRoute(page: const SettingsScreen());

      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${routeSettings.name}'),
            ),
          ),
        );
    }
  }
}
