import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/custom_button.dart';

class PaymentMethodsScreen extends StatefulWidget {
  const PaymentMethodsScreen({super.key});

  @override
  State<PaymentMethodsScreen> createState() => _PaymentMethodsScreenState();
}

class _PaymentMethodsScreenState extends State<PaymentMethodsScreen> {
  final List<Map<String, dynamic>> _savedCards = [
    {
      'id': 'card_1',
      'brand': 'Visa',
      'last4': '4242',
      'expiry': '12/28',
      'holder': 'Alex Johnson',
      'isDefault': true,
    },
    {
      'id': 'card_2',
      'brand': 'MasterCard',
      'last4': '8831',
      'expiry': '09/27',
      'holder': 'Alex Johnson',
      'isDefault': false,
    },
  ];

  void _showAddCardDialog() {
    final numCtrl = TextEditingController();
    final holderCtrl = TextEditingController(text: 'Alex Johnson');
    final expCtrl = TextEditingController();
    final cvvCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Add Credit / Debit Card', style: TextStyle(fontWeight: FontWeight.w800)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: numCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Card Number', hintText: '•••• •••• •••• ••••'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: holderCtrl,
                decoration: const InputDecoration(labelText: 'Cardholder Name'),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: expCtrl,
                      decoration: const InputDecoration(labelText: 'MM/YY', hintText: '12/28'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: cvvCtrl,
                      obscureText: true,
                      decoration: const InputDecoration(labelText: 'CVV', hintText: '•••'),
                    ),
                  ),
                ],
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
              if (numCtrl.text.length < 4) return;
              setState(() {
                _savedCards.add({
                  'id': 'card_${DateTime.now().millisecondsSinceEpoch}',
                  'brand': 'Visa',
                  'last4': numCtrl.text.substring(numCtrl.text.length - 4),
                  'expiry': expCtrl.text.isEmpty ? '12/28' : expCtrl.text,
                  'holder': holderCtrl.text,
                  'isDefault': false,
                });
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Card added successfully! 💳'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Add Card'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Payment Methods 💳'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 14.0),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Saved Cards',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 12),
            ..._savedCards.map((card) {
              final isDefault = card['isDefault'] as bool;
              return Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isDefault
                        ? [const Color(0xFF1E1E24), const Color(0xFF2C2C34)]
                        : [const Color(0xFF42424E), const Color(0xFF535360)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.12),
                      blurRadius: 14,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          card['brand'],
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                        if (isDefault)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text('Default', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800)),
                          ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      '••••  ••••  ••••  ${card['last4']}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white, letterSpacing: 2),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('CARD HOLDER', style: TextStyle(color: Colors.white60, fontSize: 9, fontWeight: FontWeight.w700)),
                            Text(card['holder'], style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700)),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('EXPIRES', style: TextStyle(color: Colors.white60, fontSize: 9, fontWeight: FontWeight.w700)),
                            Text(card['expiry'], style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 20),

            // Digital Wallets Section
            const Text(
              'Digital Wallets',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 10),
            _WalletTile(title: 'Google Pay', subtitle: 'Connected to alex@example.com', icon: Icons.account_balance_wallet_rounded),
            _WalletTile(title: 'Apple Pay', subtitle: 'Ready for Touch/Face ID', icon: Icons.apple),
            _WalletTile(title: 'Pizza Cash Wallet', subtitle: 'Available balance: \$45.00', icon: Icons.savings_rounded),
            const SizedBox(height: 80),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        child: SafeArea(
          child: CustomButton(
            text: '+ Add New Card',
            onPressed: _showAddCardDialog,
          ),
        ),
      ),
    );
  }
}

class _WalletTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;

  const _WalletTile({
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: AppColors.primarySoft, borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: AppColors.primary, size: 22),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        trailing: const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 20),
      ),
    );
  }
}
