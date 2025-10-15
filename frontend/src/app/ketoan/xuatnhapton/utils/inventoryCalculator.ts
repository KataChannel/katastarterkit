import { InvoiceHeader, InvoiceDetail, ProductMapping, InventoryRow, GroupBy } from '../types';
import { classifyInvoice } from './invoiceClassifier';

/**
 * Match product name from invoice detail to product mapping
 * Returns normalized name (ten2) or product code (ma) based on groupBy
 */
const matchProduct = (
  detailName: string,
  products: ProductMapping[],
  groupBy: GroupBy
): { key: string; code: string | null; unit: string | null } => {
  // Try exact match first
  const exactMatch = products.find(p => p.ten?.toLowerCase() === detailName.toLowerCase());
  if (exactMatch) {
    const key = groupBy === 'ma' ? (exactMatch.ma || detailName) : (exactMatch.ten2 || detailName);
    return {
      key,
      code: exactMatch.ma,
      unit: exactMatch.dvt,
    };
  }
  
  // Try partial match
  const partialMatch = products.find(p => 
    p.ten?.toLowerCase().includes(detailName.toLowerCase()) ||
    detailName.toLowerCase().includes(p.ten?.toLowerCase() || '')
  );
  if (partialMatch) {
    const key = groupBy === 'ma' ? (partialMatch.ma || detailName) : (partialMatch.ten2 || detailName);
    return {
      key,
      code: partialMatch.ma,
      unit: partialMatch.dvt,
    };
  }
  
  // No match found, use original name
  return {
    key: detailName,
    code: null,
    unit: null,
  };
};

/**
 * Calculate inventory report from invoices
 */
export const calculateInventory = (
  invoices: InvoiceHeader[],
  details: InvoiceDetail[],
  products: ProductMapping[],
  userMST: string,
  groupBy: GroupBy,
  startDate: string,
  endDate: string
): InventoryRow[] => {
  // Create a map to store inventory by product and date
  const inventoryMap = new Map<string, InventoryRow>();
  
  // Filter invoices by date range
  const filteredInvoices = invoices.filter(inv => {
    if (!inv.tdlap) return false;
    const invDate = new Date(inv.tdlap);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include end date
    return invDate >= start && invDate <= end;
  });
  
  // Process each invoice detail
  filteredInvoices.forEach(invoice => {
    const invoiceType = classifyInvoice(invoice, userMST);
    if (!invoiceType) return; // Skip if invoice doesn't belong to user
    
    // Get all details for this invoice
    const invoiceDetails = details.filter(d => d.idhdon === invoice.id);
    
    invoiceDetails.forEach(detail => {
      if (!detail.ten) return;
      
      // Match product
      const { key: productKey, code: productCode, unit } = matchProduct(
        detail.ten,
        products,
        groupBy
      );
      
      // Get or create inventory row for this product and date
      const date = invoice.tdlap ? new Date(invoice.tdlap).toISOString().split('T')[0] : '';
      const mapKey = `${productKey}_${date}`;
      
      let row = inventoryMap.get(mapKey);
      if (!row) {
        row = {
          productName: productKey,
          productCode: productCode,
          unit: unit || detail.dvtinh,
          date: date,
          openingQuantity: 0,
          openingAmount: 0,
          importQuantity: 0,
          importAmount: 0,
          exportQuantity: 0,
          exportAmount: 0,
          closingQuantity: 0,
          closingAmount: 0,
        };
        inventoryMap.set(mapKey, row);
      }
      
      // Add to import or export based on invoice type
      const quantity = Number(detail.sluong) || 0;
      const amount = Number(detail.thtien) || 0;
      
      if (invoiceType === 'purchase') {
        // Mua hàng = Nhập kho
        row.importQuantity += quantity;
        row.importAmount += amount;
      } else if (invoiceType === 'sale') {
        // Bán hàng = Xuất kho
        row.exportQuantity += quantity;
        row.exportAmount += amount;
      }
    });
  });
  
  // Convert map to array and calculate closing inventory
  const inventoryRows = Array.from(inventoryMap.values());
  
  // Sort by date and calculate cumulative inventory
  const productGroups = new Map<string, InventoryRow[]>();
  inventoryRows.forEach(row => {
    const key = row.productName;
    if (!productGroups.has(key)) {
      productGroups.set(key, []);
    }
    productGroups.get(key)!.push(row);
  });
  
  // Calculate opening and closing for each product
  const finalRows: InventoryRow[] = [];
  productGroups.forEach(rows => {
    // Sort by date
    rows.sort((a, b) => a.date.localeCompare(b.date));
    
    let runningQuantity = 0;
    let runningAmount = 0;
    
    rows.forEach(row => {
      row.openingQuantity = runningQuantity;
      row.openingAmount = runningAmount;
      
      // Formula: Tồn Đầu + Nhập - Xuất = Tồn Cuối
      row.closingQuantity = row.openingQuantity + row.importQuantity - row.exportQuantity;
      row.closingAmount = row.openingAmount + row.importAmount - row.exportAmount;
      
      runningQuantity = row.closingQuantity;
      runningAmount = row.closingAmount;
      
      finalRows.push(row);
    });
  });
  
  return finalRows;
};

/**
 * Group inventory rows by product (sum all dates for each product)
 */
export const groupInventoryByProduct = (rows: InventoryRow[]): InventoryRow[] => {
  const productMap = new Map<string, InventoryRow>();
  
  rows.forEach(row => {
    const existing = productMap.get(row.productName);
    if (!existing) {
      productMap.set(row.productName, { ...row });
    } else {
      existing.importQuantity += row.importQuantity;
      existing.importAmount += row.importAmount;
      existing.exportQuantity += row.exportQuantity;
      existing.exportAmount += row.exportAmount;
      existing.closingQuantity += row.closingQuantity;
      existing.closingAmount += row.closingAmount;
    }
  });
  
  return Array.from(productMap.values());
};
