class PromoBanner {
  final String id;
  final String title;
  final String subtitle;
  final String discountTag;
  final String code;
  final String buttonText;
  final String imageUrl;

  const PromoBanner({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.discountTag,
    required this.code,
    this.buttonText = 'Order Now',
    required this.imageUrl,
  });
}

class MockPromos {
  MockPromos._();

  static const List<PromoBanner> banners = [
    PromoBanner(
      id: 'b1',
      title: '50% OFF',
      subtitle: 'On your first artisanal pizza order',
      discountTag: 'LIMITED TIME',
      code: 'PIZZA50',
      buttonText: 'Claim Offer',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    ),
    PromoBanner(
      id: 'b2',
      title: 'Free Delivery',
      subtitle: 'On all orders above \$35 today',
      discountTag: 'TODAY SPECIAL',
      code: 'FREESHIP',
      buttonText: 'Order Now',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
    ),
    PromoBanner(
      id: 'b3',
      title: 'Extra 20% Cheesy',
      subtitle: 'Use code CHEESE20 on all four-cheese & burst pizzas',
      discountTag: 'CHEESE LOVER',
      code: 'CHEESE20',
      buttonText: 'Get Cheesy',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
    ),
  ];
}
