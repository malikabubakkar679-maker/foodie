import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../models/address_model.dart';
import '../../providers/address_provider.dart';
import '../../widgets/custom_button.dart';

class SavedAddressesScreen extends StatelessWidget {
  const SavedAddressesScreen({super.key});

  void _showAddEditAddressDialog(BuildContext context, [AddressModel? existing]) {
    final titleCtrl = TextEditingController(text: existing?.title ?? 'Home');
    final streetCtrl = TextEditingController(text: existing?.street ?? '');
    final cityCtrl = TextEditingController(text: existing?.city ?? 'New York, NY');
    final phoneCtrl = TextEditingController(text: existing?.phone ?? '+1 (555) 000-0000');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(existing != null ? 'Edit Address' : 'Add New Address', style: const TextStyle(fontWeight: FontWeight.w800)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: 'Label (e.g. Home, Work)')),
              const SizedBox(height: 10),
              TextField(controller: streetCtrl, decoration: const InputDecoration(labelText: 'Street Address')),
              const SizedBox(height: 10),
              TextField(controller: cityCtrl, decoration: const InputDecoration(labelText: 'City, State')),
              const SizedBox(height: 10),
              TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'Phone')),
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
              final addrProv = context.read<AddressProvider>();

              if (existing != null) {
                final updated = existing.copyWith(
                  title: titleCtrl.text.trim(),
                  street: streetCtrl.text.trim(),
                  city: cityCtrl.text.trim(),
                  phone: phoneCtrl.text.trim(),
                );
                addrProv.updateAddress(updated);
              } else {
                final newAddr = AddressModel(
                  id: 'addr_${DateTime.now().millisecondsSinceEpoch}',
                  title: titleCtrl.text.trim(),
                  street: streetCtrl.text.trim(),
                  city: cityCtrl.text.trim(),
                  zipCode: '10001',
                  phone: phoneCtrl.text.trim(),
                );
                addrProv.addAddress(newAddr);
              }
              Navigator.pop(ctx);
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final addressProv = context.watch<AddressProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Saved Addresses 📍'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView.builder(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
        itemCount: addressProv.addresses.length,
        itemBuilder: (context, index) {
          final addr = addressProv.addresses[index];
          final isDefault = addr.isDefault;

          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isDefault ? AppColors.primary : AppColors.border,
                width: isDefault ? 1.8 : 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          addr.title.toLowerCase() == 'home'
                              ? Icons.home_rounded
                              : addr.title.toLowerCase() == 'work'
                                  ? Icons.work_rounded
                                  : Icons.location_on_rounded,
                          color: AppColors.primary,
                          size: 22,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          addr.title,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                        ),
                        if (isDefault) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primarySoft,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'Default',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.primaryDark),
                            ),
                          ),
                        ],
                      ],
                    ),
                    PopupMenuButton<String>(
                      icon: const Icon(Icons.more_vert_rounded, color: AppColors.textSecondary),
                      onSelected: (val) {
                        if (val == 'edit') {
                          _showAddEditAddressDialog(context, addr);
                        } else if (val == 'default') {
                          addressProv.setDefaultAddress(addr.id);
                        } else if (val == 'delete') {
                          addressProv.deleteAddress(addr.id);
                        }
                      },
                      itemBuilder: (ctx) => [
                        if (!isDefault)
                          const PopupMenuItem(value: 'default', child: Text('Set as Default')),
                        const PopupMenuItem(value: 'edit', child: Text('Edit')),
                        if (addressProv.addresses.length > 1)
                          const PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: AppColors.error))),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  addr.fullAddress,
                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
                ),
                const SizedBox(height: 4),
                Text(
                  'Phone: ${addr.phone}',
                  style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        child: SafeArea(
          child: CustomButton(
            text: '+ Add New Address',
            onPressed: () => _showAddEditAddressDialog(context),
          ),
        ),
      ),
    );
  }
}
