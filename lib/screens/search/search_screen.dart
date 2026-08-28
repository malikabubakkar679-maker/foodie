import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../data/mock_categories.dart';
import '../../providers/pizza_provider.dart';
import '../../widgets/empty_state_widget.dart';
import '../../widgets/pizza_card.dart';
import '../../widgets/search_bar_widget.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final List<String> _recentSearches = ['Pepperoni', 'Margherita', 'BBQ Chicken', 'Truffle'];
  final List<String> _popularTags = ['🔥 Pepperoni', '🌱 Veggie', '🧀 Cheese Burst', '🌶️ Spicy', '🍄 Mushroom'];

  @override
  void initState() {
    super.initState();
    final prov = context.read<PizzaProvider>();
    _searchController.text = prov.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pizzaProvider = context.watch<PizzaProvider>();
    final products = pizzaProvider.filteredPizzas;
    final categories = MockCategories.categories;
    final isSearching = _searchController.text.trim().isNotEmpty;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Search & Explore'),
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                onPressed: () => Navigator.pop(context),
              )
            : null,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Bar Input
            SearchBarWidget(
              controller: _searchController,
              hintText: 'Search by pizza name, ingredient...',
              onChanged: (val) {
                pizzaProvider.setSearchQuery(val);
              },
            ),

            // Horizontal Category Chips
            SizedBox(
              height: 42,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 18.0),
                scrollDirection: Axis.horizontal,
                itemCount: categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final isSelected = pizzaProvider.selectedCategory == cat.id;

                  return FilterChip(
                    label: Text('${cat.iconEmoji} ${cat.name}'),
                    selected: isSelected,
                    selectedColor: AppColors.primarySoft,
                    checkmarkColor: AppColors.primary,
                    labelStyle: TextStyle(
                      fontSize: 13,
                      fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                      color: isSelected ? AppColors.primaryDark : AppColors.textPrimary,
                    ),
                    onSelected: (_) {
                      pizzaProvider.selectCategory(cat.id);
                    },
                  );
                },
              ),
            ),
            const SizedBox(height: 10),

            // Recent & Popular tags (if search query is empty)
            if (!isSearching && pizzaProvider.selectedCategory == 'all') ...[
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Recent Searches
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Recent Searches',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        if (_recentSearches.isNotEmpty)
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                _recentSearches.clear();
                              });
                            },
                            child: const Text(
                              'Clear',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textMuted,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _recentSearches.map((tag) {
                        return InkWell(
                          onTap: () {
                            _searchController.text = tag;
                            pizzaProvider.setSearchQuery(tag);
                          },
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.history_rounded, size: 14, color: AppColors.textMuted),
                                const SizedBox(width: 4),
                                Text(
                                  tag,
                                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),

                    // Popular Keywords
                    const Text(
                      'Popular Searches',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _popularTags.map((tag) {
                        final cleanTag = tag.replaceAll(RegExp(r'[^\w\s]'), '').trim();
                        return ActionChip(
                          label: Text(tag),
                          backgroundColor: Colors.white,
                          side: const BorderSide(color: AppColors.border),
                          onPressed: () {
                            _searchController.text = cleanTag;
                            pizzaProvider.setSearchQuery(cleanTag);
                          },
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              const Divider(height: 24),
            ],

            // Search Results Count Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 4.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${products.length} Products Found',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  if (pizzaProvider.searchQuery.isNotEmpty || pizzaProvider.selectedCategory != 'all')
                    GestureDetector(
                      onTap: () {
                        _searchController.clear();
                        pizzaProvider.resetFilters();
                      },
                      child: const Text(
                        'Reset Filters',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 6),

            // Products Grid
            Expanded(
              child: products.isEmpty
                  ? EmptyStateWidget(
                      emoji: '🔍',
                      title: 'No Pizzas Match',
                      description: 'We couldn’t find any items matching "${_searchController.text}". Try another craving.',
                      buttonText: 'Clear Search',
                      onButtonPressed: () {
                        _searchController.clear();
                        pizzaProvider.resetFilters();
                      },
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 10.0),
                      physics: const BouncingScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 14,
                        childAspectRatio: 0.68,
                      ),
                      itemCount: products.length,
                      itemBuilder: (context, index) {
                        return PizzaCard(pizza: products[index]);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
