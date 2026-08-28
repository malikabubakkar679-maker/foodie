import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/currency_formatter.dart';
import '../../models/address_model.dart';
import '../../providers/address_provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../routes/app_routes.dart';
import '../../widgets/custom_button.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String _selectedTiming = 'asap'; // 'asap' or 'scheduled'
  TimeOfDay _scheduledTime = const TimeOfDay(hour: 20, minute: 30);
  String _selectedPayment = 'card'; // 'cod', 'card', 'wallet', 'gpay'
  final TextEditingController _notesController = TextEditingController();
  bool _isPlacingOrder = false;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _handlePlaceOrder() async {
    final cart = context.read<CartProvider>();
    final addressProv = context.read<AddressProvider>();
    final orderProv = context.read<OrderProvider>();

    if (cart.isEmpty) {
      Navigator.pop(context);
      return;
    }

    setState(() {
      _isPlacingOrder = true;
    });

    // Simulated network processing
    await Future.delayed(const Duration(milliseconds: 1200));

    String paymentLabel = 'Credit Card';
    if (_selectedPayment == 'cod') paymentLabel = 'Cash on Delivery';
    if (_selectedPayment == 'gpay') paymentLabel = 'Google Pay';
    if (_selectedPayment == 'wallet') paymentLabel = 'Pizza Wallet';

    final createdOrder = orderProv.placeOrder(
      items: cart.items,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      discount: cart.discountAmount,
      tax: cart.taxAmount,
      total: cart.finalTotal,
      deliveryAddress: addressProv.selectedAddress,
      paymentMethod: paymentLabel,
      promoCode: cart.appliedCoupon,
    );

    cart.clearCart();

    if (mounted) {
      setState(() {
        _isPlacingOrder = false;
      });

      Navigator.pushReplacementNamed(
        context,
        AppRoutes.orderConfirmation,
        arguments: createdOrder,
      );
    }
  }

  void _showAddAddressDialog() {
    final titleCtrl = TextEditingController(text: 'Other');
    final streetCtrl = TextEditingController();
    final cityCtrl = TextEditingController(text: 'New York, NY');
    final phoneCtrl = TextEditingController(text: '+1 (555) 000-0000');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Add Delivery Address', style: TextStyle(fontWeight: FontWeight.w800)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleCtrl,
                decoration: const InputDecoration(labelText: 'Address Label (e.g. Home, Office)'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: streetCtrl,
                decoration: const InputDecoration(labelText: 'Street Address'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: cityCtrl,
                decoration: const InputDecoration(labelText: 'City, State'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: phoneCtrl,
                decoration: const InputDecoration(labelText: 'Contact Phone'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              if (streetCtrl.text.trim().isEmpty) return;
              final newAddr = AddressModel(
                id: 'addr_${DateTime.now().millisecondsSinceEpoch}',
                title: titleCtrl.text.trim(),
                street: streetCtrl.text.trim(),
                city: cityCtrl.text.trim(),
                zipCode: '10001',
                phone: phoneCtrl.text.trim(),
                isDefault: true,
              );
              context.read<AddressProvider>().addAddress(newAddr);
              Navigator.pop(ctx);
            },
            child: const Text('Save Address'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final addressProv = context.watch<AddressProvider>();
    final cart = context.watch<CartProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Checkout 📦'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. DELIVERY ADDRESS SECTION
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '1. Delivery Address',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                ),
                TextButton.icon(
                  onPressed: _showAddAddressDialog,
                  icon: const Icon(Icons.add_rounded, size: 18),
                  label: const Text('Add New'),
                  style: TextButton.styleFrom(foregroundColor: AppColors.primary),
                ),
              ],
            ),
            const SizedBox(height: 6),
            ...addressProv.addresses.map((address) {
              final isSelected = address.id == addressProv.selectedAddress.id;
              return GestureDetector(
                onTap: () => addressProv.selectAddress(address),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.primarySoft : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? AppColors.primary : AppColors.border,
                      width: isSelected ? 1.8 : 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                        color: isSelected ? AppColors.primary : AppColors.textMuted,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  address.title,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w800,
                                    color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                                  ),
                                ),
                                if (address.isDefault) ...[
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppColors.secondaryLight,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: const Text(
                                      'Default',
                                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.secondaryDark),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              address.fullAddress,
                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: 18),

            // 2. DELIVERY TIME
            const Text(
              '2. Delivery Timing',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: _SelectableCard(
                    title: 'ASAP (~25 min)',
                    subtitle: 'Hot & Fresh',
                    icon: Icons.electric_bolt_rounded,
                    isSelected: _selectedTiming == 'asap',
                    onTap: () => setState(() => _selectedTiming = 'asap'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _SelectableCard(
                    title: 'Schedule Later',
                    subtitle: '${_scheduledTime.format(context)}',
                    icon: Icons.schedule_rounded,
                    isSelected: _selectedTiming == 'scheduled',
                    onTap: () async {
                      final picked = await showTimePicker(
                        context: context,
                        initialTime: _scheduledTime,
                      );
                      if (picked != null) {
                        setState(() {
                          _scheduledTime = picked;
                          _selectedTiming = 'scheduled';
                        });
                      }
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 22),

            // 3. PAYMENT METHOD
            const Text(
              '3. Payment Method',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 10),
            _PaymentTile(
              id: 'card',
              title: 'Credit / Debit Card',
              subtitle: 'Visa •••• 4242',
              icon: Icons.credit_card_rounded,
              isSelected: _selectedPayment == 'card',
              onTap: () => setState(() => _selectedPayment = 'card'),
            ),
            _PaymentTile(
              id: 'gpay',
              title: 'Google Pay / Apple Pay',
              subtitle: 'Instant One-Tap Checkout',
              icon: Icons.account_balance_wallet_rounded,
              isSelected: _selectedPayment == 'gpay',
              onTap: () => setState(() => _selectedPayment = 'gpay'),
            ),
            _PaymentTile(
              id: 'wallet',
              title: 'Pizza Wallet',
              subtitle: 'Balance: \$45.00',
              icon: Icons.savings_rounded,
              isSelected: _selectedPayment == 'wallet',
              onTap: () => setState(() => _selectedPayment = 'wallet'),
            ),
            _PaymentTile(
              id: 'cod',
              title: 'Cash on Delivery',
              subtitle: 'Pay at your door in cash',
              icon: Icons.payments_rounded,
              isSelected: _selectedPayment == 'cod',
              onTap: () => setState(() => _selectedPayment = 'cod'),
            ),
            const SizedBox(height: 18),

            // 4. DELIVERY INSTRUCTIONS
            const Text(
              'Delivery Instructions (Optional)',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _notesController,
              decoration: const InputDecoration(
                hintText: 'e.g. Leave package by the door, buzzer code 1234',
                prefixIcon: Icon(Icons.note_alt_outlined, color: AppColors.textMuted),
              ),
            ),
            const SizedBox(height: 24),

            // 5. MINI ORDER SUMMARY
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${cart.totalItemCount} Items in Order',
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                      ),
                      Text(
                        CurrencyFormatter.format(cart.finalTotal),
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.primaryDark),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    cart.items.map((i) => '${i.quantity}x ${i.pizza.name}').join(', '),
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),

      // Sticky Bottom Place Order Action Bar
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
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
          child: CustomButton(
            text: 'Place Order — ${CurrencyFormatter.format(cart.finalTotal)}',
            isLoading: _isPlacingOrder,
            onPressed: _handlePlaceOrder,
            height: 54,
          ),
        ),
      ),
    );
  }
}

class _SelectableCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _SelectableCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primarySoft : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.8 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: isSelected ? AppColors.primary : AppColors.textMuted, size: 22),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentTile extends StatelessWidget {
  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _PaymentTile({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primarySoft : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.8 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected ? AppColors.primary : AppColors.textMuted,
              size: 20,
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected ? Colors.white : AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: isSelected ? AppColors.primary : AppColors.textSecondary, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
