import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/pizza_provider.dart';
import '../../routes/app_routes.dart';
import '../../widgets/app_header.dart';
import '../../widgets/circular_category_list.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/location_greeting.dart';
import '../../widgets/pizza_card.dart';
import '../../widgets/promo_banner_slider.dart';
import '../../widgets/search_bar_widget.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final pizzaProvider = context.watch<PizzaProvider>();
    final products = pizzaProvider.filteredPizzas;
    final selectedCat = pizzaProvider.selectedCategory;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            await Future.delayed(const Duration(milliseconds: 500));
            pizzaProvider.resetFilters();
          },
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
            slivers: [
              // Top Header (Logo, Cart Badge, Profile)
              const SliverToBoxAdapter(
                child: AppHeader(),
              ),

              // Location & Greeting
              const SliverToBoxAdapter(
                child: LocationGreeting(),
              ),

              // Search Bar
              SliverToBoxAdapter(
                child: SearchBarWidget(
                  readOnly: true,
                  onTap: () {
                    Navigator.pushNamed(context, AppRoutes.search);
                  },
                ),
              ),

              const SliverToBoxAdapter(
                child: SizedBox(height: 6),
              ),

              // Circular Category List
              const SliverToBoxAdapter(
                child: CircularCategoryList(),
              ),

              const SliverToBoxAdapter(
                child: SizedBox(height: 12),
              ),

              // Featured / Promo Banner
              const SliverToBoxAdapter(
                child: PromoBannerSlider(),
              ),

              const SliverToBoxAdapter(
                child: SizedBox(height: 20),
              ),

              // Section Header: "Popular Near You" / "Selected Category" + "See All"
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 18.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text(
                            selectedCat == 'all'
                                ? 'Popular Near You 🔥'
                                : '${selectedCat[0].toUpperCase()}${selectedCat.substring(1)} Menu',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textPrimary,
                              letterSpacing: -0.3,
                            ),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: () {
                          pizzaProvider.selectCategory('all');
                          Navigator.pushNamed(context, AppRoutes.search);
                        },
                        child: const Text(
                          'See All',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(
                child: SizedBox(height: 12),
              ),

              // 2-Column Responsive Product Grid
              if (products.isEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(32.0),
                    child: EmptyStateWidget(
                      emoji: '🍕',
                      title: 'No pizzas found',
                      description: 'Try choosing another category or clearing your search filters.',
                      buttonText: 'Show All Pizzas',
                      onButtonPressed: () => pizzaProvider.resetFilters(),
                    ),
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 18.0),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 14,
                      childAspectRatio: 0.68,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final pizza = products[index];
                        return PizzaCard(pizza: pizza);
                      },
                      childCount: products.length,
                    ),
                  ),
                ),

              const SliverToBoxAdapter(
                child: SizedBox(height: 32),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
