/**
 * Tiện ích xử lý tiếng Việt
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
 * Chuẩn hóa chuỗi tìm kiếm tiếng Việt
 * Trả về cả chuỗi gốc và chuỗi không dấu để tìm kiếm
 * @param str Chuỗi tìm kiếm
 * @returns Object chứa chuỗi gốc và chuỗi không dấu
 */
export function normalizeVietnameseSearch(str: string): { original: string; normalized: string } {
  const trimmed = str?.trim() || '';
  return {
    original: trimmed,
    normalized: removeVietnameseDiacritics(trimmed),
  };
}

/**
 * Tạo SQL LIKE pattern cho tìm kiếm tiếng Việt
 * Hỗ trợ tìm kiếm cả có dấu và không dấu
 * @param searchTerm Từ khóa tìm kiếm
 * @returns Mảng các điều kiện tìm kiếm
 */
export function createVietnameseSearchPatterns(searchTerm: string): string[] {
  const { original, normalized } = normalizeVietnameseSearch(searchTerm);
  
  // Nếu chuỗi gốc và chuỗi không dấu khác nhau, trả về cả hai
  if (original.toLowerCase() !== normalized.toLowerCase()) {
    return [original, normalized];
  }
  
  return [original];
}
