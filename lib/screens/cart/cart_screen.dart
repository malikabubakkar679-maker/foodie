import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/currency_formatter.dart';
import '../../providers/cart_provider.dart';
import '../../routes/app_routes.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/food_network_image.dart';
import '../../widgets/quantity_stepper.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();

  @override
  void dispose() {
    _couponController.dispose();
    super.dispose();
  }

  void _applyCoupon() {
    final cart = context.read<CartProvider>();
    final code = _couponController.text.trim();
    if (code.isEmpty) return;

    final success = cart.applyCoupon(code);
    if (success) {
      _couponController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Coupon "$code" applied successfully! 🎉'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Invalid coupon code "$code". Try PIZZA50 or CHEESE20'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Cart 🛒'),
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                onPressed: () => Navigator.pop(context),
              )
            : null,
        actions: [
          if (!cart.isEmpty)
            TextButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    title: const Text('Clear Cart?'),
                    content: const Text('Are you sure you want to remove all items from your cart?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
                        onPressed: () {
                          cart.clearCart();
                          Navigator.pop(ctx);
                        },
                        child: const Text('Clear All'),
                      ),
                    ],
                  ),
                );
              },
              child: const Text(
                'Clear',
                style: TextStyle(color: AppColors.error, fontWeight: FontWeight.w700),
              ),
            ),
        ],
      ),
      body: cart.isEmpty
          ? EmptyStateWidget(
              emoji: '🛒',
              title: 'Your Cart is Empty',
              description: 'Looks like you haven’t added any delicious pizzas to your cart yet.',
              buttonText: 'Explore Menu',
              onButtonPressed: () {
                if (Navigator.canPop(context)) {
                  Navigator.pop(context);
                } else {
                  Navigator.pushReplacementNamed(context, AppRoutes.mainShell);
                }
              },
            )
          : CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                // Cart Items List
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final item = cart.items[index];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 14),
                          padding: const EdgeInsets.all(12),
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
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Circular Pizza Thumbnail
                              Container(
                                width: 75,
                                height: 75,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.primary.withOpacity(0.15),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: ClipOval(
                                  child: FoodNetworkImage(
                                    imageUrl: item.pizza.imageUrl,
                                    fit: BoxFit.cover,
                                    fallbackEmoji: '🍕',
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),

                              // Item Details & Options
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            item.pizza.name,
                                            style: const TextStyle(
                                              fontSize: 15,
                                              fontWeight: FontWeight.w800,
                                              color: AppColors.textPrimary,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.delete_outline_rounded, color: AppColors.error, size: 20),
                                          padding: EdgeInsets.zero,
                                          constraints: const BoxConstraints(),
                                          onPressed: () => cart.removeItem(item.id),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),

                                    // Size & Crust
                                    Text(
                                      '${item.selectedSize.name} (${item.selectedSize.inches}") • ${item.selectedCrust.name}',
                                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                                    ),

                                    // Extra toppings list if any
                                    if (item.selectedToppings.isNotEmpty) ...[
                                      const SizedBox(height: 2),
                                      Text(
                                        '+ ${item.selectedToppings.map((t) => t.name).join(', ')}',
                                        style: const TextStyle(fontSize: 11, color: AppColors.primaryDark, fontWeight: FontWeight.w600),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                    const SizedBox(height: 10),

                                    // Quantity & Price Row
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          CurrencyFormatter.format(item.totalPrice),
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w900,
                                            color: AppColors.primaryDark,
                                          ),
                                        ),
                                        QuantityStepper(
                                          quantity: item.quantity,
                                          onIncrement: () => cart.incrementQuantity(item.id),
                                          onDecrement: () => cart.decrementQuantity(item.id),
                                          size: 32,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                      childCount: cart.items.length,
                    ),
                  ),
                ),

                // Coupon Code Input Section
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 8.0),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Promo & Discounts',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 10),
                          if (cart.appliedCoupon != null)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: AppColors.successLight,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.success.withOpacity(0.4)),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 20),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Code "${cart.appliedCoupon}" Applied!',
                                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.success),
                                      ),
                                    ],
                                  ),
                                  GestureDetector(
                                    onTap: () => cart.removeCoupon(),
                                    child: const Icon(Icons.close_rounded, color: AppColors.error, size: 20),
                                  ),
                                ],
                              ),
                            )
                          else
                            Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    controller: _couponController,
                                    textCapitalization: TextCapitalization.characters,
                                    decoration: const InputDecoration(
                                      hintText: 'Enter Coupon (PIZZA50)',
                                      prefixIcon: Icon(Icons.discount_outlined, color: AppColors.primary, size: 20),
                                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                ElevatedButton(
                                  onPressed: _applyCoupon,
                                  style: ElevatedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                  ),
                                  child: const Text('Apply'),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Bill Breakdown Card
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
                    child: Container(
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
                            'Order Summary',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 14),
                          _BillRow(label: 'Subtotal', value: CurrencyFormatter.format(cart.subtotal)),
                          const SizedBox(height: 8),
                          _BillRow(
                            label: 'Delivery Fee',
                            value: cart.deliveryFee == 0 ? 'FREE' : CurrencyFormatter.format(cart.deliveryFee),
                            isSuccess: cart.deliveryFee == 0,
                          ),
                          if (cart.discountAmount > 0) ...[
                            const SizedBox(height: 8),
                            _BillRow(
                              label: 'Promo Discount',
                              value: '-${CurrencyFormatter.format(cart.discountAmount)}',
                              isSuccess: true,
                            ),
                          ],
                          const SizedBox(height: 8),
                          _BillRow(label: 'Estimated Tax (8%)', value: CurrencyFormatter.format(cart.taxAmount)),
                          const Divider(height: 24),
                          _BillRow(
                            label: 'Total Amount',
                            value: CurrencyFormatter.format(cart.finalTotal),
                            isBold: true,
                            isLarge: true,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SliverToBoxAdapter(child: SizedBox(height: 100)),
              ],
            ),

      // Sticky Checkout Action Bar
      bottomNavigationBar: cart.isEmpty
          ? null
          : Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 20,
                    offset: const Offset(0, -6),
                  ),
                ],
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Total to Pay',
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                        ),
                        Text(
                          CurrencyFormatter.format(cart.finalTotal),
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryDark,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: CustomButton(
                        text: 'Proceed to Checkout →',
                        height: 52,
                        onPressed: () {
                          Navigator.pushNamed(context, AppRoutes.checkout);
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _BillRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isBold;
  final bool isLarge;
  final bool isSuccess;

  const _BillRow({
    required this.label,
    required this.value,
    this.isBold = false,
    this.isLarge = false,
    this.isSuccess = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isLarge ? 16 : 13.5,
            fontWeight: isBold ? FontWeight.w900 : FontWeight.w500,
            color: isBold ? AppColors.textPrimary : AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: isLarge ? 18 : 14,
            fontWeight: isBold ? FontWeight.w900 : FontWeight.w700,
            color: isSuccess
                ? AppColors.success
                : isBold
                    ? AppColors.primaryDark
                    : AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
