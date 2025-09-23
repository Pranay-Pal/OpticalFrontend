## BaseURL: `https://staff-optical-production.up.railway.app`

## **Inventory:**

## **1️⃣ Update Stock by Barcode**

**Endpoint:** `POST /stock-by-barcode`  
 **Headers:**

`Authorization: Bearer <your-jwt-token>`  
`Content-Type: application/json`

**Request Body (JSON):**

`{`  
  `"barcode": "RAY0015678901",`  
  `"quantity": 10,`  
  `"price": 1500`  
`}`

**Successful Response (200):**

`{`  
  `"success": true,`  
  `"message": "Stock updated successfully via barcode scan",`  
  `"inventory": {`  
    `"id": 1,`  
    `"productId": 101,`  
    `"quantity": 50,`  
    `"lastRestockedAt": "2025-09-20T18:45:00.000Z",`  
    `"lastUpdated": "2025-09-20T18:45:00.000Z"`  
  `},`  
  `"productDetails": {`  
    `"id": 101,`  
    `"sku": "SKU101",`  
    `"barcode": "RAY0015678901",`  
    `"name": "Ray-Ban Aviator",`  
    `"description": "Classic Aviator Sunglasses",`  
    `"model": "RB3025",`  
    `"size": "Medium",`  
    `"color": "Gold",`  
    `"material": "Metal",`  
    `"price": 1500,`  
    `"eyewearType": "SUNGLASSES",`  
    `"frameType": "FULL",`  
    `"company": {`  
      `"id": 5,`  
      `"name": "Ray-Ban",`  
      `"description": "Premium eyewear brand"`  
    `}`  
  `},`  
  `"stockInDetails": {`  
    `"method": "barcode_scan",`  
    `"scannedBarcode": "RAY0015678901",`  
    `"productName": "Ray-Ban Aviator",`  
    `"addedQuantity": 10,`  
    `"newQuantity": 50,`  
    `"previousQuantity": 40,`  
    `"stockOperation": "STOCK_IN",`  
    `"timestamp": "2025-09-20T18:45:00.000Z"`  
  `},`  
  `"inventoryStatus": {`  
    `"currentStock": 50,`  
    `"stockLevel": "HIGH",`  
    `"statusMessage": "In Stock"`  
  `}`  
`}`

---

## **2️⃣ Stock Out by Barcode**

**Endpoint:** `POST /stock-out-by-barcode`  
 **Headers:**

`Authorization: Bearer <your-jwt-token>`  
`Content-Type: application/json`

**Request Body (JSON):**

`{`  
  `"barcode": "RAY0015678901",`  
  `"quantity": 5`  
`}`

**Successful Response (200):**

`{`  
  `"id": 1,`  
  `"shopId": 10,`  
  `"productId": 101,`  
  `"quantity": 45,`  
  `"createdAt": "2025-09-20T18:45:00.000Z",`  
  `"updatedAt": "2025-09-20T18:50:00.000Z",`  
  `"product": {`  
    `"id": 101,`  
    `"sku": "SKU101",`  
    `"barcode": "RAY0015678901",`  
    `"name": "Ray-Ban Aviator",`  
    `"description": "Classic Aviator Sunglasses",`  
    `"model": "RB3025",`  
    `"size": "Medium",`  
    `"color": "Gold",`  
    `"material": "Metal",`  
    `"price": 1500,`  
    `"eyewearType": "SUNGLASSES",`  
    `"frameType": "FULL",`  
    `"company": {`  
      `"id": 5,`  
      `"name": "Ray-Ban",`  
      `"description": "Premium eyewear brand"`  
    `}`  
  `},`  
  `"stockOutDetails": {`  
    `"productName": "Ray-Ban Aviator",`  
    `"removedQuantity": 5,`  
    `"previousQuantity": 50,`  
    `"newQuantity": 45,`  
    `"lowStockWarning": null`  
  `}`  
`}`

---

## **3️⃣ Get Product by Barcode**

**Endpoint:** `GET /product/barcode/:barcode`  
 **Headers:**

`Authorization: Bearer <your-jwt-token>`

**Response (200):**

`{`  
  `"success": true,`  
  `"message": "Product found successfully",`  
  `"product": {`  
    `"id": 101,`  
    `"sku": "SKU101",`  
    `"name": "Ray-Ban Aviator",`  
    `"description": "Classic Aviator Sunglasses",`  
    `"price": 1500,`  
    `"barcode": "RAY0015678901",`  
    `"eyewearType": "SUNGLASSES",`  
    `"frameType": "FULL",`  
    `"company": {`  
      `"id": 5,`  
      `"name": "Ray-Ban",`  
      `"description": "Premium eyewear brand"`  
    `},`  
    `"material": "Metal",`  
    `"color": "Gold",`  
    `"size": "Medium",`  
    `"model": "RB3025",`  
    `"inventory": {`  
      `"quantity": 45,`  
      `"lastUpdated": "2025-09-20T18:50:00.000Z",`  
      `"stockStatus": "In Stock"`  
    `},`  
    `"createdAt": "2025-01-10T10:00:00.000Z",`  
    `"updatedAt": "2025-09-20T18:50:00.000Z"`  
  `},`  
  `"scanResult": {`  
    `"scannedBarcode": "RAY0015678901",`  
    `"productFound": true,`  
    `"quickInfo": "Ray-Ban SUNGLASSES - Ray-Ban Aviator ($1500)"`  
  `}`  
