import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';
import '../models/cart_item.dart';
import '../models/pizza_item.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  String? _appliedCoupon;
  double _discountPercentage = 0.0;
  double _fixedDiscount = 0.0;

  List<CartItem> get items => _items;
  String? get appliedCoupon => _appliedCoupon;
  bool get isEmpty => _items.isEmpty;

  int get totalItemCount {
    return _items.fold(0, (sum, item) => sum + item.quantity);
  }

  double get subtotal {
    return _items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  double get deliveryFee {
    if (isEmpty || subtotal >= AppConstants.freeDeliveryThreshold) {
      return 0.0;
    }
    if (_appliedCoupon == 'FREESHIP') {
      return 0.0;
    }
    return AppConstants.standardDeliveryFee;
  }

  double get discountAmount {
    if (isEmpty) return 0.0;
    if (_fixedDiscount > 0) {
      return _fixedDiscount.clamp(0.0, subtotal);
    }
    if (_discountPercentage > 0) {
      return subtotal * _discountPercentage;
    }
    return 0.0;
  }

  double get taxAmount {
    if (isEmpty) return 0.0;
    final taxableAmount = (subtotal - discountAmount).clamp(0.0, double.infinity);
    return taxableAmount * AppConstants.taxRate;
  }

  double get finalTotal {
    if (isEmpty) return 0.0;
    final total = subtotal - discountAmount + taxAmount + deliveryFee;
    return total < 0 ? 0.0 : total;
  }

  void addToCart(CartItem newItem) {
    // Check if an identical customized item exists
    final existingIndex = _items.indexWhere((item) =>
        item.pizza.id == newItem.pizza.id &&
        item.selectedSize.name == newItem.selectedSize.name &&
        item.selectedCrust.name == newItem.selectedCrust.name &&
        _areToppingsIdentical(item.selectedToppings, newItem.selectedToppings));

    if (existingIndex >= 0) {
      _items[existingIndex].quantity += newItem.quantity;
    } else {
      _items.add(newItem);
    }
    notifyListeners();
  }

  void quickAddPizza(PizzaItem pizza) {
    final newItem = CartItem(
      id: 'ci_${DateTime.now().millisecondsSinceEpoch}',
      pizza: pizza,
      selectedSize: pizza.availableSizes.first,
      selectedCrust: pizza.availableCrusts.first,
      selectedToppings: [],
      quantity: 1,
    );
    addToCart(newItem);
  }

  void incrementQuantity(String cartItemId) {
    final index = _items.indexWhere((item) => item.id == cartItemId);
    if (index >= 0) {
      _items[index].quantity++;
      notifyListeners();
    }
  }

  void decrementQuantity(String cartItemId) {
    final index = _items.indexWhere((item) => item.id == cartItemId);
    if (index >= 0) {
      if (_items[index].quantity > 1) {
        _items[index].quantity--;
      } else {
        _items.removeAt(index);
      }
      notifyListeners();
    }
  }

  void removeItem(String cartItemId) {
    _items.removeWhere((item) => item.id == cartItemId);
    if (isEmpty) {
      removeCoupon();
    }
    notifyListeners();
  }

  bool applyCoupon(String code) {
    final cleanCode = code.trim().toUpperCase();
    if (!AppConstants.validCoupons.containsKey(cleanCode)) {
      return false;
    }

    _appliedCoupon = cleanCode;
    if (cleanCode == 'FREESHIP') {
      _discountPercentage = 0.0;
      _fixedDiscount = 0.0;
    } else {
      _discountPercentage = AppConstants.validCoupons[cleanCode]!;
      _fixedDiscount = 0.0;
    }
    notifyListeners();
    return true;
  }

  void removeCoupon() {
    _appliedCoupon = null;
    _discountPercentage = 0.0;
    _fixedDiscount = 0.0;
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    removeCoupon();
    notifyListeners();
  }

  bool _areToppingsIdentical(List<ToppingItem> a, List<ToppingItem> b) {
    if (a.length != b.length) return false;
    final idsA = a.map((e) => e.id).toSet();
    final idsB = b.map((e) => e.id).toSet();
    return idsA.containsAll(idsB);
  }
}
