import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/address_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/pizza_provider.dart';
import '../../routes/app_routes.dart';
import '../../widgets/food_network_image.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Log Out?', style: TextStyle(fontWeight: FontWeight.w800)),
        content: const Text('Are you sure you want to sign out from Crust & Co.?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<AuthProvider>().logout();
              Navigator.pushNamedAndRemoveUntil(context, AppRoutes.login, (route) => false);
            },
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }

  void _showHelpModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      backgroundColor: Colors.white,
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(22.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 16),
              const Text('Help & Support 💬', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
              const SizedBox(height: 14),
              _FaqItem(q: 'How fast is delivery?', a: 'Average delivery takes between 25-35 minutes.'),
              _FaqItem(q: 'Can I customize any pizza?', a: 'Yes! Tap any pizza to select sizes, crusts, and extra toppings.'),
              _FaqItem(q: 'Customer Support Hotline', a: 'Call toll-free: 1-800-CRUST-PIZZA or email support@crustco.com'),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final orderProv = context.watch<OrderProvider>();
    final pizzaProv = context.watch<PizzaProvider>();
    final addressProv = context.watch<AddressProvider>();
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Profile 👤'),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
        child: Column(
          children: [
            // User Profile Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 65,
                    height: 65,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primary, width: 2),
                    ),
                    child: ClipOval(
                      child: user != null && user.avatarUrl.isNotEmpty
                          ? FoodNetworkImage(
                              imageUrl: user.avatarUrl,
                              fit: BoxFit.cover,
                              fallbackEmoji: '👤',
                            )
                          : const Icon(Icons.person, size: 36, color: AppColors.primary),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.name ?? 'Alex Johnson',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user?.email ?? 'alex@example.com',
                          style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primarySoft,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'VIP Foodie 🍕',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.primaryDark),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit_outlined, color: AppColors.primary),
                    onPressed: () {
                      _showEditProfileModal(context);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Quick Stats Row
            Row(
              children: [
                _StatCard(label: 'Orders', value: '${orderProv.orders.length}', icon: Icons.receipt_long_rounded),
                const SizedBox(width: 10),
                _StatCard(label: 'Favorites', value: '${pizzaProv.favoriteIds.length}', icon: Icons.favorite_rounded),
                const SizedBox(width: 10),
                _StatCard(label: 'Addresses', value: '${addressProv.addresses.length}', icon: Icons.location_on_rounded),
              ],
            ),
            const SizedBox(height: 20),

            // Navigation Menu Options
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  _ProfileMenuItem(
                    icon: Icons.location_on_outlined,
                    title: 'Saved Addresses',
                    subtitle: 'Manage your delivery locations',
                    onTap: () => Navigator.pushNamed(context, AppRoutes.savedAddresses),
                  ),
                  const Divider(height: 1, indent: 60),
                  _ProfileMenuItem(
                    icon: Icons.payment_outlined,
                    title: 'Payment Methods',
                    subtitle: 'Credit cards & digital wallets',
                    onTap: () => Navigator.pushNamed(context, AppRoutes.paymentMethods),
                  ),
                  const Divider(height: 1, indent: 60),
                  _ProfileMenuItem(
                    icon: Icons.settings_outlined,
                    title: 'Settings & Preferences',
                    subtitle: 'Notifications, currency, and theme',
                    onTap: () => Navigator.pushNamed(context, AppRoutes.settings),
                  ),
                  const Divider(height: 1, indent: 60),
                  _ProfileMenuItem(
                    icon: Icons.help_outline_rounded,
                    title: 'Help & FAQ',
                    subtitle: 'Customer support hotline & questions',
                    onTap: () => _showHelpModal(context),
                  ),
                  const Divider(height: 1, indent: 60),
                  _ProfileMenuItem(
                    icon: Icons.info_outline_rounded,
                    title: 'About ${AppConstants.appName}',
                    subtitle: 'Version 1.0.0 (Production Build)',
                    onTap: () {
                      showAboutDialog(
                        context: context,
                        applicationName: AppConstants.appName,
                        applicationVersion: '1.0.0',
                        applicationLegalese: '© 2026 Crust & Co. All rights reserved.',
                        applicationIcon: const Text('🍕', style: TextStyle(fontSize: 32)),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Logout Tile
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.error.withOpacity(0.3)),
              ),
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AppColors.errorLight, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.logout_rounded, color: AppColors.error, size: 20),
                ),
                title: const Text(
                  'Log Out',
                  style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.error, fontSize: 15),
                ),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppColors.error),
                onTap: () => _showLogoutDialog(context),
              ),
            ),
            const SizedBox(height: 36),
          ],
        ),
      ),
    );
  }

  void _showEditProfileModal(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final nameCtrl = TextEditingController(text: auth.currentUser?.name ?? '');
    final phoneCtrl = TextEditingController(text: auth.currentUser?.phone ?? '');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Edit Profile', style: TextStyle(fontWeight: FontWeight.w800)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Full Name'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: phoneCtrl,
              decoration: const InputDecoration(labelText: 'Phone Number'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              auth.updateProfile(name: nameCtrl.text.trim(), phone: phoneCtrl.text.trim());
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(height: 6),
            Text(
              value,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileMenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ProfileMenuItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primarySoft,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppColors.primary, size: 20),
      ),
      title: Text(
        title,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
      ),
      trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppColors.textMuted),
    );
  }
}

class _FaqItem extends StatelessWidget {
  final String q;
  final String a;

  const _FaqItem({required this.q, required this.a});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(q, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.textPrimary)),
          const SizedBox(height: 2),
          Text(a, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