`}`

---

## **4️⃣ Add Product**

**Endpoint:** `POST /product`  
 **Headers:**

`Authorization: Bearer <your-jwt-token>`  
`Content-Type: application/json`

**Request Body:**

`{`  
  `"name": "Ray-Ban Wayfarer",`  
  `"description": "Classic Wayfarer Sunglasses",`  
  `"barcode": "RAY0015678902",`  
  `"sku": "SKU102",`  
  `"basePrice": 1400,`  
  `"eyewearType": "SUNGLASSES",`  
  `"frameType": "FULL",`  
  `"companyId": 5,`  
  `"material": "Plastic",`  
  `"color": "Black",`  
  `"size": "Medium",`  
  `"model": "RB2140"`  
`}`

**Response (201):**

`{`  
  `"id": 102,`  
  `"name": "Ray-Ban Wayfarer",`  
  `"description": "Classic Wayfarer Sunglasses",`  
  `"barcode": "RAY0015678902",`  
  `"sku": "SKU102",`  
  `"basePrice": 1400,`  
  `"eyewearType": "SUNGLASSES",`  
  `"frameType": "FULL",`  
  `"companyId": 5,`  
  `"material": "Plastic",`  
  `"color": "Black",`  
  `"size": "Medium",`  
  `"model": "RB2140",`  
  `"createdAt": "2025-09-20T18:55:00.000Z",`  
  `"updatedAt": "2025-09-20T18:55:00.000Z",`  
  `"company": {`  
    `"id": 5,`  
    `"name": "Ray-Ban",`  
    `"description": "Premium eyewear brand"`  
  `}`  
`}`

---

## **5️⃣ Get Inventory**

**Endpoint:** `GET /`  
 **Headers:**

`Authorization: Bearer <your-jwt-token>`

**Response (200):**

`{`  
  `"inventory": [`  
    `{`  
      `"id": 1,`  
      `"shopId": 10,`  
      `"productId": 101,`  
      `"quantity": 45,`  
      `"product": {`  
        `"id": 101,`  
        `"name": "Ray-Ban Aviator",`  
        `"sku": "SKU101",`  
        `"barcode": "RAY0015678901",`  
        `"eyewearType": "SUNGLASSES",`  
        `"frameType": "FULL",`  
        `"company": {`  
          `"id": 5,`  
          `"name": "Ray-Ban",`  
          `"description": "Premium eyewear brand"`  
        `}`  
      `}`  
    `}`  
  `],`  
  `"grouped": {`  
    `"Ray-Ban": {`  
      `"SUNGLASSES": [`  
        `{`  
          `"id": 1,`  
          `"shopId": 10,`  
          `"productId": 101,`  
          `"quantity": 45,`  
          `"product": {`  
            `"id": 101,`  
            `"name": "Ray-Ban Aviator"`  
          `}`  
        `}`  
      `]`  
    `}`  
  `},`  
  `"summary": {`  
    `"totalProducts": 1,`  
    `"totalQuantity": 45,`  
    `"companiesCount": 1`  
  `}`  
`}`

Invoice:

## **1\. Create Invoice**

**Endpoint:** `POST /invoices`  
 **Headers:**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**Request Body (JSON):**

`{`  
  `"patientId": 1,`  
  `"items": [`  
    `{`  
      `"productId": 101,`  
      `"quantity": 2,`  
      `"discount": 20,`  
      `"cgst": 18,`  
      `"sgst": 18`  
    `},`  
    `{`  
      `"productId": 102,`  
      `"quantity": 1,`  
      `"discount": 0,`  
      `"cgst": 9,`  
      `"sgst": 9`  
    `}`  
  `],`  
  `"totalIgst": 0`  
`}`

**Note:** Use either `patientId` or `customerId`, not both.

**Sample Response (201 Created):**

