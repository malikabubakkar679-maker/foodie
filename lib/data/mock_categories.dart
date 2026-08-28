import '../models/category_item.dart';

class MockCategories {
  MockCategories._();

  static const List<CategoryItem> categories = [
    CategoryItem(
      id: 'all',
      name: 'All',
      iconEmoji: '🔥',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'pizza',
      name: 'Pizza',
      iconEmoji: '🍕',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'burgers',
      name: 'Burgers',
      iconEmoji: '🍔',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'pasta',
      name: 'Pasta',
      iconEmoji: '🍝',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=200&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'chicken',
      name: 'Chicken',
      iconEmoji: '🍗',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'drinks',
      name: 'Drinks',
      iconEmoji: '🥤',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'desserts',
      name: 'Desserts',
      iconEmoji: '🍰',
      imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&auto=format&fit=crop&q=80',
    ),
    CategoryItem(
      id: 'sides',
      name: 'Sides',
      iconEmoji: '🍟',
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=200&auto=format&fit=crop&q=80',
    ),
  ];
}
