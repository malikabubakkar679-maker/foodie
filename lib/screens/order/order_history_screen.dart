import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/currency_formatter.dart';
import '../../models/order_model.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../routes/app_routes.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/food_network_image.dart';

class OrderHistoryScreen extends StatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  State<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final orderProv = context.watch<OrderProvider>();
    final allOrders = orderProv.orders;
    final activeOrders = orderProv.activeOrders;
    final pastOrders = orderProv.pastOrders;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Orders 📋'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
          tabs: [
            Tab(text: 'All (${allOrders.length})'),
            Tab(text: 'Active (${activeOrders.length})'),
            Tab(text: 'Past (${pastOrders.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _OrderList(orders: allOrders),
          _OrderList(orders: activeOrders, emptySubtitle: 'No active orders in progress right now.'),
          _OrderList(orders: pastOrders, emptySubtitle: 'No past orders completed yet.'),
        ],
      ),
    );
  }
}

class _OrderList extends StatelessWidget {
  final List<OrderModel> orders;
  final String emptySubtitle;

  const _OrderList({
    required this.orders,
    this.emptySubtitle = 'You haven’t placed any pizza orders yet.',
  });

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return EmptyStateWidget(
        emoji: '🍕',
        title: 'No Orders Found',
        description: emptySubtitle,
        buttonText: 'Order Some Pizza',
        onButtonPressed: () {
          Navigator.pushReplacementNamed(context, AppRoutes.mainShell);
        },
      );
    }

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 14.0),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        final isDelivered = order.status == OrderStatus.delivered;
        final isCancelled = order.status == OrderStatus.cancelled;
        final isActive = !isDelivered && !isCancelled;

        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Row: Order Number + Status Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '#${order.orderNumber}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  _StatusBadge(status: order.status),
                ],
              ),
              const SizedBox(height: 4),

              // Date
              Text(
                DateFormat('MMM dd, yyyy • hh:mm a').format(order.orderDate),
                style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
              const Divider(height: 20),

              // Items Thumbnail & details
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Thumbnails row
                  SizedBox(
                    width: 70,
                    height: 50,
                    child: Stack(
                      children: order.items.take(2).toList().asMap().entries.map((entry) {
                        final i = entry.key;
                        final item = entry.value;
                        return Positioned(
                          left: i * 20.0,
                          child: Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: ClipOval(
                              child: FoodNetworkImage(
                                imageUrl: item.pizza.imageUrl,
                                fit: BoxFit.cover,
                                fallbackEmoji: '🍕',
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // Items Summary text
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          order.items.map((i) => '${i.quantity}x ${i.pizza.name}').join(', '),
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${order.items.length} item(s) • Total: ${CurrencyFormatter.format(order.total)}',
                          style: const TextStyle(fontSize: 12, color: AppColors.primaryDark, fontWeight: FontWeight.w800),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Bottom Action Buttons
              Row(
                children: [
                  if (isActive)
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.location_searching_rounded, size: 18),
                        label: const Text('Track Order Live', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                        onPressed: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.orderTracking,
                            arguments: order,
                          );
                        },
                      ),
                    )
                  else
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.replay_rounded, size: 18, color: AppColors.primary),
                        label: const Text('Reorder Items', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                        onPressed: () {
                          final cart = context.read<CartProvider>();
                          for (final item in order.items) {
                            cart.addToCart(item);
                          }
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Reordered items added to your cart! 🛒'),
                              backgroundColor: AppColors.success,
                            ),
                          );
                          Navigator.pushNamed(context, AppRoutes.cart);
                        },
                      ),
                    ),
                  const SizedBox(width: 10),
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.border),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      _showOrderReceiptModal(context, order);
                    },
                    child: const Text('Receipt', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  void _showOrderReceiptModal(BuildContext context, OrderModel order) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      backgroundColor: Colors.white,
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Receipt #${order.orderNumber}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  Text(CurrencyFormatter.format(order.total), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryDark)),
                ],
              ),
              const Divider(height: 20),
              ...order.items.map((item) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${item.quantity}x ${item.pizza.name} (${item.selectedSize.name})', style: const TextStyle(fontSize: 13)),
                    Text(CurrencyFormatter.format(item.totalPrice), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  ],
                ),
              )),
              const Divider(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Payment Method:', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
                  Text(order.paymentMethod, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final OrderStatus status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg = AppColors.primarySoft;
    Color fg = AppColors.primaryDark;

    if (status == OrderStatus.delivered) {
      bg = AppColors.successLight;
      fg = AppColors.success;
    } else if (status == OrderStatus.cancelled) {
      bg = AppColors.errorLight;
      fg = AppColors.error;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status.displayName,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w800,
          color: fg,
        ),
      ),
    );
  }
}