`{`  
  `"id": 201,`  
  `"staffId": 3,`  
  `"patientId": 1,`  
  `"subtotal": 500,`  
  `"totalDiscount": 20,`  
  `"totalIgst": 0,`  
  `"totalCgst": 27,`  
  `"totalSgst": 27,`  
  `"totalAmount": 534,`  
  `"status": "UNPAID",`  
  `"items": [`  
    `{`  
      `"productId": 101,`  
      `"quantity": 2,`  
      `"unitPrice": 200,`  
      `"discount": 20,`  
      `"cgst": 18,`  
      `"sgst": 18,`  
      `"totalPrice": 416,`  
      `"product": {`  
        `"id": 101,`  
        `"name": "Lens",`  
        `"company": {`  
          `"id": 1,`  
          `"name": "Clear Vision"`  
        `}`  
      `}`  
    `},`  
    `{`  
      `"productId": 102,`  
      `"quantity": 1,`  
      `"unitPrice": 100,`  
      `"discount": 0,`  
      `"cgst": 9,`  
      `"sgst": 9,`  
      `"totalPrice": 118,`  
      `"product": {`  
        `"id": 102,`  
        `"name": "Frame",`  
        `"company": {`  
          `"id": 2,`  
          `"name": "EyeStyle"`  
        `}`  
      `}`  
    `}`  
  `],`  
  `"createdAt": "2025-09-20T05:45:00.000Z",`  
  `"updatedAt": "2025-09-20T05:45:00.000Z"`  
`}`

---

## **2\. Get Single Invoice**

**Endpoint:** `GET /invoices/:id`  
 **Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**Sample Response (200 OK):**

`{`  
  `"id": 201,`  
  `"staffId": 3,`  
  `"patientId": 1,`  
  `"subtotal": 500,`  
  `"totalDiscount": 20,`  
  `"totalIgst": 0,`  
  `"totalCgst": 27,`  
  `"totalSgst": 27,`  
  `"totalAmount": 534,`  
  `"status": "UNPAID",`  
  `"items": [`  
    `{`  
      `"productId": 101,`  
      `"quantity": 2,`  
      `"unitPrice": 200,`  
      `"discount": 20,`  
      `"cgst": 18,`  
      `"sgst": 18,`  
      `"totalPrice": 416,`  
      `"product": {`  
        `"id": 101,`  
        `"name": "Lens",`  
        `"company": {`  
          `"id": 1,`  
          `"name": "Clear Vision"`  
        `}`  
      `}`  
    `}`  
  `],`  
  `"patient": {`  
    `"id": 1,`  
    `"name": "John Doe",`  
    `"phone": "+91-9876543210"`  
  `},`  
  `"transactions": [],`  
  `"createdAt": "2025-09-20T05:45:00.000Z",`  
  `"updatedAt": "2025-09-20T05:45:00.000Z"`  
`}`

---

## **3\. Update Invoice Status**

**Endpoint:** `PATCH /invoices/:id/status`  
 **Headers:**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**Request Body:**

`{`  
  `"status": "PAID"`  
`}`

**Sample Response (200 OK):**

`{`  
  `"id": 201,`  
  `"status": "PAID",`  
  `"totalAmount": 534,`  
  `"paidAmount": 534,`  
  `"items": [ ... ],`  
  `"patient": { ... },`  
  `"transactions": [ ... ]`  
`}`

---

## **4\. Add Payment to Invoice**

**Endpoint:** `POST /invoices/:id/payment`  
 **Headers:**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**Request Body:**

`{`  
  `"amount": 200,`  
  `"paymentMethod": "CASH"`  
`}`

**Sample Response (201 Created):**

`{`  
  `"invoice": {`  
    `"id": 201,`  
    `"status": "PARTIALLY_PAID",`  
    `"paidAmount": 200,`  
    `"totalAmount": 534,`  
    `"items": [ ... ]`  
  `},`  
  `"transaction": {`  
    `"id": 301,`  
    `"invoiceId": 201,`  
    `"amount": 200,`  
    `"paymentMethod": "CASH",`  
    `"createdAt": "2025-09-20T06:00:00.000Z"`  
  `}`  
`}`

---

## **5\. Delete/Cancel Invoice**

**Endpoint:** `DELETE /invoices/:id`  
 **Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**Sample Response (200 OK):**

`{`  
  `"message": "Invoice cancelled successfully",`  
  `"invoice": {`  
    `"id": 201,`  
    `"status": "CANCELLED"`  
  `}`  
`}`

`Patient`

## **`1️⃣ Create a new patient (POST /patients)`**

**`URL:`**

`POST https://staff-optical-production.up.railway.app/patients`

**`Headers:`**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**`Request Body (JSON):`**

`{`  
  `"name": "John Doe",`  
  `"age": 30,`  
  `"gender": "Male",`  
  `"phone": "9876543210",`  
  `"address": "123, MG Road, Kolkata",`  
  `"medicalHistory": "Diabetic, Allergic to penicillin"`  
`}`

**`Successful Response (201 Created):`**

