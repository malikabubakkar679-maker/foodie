import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/currency_formatter.dart';
import '../../models/cart_item.dart';
import '../../models/pizza_item.dart';
import '../../providers/cart_provider.dart';
import '../../providers/pizza_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/food_network_image.dart';
import '../../widgets/quantity_stepper.dart';

class PizzaDetailsScreen extends StatefulWidget {
  final PizzaItem pizza;

  const PizzaDetailsScreen({
    super.key,
    required this.pizza,
  });

  @override
  State<PizzaDetailsScreen> createState() => _PizzaDetailsScreenState();
}

class _PizzaDetailsScreenState extends State<PizzaDetailsScreen> {
  late PizzaSize _selectedSize;
  late PizzaCrust _selectedCrust;
  final List<ToppingItem> _selectedToppings = [];
  final TextEditingController _specialNotesController = TextEditingController();
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    _selectedSize = widget.pizza.availableSizes.isNotEmpty
        ? widget.pizza.availableSizes.first
        : PizzaSize.standardSizes.first;
    _selectedCrust = widget.pizza.availableCrusts.isNotEmpty
        ? widget.pizza.availableCrusts.first
        : PizzaCrust.standardCrusts.first;
  }

  @override
  void dispose() {
    _specialNotesController.dispose();
    super.dispose();
  }

  double get _calculatedUnitPrice {
    double price = widget.pizza.basePrice + _selectedSize.extraPrice + _selectedCrust.extraPrice;
    for (final topping in _selectedToppings) {
      price += topping.price;
    }
    return price;
  }

  double get _calculatedTotalPrice => _calculatedUnitPrice * _quantity;

  void _handleAddToCart() {
    final cart = context.read<CartProvider>();
    final cartItem = CartItem(
      id: 'ci_${DateTime.now().millisecondsSinceEpoch}',
      pizza: widget.pizza,
      selectedSize: _selectedSize,
      selectedCrust: _selectedCrust,
      selectedToppings: List.from(_selectedToppings),
      quantity: _quantity,
      specialInstructions: _specialNotesController.text.trim(),
    );

    cart.addToCart(cartItem);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Text('🍕 ', style: TextStyle(fontSize: 18)),
            Expanded(
              child: Text(
                'Added $_quantity× ${widget.pizza.name} (${_selectedSize.name}) to cart!',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.textPrimary,
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final pizzaProvider = context.watch<PizzaProvider>();
    final isFav = pizzaProvider.isFavorite(widget.pizza.id);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // App Bar with Pizza Hero Image
          SliverAppBar(
            expandedHeight: 330,
            pinned: true,
            backgroundColor: AppColors.background,
            elevation: 0,
            leading: Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircleAvatar(
                backgroundColor: Colors.white,
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: AppColors.textPrimary),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: CircleAvatar(
                  backgroundColor: Colors.white,
                  child: IconButton(
                    icon: Icon(
                      isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                      color: isFav ? AppColors.favoriteRed : AppColors.textMuted,
                      size: 20,
                    ),
                    onPressed: () => pizzaProvider.toggleFavorite(widget.pizza.id),
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Center(
                child: Hero(
                  tag: 'pizza_image_${widget.pizza.id}',
                  child: Container(
                    width: 250,
                    height: 250,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withOpacity(0.25),
                          blurRadius: 36,
                          offset: const Offset(0, 14),
                        ),
                      ],
                    ),
                    child: ClipOval(
                      child: FoodNetworkImage(
                        imageUrl: widget.pizza.imageUrl,
                        fit: BoxFit.cover,
                        fallbackEmoji: '🍕',
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Details Body
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x08000000),
                    blurRadius: 20,
                    offset: Offset(0, -6),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(22.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title & Base Price
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.pizza.name,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                color: AppColors.textPrimary,
                                letterSpacing: -0.5,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(Icons.star_rounded, color: AppColors.starGold, size: 20),
                                const SizedBox(width: 4),
                                Text(
                                  widget.pizza.rating.toStringAsFixed(1),
                                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  '(${widget.pizza.reviewsCount} reviews)',
                                  style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.primarySoft,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Text(
                          CurrencyFormatter.format(_calculatedUnitPrice),
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: AppColors.primaryDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Quick info pills (Prep time, Calories, Category)
                  Row(
                    children: [
                      _InfoChip(icon: Icons.timer_outlined, label: '${widget.pizza.prepTimeMinutes} mins'),
                      const SizedBox(width: 10),
                      _InfoChip(icon: Icons.local_fire_department_outlined, label: '${widget.pizza.calories} kcal'),
                      const SizedBox(width: 10),
                      if (widget.pizza.isVegetarian)
                        const _InfoChip(icon: Icons.eco_outlined, label: 'Vegetarian', color: AppColors.success)
                      else if (widget.pizza.isSpicy)
                        const _InfoChip(icon: Icons.whatshot_rounded, label: 'Spicy', color: AppColors.error),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Description
                  const Text(
                    'Description',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.pizza.description,
                    style: const TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.5),
                  ),
                  const SizedBox(height: 18),

                  // Ingredients Chips
                  const Text(
                    'Key Ingredients',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.pizza.ingredients.map((ing) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceVariant,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          ing,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                        ),
                      );
                    }).toList(),
                  ),
                  const Divider(height: 36),

                  // 1. SIZE SELECTOR
                  const Text(
                    '1. Choose Size',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: widget.pizza.availableSizes.map((size) {
                      final isSelected = _selectedSize.name == size.name;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedSize = size),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            margin: const EdgeInsets.only(right: 8),
                            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.primarySoft : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? AppColors.primary : AppColors.border,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Column(
                              children: [
                                Text(
                                  size.name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
                                    color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${size.inches}"',
                                  style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  size.extraPrice > 0 ? '+${CurrencyFormatter.format(size.extraPrice)}' : 'Included',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: isSelected ? AppColors.primary : AppColors.textMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),

                  // 2. CRUST SELECTOR
                  const Text(
                    '2. Choose Crust',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 10),
                  ...widget.pizza.availableCrusts.map((crust) {
                    final isSelected = _selectedCrust.name == crust.name;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCrust = crust),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primarySoft : AppColors.surfaceVariant,
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
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    crust.name,
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                                    ),
                                  ),
                                  Text(
                                    crust.description,
                                    style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              crust.extraPrice > 0 ? '+${CurrencyFormatter.format(crust.extraPrice)}' : 'Free',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 20),

                  // 3. EXTRA TOPPINGS MULTI-SELECT
                  const Text(
                    '3. Add Extra Toppings',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.pizza.availableToppings.map((topping) {
                      final isSelected = _selectedToppings.any((t) => t.id == topping.id);
                      return FilterChip(
                        label: Text('${topping.icon} ${topping.name} (+${CurrencyFormatter.format(topping.price)})'),
                        selected: isSelected,
                        selectedColor: AppColors.primarySoft,
                        checkmarkColor: AppColors.primary,
                        backgroundColor: Colors.white,
                        side: BorderSide(color: isSelected ? AppColors.primary : AppColors.border),
                        labelStyle: TextStyle(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                          color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                        ),
                        onSelected: (val) {
                          setState(() {
                            if (val) {
                              _selectedToppings.add(topping);
                            } else {
                              _selectedToppings.removeWhere((t) => t.id == topping.id);
                            }
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),

                  // Special cooking instructions
                  const Text(
                    'Special Cooking Instructions',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _specialNotesController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Well done, extra crispy, sauce on the side...',
                    ),
                  ),
                  const SizedBox(height: 100), // padding for sticky bottom bar
                ],
              ),
            ),
          ),
        ],
      ),

      // Sticky Bottom Action Bar: Quantity + Add To Cart Button
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
          child: Row(
            children: [
              // Quantity Stepper
              QuantityStepper(
                quantity: _quantity,
                onIncrement: () => setState(() => _quantity++),
                onDecrement: () {
                  if (_quantity > 1) setState(() => _quantity--);
                },
                size: 42,
              ),
              const SizedBox(width: 14),

              // Add to Cart Button with dynamic total price
              Expanded(
                child: CustomButton(
                  text: 'Add to Cart — ${CurrencyFormatter.format(_calculatedTotalPrice)}',
                  onPressed: _handleAddToCart,
                  height: 52,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;

  const _InfoChip({
    required this.icon,
    required this.label,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: (color ?? AppColors.primary).withOpacity(0.08),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color ?? AppColors.primary),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: color ?? AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
