class PizzaSize {
  final String name;
  final String description;
  final double extraPrice;
  final int inches;

  const PizzaSize({
    required this.name,
    required this.description,
    required this.extraPrice,
    required this.inches,
  });

  static const List<PizzaSize> standardSizes = [
    PizzaSize(name: 'Small', description: '10 inch (6 slices)', extraPrice: 0.0, inches: 10),
    PizzaSize(name: 'Medium', description: '12 inch (8 slices)', extraPrice: 3.50, inches: 12),
    PizzaSize(name: 'Large', description: '14 inch (10 slices)', extraPrice: 6.00, inches: 14),
  ];
}

class PizzaCrust {
  final String name;
  final String description;
  final double extraPrice;

  const PizzaCrust({
    required this.name,
    required this.description,
    required this.extraPrice,
  });

  static const List<PizzaCrust> standardCrusts = [
    PizzaCrust(name: 'Classic Hand Tossed', description: 'Traditional crispy crust', extraPrice: 0.0),
    PizzaCrust(name: 'Thin & Crispy', description: 'Ultra light and crunchy', extraPrice: 1.50),
    PizzaCrust(name: 'Cheese Burst', description: 'Stuffed with molten mozzarella', extraPrice: 3.00),
    PizzaCrust(name: 'Garlic Butter Crust', description: 'Infused with roasted garlic', extraPrice: 2.50),
  ];
}

class ToppingItem {
  final String id;
  final String name;
  final double price;
  final String icon;

  const ToppingItem({
    required this.id,
    required this.name,
    required this.price,
    this.icon = '🍕',
  });

  static const List<ToppingItem> standardToppings = [
    ToppingItem(id: 't1', name: 'Extra Mozzarella', price: 1.50, icon: '🧀'),
    ToppingItem(id: 't2', name: 'Pepperoni Slices', price: 2.00, icon: '🥩'),
    ToppingItem(id: 't3', name: 'Portobello Mushrooms', price: 1.20, icon: '🍄'),
    ToppingItem(id: 't4', name: 'Black Olives', price: 1.00, icon: '🫒'),
    ToppingItem(id: 't5', name: 'Spicy Jalapeños', price: 1.00, icon: '🌶️'),
    ToppingItem(id: 't6', name: 'Grilled Chicken', price: 2.50, icon: '🍗'),
    ToppingItem(id: 't7', name: 'Crisp Bell Peppers', price: 1.00, icon: '🫑'),
    ToppingItem(id: 't8', name: 'Fresh Italian Basil', price: 0.80, icon: '🌿'),
    ToppingItem(id: 't9', name: 'Caramelized Onion', price: 0.90, icon: '🧅'),
    ToppingItem(id: 't10', name: 'Crispy Bacon', price: 2.20, icon: '🥓'),
  ];
}

class PizzaItem {
  final String id;
  final String name;
  final String category;
  final String description;
  final String imageUrl;
  final double basePrice;
  final double rating;
  final int reviewsCount;
  final int prepTimeMinutes;
  final int calories;
  final List<String> ingredients;
  final List<PizzaSize> availableSizes;
  final List<PizzaCrust> availableCrusts;
  final List<ToppingItem> availableToppings;
  final bool isVegetarian;
  final bool isSpicy;
  final bool isPopular;

  const PizzaItem({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.imageUrl,
    required this.basePrice,
    this.rating = 4.8,
    this.reviewsCount = 120,
    this.prepTimeMinutes = 20,
    this.calories = 280,
    required this.ingredients,
    this.availableSizes = PizzaSize.standardSizes,
    this.availableCrusts = PizzaCrust.standardCrusts,
    this.availableToppings = ToppingItem.standardToppings,
    this.isVegetarian = false,
    this.isSpicy = false,
    this.isPopular = false,
  });
}