`{`  
  `"id": 1,`  
  `"name": "John Doe",`  
  `"age": 30,`  
  `"gender": "Male",`  
  `"phone": "9876543210",`  
  `"address": "123, MG Road, Kolkata",`  
  `"medicalHistory": "Diabetic, Allergic to penicillin",`  
  `"shopId": 1,`  
  `"createdAt": "2025-09-20T18:00:00.000Z",`  
  `"updatedAt": "2025-09-20T18:00:00.000Z"`  
`}`

**`Error Response Example (500):`**

`{`  
  `"error": "Patient creation failed"`  
`}`

---

## **`2️⃣ Get all patients (GET /patients)`**

**`URL:`**

`GET https://staff-optical-production.up.railway.app/patients?page=1&limit=10&search=john`

**`Headers:`**

`Authorization: Bearer <JWT_TOKEN>`

**`Query Parameters:`**

* `page (optional, default 1)`

* `limit (optional, default 10)`

* `search (optional, filters by name or phone)`

**`Successful Response (200):`**

`{`  
  `"patients": [`  
    `{`  
      `"id": 1,`  
      `"name": "John Doe",`  
      `"age": 30,`  
      `"gender": "Male",`  
      `"phone": "9876543210",`  
      `"address": "123, MG Road, Kolkata",`  
      `"medicalHistory": "Diabetic, Allergic to penicillin",`  
      `"shopId": 1,`  
      `"createdAt": "2025-09-20T18:00:00.000Z",`  
      `"updatedAt": "2025-09-20T18:00:00.000Z"`  
    `}`  
  `],`  
  `"total": 1,`  
  `"page": 1,`  
  `"totalPages": 1`  
`}`

**`Error Response Example (500):`**

`{`  
  `"error": "Failed to fetch patients"`  
`}`

---

## **`3️⃣ Get a single patient by ID (GET /patients/:id)`**

**`URL:`**

`GET https://staff-optical-production.up.railway.app/patients/1`

**`Headers:`**

`Authorization: Bearer <JWT_TOKEN>`

**`Successful Response (200):`**

`{`  
  `"id": 1,`  
  `"name": "John Doe",`  
  `"age": 30,`  
  `"gender": "Male",`  
  `"phone": "9876543210",`  
  `"address": "123, MG Road, Kolkata",`  
  `"medicalHistory": "Diabetic, Allergic to penicillin",`  
  `"shopId": 1,`  
  `"createdAt": "2025-09-20T18:00:00.000Z",`  
  `"updatedAt": "2025-09-20T18:00:00.000Z",`  
  `"prescriptions": [`  
    `{`  
      `"id": 1,`  
      `"patientId": 1,`  
      `"rightEye": { "sph": "0.00", "cyl": "0.00", "axis": "0" },`  
      `"leftEye": { "sph": "0.00", "cyl": "0.00", "axis": "0" },`  
      `"createdAt": "2025-09-20T18:10:00.000Z",`  
      `"updatedAt": "2025-09-20T18:10:00.000Z"`  
    `}`  
  `],`  
  `"invoices": [`  
    `{`  
      `"id": 1,`  
      `"patientId": 1,`  
      `"staffId": 1,`  
      `"subtotal": 500,`  
      `"totalDiscount": 50,`  
      `"totalCgst": 22.5,`  
      `"totalSgst": 22.5,`  
      `"totalIgst": 0,`  
      `"totalAmount": 495,`  
      `"status": "UNPAID",`  
      `"items": [`  
        `{`  
          `"id": 1,`  
          `"invoiceId": 1,`  
          `"productId": 1,`  
          `"quantity": 1,`  
          `"unitPrice": 500,`  
          `"discount": 50,`  
          `"cgst": 22.5,`  
          `"sgst": 22.5,`  
          `"totalPrice": 495,`  
          `"product": {`  
            `"id": 1,`  
            `"name": "Eye Glass",`  
            `"basePrice": 500`  
          `}`  
        `}`  
      `]`  
    `}`  
  `]`  
`}`

**`Error Response Example (404 Not Found):`**

`{`  
  `"error": "Patient not found"`  
`}`

`PAYMENT:`

## **`✅ 1. Normal payment (Cash / UPI / Card)`**

**`URL:`**

`POST https://staff-optical-production.up.railway.app/payments`

**`Headers:`**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**`Request Body (JSON):`**

`{`  
  `"invoiceId": 1,`  
  `"amount": 200,`  
  `"paymentMethod": "CASH"`  
`}`

**`Successful Response (200):`**

`{`  
  `"id": 1,`  
  `"patientId": 1,`  
  `"staffId": 2,`  
  `"subtotal": 500,`  
  `"totalDiscount": 50,`  
  `"totalCgst": 22.5,`  
  `"totalSgst": 22.5,`  
  `"totalIgst": 0,`  
  `"totalAmount": 495,`  
  `"paidAmount": 200,`  
  `"status": "PARTIALLY_PAID",`  
  `"transactions": [`  
    `{`  
      `"id": 1,`  
      `"invoiceId": 1,`  
      `"amount": 200,`  
      `"paymentMethod": "CASH",`  
      `"giftCardId": null,`  
      `"createdAt": "2025-09-20T18:30:00.000Z"`  
    `}`  
  `]`  
