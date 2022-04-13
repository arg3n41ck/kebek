export interface ApiResponse<T>{
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
    page_count: number;
}
