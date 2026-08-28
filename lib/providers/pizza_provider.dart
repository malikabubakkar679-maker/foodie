import 'package:flutter/material.dart';
import '../data/mock_pizzas.dart';
import '../models/pizza_item.dart';

class PizzaProvider extends ChangeNotifier {
  final List<PizzaItem> _allPizzas = List.from(MockPizzas.pizzas);
  String _selectedCategory = 'all';
  String _searchQuery = '';
  final Set<String> _favoriteIds = {'p1', 'p2', 'p4', 'p7'};

  // Filter state
  bool _onlyVeg = false;
  bool _onlySpicy = false;
  double _maxPrice = 30.0;
  double _minRating = 0.0;

  List<PizzaItem> get allPizzas => _allPizzas;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  Set<String> get favoriteIds => _favoriteIds;
  bool get onlyVeg => _onlyVeg;
  bool get onlySpicy => _onlySpicy;
  double get maxPrice => _maxPrice;
  double get minRating => _minRating;

  List<PizzaItem> get popularPizzas {
    return _allPizzas.where((p) => p.isPopular).toList();
  }

  List<PizzaItem> get favoritePizzas {
    return _allPizzas.where((p) => _favoriteIds.contains(p.id)).toList();
  }

  List<PizzaItem> get filteredPizzas {
    return _allPizzas.where((pizza) {
      // Category filter
      if (_selectedCategory != 'all') {
        if (_selectedCategory == 'pizza' && pizza.category != 'pizza') return false;
        if (_selectedCategory != 'pizza' && pizza.category != _selectedCategory) return false;
      }

      // Search filter
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final matchesName = pizza.name.toLowerCase().contains(query);
        final matchesDesc = pizza.description.toLowerCase().contains(query);
        final matchesIng = pizza.ingredients.any((i) => i.toLowerCase().contains(query));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      // Dietary & Attribute filters
      if (_onlyVeg && !pizza.isVegetarian) return false;
      if (_onlySpicy && !pizza.isSpicy) return false;
      if (pizza.basePrice > _maxPrice) return false;
      if (pizza.rating < _minRating) return false;

      return true;
    }).toList();
  }

  void selectCategory(String categoryId) {
    if (_selectedCategory == categoryId) return;
    _selectedCategory = categoryId;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void toggleFavorite(String pizzaId) {
    if (_favoriteIds.contains(pizzaId)) {
      _favoriteIds.remove(pizzaId);
    } else {
      _favoriteIds.add(pizzaId);
    }
    notifyListeners();
  }

  bool isFavorite(String pizzaId) {
    return _favoriteIds.contains(pizzaId);
  }

  void applyFilters({
    bool? onlyVeg,
    bool? onlySpicy,
    double? maxPrice,
    double? minRating,
  }) {
    if (onlyVeg != null) _onlyVeg = onlyVeg;
    if (onlySpicy != null) _onlySpicy = onlySpicy;
    if (maxPrice != null) _maxPrice = maxPrice;
    if (minRating != null) _minRating = minRating;
    notifyListeners();
  }

  void resetFilters() {
    _onlyVeg = false;
    _onlySpicy = false;
    _maxPrice = 30.0;
    _minRating = 0.0;
    _searchQuery = '';
    _selectedCategory = 'all';
    notifyListeners();
  }

  PizzaItem? getPizzaById(String id) {
    try {
      return _allPizzas.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }
}
