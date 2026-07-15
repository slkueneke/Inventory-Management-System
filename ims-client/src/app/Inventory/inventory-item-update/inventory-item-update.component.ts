/**
 * Author: Aisha Keller
 * Date: 07/15/2026
 * File: inventory-item-update.component.ts
 * Description: This file defines the InventoryItemUpdateComponent, which is responsible for updating existing inventory items in the system. It includes form validation and submission logic.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface InventoryItem {
  categoryId: number;
  supplierId: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-inventory-item-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-content">
      <h2>Edit Inventory Item</h2>

      <div class="form-card">
        <p *ngIf="loading">Loading item...</p>
        <p *ngIf="loadError" class="form-error">{{ loadError }}</p>

        <form
          *ngIf="!loading && !loadError"
          [formGroup]="itemForm"
          (ngSubmit)="onSubmit()"
          novalidate
        >
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="categoryId">Category ID</label>
              <input
                class="form-input"
                id="categoryId"
                type="number"
                formControlName="categoryId"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="supplierId">Supplier ID</label>
              <input
                class="form-input"
                id="supplierId"
                type="number"
                formControlName="supplierId"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="name">Name</label>
            <input
              class="form-input"
              id="name"
              type="text"
              formControlName="name"
            />
            <p
              class="form-error"
              *ngIf="itemForm.get('name')?.touched && itemForm.get('name')?.invalid"
            >
              Name is required and must be between 2 and 100 characters.
            </p>
          </div>

          <div class="form-group">
            <label class="form-label" for="description">Description</label>
            <textarea
              class="form-textarea"
              id="description"
              formControlName="description"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quantity">Quantity</label>
              <input
                class="form-input"
                id="quantity"
                type="number"
                formControlName="quantity"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="price">Price</label>
              <input
                class="form-input"
                id="price"
                type="number"
                step="0.01"
                formControlName="price"
              />
            </div>
          </div>

          <div class="form-actions">
            <button
              class="btn btn--primary"
              type="submit"
              [disabled]="itemForm.invalid || isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>

            <a class="btn btn--secondary" routerLink="/inventory-items">
              Cancel
            </a>
          </div>
        </form>

        <p *ngIf="successMessage" class="update-success">
          {{ successMessage }}
        </p>
        <p *ngIf="errorMessage" class="form-error">
          {{ errorMessage }}
        </p>
      </div>
    </section>
  `,
  styles: `
    .update-success {
      margin-top: var(--space-4, 16px);
      color: var(--color-success-text, #15803d);
      background-color: var(--color-success-bg, #dcfce7);
      padding: var(--space-3, 12px);
      border-radius: var(--radius-sm, 4px);
    }
  `
})
export class InventoryItemUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  id = '';
  loading = false;
  loadError = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  itemForm = this.fb.group({
    categoryId: [1, [Validators.required, Validators.min(1)]],
    supplierId: [1, [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(250)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.id) {
      this.loadError = 'Inventory item id is required.';
      return;
    }

    this.loadItem();
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.http
      .put(`${environment.apiBaseUrl}/api/inventory-items/${this.id}`, this.itemForm.value)
      .subscribe({
        next: () => {
          this.successMessage = 'Inventory item updated successfully.';
          this.isSubmitting = false;
        },
        error: () => {
          this.errorMessage = 'Unable to update inventory item. Please try again.';
          this.isSubmitting = false;
        }
      });
  }

  private loadItem(): void {
    this.loading = true;
    this.loadError = '';

    this.http
      .get<InventoryItem>(`${environment.apiBaseUrl}/api/inventory-items/${this.id}`)
      .subscribe({
        next: (item) => {
          this.itemForm.patchValue({
            categoryId: item.categoryId,
            supplierId: item.supplierId,
            name: item.name,
            description: item.description ?? '',
            quantity: item.quantity,
            price: item.price
          });
          this.loading = false;
        },
        error: () => {
          this.loadError = 'Unable to load inventory item.';
          this.loading = false;
        }
      });
  }
}