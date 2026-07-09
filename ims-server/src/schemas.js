/**
 * Author: Aisha Keller
 * Date: 07/08/2026
 * File: schemas.js
 * Description: Validate APIs 
 */

// Add a validation schema for adding new Item Inventory to the Inventory Management System (IMS)
const addItemSchema = {
    type: 'object',
    properties: {
        categoryId: { type: 'number', required: true },
        supplierId: { type: 'number', required: true },
        name: { type: 'string', minLength: 2, maxLength: 100, required: true },
        description: { type: 'string', maxLength: 250 },
        quantity: { type: 'number', minimum: 0, required: true },
        price: { type: 'number', minimum: 0, required: true },

    }
};

module.exports = {
    addItemSchema
};

