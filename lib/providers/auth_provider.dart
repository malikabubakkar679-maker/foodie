import 'package:flutter/material.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _currentUser = const UserModel(
    id: 'u_101',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  );

  bool _isAuthenticated = true;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<bool> login({
    required String email,
    required String password,
    bool rememberMe = true,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    // Simulated network delay
    await Future.delayed(const Duration(milliseconds: 700));

    if (email.trim().isEmpty || !email.contains('@')) {
      _errorMessage = 'Please enter a valid email address.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (password.length < 6) {
      _errorMessage = 'Password must be at least 6 characters.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    _currentUser = UserModel(
      id: 'u_${DateTime.now().millisecondsSinceEpoch}',
      name: email.split('@').first.capitalize(),
      email: email.trim(),
      phone: '+1 (555) 234-5678',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    );
    _isAuthenticated = true;
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 700));

    if (name.trim().isEmpty) {
      _errorMessage = 'Please enter your full name.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (email.trim().isEmpty || !email.contains('@')) {
      _errorMessage = 'Please enter a valid email address.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    if (password.length < 6) {
      _errorMessage = 'Password must be at least 6 characters.';
      _isLoading = false;
      notifyListeners();
      return false;
    }

    _currentUser = UserModel(
      id: 'u_${DateTime.now().millisecondsSinceEpoch}',
      name: name.trim(),
      email: email.trim(),
      phone: '+1 (555) 234-5678',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    );
    _isAuthenticated = true;
    _isLoading = false;
    notifyListeners();
    return true;
  }

  void logout() {
    _currentUser = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  void updateProfile({String? name, String? phone, String? email}) {
    if (_currentUser == null) return;
    _currentUser = _currentUser!.copyWith(
      name: name ?? _currentUser!.name,
      phone: phone ?? _currentUser!.phone,
      email: email ?? _currentUser!.email,
    );
    notifyListeners();
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return '';
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}
