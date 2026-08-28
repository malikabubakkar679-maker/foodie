export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          image: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          icon: string;
          image: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          image?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          rating: number;
          reviews_count: number;
          prep_time: number;
          calories: number;
          is_veg: boolean;
          is_spicy: boolean;
          is_popular: boolean;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description: string;
          rating?: number;
          reviews_count?: number;
          prep_time?: number;
          calories?: number;
          is_veg?: boolean;
          is_spicy?: boolean;
          is_popular?: boolean;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          rating?: number;
          reviews_count?: number;
          prep_time?: number;
          calories?: number;
          is_veg?: boolean;
          is_spicy?: boolean;
          is_popular?: boolean;
          image_url?: string;
          created_at?: string;
        };
      };
      product_sizes: {
        Row: {
          id: string;
          product_id: string;
          size: 'small' | 'medium' | 'large';
          price: number;
          extra_price: number;
          inches: string;
          image_url: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size: 'small' | 'medium' | 'large';
          price: number;
          extra_price?: number;
          inches: string;
          image_url: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          size?: 'small' | 'medium' | 'large';
          price?: number;
          extra_price?: number;
          inches?: string;
          image_url?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          address: string;
          city: string;
          phone: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          address: string;
          city: string;
          phone: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          address?: string;
          city?: string;
          phone?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
          step: number;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          delivery_address: string;
          driver_name: string;
          driver_phone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
          step?: number;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          delivery_address: string;
          driver_name?: string;
          driver_phone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
          step?: number;
          subtotal?: number;
          delivery_fee?: number;
          discount?: number;
          total?: number;
          delivery_address?: string;
          driver_name?: string;
          driver_phone?: string;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          size: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          image_url: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          size: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          image_url: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          size?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          image_url?: string;
        };
      };
    };
  };
}