`}`

---

## **`✅ 2. Gift card payment`**

**`Request Body (JSON):`**

`{`  
  `"invoiceId": 1,`  
  `"amount": 150,`  
  `"paymentMethod": "GIFT_CARD",`  
  `"giftCardCode": "GC123456"`  
`}`

**`Successful Response (200):`**

`{`  
  `"id": 1,`  
  `"patientId": 1,`  
  `"staffId": 2,`  
  `"subtotal": 500,`  
  `"totalDiscount": 50,`  
  `"totalCgst": 22.5,`  
  `"totalSgst": 22.5,`  
  `"totalIgst": 0,`  
  `"totalAmount": 495,`  
  `"paidAmount": 350,`  
  `"status": "PARTIALLY_PAID",`  
  `"transactions": [`  
    `{`  
      `"id": 1,`  
      `"invoiceId": 1,`  
      `"amount": 200,`  
      `"paymentMethod": "CASH",`  
      `"giftCardId": null,`  
      `"createdAt": "2025-09-20T18:30:00.000Z"`  
    `},`  
    `{`  
      `"id": 2,`  
      `"invoiceId": 1,`  
      `"amount": 150,`  
      `"paymentMethod": "GIFT_CARD",`  
      `"giftCardId": 1,`  
      `"createdAt": "2025-09-20T18:35:00.000Z"`  
    `}`  
  `]`  
`}`

---

## **`⚠️ Error Cases`**

1. **`Invoice not found (404):`**

`{`  
  `"error": "Invoice not found."`  
`}`

2. **`Invoice already paid (400):`**

`{`  
  `"error": "This invoice has already been paid in full."`  
`}`

3. **`Amount exceeds due (400):`**

`{`  
  `"error": "Payment amount cannot exceed the amount due of $295.00."`  
`}`

4. **`Gift card required but missing (400):`**

`{`  
  `"error": "Gift card code is required for gift card payments."`  
`}`

5. **`Insufficient gift card balance (400):`**

`{`  
  `"error": "Insufficient gift card balance. Current balance is $100.00."`  
`}`

## 

## **PRESCRIPTION**

## **1️⃣ Create a new prescription (`POST /prescriptions`)**

**URL:**

`POST https://staff-optical-production.up.railway.app/prescriptions`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**Request Body (JSON):**

`{`  
  `"patientId": 1,`  
  `"rightEye": {`  
    `"sph": "-1.25",`  
    `"cyl": "-0.50",`  
    `"axis": "90",`  
    `"add": "+1.00"`  
  `},`  
  `"leftEye": {`  
    `"sph": "-1.00",`  
    `"cyl": "-0.25",`  
    `"axis": "85",`  
    `"add": "+1.25"`  
  `}`  
`}`

**Successful Response (201):**

`{`  
  `"id": 1,`  
  `"patientId": 1,`  
  `"rightEye": {`  
    `"sph": "-1.25",`  
    `"cyl": "-0.50",`  
    `"axis": "90",`  
    `"add": "+1.00"`  
  `},`  
  `"leftEye": {`  
    `"sph": "-1.00",`  
    `"cyl": "-0.25",`  
    `"axis": "85",`  
    `"add": "+1.25"`  
  `},`  
  `"createdAt": "2025-09-20T19:00:00.000Z",`  
  `"updatedAt": "2025-09-20T19:00:00.000Z"`  
`}`

**Error Response Example (400):**

`{`  
  `"error": "Patient ID is required."`  
`}`

---

## **2️⃣ Get all prescriptions (`GET /prescriptions`)**

**URL:**

`GET https://staff-optical-production.up.railway.app/prescriptions?page=1&limit=10&patientId=1`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**Successful Response (200):**

`{`  
  `"prescriptions": [`  
    `{`  
      `"id": 1,`  
      `"patientId": 1,`  
      `"rightEye": {`  
        `"sph": "-1.25",`  
        `"cyl": "-0.50",`  
        `"axis": "90",`  
        `"add": "+1.00"`  
      `},`  
      `"leftEye": {`  
        `"sph": "-1.00",`  
        `"cyl": "-0.25",`  
        `"axis": "85",`  
        `"add": "+1.25"`  
      `},`  
      `"createdAt": "2025-09-20T19:00:00.000Z",`  
      `"updatedAt": "2025-09-20T19:00:00.000Z",`  
      `"patient": {`  
        `"id": 1,`  
        `"name": "John Doe",`  
        `"phone": "9876543210",`  
        `"shopId": 1`  
      `}`  
    `}`  
  `],`  
  `"total": 1,`  
  `"page": 1,`  
  `"totalPages": 1`  
