import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../data/mock_categories.dart';
import '../providers/pizza_provider.dart';
import 'food_network_image.dart';

class CircularCategoryList extends StatelessWidget {
  const CircularCategoryList({super.key});

  @override
  Widget build(BuildContext context) {
    final pizzaProvider = context.watch<PizzaProvider>();
    final categories = MockCategories.categories;
    final selectedCategory = pizzaProvider.selectedCategory;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 18.0, vertical: 6.0),
          child: Text(
            'Categories',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
              letterSpacing: -0.3,
            ),
          ),
        ),
        SizedBox(
          height: 110,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 4.0),
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: categories.length,
            separatorBuilder: (_, __) => const SizedBox(width: 14),
            itemBuilder: (context, index) {
              final category = categories[index];
              final isSelected = selectedCategory == category.id;

              return GestureDetector(
                onTap: () {
                  pizzaProvider.selectCategory(category.id);
                },
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Circular Avatar with border & shadow
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeInOut,
                      width: 64,
                      height: 64,
                      padding: const EdgeInsets.all(3),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isSelected ? AppColors.primary : Colors.white,
                        border: Border.all(
                          color: isSelected ? AppColors.primary : AppColors.border,
                          width: isSelected ? 2.5 : 1.2,
                        ),
                        boxShadow: [
                          if (isSelected)
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.35),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            )
                          else
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                        ],
                      ),
                      child: Container(
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.surfaceVariant,
                        ),
                        child: ClipOval(
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              FoodNetworkImage(
                                imageUrl: category.imageUrl,
                                fit: BoxFit.cover,
                                fallbackEmoji: category.iconEmoji,
                              ),
                              // Soft dark overlay for emoji badge
                              if (category.id == 'all')
                                Container(
                                  color: AppColors.primaryDark.withOpacity(0.2),
                                  child: Center(
                                    child: Text(
                                      category.iconEmoji,
                                      style: const TextStyle(fontSize: 26),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),

                    // Category Name
                    AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                        color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                      ),
                      child: Text(category.name),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
