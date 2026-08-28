import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../core/utils/currency_formatter.dart';
import '../providers/pizza_provider.dart';
import 'custom_button.dart';

class FilterBottomSheet extends StatefulWidget {
  const FilterBottomSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      backgroundColor: Colors.white,
      builder: (_) => const FilterBottomSheet(),
    );
  }

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late bool _onlyVeg;
  late bool _onlySpicy;
  late double _maxPrice;
  late double _minRating;

  @override
  void initState() {
    super.initState();
    final prov = context.read<PizzaProvider>();
    _onlyVeg = prov.onlyVeg;
    _onlySpicy = prov.onlySpicy;
    _maxPrice = prov.maxPrice;
    _minRating = prov.minRating;
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.read<PizzaProvider>();

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
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
                const Text(
                  'Filter Products',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    prov.resetFilters();
                    Navigator.pop(context);
                  },
                  child: const Text(
                    'Reset',
                    style: TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            const Divider(),

            // Dietary Preferences
            const Text(
              'Dietary & Flavor',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: FilterChip(
                    label: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('🌱 '),
                        Text('Vegetarian'),
                      ],
                    ),
                    selected: _onlyVeg,
                    selectedColor: AppColors.primarySoft,
                    checkmarkColor: AppColors.primary,
                    onSelected: (val) {
                      setState(() {
                        _onlyVeg = val;
                      });
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: FilterChip(
                    label: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('🌶️ '),
                        Text('Spicy Only'),
                      ],
                    ),
                    selected: _onlySpicy,
                    selectedColor: AppColors.primarySoft,
                    checkmarkColor: AppColors.primary,
                    onSelected: (val) {
                      setState(() {
                        _onlySpicy = val;
                      });
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Price Range Slider
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Max Price',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  CurrencyFormatter.format(_maxPrice),
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryDark,
                  ),
                ),
              ],
            ),
            Slider(
              value: _maxPrice,
              min: 5.0,
              max: 30.0,
              divisions: 25,
              activeColor: AppColors.primary,
              inactiveColor: AppColors.border,
              onChanged: (val) {
                setState(() {
                  _maxPrice = val;
                });
              },
            ),
            const SizedBox(height: 10),

            // Minimum Rating
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Minimum Rating',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                Row(
                  children: [
                    const Icon(Icons.star_rounded, color: AppColors.starGold, size: 18),
                    const SizedBox(width: 4),
                    Text(
                      _minRating > 0 ? '${_minRating.toStringAsFixed(1)}+' : 'Any',
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            Slider(
              value: _minRating,
              min: 0.0,
              max: 5.0,
              divisions: 10,
              activeColor: AppColors.primary,
              inactiveColor: AppColors.border,
              onChanged: (val) {
                setState(() {
                  _minRating = val;
                });
              },
            ),
            const SizedBox(height: 20),

            CustomButton(
              text: 'Apply Filters',
              onPressed: () {
                prov.applyFilters(
                  onlyVeg: _onlyVeg,
                  onlySpicy: _onlySpicy,
                  maxPrice: _maxPrice,
                  minRating: _minRating,
                );
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