`}`

---

## **3️⃣ Get a single prescription (`GET /prescriptions/:id`)**

**URL:**

`GET https://staff-optical-production.up.railway.app/prescriptions/1`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**Successful Response (200):**

`{`  
  `"id": 1,`  
  `"patientId": 1,`  
  `"rightEye": {`  
    `"sph": "-1.25",`  
    `"cyl": "-0.50",`  
    `"axis": "90",`  
    `"add": "+1.00"`  
  `},`  
  `"leftEye": {`  
    `"sph": "-1.00",`  
    `"cyl": "-0.25",`  
    `"axis": "85",`  
    `"add": "+1.25"`  
  `},`  
  `"createdAt": "2025-09-20T19:00:00.000Z",`  
  `"updatedAt": "2025-09-20T19:00:00.000Z",`  
  `"patient": {`  
    `"id": 1,`  
    `"name": "John Doe",`  
    `"phone": "9876543210",`  
    `"shopId": 1`  
  `}`  
`}`

**Error Response Example (404):**

`{`  
  `"error": "Prescription not found."`  
`}`

---

## **4️⃣ Generate PDF for prescription’s invoice (`GET /prescriptions/:id/pdf`)**

**URL:**

`GET https://staff-optical-production.up.railway.app/prescriptions/1/pdf`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**Response (200):**

* Returns a **PDF file stream** (not JSON).

* In Postman, it will auto-download as a `.pdf`.

**Error Example (404):**

`{`  
  `"error": "No invoice found for this prescription ID. Please create an invoice that uses prescriptionId: 1 first."`  
`}`

---

## **5️⃣ Generate Thermal Print for prescription’s invoice (`GET /prescriptions/:id/thermal`)**

**URL:**

`GET https://staff-optical-production.up.railway.app/prescriptions/1/thermal`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**Response (200):**

* Returns **thermal print HTML/text stream** (depends on your `invoiceController`).

* In Postman, you’ll see **raw HTML** (usable for POS printers).

**Error Example (404):**

`{`  
  `"error": "No invoice found for this prescription ID. Please create an invoice that uses prescriptionId: 1 first."`  
`}`

REPORTING:

# **1\. Daily Report (`GET /reports/daily`)**

**URL Example:**

`GET https://staff-optical-production.up.railway.app/reports/daily?date=2025-09-20`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

✅ **Response Example (200):**

`{`  
  `"attendance": [`  
    `{`  
      `"id": 1,`  
      `"loginTime": "2025-09-20T09:00:00.000Z",`  
      `"logoutTime": "2025-09-20T18:00:00.000Z",`  
      `"staff": {`  
        `"id": 2,`  
        `"name": "Alice",`  
        `"email": "alice@example.com",`  
        `"shopId": 1`  
      `}`  
    `}`  
  `],`  
  `"inventory": [`  
    `{`  
      `"id": 1,`  
      `"quantity": 50,`  
      `"product": {`  
        `"id": 10,`  
        `"name": "Sunglasses",`  
        `"price": 199.99`  
      `}`  
    `}`  
  `]`  
`}`

❌ **Error Example:**

`{`  
  `"error": "Something went wrong"`  
`}`

---

# **🔹 2\. Monthly Report (`GET /reports/monthly`)**

**URL Example:**

`GET https://staff-optical-production.up.railway.app/reports/monthly?year=2025&month=9`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

✅ **Response Example (200):**

`{`  
  `"attendance": [`  
    `{`  
      `"id": 12,`  
      `"loginTime": "2025-09-10T09:00:00.000Z",`  
      `"logoutTime": "2025-09-10T18:00:00.000Z",`  
      `"staff": {`  
        `"id": 3,`  
        `"name": "Bob",`  
        `"email": "bob@example.com"`  
      `}`  
    `}`  
  `],`  
  `"inventory": [`  
    `{`  
      `"id": 3,`  
      `"quantity": 100,`  
      `"product": {`  
        `"id": 20,`  
        `"name": "Eye Drops",`  
        `"price": 49.5`  
      `}`  
    `}`  
  `]`  
`}`

---

# **🔹 3\. Staff Sales Report (`GET /reports/staff-sales`)**

**URL Example:**

`GET https://staff-optical-production.up.railway.app/reports/staff-sales?startDate=2025-09-01&endDate=2025-09-20`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

✅ **Response Example (200):**

`[`  
  `{`  
    `"staff": {`  
      `"id": 2,`  
      `"name": "Alice",`  
      `"email": "alice@example.com"`  
    `},`  
    `"totalSales": 2500.75,`  
    `"invoiceCount": 12`  
  `},`  
  `{`  
    `"staff": {`  
      `"id": 3,`  
      `"name": "Bob",`  
      `"email": "bob@example.com"`  
    `},`  
    `"totalSales": 1800.00,`  
    `"invoiceCount": 8`  
  `}`  
