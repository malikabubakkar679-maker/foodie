import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../models/order_model.dart';
import '../../providers/order_provider.dart';
import '../../routes/app_routes.dart';

class OrderTrackingScreen extends StatelessWidget {
  final OrderModel order;

  const OrderTrackingScreen({
    super.key,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    final orderProv = context.watch<OrderProvider>();
    final currentOrder = orderProv.getOrderById(order.id) ?? order;
    final status = currentOrder.status;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Track #${currentOrder.orderNumber}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            } else {
              Navigator.pushReplacementNamed(context, AppRoutes.mainShell);
            }
          },
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Simulated Live Map Route Card
            Container(
              height: 190,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                color: const Color(0xFFE8ECEF),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Decorative Map Grid & Streets Simulation
                  CustomPaint(
                    size: const Size(double.infinity, 190),
                    painter: _MapGridPainter(),
                  ),

                  // Route Line
                  CustomPaint(
                    size: const Size(double.infinity, 190),
                    painter: _RouteLinePainter(),
                  ),

                  // Restaurant Pin
                  Positioned(
                    top: 35,
                    left: 45,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                      child: const Text('🍕', style: TextStyle(fontSize: 16)),
                    ),
                  ),

                  // Moving Driver Delivery Pin
                  Positioned(
                    top: status == OrderStatus.placed
                        ? 40
                        : status == OrderStatus.preparing
                            ? 60
                            : status == OrderStatus.outForDelivery
                                ? 100
                                : 125,
                    left: status == OrderStatus.placed
                        ? 60
                        : status == OrderStatus.preparing
                            ? 120
                            : status == OrderStatus.outForDelivery
                                ? 200
                                : 260,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.black,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Icon(Icons.delivery_dining_rounded, color: Colors.white, size: 20),
                    ),
                  ),

                  // Destination Customer Pin
                  Positioned(
                    bottom: 30,
                    right: 40,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: AppColors.success,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.home_rounded, color: Colors.white, size: 18),
                    ),
                  ),

                  // Live Status Pill on top of map
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.92),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.06),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.success,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Text(
                            'GPS Live',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Estimated Delivery Time Header Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primarySoft,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.access_time_filled_rounded, color: AppColors.primary, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          status == OrderStatus.delivered
                              ? 'Delivered at Doorstep'
                              : 'Estimated Arrival in 20-30 mins',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          status.displayName,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primaryDark),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Timeline Steps Container
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Order Progress',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 16),
                  _TimelineStep(
                    title: 'Order Placed',
                    description: 'Your order was accepted and sent to kitchen',
                    time: 'Just now',
                    isCompleted: status.stepIndex >= 0,
                    isActive: status == OrderStatus.placed,
                    isLast: false,
                  ),
                  _TimelineStep(
                    title: 'Baking & Preparing',
                    description: 'Fresh dough hand-tossed with toppings',
                    time: '~10 mins',
                    isCompleted: status.stepIndex >= 1,
                    isActive: status == OrderStatus.preparing,
                    isLast: false,
                  ),
                  _TimelineStep(
                    title: 'Out for Delivery',
                    description: 'Driver ${currentOrder.driverName} is on the way',
                    time: '~20 mins',
                    isCompleted: status.stepIndex >= 2,
                    isActive: status == OrderStatus.outForDelivery,
                    isLast: false,
                  ),
                  _TimelineStep(
                    title: 'Delivered',
                    description: 'Enjoy your hot artisanal pizza!',
                    time: '~30 mins',
                    isCompleted: status.stepIndex >= 3,
                    isActive: status == OrderStatus.delivered,
                    isLast: true,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Driver Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 24,
                    backgroundColor: AppColors.primarySoft,
                    child: Text('🛵', style: TextStyle(fontSize: 24)),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          currentOrder.driverName,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            const Icon(Icons.star_rounded, color: AppColors.starGold, size: 16),
                            const SizedBox(width: 3),
                            Text(
                              '${currentOrder.driverRating} • Delivery Partner',
                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Call & Message Action Buttons
                  IconButton(
                    icon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Calling ${currentOrder.driverName} (${currentOrder.driverPhone})...'),
                          backgroundColor: AppColors.primary,
                        ),
                      );
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.chat_bubble_outline_rounded, color: AppColors.primary),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Opening chat with ${currentOrder.driverName}...'),
                          backgroundColor: AppColors.primary,
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Delivery Address Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.location_on_rounded, color: AppColors.primary, size: 22),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Delivering to ${currentOrder.deliveryAddress.title}',
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          currentOrder.deliveryAddress.fullAddress,
                          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}

class _TimelineStep extends StatelessWidget {
  final String title;
  final String description;
  final String time;
  final bool isCompleted;
  final bool isActive;
  final bool isLast;

  const _TimelineStep({
    required this.title,
    required this.description,
    required this.time,
    required this.isCompleted,
    required this.isActive,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Indicator & Vertical Line
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isCompleted ? AppColors.primary : Colors.grey[200],
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isActive ? AppColors.primaryDark : Colors.transparent,
                    width: 2,
                  ),
                ),
                child: Center(
                  child: Icon(
                    isCompleted ? Icons.check_rounded : Icons.circle,
                    size: 14,
                    color: isCompleted ? Colors.white : Colors.grey[400],
                  ),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2.5,
                    color: isCompleted ? AppColors.primary : Colors.grey[200],
                    margin: const EdgeInsets.symmetric(vertical: 4),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),

          // Text Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: isActive || isCompleted ? FontWeight.w800 : FontWeight.w500,
                          color: isCompleted ? AppColors.textPrimary : AppColors.textMuted,
                        ),
                      ),
                      Text(
                        time,
                        style: const TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    description,
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.8)
      ..strokeWidth = 4;

    // Draw horizontal road lines
    canvas.drawLine(Offset(0, size.height * 0.35), Offset(size.width, size.height * 0.35), paint);
    canvas.drawLine(Offset(0, size.height * 0.75), Offset(size.width, size.height * 0.75), paint);

    // Draw vertical road lines
    canvas.drawLine(Offset(size.width * 0.3, 0), Offset(size.width * 0.3, size.height), paint);
    canvas.drawLine(Offset(size.width * 0.7, 0), Offset(size.width * 0.7, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _RouteLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary.withOpacity(0.8)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    path.moveTo(60, 45);
    path.lineTo(size.width * 0.3, 45);
    path.lineTo(size.width * 0.3, size.height * 0.75);
    path.lineTo(size.width * 0.7, size.height * 0.75);
    path.lineTo(size.width - 50, size.height - 40);

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
