//  automatise avant de la sauvegarder 
const invoiceStatusMiddleware = (schema) => {
  schema.pre('save', function(next) {
    const now = new Date();
    if (this.paidAmount >= this.amount) {
      this.status = 'paid';
    } else if (this.paidAmount > 0 && this.paidAmount < this.amount) {
      this.status = 'pending';
    } else if (this.dueDate && new Date(this.dueDate) < now) {
      this.status = 'overdue';
    } else {
      this.status = 'unpaid';
    }
    next();
  });
};

module.exports = invoiceStatusMiddleware;