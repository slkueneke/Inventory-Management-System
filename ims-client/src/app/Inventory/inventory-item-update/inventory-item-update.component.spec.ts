/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { InventoryItemUpdateComponent } from './inventory-item-update.component';
import { environment } from '../../../environments/environment';

describe('InventoryItemUpdateComponent', () => {
    let component: InventoryItemUpdateComponent;
    let fixture: ComponentFixture<InventoryItemUpdateComponent>;
    let httpMock: HttpTestingController;

    const itemId = '1';
    const itemUrl = `${environment.apiBaseUrl}/api/inventory-items/${itemId}`;

    const existingItem = {
        _id: itemId,
        categoryId: 2,
        supplierId: 3,
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        price: 99.99,
        dateCreated: '2026-01-01T00:00:00.000Z',
        dateModified: '2026-01-01T00:00:00.000Z',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InventoryItemUpdateComponent, HttpClientTestingModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: convertToParamMap({ id: itemId }) },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InventoryItemUpdateComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load existing item and prefill form on init', () => {
        fixture.detectChanges();

        const req = httpMock.expectOne(itemUrl);
        expect(req.request.method).toBe('GET');
        req.flush(existingItem);

        expect(component.itemForm.value).toEqual({
            categoryId: existingItem.categoryId,
            supplierId: existingItem.supplierId,
            name: existingItem.name,
            description: existingItem.description,
            quantity: existingItem.quantity,
            price: existingItem.price,
        });
        expect(component.loading).toBeFalse();
    });

    it('should submit valid form and call PUT', () => {
        fixture.detectChanges();

        const getReq = httpMock.expectOne(itemUrl);
        getReq.flush(existingItem);

        component.itemForm.patchValue({
            name: 'Updated Item',
            description: 'Updated Description',
            quantity: 20,
            price: 199.99,
        });

        component.onSubmit();

        const putReq = httpMock.expectOne(itemUrl);
        expect(putReq.request.method).toBe('PUT');
        expect(putReq.request.body).toEqual({
            categoryId: existingItem.categoryId,
            supplierId: existingItem.supplierId,
            name: 'Updated Item',
            description: 'Updated Description',
            quantity: 20,
            price: 199.99,
        });

        putReq.flush({
            message: 'Inventory item updated successfully',
            item: { ...existingItem, name: 'Updated Item' },
        });

        expect(component.successMessage).toBe('Inventory item updated successfully.');
        expect(component.errorMessage).toBe('');
        expect(component.isSubmitting).toBeFalse();
    });

    it('should show error message when PUT fails', () => {
        fixture.detectChanges();

        const getReq = httpMock.expectOne(itemUrl);
        getReq.flush(existingItem);

        component.onSubmit();

        const putReq = httpMock.expectOne(itemUrl);
        expect(putReq.request.method).toBe('PUT');

        putReq.flush(
            { message: 'Server error' },
            { status: 500, statusText: 'Internal Server Error' }
        );

        expect(component.errorMessage).toBe('Unable to update inventory item. Please try again.');
        expect(component.successMessage).toBe('');
        expect(component.isSubmitting).toBeFalse();
    });
});

