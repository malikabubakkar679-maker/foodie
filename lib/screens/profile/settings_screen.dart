import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _pushNotifications = true;
  bool _orderStatusAlerts = true;
  bool _promotionalEmails = false;
  bool _locationServices = true;
  String _selectedLanguage = 'English (US)';
  String _selectedCurrency = 'USD (\$)';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Settings ⚙️'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
        physics: const BouncingScrollPhysics(),
        children: [
          const Text(
            'Notifications',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text('Order Live Status Alerts', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: const Text('Realtime updates when your pizza is baking & dispatched', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  activeColor: AppColors.primary,
                  value: _orderStatusAlerts,
                  onChanged: (val) => setState(() => _orderStatusAlerts = val),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: const Text('Receive special flash deals and discount coupons', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  activeColor: AppColors.primary,
                  value: _pushNotifications,
                  onChanged: (val) => setState(() => _pushNotifications = val),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Promotional Emails', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: const Text('Weekly newsletter and weekend menu specials', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  activeColor: AppColors.primary,
                  value: _promotionalEmails,
                  onChanged: (val) => setState(() => _promotionalEmails = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const Text(
            'App Preferences',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text('Location Services', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: const Text('Automatically detect your closest pizza kitchen', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  activeColor: AppColors.primary,
                  value: _locationServices,
                  onChanged: (val) => setState(() => _locationServices = val),
                ),
                const Divider(height: 1),
                ListTile(
                  title: const Text('Language', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  trailing: Text(_selectedLanguage, style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.primary)),
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => SimpleDialog(
                        title: const Text('Select Language'),
                        children: ['English (US)', 'Español', 'Italiano', 'Français', 'Urdu / Hindi'].map((lang) {
                          return SimpleDialogOption(
                            onPressed: () {
                              setState(() => _selectedLanguage = lang);
                              Navigator.pop(ctx);
                            },
                            child: Text(lang),
                          );
                        }).toList(),
                      ),
                    );
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  title: const Text('Currency', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  trailing: Text(_selectedCurrency, style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.primary)),
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => SimpleDialog(
                        title: const Text('Select Currency'),
                        children: ['USD (\$)', 'EUR (€)', 'GBP (£)', 'CAD (\$)'].map((curr) {
                          return SimpleDialogOption(
                            onPressed: () {
                              setState(() => _selectedCurrency = curr);
                              Navigator.pop(ctx);
                            },
                            child: Text(curr),
                          );
                        }).toList(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const Text(
            'Legal & Security',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                ListTile(
                  title: const Text('Privacy Policy', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppColors.textMuted),
                  onTap: () {},
                ),
                const Divider(height: 1),
                ListTile(
                  title: const Text('Terms of Service', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppColors.textMuted),
                  onTap: () {},
                ),
                const Divider(height: 1),
                ListTile(
                  title: const Text('Clear Local Cache', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.error)),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Cache cleared successfully! 🧹'), backgroundColor: AppColors.success),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
