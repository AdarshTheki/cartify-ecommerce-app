export interface TableQuery {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  select: string;
  sortOrder: 'asc' | 'desc';
}

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

export interface TableData<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string | null;

  // server controls
  totalDocs: number;
  page: number;
  limit: number;

  onPageChange: (page: number) => void;
  onSort: (key: string) => void;
}
