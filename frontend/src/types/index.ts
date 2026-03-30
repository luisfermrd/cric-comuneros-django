export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'operator';
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Territory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Comunero {
  id: number;
  document_type: string;
  document_number: string;
  first_name: string;
  second_name: string;
  first_last_name: string;
  second_last_name: string;
  birth_date: string;
  sex: string;
  phone: string;
  email: string;
  is_active: boolean;
  territory: number;
  territory_detail: Territory;
  full_name: string;
  age: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Stats {
  total_comuneros: number;
  active_comuneros: number;
  inactive_comuneros: number;
  by_gender: { MASCULINO: number; FEMENINO: number };
  by_territory: { territory_id: number; territory_name: string; count: number }[];
}