`]`

❌ **Error Example:**

`{`  
  `"error": "Failed to generate staff sales report."`  
`}`

---

# **🔹 4\. Sales by Price Tier (`GET /reports/sales-by-price-tier`)**

**URL Example:**

`GET https://staff-optical-production.up.railway.app/reports/sales-by-price-tier?startDate=2025-09-01&endDate=2025-09-20`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

✅ **Response Example (200):**

`{`  
  `"tierDefinitions": {`  
    `"low": { "max": 50 },`  
    `"medium": { "min": 50, "max": 500 },`  
    `"high": { "min": 500 }`  
  `},`  
  `"salesByTier": {`  
    `"low": { "count": 120 },`  
    `"medium": { "count": 300 },`  
    `"high": { "count": 50 }`  
  `}`  
`}`

---

# **🔹 5\. Best Sellers by Price Tier (`GET /reports/best-sellers-by-price-tier`)**

**URL Example:**

`GET https://staff-optical-production.up.railway.app/reports/best-sellers-by-price-tier?startDate=2025-09-01&endDate=2025-09-20&limit=3`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

✅ **Response Example (200):**

`{`  
  `"tierDefinitions": {`  
    `"low": { "max": 50 },`  
    `"medium": { "min": 50, "max": 500 },`  
    `"high": { "min": 500 }`  
  `},`  
  `"bestSellers": {`  
    `"low": [`  
      `{ "productName": "Eye Drops", "totalQuantity": 120, "unitPrice": 45 }`  
    `],`  
    `"medium": [`  
      `{ "productName": "Frames", "totalQuantity": 90, "unitPrice": 299 }`  
    `],`  
    `"high": [`  
      `{ "productName": "Premium Glasses", "totalQuantity": 30, "unitPrice": 1500 }`  
    `]`  
  `}`  
`}`

❌ **Error Example:**

`{`  
  `"error": "Failed to generate best sellers report."`  
`}`

ROYALTY:

#  **1\. Add Royalty Points (`POST /royalty`)**

**URL Example:**

`POST https://staff-optical-production.up.railway.app/royalty`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**✅ Request Body (JSON):**

`{`  
  `"patientId": 5`  
`}`

👉 This will add **10 points (pointsPerVisit)** to the patient’s royalty record.  
 If the patient doesn’t exist in the royalty table, it creates a new record.

**✅ Response Example (200):**

`{`  
  `"id": 3,`  
  `"patientId": 5,`  
  `"points": 30`  
`}`

*(Here the patient already had 20 points, and 10 more were added.)*

**❌ Error Responses:**

`{ "error": "Patient not found" }`

`{ "error": "Access denied. Patient belongs to different shop." }`

`{ "error": "Something went wrong" }`

---

# **🔹 2\. Get Royalty Points (`GET /royalty/:patientId`)**

**URL Example:**

`GET https://staff-optical-production.up.railway.app/royalty/5`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**✅ Response Example (200):**

`{`  
  `"id": 3,`  
  `"patientId": 5,`  
  `"points": 30`  
`}`

**❌ Error Responses:**

`{ "error": "Patient not found" }`

`{ "error": "Access denied. Patient belongs to different shop." }`

`{ "error": "Patient not found in royalty program" }`

`{ "error": "Something went wrong" }`

STOCKRECEIPT:

# **1\. Create Stock Receipt (POST)**

**URL:**

`POST https://staff-optical-production.up.railway.app/api/stock-receipts`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`  
`Content-Type: application/json`

**✅ Request Body Example:**

`{`  
  `"productId": 3,`  
  `"receivedQuantity": 100,`  
  `"supplierName": "ABC Suppliers Pvt Ltd",`  
  `"deliveryNote": "DN-789456",`  
  `"batchNumber": "BATCH-2025-09",`  
  `"expiryDate": "2026-12-31"`  
`}`

👉 `shopId` and `receivedByStaffId` are **taken from `req.user` (auth)**, so don’t include them manually.

**✅ Success Response Example (201):**

`{`  
  `"success": true,`  
  `"message": "Stock receipt created successfully. Waiting for shop admin approval.",`  
  `"receipt": {`  
    `"id": 15,`  
    `"shopId": 2,`  
    `"productId": 3,`  
    `"receivedQuantity": 100,`  
    `"receivedByStaffId": 7,`  
    `"supplierName": "ABC Suppliers Pvt Ltd",`  
    `"deliveryNote": "DN-789456",`  
    `"batchNumber": "BATCH-2025-09",`  
    `"expiryDate": "2026-12-31T00:00:00.000Z",`  
    `"status": "PENDING",`  
    `"createdAt": "2025-09-20T10:30:45.123Z",`  
    `"product": {`  
      `"id": 3,`  
      `"name": "Optical Frame X100",`  
      `"company": {`  
        `"id": 1,`  
        `"name": "LensKart Pvt Ltd"`  
      `}`  
    `}`  
  `}`  
`}`

**❌ Error Responses:**

`{ "error": "Missing required fields: productId, receivedQuantity" }`

`{ "error": "Product not found" }`

`{ "error": "Failed to create stock receipt" }`

---

# **🔹 2\. Get All Stock Receipts (GET)**

**URL:**

`GET https://staff-optical-production.up.railway.app/api/stock-receipts`

