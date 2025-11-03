import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  gst: number;
  stock: number;
  category: string;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  gst_no: string;
  phone: string;
  opening_balance: number;
  balance_type: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface GstRate {
  id: string;
  rate: number;
  description: string;
}

export interface Sale {
  id: string;
  invoice_number: number;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  items: any[];
  subtotal: number;
  total_gst: number;
  total_amount: number;
  payment_method: string;
}

export interface Purchase {
  id: string;
  invoice_number: number;
  date: string;
  time: string;
  supplier_id?: string;
  supplier_name: string;
  supplier_phone: string;
  items: any[];
  subtotal: number;
  total_gst: number;
  total_amount: number;
  payment_method: string;
}

export const db = {
  products: {
    async getAll() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    async create(product: Omit<Product, 'id'>) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async update(id: string, product: Partial<Product>) {
      const { data, error } = await supabase
        .from('products')
        .update({ ...product, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  suppliers: {
    async getAll() {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    async create(supplier: Omit<Supplier, 'id'>) {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async update(id: string, supplier: Partial<Supplier>) {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplier)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  categories: {
    async getAll() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    async create(category: Omit<Category, 'id'>) {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async update(id: string, category: Partial<Category>) {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  gstRates: {
    async getAll() {
      const { data, error } = await supabase
        .from('gst_rates')
        .select('*')
        .order('rate');
      if (error) throw error;
      return data || [];
    },
    async create(gstRate: Omit<GstRate, 'id'>) {
      const { data, error } = await supabase
        .from('gst_rates')
        .insert(gstRate)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async update(id: string, gstRate: Partial<GstRate>) {
      const { data, error } = await supabase
        .from('gst_rates')
        .update(gstRate)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('gst_rates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  },

  sales: {
    async getAll() {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(sale: Omit<Sale, 'id'>) {
      const { data, error } = await supabase
        .from('sales')
        .insert(sale)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async getNextInvoiceNumber() {
      const { data, error } = await supabase
        .from('sales')
        .select('invoice_number')
        .order('invoice_number', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ? data.invoice_number + 1 : 1001;
    }
  },

  purchases: {
    async getAll() {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(purchase: Omit<Purchase, 'id'>) {
      const { data, error } = await supabase
        .from('purchases')
        .insert(purchase)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async getNextInvoiceNumber() {
      const { data, error } = await supabase
        .from('purchases')
        .select('invoice_number')
        .order('invoice_number', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ? data.invoice_number + 1 : 2001;
    }
  },

  shopProfile: {
    async getAll() {
      const { data, error } = await supabase
        .from('shop_profile')
        .select('*');
      if (error) throw error;
      return data || [];
    },
    async create(profile: any) {
      const { data, error } = await supabase
        .from('shop_profile')
        .insert(profile)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async update(id: string, profile: any) {
      const { data, error } = await supabase
        .from('shop_profile')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }
};
