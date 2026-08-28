import 'dart:async';
import 'package:flutter/material.dart';
import '../data/mock_orders.dart';
import '../models/address_model.dart';
import '../models/cart_item.dart';
import '../models/order_model.dart';

class OrderProvider extends ChangeNotifier {
  final List<OrderModel> _orders = MockOrders.getInitialOrders();
  OrderModel? _latestPlacedOrder;
  Timer? _statusSimulationTimer;

  List<OrderModel> get orders => _orders;
  OrderModel? get latestPlacedOrder => _latestPlacedOrder;

  List<OrderModel> get activeOrders {
    return _orders.where((o) => o.status != OrderStatus.delivered && o.status != OrderStatus.cancelled).toList();
  }

  List<OrderModel> get pastOrders {
    return _orders.where((o) => o.status == OrderStatus.delivered || o.status == OrderStatus.cancelled).toList();
  }

  OrderModel placeOrder({
    required List<CartItem> items,
    required double subtotal,
    required double deliveryFee,
    required double discount,
    required double tax,
    required double total,
    required AddressModel deliveryAddress,
    required String paymentMethod,
    String? promoCode,
  }) {
    final randId = 1000 + (DateTime.now().millisecondsSinceEpoch % 9000);
    final newOrder = OrderModel(
      id: 'ord_${DateTime.now().millisecondsSinceEpoch}',
      orderNumber: 'PZ-$randId',
      items: List.from(items),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      tax: tax,
      total: total,
      status: OrderStatus.placed,
      orderDate: DateTime.now(),
      estimatedDeliveryTime: DateTime.now().add(const Duration(minutes: 30)),
      deliveryAddress: deliveryAddress,
      paymentMethod: paymentMethod,
      promoCode: promoCode,
    );

    _orders.insert(0, newOrder);
    _latestPlacedOrder = newOrder;
    notifyListeners();

    _startLiveTrackingSimulation(newOrder.id);
    return newOrder;
  }

  void _startLiveTrackingSimulation(String orderId) {
    _statusSimulationTimer?.cancel();
    int currentStep = 0;

    _statusSimulationTimer = Timer.periodic(const Duration(seconds: 15), (timer) {
      currentStep++;
      final index = _orders.indexWhere((o) => o.id == orderId);
      if (index < 0) {
        timer.cancel();
        return;
      }

      OrderStatus nextStatus;
      if (currentStep == 1) {
        nextStatus = OrderStatus.preparing;
      } else if (currentStep == 2) {
        nextStatus = OrderStatus.outForDelivery;
      } else if (currentStep >= 3) {
        nextStatus = OrderStatus.delivered;
        timer.cancel();
      } else {
        timer.cancel();
        return;
      }

      _orders[index] = _orders[index].copyWith(status: nextStatus);
      if (_latestPlacedOrder?.id == orderId) {
        _latestPlacedOrder = _orders[index];
      }
      notifyListeners();
    });
  }

  void cancelOrder(String orderId) {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index >= 0) {
      _orders[index] = _orders[index].copyWith(status: OrderStatus.cancelled);
      if (_latestPlacedOrder?.id == orderId) {
        _latestPlacedOrder = _orders[index];
      }
      notifyListeners();
    }
  }

  OrderModel? getOrderById(String orderId) {
    try {
      return _orders.firstWhere((o) => o.id == orderId);
    } catch (_) {
      return null;
    }
  }

  @override
  void dispose() {
    _statusSimulationTimer?.cancel();
    super.dispose();
  }
}
