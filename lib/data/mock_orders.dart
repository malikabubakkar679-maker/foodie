import '../models/address_model.dart';
import '../models/cart_item.dart';
import '../models/order_model.dart';
import '../models/pizza_item.dart';
import 'mock_pizzas.dart';

class MockOrders {
  MockOrders._();

  static final AddressModel defaultAddress = const AddressModel(
    id: 'addr_1',
    title: 'Home',
    street: '742 Evergreen Terrace, Apt 4B',
    city: 'Brooklyn, NY',
    zipCode: '11201',
    phone: '+1 (555) 987-6543',
    deliveryNote: 'Leave at door, ring buzzer 4B',
    isDefault: true,
  );

  static final AddressModel workAddress = const AddressModel(
    id: 'addr_2',
    title: 'Work',
    street: '450 Lexington Avenue, Suite 1800',
    city: 'New York, NY',
    zipCode: '10017',
    phone: '+1 (555) 432-1098',
    deliveryNote: 'Deliver to front desk reception',
    isDefault: false,
  );

  static List<OrderModel> getInitialOrders() {
    final margherita = MockPizzas.pizzas[0];
    final pepperoni = MockPizzas.pizzas[1];
    final bbqChicken = MockPizzas.pizzas[2];

    return [
      OrderModel(
        id: 'ord_101',
        orderNumber: 'PZ-8492',
        items: [
          CartItem(
            id: 'ci_1',
            pizza: pepperoni,
            selectedSize: PizzaSize.standardSizes[1], // Medium
            selectedCrust: PizzaCrust.standardCrusts[2], // Cheese Burst
            selectedToppings: [ToppingItem.standardToppings[0], ToppingItem.standardToppings[4]], // Extra cheese + jalapeños
            quantity: 1,
          ),
          CartItem(
            id: 'ci_2',
            pizza: margherita,
            selectedSize: PizzaSize.standardSizes[0], // Small
            selectedCrust: PizzaCrust.standardCrusts[0], // Classic
            selectedToppings: [],
            quantity: 1,
          ),
        ],
        subtotal: 34.98,
        deliveryFee: 3.99,
        discount: 5.00,
        tax: 2.70,
        total: 36.67,
        status: OrderStatus.outForDelivery,
        orderDate: DateTime.now().subtract(const Duration(minutes: 24)),
        estimatedDeliveryTime: DateTime.now().add(const Duration(minutes: 16)),
        deliveryAddress: defaultAddress,
        paymentMethod: 'Credit Card (•••• 4242)',
        driverName: 'Marco Bellini',
        driverPhone: '+1 (555) 872-9102',
        driverRating: 4.95,
      ),
      OrderModel(
        id: 'ord_102',
        orderNumber: 'PZ-7821',
        items: [
          CartItem(
            id: 'ci_3',
            pizza: bbqChicken,
            selectedSize: PizzaSize.standardSizes[2], // Large
            selectedCrust: PizzaCrust.standardCrusts[1], // Thin & Crispy
            selectedToppings: [ToppingItem.standardToppings[1]], // Pepperoni
            quantity: 2,
          ),
        ],
        subtotal: 48.98,
        deliveryFee: 0.0,
        discount: 10.00,
        tax: 3.12,
        total: 42.10,
        status: OrderStatus.delivered,
        orderDate: DateTime.now().subtract(const Duration(days: 2, hours: 3)),
        estimatedDeliveryTime: DateTime.now().subtract(const Duration(days: 2, hours: 2, minutes: 20)),
        deliveryAddress: defaultAddress,
        paymentMethod: 'Apple Pay',
      ),
      OrderModel(
        id: 'ord_103',
        orderNumber: 'PZ-6510',
        items: [
          CartItem(
            id: 'ci_4',
            pizza: margherita,
            selectedSize: PizzaSize.standardSizes[1],
            selectedCrust: PizzaCrust.standardCrusts[0],
            selectedToppings: [],
            quantity: 1,
          ),
        ],
        subtotal: 16.49,
        deliveryFee: 3.99,
        discount: 0.00,
        tax: 1.32,
        total: 21.80,
        status: OrderStatus.delivered,
        orderDate: DateTime.now().subtract(const Duration(days: 6)),
        estimatedDeliveryTime: DateTime.now().subtract(const Duration(days: 6, hours: -1)),
        deliveryAddress: workAddress,
        paymentMethod: 'Cash on Delivery',
      ),
    ];
  }
}
