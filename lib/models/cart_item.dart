import 'pizza_item.dart';

class CartItem {
  final String id;
  final PizzaItem pizza;
  final PizzaSize selectedSize;
  final PizzaCrust selectedCrust;
  final List<ToppingItem> selectedToppings;
  int quantity;
  final String specialInstructions;

  CartItem({
    required this.id,
    required this.pizza,
    required this.selectedSize,
    required this.selectedCrust,
    required this.selectedToppings,
    this.quantity = 1,
    this.specialInstructions = '',
  });

  double get unitPrice {
    double price = pizza.basePrice + selectedSize.extraPrice + selectedCrust.extraPrice;
    for (final topping in selectedToppings) {
      price += topping.price;
    }
    return price;
  }

  double get totalPrice {
    return unitPrice * quantity;
  }

  CartItem copyWith({
    String? id,
    PizzaItem? pizza,
    PizzaSize? selectedSize,
    PizzaCrust? selectedCrust,
    List<ToppingItem>? selectedToppings,
    int? quantity,
    String? specialInstructions,
  }) {
    return CartItem(
      id: id ?? this.id,
      pizza: pizza ?? this.pizza,
      selectedSize: selectedSize ?? this.selectedSize,
      selectedCrust: selectedCrust ?? this.selectedCrust,
      selectedToppings: selectedToppings ?? this.selectedToppings,
      quantity: quantity ?? this.quantity,
      specialInstructions: specialInstructions ?? this.specialInstructions,
    );
  }
}
