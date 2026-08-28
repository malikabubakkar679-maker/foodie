import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/theme/app_colors.dart';
import '../core/utils/currency_formatter.dart';
import '../models/pizza_item.dart';
import '../providers/cart_provider.dart';
import '../providers/pizza_provider.dart';
import '../routes/app_routes.dart';
import 'food_network_image.dart';

class PizzaCard extends StatelessWidget {
  final PizzaItem pizza;

  const PizzaCard({
    super.key,
    required this.pizza,
  });

  @override
  Widget build(BuildContext context) {
    final pizzaProvider = context.watch<PizzaProvider>();
    final cartProvider = context.read<CartProvider>();
    final isFav = pizzaProvider.isFavorite(pizza.id);

    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(
          context,
          AppRoutes.pizzaDetails,
          arguments: pizza,
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.border, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Stack: Circular/Rounded Pizza Image + Favorite Heart Button
              Stack(
                alignment: Alignment.topRight,
                children: [
                  Center(
                    child: Hero(
                      tag: 'pizza_image_${pizza.id}',
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.18),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: FoodNetworkImage(
                            imageUrl: pizza.imageUrl,
                            fit: BoxFit.cover,
                            fallbackEmoji: '🍕',
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Favorite Heart Button
                  GestureDetector(
                    onTap: () {
                      pizzaProvider.toggleFavorite(pizza.id);
                    },
                    child: Container(
                      padding: const EdgeInsets.all(7),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Icon(
                        isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                        color: isFav ? AppColors.favoriteRed : AppColors.textMuted,
                        size: 18,
                      ),
                    ),
                  ),

                  // Spicy / Veg Badge on top left
                  if (pizza.isSpicy || pizza.isVegetarian)
                    Positioned(
                      left: 0,
                      top: 0,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: pizza.isSpicy ? AppColors.errorLight : AppColors.successLight,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          pizza.isSpicy ? '🌶️ Spicy' : '🌱 Veg',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: pizza.isSpicy ? AppColors.error : AppColors.success,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 10),

              // Pizza Name
              Text(
                pizza.name,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                  height: 1.15,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),

              // Ingredients summary
              Text(
                pizza.ingredients.take(3).join(', '),
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),

              // Rating and Prep Time
              Row(
                children: [
                  const Icon(
                    Icons.star_rounded,
                    color: AppColors.starGold,
                    size: 16,
                  ),
                  const SizedBox(width: 3),
                  Text(
                    pizza.rating.toStringAsFixed(1),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '• ${pizza.prepTimeMinutes}m',
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
              const Spacer(),

              // Bottom Row: Price + Add Button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    CurrencyFormatter.format(pizza.basePrice),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppColors.primaryDark,
                    ),
                  ),

                  // Quick Add (+) Button
                  Material(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(12),
                    child: InkWell(
                      onTap: () {
                        cartProvider.quickAddPizza(pizza);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Row(
                              children: [
                                const Text('🍕 ', style: TextStyle(fontSize: 18)),
                                Expanded(
                                  child: Text('Added ${pizza.name} to cart!'),
                                ),
                              ],
                            ),
                            backgroundColor: AppColors.textPrimary,
                            duration: const Duration(seconds: 1),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        );
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.3),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.add_rounded,
                          color: Colors.white,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