👉 Optional filter:

`GET https://staff-optical-production.up.railway.app/api/stock-receipts?status=PENDING`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**✅ Success Response Example (200):**

`{`  
  `"receipts": [`  
    `{`  
      `"id": 15,`  
      `"shopId": 2,`  
      `"productId": 3,`  
      `"receivedQuantity": 100,`  
      `"supplierName": "ABC Suppliers Pvt Ltd",`  
      `"deliveryNote": "DN-789456",`  
      `"batchNumber": "BATCH-2025-09",`  
      `"expiryDate": "2026-12-31T00:00:00.000Z",`  
      `"status": "PENDING",`  
      `"createdAt": "2025-09-20T10:30:45.123Z",`  
      `"product": {`  
        `"id": 3,`  
        `"name": "Optical Frame X100",`  
        `"company": {`  
          `"id": 1,`  
          `"name": "LensKart Pvt Ltd"`  
        `}`  
      `},`  
      `"receivedByStaff": {`  
        `"name": "Rohit Sharma"`  
      `},`  
      `"verifiedByAdmin": null`  
    `}`  
  `],`  
  `"summary": {`  
    `"total": 1,`  
    `"pending": 1,`  
    `"approved": 0,`  
    `"rejected": 0,`  
    `"completed": 0`  
  `}`  
`}`

---

# **🔹 3\. Get Stock Receipt by ID (GET)**

**URL:**

`GET https://staff-optical-production.up.railway.app/api/stock-receipts/15`

**Headers:**

`Authorization: Bearer <JWT_TOKEN>`

**✅ Success Response Example (200):**

`{`  
  `"id": 15,`  
  `"shopId": 2,`  
  `"productId": 3,`  
  `"receivedQuantity": 100,`  
  `"supplierName": "ABC Suppliers Pvt Ltd",`  
  `"deliveryNote": "DN-789456",`  
  `"batchNumber": "BATCH-2025-09",`  
  `"expiryDate": "2026-12-31T00:00:00.000Z",`  
  `"status": "PENDING",`  
  `"createdAt": "2025-09-20T10:30:45.123Z",`  
  `"product": {`  
    `"id": 3,`  
    `"name": "Optical Frame X100",`  
    `"company": {`  
      `"id": 1,`  
      `"name": "LensKart Pvt Ltd"`  
    `}`  
  `},`  
  `"receivedByStaff": {`  
    `"name": "Rohit Sharma"`  
  `},`  
  `"verifiedByAdmin": null`  
`}`

**❌ Error Response:**

`{ "error": "Stock receipt not found" }`

GIFTCARD:

### **1\. Issue Gift Card**

**POST** `/api/gift-cards/issue`  
 🔑 Requires `Authorization: Bearer <your_jwt_token>`

**Request Body (JSON):**

`{`  
  `"patientId": 1,`  
  `"balance": 1000`  
`}`

**Success Response (201 Created):**

`{`  
  `"id": 1,`  
  `"code": "k3x9a7h1d8q",`    
  `"balance": 1000,`  
  `"patientId": 1`  
`}`

❌ **Error Example (Patient doesn’t exist):**

`{ "error": "Something went wrong" }`

---

### **2\. Redeem Gift Card**

**POST** `/api/gift-cards/redeem`  
 🔑 Requires `Authorization: Bearer <your_jwt_token>`

**Request Body (JSON):**

`{`  
  `"code": "k3x9a7h1d8q",`  
  `"amount": 200`  
`}`

**Success Response (200 OK):**

`{`  
  `"id": 1,`  
  `"code": "k3x9a7h1d8q",`  
  `"balance": 800,`  
  `"patientId": 1`  
`}`

❌ **Error Example (Card not found):**

`{ "error": "Gift card not found" }`

❌ **Error Example (Insufficient balance):**

`{ "error": "Insufficient balance" }`

---

### **3\. Get Gift Card Balance**

**GET** `/api/gift-cards/k3x9a7h1d8q`  
 🔑 Requires `Authorization: Bearer <your_jwt_token>`

**Success Response (200 OK):**

`{`  
  `"balance": 800`  
`}`

❌ **Error Example (Card not found):**

`{ "error": "Gift card not found" }`  
