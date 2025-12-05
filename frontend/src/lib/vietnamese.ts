/**
 * Tiện ích xử lý tiếng Việt cho frontend
 * Hỗ trợ chuyển đổi tiếng Việt có dấu sang không dấu để tìm kiếm
 */

/**
 * Bảng chuyển đổi tiếng Việt có dấu sang không dấu
 */
export const VIETNAMESE_DIACRITICS_MAP: { [key: string]: string } = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
  'Đ': 'D',
  'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
};

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu sang không dấu
 * @param str Chuỗi cần chuyển đổi
 * @returns Chuỗi đã được chuyển đổi sang không dấu
 * @example
 * removeVietnameseDiacritics('Rau sạch') // 'Rau sach'
 * removeVietnameseDiacritics('Cải thìa') // 'Cai thia'
 */
export function removeVietnameseDiacritics(str: string): string {
  if (!str) return str;
  return str
    .split('')
    .map(char => VIETNAMESE_DIACRITICS_MAP[char] || char)
    .join('');
}

/**
 * Kiểm tra xem chuỗi có chứa ký tự tiếng Việt có dấu không
 * @param str Chuỗi cần kiểm tra
 * @returns true nếu có chứa ký tự tiếng Việt có dấu
 */
export function hasVietnameseDiacritics(str: string): boolean {
  if (!str) return false;
  return str.split('').some(char => VIETNAMESE_DIACRITICS_MAP[char] !== undefined);
}

/**
 * Tìm kiếm text hỗ trợ tiếng Việt có dấu và không dấu
 * @param text Text gốc cần tìm kiếm trong đó
 * @param searchTerm Từ khóa tìm kiếm
 * @returns true nếu text chứa searchTerm (có dấu hoặc không dấu)
 */
export function vietnameseSearch(text: string, searchTerm: string): boolean {
  if (!text || !searchTerm) return false;
  
  const normalizedText = removeVietnameseDiacritics(text).toLowerCase();
  const normalizedSearch = removeVietnameseDiacritics(searchTerm).toLowerCase();
  
  // Tìm kiếm cả text gốc (case insensitive) và text đã normalize
  return text.toLowerCase().includes(searchTerm.toLowerCase()) ||
         normalizedText.includes(normalizedSearch);
}

/**
 * Lọc mảng theo điều kiện tìm kiếm tiếng Việt
 * @param items Mảng cần lọc
 * @param searchTerm Từ khóa tìm kiếm
 * @param getSearchFields Hàm lấy các trường cần tìm kiếm từ mỗi item
 * @returns Mảng đã được lọc
 */
export function filterByVietnameseSearch<T>(
  items: T[],
  searchTerm: string,
  getSearchFields: (item: T) => string[]
): T[] {
  if (!searchTerm || !searchTerm.trim()) return items;
  
  const normalizedSearch = removeVietnameseDiacritics(searchTerm.trim()).toLowerCase();
  const originalSearch = searchTerm.trim().toLowerCase();
  
  return items.filter(item => {
    const fields = getSearchFields(item);
    return fields.some(field => {
      if (!field) return false;
      const normalizedField = removeVietnameseDiacritics(field).toLowerCase();
      return field.toLowerCase().includes(originalSearch) ||
             normalizedField.includes(normalizedSearch);
    });
  });
}
