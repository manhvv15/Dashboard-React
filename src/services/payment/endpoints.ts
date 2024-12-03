export const invoices = {
  getInvoiceManagements: `/payment/system/invoice`,
  getInvoicesByWorkspace: `/payment/system/invoice/current-workspace`,
  invoiceDetails: `/payment/system/invoice/get-details`,
  getInvoiceDetailById: `/payment/system/invoice/get-detail`,
};

export const transaction = {
  getTransactions: `/payment/system/transactions/management`,
  detailTransaction: '/payment/system/transactions/detail',
  getTransactionWorkspace: `/payment/system/transactions/current-workspace`,
};
