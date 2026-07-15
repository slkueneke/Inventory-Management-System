/**
 * Author: Aisha Keller
 * Date: 07/15/2026
 * File: put.spec.js
 * Description: Test for updating an inventory item.
 */

const request = require('supertest');
const app = require('../../../src/app');
const { InventoryItem } = require('../../../src/models/inventory-item.js');

// Mock the InventoryItem model to avoid real database interactions
jest.mock('../../../src/models/inventory-item.js');

describe('PUT /api/inventory-items/:id', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

// Unit Test 1 Sprint 2: Should update an inventory item and return 200 status code
it('should update an inventory item and return 200 status code', async () => {
    const mockItem = {
        _id: '1',
        categoryId: 1,
        supplierId: 1,
        name: 'Updated Item',
        description: 'Updated Description',
        quantity: 10,
        price: 100
    };

    InventoryItem.findByIdAndUpdate.mockResolvedValue(mockItem);

    const response = await request(app)
        .put('/api/inventory-items/1')
        .send({
            categoryId: 1,
            supplierId: 1,
            name: 'Updated Item',
            description: 'Updated Description',
            quantity: 10,
            price: 100
        });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        message: 'Inventory item updated successfully',
        item: mockItem
    });
});

// Unit Test 2 Sprint 2: Should return 400 for invalid payload. 
it('should return 400 for invalid payload', async () => {
    const response = await request(app)
        .put('/api/inventory-items/1')
        .send({
            categoryId: 1,
            supplierId: 1,
            name: 'A', // Invalid name (too short)
            quantity: 10,
            price: 100
        });
      
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/name must NOT have fewer than 2 characters/);
});

// Unit Test 3 Sprint 2: Should return 404 when item does not exist
it('should return 404 when item does not exist', async () => {
    InventoryItem.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app)
        .put('/api/inventory-items/999') // Assuming 999 does not exist
        .send({
            categoryId: 1,
            supplierId: 1,
            name: 'Non-existent Item',
            description: 'This item does not exist',
            quantity: 10,
            price: 100
        });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Inventory item not found');
});
});


