import 'package:flutter/material.dart';
import '../data/mock_orders.dart';
import '../models/address_model.dart';

class AddressProvider extends ChangeNotifier {
  final List<AddressModel> _addresses = [
    MockOrders.defaultAddress,
    MockOrders.workAddress,
  ];

  late AddressModel _selectedAddress;

  AddressProvider() {
    _selectedAddress = _addresses.firstWhere(
      (a) => a.isDefault,
      orElse: () => _addresses.first,
    );
  }

  List<AddressModel> get addresses => _addresses;
  AddressModel get selectedAddress => _selectedAddress;

  void selectAddress(AddressModel address) {
    _selectedAddress = address;
    notifyListeners();
  }

  void addAddress(AddressModel address) {
    if (address.isDefault) {
      _resetDefaultFlags();
    }
    _addresses.add(address);
    if (address.isDefault || _addresses.length == 1) {
      _selectedAddress = address;
    }
    notifyListeners();
  }

  void updateAddress(AddressModel updatedAddress) {
    final index = _addresses.indexWhere((a) => a.id == updatedAddress.id);
    if (index >= 0) {
      if (updatedAddress.isDefault) {
        _resetDefaultFlags();
      }
      _addresses[index] = updatedAddress;
      if (_selectedAddress.id == updatedAddress.id) {
        _selectedAddress = updatedAddress;
      }
      notifyListeners();
    }
  }

  void deleteAddress(String id) {
    if (_addresses.length <= 1) return; // keep at least one address
    _addresses.removeWhere((a) => a.id == id);
    if (_selectedAddress.id == id) {
      _selectedAddress = _addresses.first;
    }
    notifyListeners();
  }

  void setDefaultAddress(String id) {
    _resetDefaultFlags();
    final index = _addresses.indexWhere((a) => a.id == id);
    if (index >= 0) {
      _addresses[index] = _addresses[index].copyWith(isDefault: true);
      _selectedAddress = _addresses[index];
      notifyListeners();
    }
  }

  void _resetDefaultFlags() {
    for (int i = 0; i < _addresses.length; i++) {
      if (_addresses[i].isDefault) {
        _addresses[i] = _addresses[i].copyWith(isDefault: false);
      }
    }
  }
}
