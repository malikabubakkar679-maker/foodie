import 'address_model.dart';
import 'cart_item.dart';

enum OrderStatus {
  placed,
  preparing,
  outForDelivery,
  delivered,
  cancelled,
}

extension OrderStatusExtension on OrderStatus {
  String get displayName {
    switch (this) {
      case OrderStatus.placed:
        return 'Order Placed';
      case OrderStatus.preparing:
        return 'Baking & Preparing';
      case OrderStatus.outForDelivery:
        return 'Out for Delivery';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  int get stepIndex {
    switch (this) {
      case OrderStatus.placed:
        return 0;
      case OrderStatus.preparing:
        return 1;
      case OrderStatus.outForDelivery:
        return 2;
      case OrderStatus.delivered:
        return 3;
      case OrderStatus.cancelled:
        return -1;
    }
  }
}

class OrderModel {
  final String id;
  final String orderNumber;
  final List<CartItem> items;
  final double subtotal;
  final double deliveryFee;
  final double discount;
  final double tax;
  final double total;
  final OrderStatus status;
  final DateTime orderDate;
  final DateTime estimatedDeliveryTime;
  final AddressModel deliveryAddress;
  final String paymentMethod;
  final String? promoCode;
  final String driverName;
  final String driverPhone;
  final double driverRating;

  OrderModel({
    required this.id,
    required this.orderNumber,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.discount,
    required this.tax,
    required this.total,
    this.status = OrderStatus.placed,
    required this.orderDate,
    required this.estimatedDeliveryTime,
    required this.deliveryAddress,
    required this.paymentMethod,
    this.promoCode,
    this.driverName = 'Alex Rodriguez',
    this.driverPhone = '+1 (555) 234-8901',
    this.driverRating = 4.9,
  });

  OrderModel copyWith({
    String? id,
    String? orderNumber,
    List<CartItem>? items,
    double? subtotal,
    double? deliveryFee,
    double? discount,
    double? tax,
    double? total,
    OrderStatus? status,
    DateTime? orderDate,
    DateTime? estimatedDeliveryTime,
    AddressModel? deliveryAddress,
    String? paymentMethod,
    String? promoCode,
    String? driverName,
    String? driverPhone,
    double? driverRating,
  }) {
    return OrderModel(
      id: id ?? this.id,
      orderNumber: orderNumber ?? this.orderNumber,
      items: items ?? this.items,
      subtotal: subtotal ?? this.subtotal,
      deliveryFee: deliveryFee ?? this.deliveryFee,
      discount: discount ?? this.discount,
      tax: tax ?? this.tax,
      total: total ?? this.total,
      status: status ?? this.status,
      orderDate: orderDate ?? this.orderDate,
      estimatedDeliveryTime: estimatedDeliveryTime ?? this.estimatedDeliveryTime,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      promoCode: promoCode ?? this.promoCode,
      driverName: driverName ?? this.driverName,
      driverPhone: driverPhone ?? this.driverPhone,
      driverRating: driverRating ?? this.driverRating,
    );
  }
}
