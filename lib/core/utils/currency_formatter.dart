import '../constants/app_constants.dart';

class CurrencyFormatter {
  CurrencyFormatter._();

  static String format(double amount) {
    return '${AppConstants.currencySymbol}${amount.toStringAsFixed(2)}';
  }

  static String formatWithoutSymbol(double amount) {
    return amount.toStringAsFixed(2);
  }
}
