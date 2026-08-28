class AddressModel {
  final String id;
  final String title; // Home, Work, Other
  final String street;
  final String city;
  final String zipCode;
  final String phone;
  final String deliveryNote;
  final bool isDefault;

  const AddressModel({
    required this.id,
    required this.title,
    required this.street,
    required this.city,
    required this.zipCode,
    required this.phone,
    this.deliveryNote = '',
    this.isDefault = false,
  });

  String get fullAddress => '$street, $city, $zipCode';

  AddressModel copyWith({
    String? id,
    String? title,
    String? street,
    String? city,
    String? zipCode,
    String? phone,
    String? deliveryNote,
    bool? isDefault,
  }) {
    return AddressModel(
      id: id ?? this.id,
      title: title ?? this.title,
      street: street ?? this.street,
      city: city ?? this.city,
      zipCode: zipCode ?? this.zipCode,
      phone: phone ?? this.phone,
      deliveryNote: deliveryNote ?? this.deliveryNote,
      isDefault: isDefault ?? this.isDefault,
    );
  }
}
