# 🎯 Staff Dashboard Frontend Implementation Task List

## 📋 Project Overview
Create a comprehensive Staff Dashboard frontend using modern React stack to implement all 37 endpoints from `staff.md` documentation. Each endpoint requires 5 verification/implementation tasks.

**Tech Stack:** React 18, TypeScript, Shadcn/ui, TailwindCSS, Redux Toolkit, React Router v6 (declarative), Responsive Design

**Total Tasks:** 185 (37 endpoints × 5 tasks each)

---

## 📊 **1. ATTENDANCE CONTROLLER** (2 endpoints × 5 tasks = 10 tasks)

### **Endpoint 1.1: POST /api/attendance/logout**

**Task 1.1.1** - API Verification
- [ ] Verify `StaffAPI.attendance.logout()` matches documentation
- [ ] Confirm endpoint: `POST /api/attendance/logout`
- [ ] Validate request body: `void` (no body required)
- [ ] Check response type: `{ message: string }`
- [ ] Ensure JWT authentication header included

**Task 1.1.2** - Component Implementation
- [ ] Create `AttendanceLogoutButton` component in `src/components/staff/attendance/`
- [ ] Implement logout button with confirmation modal using Shadcn Dialog
- [ ] Add loading states during API call
- [ ] Handle success/error notifications with Shadcn Toast
- [ ] Integrate with Redux state management

**Task 1.1.3** - UI/UX Placement
- [ ] Add logout button to Staff Header navigation
- [ ] Implement in Staff Dashboard main layout
- [ ] Ensure responsive design (mobile/tablet/desktop)
- [ ] Follow Shadcn design patterns for consistency
- [ ] Add proper accessibility (ARIA labels, keyboard navigation)

**Task 1.1.4** - User Interaction & Parameters
- [ ] Design confirmation dialog: "Are you sure you want to logout?"
- [ ] Add logout time display in confirmation
- [ ] Implement auto-logout on session expiry
- [ ] Handle network errors gracefully
- [ ] Provide clear user feedback for all states

**Task 1.1.5** - Response Display
- [ ] Show success message on successful logout
- [ ] Display attendance summary before logout (login time, duration)
- [ ] Handle error messages with user-friendly text
- [ ] Redirect to login page after successful logout
- [ ] Clear all cached data and Redux state

### **Endpoint 1.2: GET /api/attendance/:staffId**

**Task 1.2.1** - API Verification
- [ ] Verify `StaffAPI.attendance.getByStaff(staffId)` implementation
- [ ] Confirm endpoint: `GET /api/attendance/:staffId`
- [ ] Validate path parameter: `staffId: number`
- [ ] Check response array structure with staff details
- [ ] Ensure proper error handling for 403/500 responses

**Task 1.2.2** - Component Implementation
- [ ] Create `StaffAttendanceHistory` component in `src/components/staff/attendance/`
- [ ] Build attendance records table using Shadcn Table component
- [ ] Implement date range filtering with Shadcn DatePicker
- [ ] Add pagination for large datasets
- [ ] Create loading skeleton components

**Task 1.2.3** - UI/UX Placement
- [ ] Add "My Attendance" page to Staff Dashboard sidebar
- [ ] Create route `/staff-dashboard/attendance/my-records`
- [ ] Design responsive table layout (mobile cards, desktop table)
- [ ] Implement breadcrumb navigation
- [ ] Add page header with staff name and summary stats

**Task 1.2.4** - User Interaction & Parameters
- [ ] Date range picker for filtering attendance records
- [ ] Export functionality (PDF/CSV) with Shadcn Button variants
- [ ] Search/filter by specific dates or date ranges
- [ ] Sort by login time, logout time, duration
- [ ] Pagination controls with items per page selector

**Task 1.2.5** - Response Display
- [ ] Attendance records table: Login Time, Logout Time, Duration, Status
- [ ] Working hours summary (daily, weekly, monthly)
- [ ] Visual indicators for incomplete records (no logout)
- [ ] Charts/graphs for attendance patterns using recharts
- [ ] Empty state design when no records found

---

## 🔐 **2. AUTH CONTROLLER** (2 endpoints × 5 tasks = 10 tasks)

### **Endpoint 2.1: POST /api/auth/login**

**Task 2.1.1** - API Verification
- [ ] Verify `StaffAPI.auth.login(data)` matches documentation
- [ ] Confirm endpoint: `POST /api/auth/login`
- [ ] Validate request body: `{ email: string, password: string }`
- [ ] Check response: `{ token, staffId, name, shopId, shopName }`
- [ ] Ensure no authentication required for this endpoint

**Task 2.1.2** - Component Implementation
- [ ] Update existing `StaffLogin` component in `src/components/staff/auth/`
- [ ] Implement form using Shadcn Form with react-hook-form
- [ ] Add email/password validation with Zod schema
- [ ] Create loading states and error handling
- [ ] Integrate with Redux auth slice

**Task 2.1.3** - UI/UX Placement
- [ ] Verify Staff Login page at `/staff-login` route
- [ ] Ensure responsive design for all screen sizes
- [ ] Add proper form layout with Shadcn Input components
- [ ] Implement "Remember Me" functionality
- [ ] Add "Forgot Password" link (if available)

**Task 2.1.4** - User Interaction & Parameters
- [ ] Email format validation with real-time feedback
- [ ] Password strength indicators (if applicable)
- [ ] Show/hide password toggle button
- [ ] Form submission with Enter key support
- [ ] Auto-focus on first input field

**Task 2.1.5** - Response Display
- [ ] Success: Redirect to Staff Dashboard with welcome message
- [ ] Store JWT token securely in Redux/localStorage
- [ ] Display staff name and shop information after login
- [ ] Error handling: Invalid credentials, server errors
- [ ] Loading spinner during authentication process

### **Endpoint 2.2: POST /api/auth/logout**

**Task 2.2.1** - API Verification
- [ ] Verify `StaffAPI.auth.logout()` matches documentation
- [ ] Confirm endpoint: `POST /api/auth/logout`
- [ ] Validate request body: `void` (no body)
- [ ] Check response: `{ message: string }`
- [ ] Ensure JWT authentication header included

**Task 2.2.2** - Component Implementation
- [ ] Create `AuthLogoutButton` component in `src/components/staff/auth/`
- [ ] Distinguish from attendance logout (this is auth-only)
- [ ] Implement using Shadcn Button with logout icon
- [ ] Add confirmation dialog for security
- [ ] Handle loading and error states

**Task 2.2.3** - UI/UX Placement
- [ ] Add to Staff Dashboard header dropdown menu
- [ ] Place in user profile menu with other account actions
- [ ] Ensure mobile-responsive design
- [ ] Follow consistent styling with other auth components
- [ ] Add tooltips explaining difference from attendance logout

**Task 2.2.4** - User Interaction & Parameters
- [ ] Confirmation modal: "Logout without recording attendance?"
- [ ] Option to switch to attendance logout if preferred
- [ ] Handle session timeout scenarios
- [ ] Provide clear explanation of logout types
- [ ] Keyboard shortcuts for power users

**Task 2.2.5** - Response Display
- [ ] Success message before redirecting to login
- [ ] Clear authentication state from Redux
- [ ] Remove JWT token from storage
- [ ] Handle API errors gracefully
- [ ] Redirect to appropriate login page

---

## 📱 **3. BARCODE CONTROLLER** (5 endpoints × 5 tasks = 25 tasks)

### **Endpoint 3.1: POST /api/barcode/label**

**Task 3.1.1** - API Verification
- [ ] Verify `StaffAPI.barcode.generateLabel(data)` implementation
- [ ] Confirm endpoint: `POST /api/barcode/label`
- [ ] Validate request: `{ productId?: number, format?: string, width?: number, height?: number }`
- [ ] Check response: Binary image data (PNG/SVG)
- [ ] Ensure proper content-type handling

**Task 3.1.2** - Component Implementation
- [ ] Create `BarcodeGenerator` component in `src/components/staff/barcode/`
- [ ] Build form with product selection using Shadcn Select
- [ ] Add format options (PNG/SVG) with radio buttons
- [ ] Implement width/height input fields with validation
- [ ] Create barcode preview area

**Task 3.1.3** - UI/UX Placement
- [ ] Add "Generate Barcode" page at `/staff-dashboard/barcode/generate`
- [ ] Include in main navigation under "Inventory" section
- [ ] Design responsive layout for form and preview
- [ ] Add to inventory product detail pages
- [ ] Create quick-access button in product list

**Task 3.1.4** - User Interaction & Parameters
- [ ] Product search/autocomplete for productId selection
- [ ] Format selection with preview of differences
- [ ] Custom size inputs with preset options (small, medium, large)
- [ ] Real-time preview as parameters change
- [ ] Batch generation for multiple products

**Task 3.1.5** - Response Display
- [ ] Display generated barcode image in preview area
- [ ] Download button for generated barcode file
- [ ] Print functionality with proper sizing
- [ ] Copy barcode data to clipboard
- [ ] Error handling for invalid products or generation failures

### **Endpoint 3.2: POST /api/barcode/generate/:productId**

**Task 3.2.1** - API Verification
- [ ] Verify `StaffAPI.barcode.generate(productId)` implementation
- [ ] Confirm endpoint: `POST /api/barcode/generate/:productId`
- [ ] Validate path parameter: `productId: number`
- [ ] Check response: `{ productId, barcode, message }`
- [ ] Ensure proper error handling for invalid productId

**Task 3.2.2** - Component Implementation
- [ ] Create `ProductBarcodeGenerator` in `src/components/staff/barcode/`
- [ ] Build product selection interface with search
- [ ] Add generate button with loading states
- [ ] Display generated barcode information
- [ ] Integrate with existing product management

**Task 3.2.3** - UI/UX Placement
- [ ] Add to product detail pages as "Generate Barcode" button
- [ ] Include in bulk product actions
- [ ] Create dedicated page at `/staff-dashboard/barcode/assign`
- [ ] Add to product creation workflow
- [ ] Include in inventory management section

**Task 3.2.4** - User Interaction & Parameters
- [ ] Product search with autocomplete from inventory
- [ ] Filter products that don't have barcodes
- [ ] Batch selection for multiple products
- [ ] Confirmation dialog before generation
- [ ] Progress indicator for batch operations

**Task 3.2.5** - Response Display
- [ ] Success message with generated barcode number
- [ ] Update product information to show new barcode
- [ ] Display barcode in human-readable and scannable formats
- [ ] Error handling for products that already have barcodes
- [ ] Link to print barcode labels

### **Endpoint 3.3: POST /api/barcode/sku/generate/:productId**

**Task 3.3.1** - API Verification
- [ ] Verify `StaffAPI.barcode.generateSku(productId)` implementation
- [ ] Confirm endpoint: `POST /api/barcode/sku/generate/:productId`
- [ ] Validate path parameter: `productId: number`
- [ ] Check response: `{ productId, sku, message }`
- [ ] Handle errors for existing SKUs

**Task 3.3.2** - Component Implementation
- [ ] Create `ProductSkuGenerator` in `src/components/staff/barcode/`
- [ ] Similar interface to barcode generator but for SKUs
- [ ] Add SKU format options if applicable
- [ ] Display both SKU and barcode information
- [ ] Handle products with existing SKUs

**Task 3.3.3** - UI/UX Placement
- [ ] Add "Generate SKU" button next to barcode generation
- [ ] Include in product management workflow
- [ ] Create combined barcode/SKU generation page
- [ ] Add to product creation process
- [ ] Include in inventory setup section

**Task 3.3.4** - User Interaction & Parameters
- [ ] Product selection with SKU status filtering
- [ ] Option to regenerate existing SKUs (with warning)
- [ ] Bulk SKU generation for multiple products
- [ ] SKU format preferences if customizable
- [ ] Integration with barcode generation workflow

**Task 3.3.5** - Response Display
- [ ] Display generated SKU with success message
- [ ] Show SKU in product information updates
- [ ] Provide copy-to-clipboard functionality
- [ ] Error messages for SKU conflicts
- [ ] Link to product detail page with new SKU

### **Endpoint 3.4: GET /api/barcode/missing**

**Task 3.4.1** - API Verification
- [ ] Verify `StaffAPI.barcode.getMissing()` implementation
- [ ] Confirm endpoint: `GET /api/barcode/missing`
- [ ] Validate response: `Array<{ id, name, barcode: null, sku: null }>`
- [ ] No request parameters required
- [ ] Proper authentication handling

**Task 3.4.2** - Component Implementation
- [ ] Create `MissingBarcodesTable` in `src/components/staff/barcode/`
- [ ] Build table with Shadcn Table component
- [ ] Add bulk actions for generating barcodes/SKUs
- [ ] Include search and filtering capabilities
- [ ] Add pagination for large lists

**Task 3.4.3** - UI/UX Placement
- [ ] Create "Missing Barcodes" page at `/staff-dashboard/barcode/missing`
- [ ] Add alert badge in navigation showing count
- [ ] Include in inventory management dashboard
- [ ] Link from inventory overview with quick access
- [ ] Add to daily tasks/checklist for staff

**Task 3.4.4** - User Interaction & Parameters
- [ ] Search products by name within missing items
- [ ] Filter by product categories or types
- [ ] Sort by product name, creation date, etc.
- [ ] Select all/individual products for bulk actions
- [ ] Refresh button to update the list

**Task 3.4.5** - Response Display
- [ ] Table showing: Product ID, Name, Missing Barcode, Missing SKU
- [ ] Action buttons for each product (Generate Barcode/SKU)
- [ ] Bulk action buttons for selected items
- [ ] Empty state when all products have barcodes
- [ ] Progress indicators during bulk generation

### **Endpoint 3.5: POST /api/barcode/ (Legacy)**

**Task 3.5.1** - API Verification
- [ ] Verify legacy route compatibility with `/label` endpoint
- [ ] Ensure backward compatibility maintained
- [ ] Same parameters and response as `/label`
- [ ] Consider deprecation warnings if applicable
- [ ] Document legacy status in code comments

**Task 3.5.2** - Component Implementation
- [ ] Use same component as 3.1.2 (`BarcodeGenerator`)
- [ ] Add legacy route handling if needed
- [ ] Maintain compatibility with existing integrations
- [ ] No separate component needed (reuse existing)
- [ ] Add migration notices if deprecating

**Task 3.5.3** - UI/UX Placement
- [ ] Same placement as 3.1.3 (no changes needed)
- [ ] Handle legacy URLs with redirects if needed
- [ ] Maintain existing bookmarks and links
- [ ] No separate UI placement required
- [ ] Document in developer notes

**Task 3.5.4** - User Interaction & Parameters
- [ ] Same interactions as 3.1.4
- [ ] Maintain existing user workflows
- [ ] Handle legacy parameter formats
- [ ] No additional parameters needed
- [ ] Preserve user experience

**Task 3.5.5** - Response Display
- [ ] Same response handling as 3.1.5
- [ ] Consistent user experience
- [ ] No changes to display logic needed
- [ ] Maintain compatibility
- [ ] Handle legacy response formats

---

## 👥 **4. CUSTOMER CONTROLLER** (5 endpoints × 5 tasks = 25 tasks)

### **Endpoint 4.1: POST /api/customer/**

**Task 4.1.1** - API Verification
- [ ] Verify `StaffAPI.customers.create(data)` implementation
- [ ] Confirm endpoint: `POST /api/customer/`
- [ ] Validate request: `{ name: string, phone: string, address: string }`
- [ ] Check response: `{ id, name, phone, address, shopId, createdAt }`
- [ ] Ensure JWT authentication

**Task 4.1.2** - Component Implementation
- [ ] Create `CustomerCreateForm` in `src/components/staff/customers/`
- [ ] Build form using Shadcn Form with validation
- [ ] Add phone number formatting and validation
- [ ] Implement address input with suggestions
- [ ] Handle form submission and loading states

**Task 4.1.3** - UI/UX Placement
- [ ] Add "Add Customer" button in customers list page
- [ ] Create modal dialog or dedicated page for customer creation
- [ ] Add quick customer creation in invoice workflow
- [ ] Include in main customers section navigation
- [ ] Responsive form layout for all devices

**Task 4.1.4** - User Interaction & Parameters
- [ ] Name input with proper validation and formatting
- [ ] Phone number input with format validation (local format)
- [ ] Address input with autocomplete suggestions
- [ ] Form validation with real-time feedback
- [ ] Save and continue vs. Save and close options

**Task 4.1.5** - Response Display
- [ ] Success message with customer details
- [ ] Redirect to customer detail page or back to list
- [ ] Display created customer information
- [ ] Error handling for validation failures
- [ ] Integration with customer list refresh

### **Endpoint 4.2: GET /api/customer/**

**Task 4.2.1** - API Verification
- [ ] Verify `StaffAPI.customers.getAll(params)` implementation
- [ ] Confirm endpoint: `GET /api/customer/`
- [ ] Validate query params: `{ page?, limit?, search? }`
- [ ] Check response: `{ customers[], total, page, totalPages }`
- [ ] Proper pagination parameter handling

**Task 4.2.2** - Component Implementation
- [ ] Create `CustomersList` in `src/components/staff/customers/`
- [ ] Build table with Shadcn Table and pagination
- [ ] Add search input with debouncing
- [ ] Implement loading states and skeletons
- [ ] Create customer card view for mobile

**Task 4.2.3** - UI/UX Placement
- [ ] Main customers page at `/staff-dashboard/customers`
- [ ] Add to primary navigation menu
- [ ] Responsive design: table on desktop, cards on mobile
- [ ] Include customer count in page header
- [ ] Add breadcrumb navigation

**Task 4.2.4** - User Interaction & Parameters
- [ ] Search by name, phone, or address with live results
- [ ] Pagination with page size selector
- [ ] Sort by name, phone, creation date
- [ ] Filter options (recent, frequent customers)
- [ ] Bulk actions (select multiple customers)

**Task 4.2.5** - Response Display
- [ ] Customer table: Name, Phone, Address, Created Date, Actions
- [ ] Pagination controls with total count
- [ ] Search results highlighting
- [ ] Empty state for no customers found
- [ ] Loading states during search and pagination

### **Endpoint 4.3: GET /api/customer/hotspots**

**Task 4.3.1** - API Verification
- [ ] Verify `StaffAPI.customers.getHotspots()` implementation
- [ ] Confirm endpoint: `GET /api/customer/hotspots`
- [ ] No request parameters required
- [ ] Check response: `Array<{ address: string, customerCount: number }>`
- [ ] Proper authentication handling

**Task 4.3.2** - Component Implementation
- [ ] Create `CustomerHotspots` in `src/components/staff/customers/`
- [ ] Build visualization using recharts (bar/pie chart)
- [ ] Create list view with address and count
- [ ] Add interactive elements for drilling down
- [ ] Implement responsive chart design

**Task 4.3.3** - UI/UX Placement
- [ ] Add "Customer Hotspots" tab in customers section
- [ ] Include in customer analytics dashboard
- [ ] Create page at `/staff-dashboard/customers/hotspots`
- [ ] Add to reports and analytics section
- [ ] Mobile-responsive chart and list views

**Task 4.3.4** - User Interaction & Parameters
- [ ] Toggle between chart and list views
- [ ] Click on hotspot to see customers in that area
- [ ] Filter by minimum customer count
- [ ] Export hotspot data (CSV/PDF)
- [ ] Refresh data button

**Task 4.3.5** - Response Display
- [ ] Visual chart showing top customer areas
- [ ] List view with address and customer count
- [ ] Click-through to see customers in each area
- [ ] Empty state when no hotspots available
- [ ] Loading states for data fetch

### **Endpoint 4.4: GET /api/customer/:id**

**Task 4.4.1** - API Verification
- [ ] Verify `StaffAPI.customers.getById(id)` implementation
- [ ] Confirm endpoint: `GET /api/customer/:id`
- [ ] Validate path parameter: `id: number`
- [ ] Check response: `{ id, name, phone, address, invoices[] }`
- [ ] Handle 404 errors for non-existent customers

**Task 4.4.2** - Component Implementation
- [ ] Create `CustomerDetail` in `src/components/staff/customers/`
- [ ] Build customer information display
- [ ] Add customer invoices list/table
- [ ] Include edit customer functionality
- [ ] Create customer activity timeline

**Task 4.4.3** - UI/UX Placement
- [ ] Customer detail page at `/staff-dashboard/customers/:id`
- [ ] Link from customer list and search results
- [ ] Add back navigation to customers list
- [ ] Responsive layout for customer info and invoices
- [ ] Include in customer management workflow

**Task 4.4.4** - User Interaction & Parameters
- [ ] Edit customer information inline or modal
- [ ] View customer purchase history
- [ ] Filter customer invoices by date/status
- [ ] Create new invoice for customer
- [ ] Customer communication actions (call, email)

**Task 4.4.5** - Response Display
- [ ] Customer information card with contact details
- [ ] Customer invoices table with pagination
- [ ] Customer statistics (total purchases, frequency)
- [ ] Edit success/error messages
- [ ] 404 handling for deleted customers

### **Endpoint 4.5: POST /api/customer/invoice**

**Task 4.5.1** - API Verification
- [ ] Verify `StaffAPI.customers.createInvoice(data)` implementation
- [ ] Confirm endpoint: `POST /api/customer/invoice`
- [ ] Validate complex request body with customer and items
- [ ] Check response: `{ message, customer, invoice }`
- [ ] Handle validation errors properly

**Task 4.5.2** - Component Implementation
- [ ] Create `WalkInCustomerInvoice` in `src/components/staff/customers/`
- [ ] Build combined customer creation + invoice form
- [ ] Add product selection with inventory lookup
- [ ] Implement payment processing interface
- [ ] Handle complex form validation

**Task 4.5.3** - UI/UX Placement
- [ ] Add "Walk-in Sale" button in main dashboard
- [ ] Include in point-of-sale (POS) section
- [ ] Create page at `/staff-dashboard/pos/walk-in`
- [ ] Add to quick actions in navigation
- [ ] Mobile-optimized for tablet POS usage

**Task 4.5.4** - User Interaction & Parameters
- [ ] Customer info form with validation
- [ ] Product search and selection with barcode scanning
- [ ] Quantity and price modification
- [ ] Payment method selection and amount input
- [ ] Order summary and confirmation

**Task 4.5.5** - Response Display
- [ ] Invoice creation success with invoice number
- [ ] Customer creation confirmation
- [ ] Print invoice option
- [ ] Error handling for inventory/payment issues
- [ ] Redirect to invoice detail or new sale

---

## 🎁 **5. GIFT CARD CONTROLLER** (3 endpoints × 5 tasks = 15 tasks)

### **Endpoint 5.1: POST /api/gift-card/issue**

**Task 5.1.1** - API Verification
- [ ] Verify `StaffAPI.giftCards.issue(data)` implementation
- [ ] Confirm endpoint: `POST /api/gift-card/issue`
- [ ] Validate request: `{ patientId: number, balance: number }`
- [ ] Check response: `{ id, code, balance, patientId, createdAt }`
- [ ] Ensure proper authentication and validation

**Task 5.1.2** - Component Implementation
- [ ] Create `GiftCardIssue` in `src/components/staff/gift-cards/`
- [ ] Build form with patient selection and balance input
- [ ] Add gift card code generation preview
- [ ] Implement amount validation and formatting
- [ ] Create print-ready gift card design

**Task 5.1.3** - UI/UX Placement
- [ ] Add "Issue Gift Card" page at `/staff-dashboard/gift-cards/issue`
- [ ] Include in main gift cards section
- [ ] Add quick action button in patient profiles
- [ ] Create gift card management dashboard
- [ ] Mobile-responsive form design

**Task 5.1.4** - User Interaction & Parameters
- [ ] Patient search and selection interface
- [ ] Balance input with currency formatting
- [ ] Gift card design/template selection
- [ ] Preview before issuing
- [ ] Batch gift card creation option

**Task 5.1.5** - Response Display
- [ ] Display issued gift card with code
- [ ] Print gift card option with proper formatting
- [ ] Success message with gift card details
- [ ] Email/SMS gift card to patient option
- [ ] Add to patient's gift card history

### **Endpoint 5.2: POST /api/gift-card/redeem**

**Task 5.2.1** - API Verification
- [ ] Verify `StaffAPI.giftCards.redeem(data)` implementation
- [ ] Confirm endpoint: `POST /api/gift-card/redeem`
- [ ] Validate request: `{ code: string, amount: number }`
- [ ] Check response: `{ id, code, balance, message }`
- [ ] Handle insufficient balance errors

**Task 5.2.2** - Component Implementation
- [ ] Create `GiftCardRedeem` in `src/components/staff/gift-cards/`
- [ ] Build code input with validation
- [ ] Add amount input with balance checking
- [ ] Implement barcode/QR code scanning
- [ ] Create redemption confirmation dialog

**Task 5.2.3** - UI/UX Placement
- [ ] Add "Redeem Gift Card" in POS workflow
- [ ] Include in payment processing section
- [ ] Create page at `/staff-dashboard/gift-cards/redeem`
- [ ] Add to invoice payment options
- [ ] Quick access button in main dashboard

**Task 5.2.4** - User Interaction & Parameters
- [ ] Gift card code input with format validation
- [ ] Amount to redeem with balance verification
- [ ] Barcode scanner integration
- [ ] Partial redemption vs. full amount options
- [ ] Integration with invoice payment flow

**Task 5.2.5** - Response Display
- [ ] Show remaining gift card balance
- [ ] Redemption success confirmation
- [ ] Receipt/proof of redemption
- [ ] Error handling for invalid codes/insufficient funds
- [ ] Update invoice payment information

### **Endpoint 5.3: GET /api/gift-card/:code**

**Task 5.3.1** - API Verification
- [ ] Verify `StaffAPI.giftCards.getBalance(code)` implementation
- [ ] Confirm endpoint: `GET /api/gift-card/:code`
- [ ] Validate path parameter: `code: string`
- [ ] Check response: `{ code, balance, patientId }`
- [ ] Handle invalid gift card codes

**Task 5.3.2** - Component Implementation
- [ ] Create `GiftCardBalance` in `src/components/staff/gift-cards/`
- [ ] Build code lookup interface
- [ ] Add balance display with formatting
- [ ] Include gift card history/transactions
- [ ] Create quick balance check widget

**Task 5.3.3** - UI/UX Placement
- [ ] Add "Check Balance" page at `/staff-dashboard/gift-cards/balance`
- [ ] Include in gift card management section
- [ ] Add to POS for pre-purchase verification
- [ ] Create widget for customer service
- [ ] Mobile-friendly balance checker

**Task 5.3.4** - User Interaction & Parameters
- [ ] Gift card code input with validation
- [ ] Barcode/QR code scanning capability
- [ ] Quick lookup from gift card list
- [ ] Integration with redemption workflow
- [ ] Customer-facing balance check option

**Task 5.3.5** - Response Display
- [ ] Current gift card balance prominently displayed
- [ ] Gift card information (issue date, patient)
- [ ] Transaction history for the card
- [ ] Options to redeem or issue more credit
- [ ] Error handling for invalid/expired cards

---

## 📦 **6. INVENTORY CONTROLLER** (13 endpoints × 5 tasks = 65 tasks)

### **Endpoint 6.1: POST /api/inventory/stock-by-barcode**

**Task 6.1.1** - API Verification
- [ ] Verify `StaffAPI.inventory.stockByBarcode(data)` implementation
- [ ] Confirm endpoint: `POST /api/inventory/stock-by-barcode`
- [ ] Validate request: `{ barcode: string, quantity: number, action: string }`
- [ ] Check response structure and error handling
- [ ] Ensure proper authentication

**Task 6.1.2** - Component Implementation
- [ ] Create `StockByBarcode` in `src/components/staff/inventory/`
- [ ] Build barcode input with scanner integration
- [ ] Add quantity input with validation
- [ ] Implement action selector (stock-in/stock-out)
- [ ] Create confirmation dialog for stock changes

**Task 6.1.3** - UI/UX Placement
- [ ] Add "Quick Stock Update" in inventory dashboard
- [ ] Create page at `/staff-dashboard/inventory/quick-stock`
- [ ] Include in daily operations section
- [ ] Add to mobile POS for immediate stock updates
- [ ] Integrate with barcode scanning workflow

**Task 6.1.4** - User Interaction & Parameters
- [ ] Barcode scanner integration with camera/external scanner
- [ ] Manual barcode input with validation
- [ ] Quantity input with increase/decrease buttons
- [ ] Action selection (stock in/out) with clear labels
- [ ] Batch operations for multiple items

**Task 6.1.5** - Response Display
- [ ] Stock update confirmation with new quantities
- [ ] Product information display after barcode scan
- [ ] Error handling for invalid barcodes
- [ ] Success notifications with updated inventory levels
- [ ] Integration with inventory alerts/notifications

### **Endpoint 6.2: POST /api/inventory/stock-out-by-barcode**

**Task 6.2.1** - API Verification
- [ ] Verify `StaffAPI.inventory.stockOutByBarcode(data)` implementation
- [ ] Confirm endpoint: `POST /api/inventory/stock-out-by-barcode`
- [ ] Validate request: `{ barcode: string, quantity: number }`
- [ ] Check response and error handling for insufficient stock
- [ ] Ensure proper validation

**Task 6.2.2** - Component Implementation
- [ ] Create `StockOutByBarcode` in `src/components/staff/inventory/`
- [ ] Similar to 6.1.2 but focused on stock removal
- [ ] Add insufficient stock warnings
- [ ] Implement quantity validation against available stock
- [ ] Create reason selection for stock out

**Task 6.2.3** - UI/UX Placement
- [ ] Include in sales/POS workflow
- [ ] Add to inventory management section
- [ ] Create quick stock-out for damaged/returned items
- [ ] Integrate with invoice creation process
- [ ] Mobile-optimized for floor staff

**Task 6.2.4** - User Interaction & Parameters
- [ ] Barcode scanning with immediate stock level display
- [ ] Quantity selection with max available validation
- [ ] Reason selection (sale, damage, return, etc.)
- [ ] Confirmation with current vs. new stock levels
- [ ] Batch stock-out for multiple items

**Task 6.2.5** - Response Display
- [ ] Updated stock levels after removal
- [ ] Warnings for low stock after operation
- [ ] Error handling for insufficient inventory
- [ ] Success confirmation with transaction details
- [ ] Integration with inventory alerts

### **Endpoint 6.3: GET /api/inventory/product/barcode/:barcode**

**Task 6.3.1** - API Verification
- [ ] Verify `StaffAPI.inventory.getProductByBarcode(barcode)` implementation
- [ ] Confirm endpoint: `GET /api/inventory/product/barcode/:barcode`
- [ ] Validate path parameter: `barcode: string`
- [ ] Check response: product with inventory information
- [ ] Handle invalid barcode errors

**Task 6.3.2** - Component Implementation
- [ ] Create `ProductBarcodeLoader` in `src/components/staff/inventory/`
- [ ] Build barcode scanner interface
- [ ] Add product information display
- [ ] Include inventory status and pricing
- [ ] Create loading states for barcode lookup

**Task 6.3.3** - UI/UX Placement
- [ ] Integrate in POS system for product lookup
- [ ] Add to inventory verification workflows
- [ ] Include in product search interfaces
- [ ] Create mobile barcode lookup tool
- [ ] Add to stock management operations

**Task 6.3.4** - User Interaction & Parameters
- [ ] Barcode scanner with camera integration
- [ ] Manual barcode entry with format validation
- [ ] Quick product lookup from barcode
- [ ] Integration with other inventory operations
- [ ] Batch barcode scanning capability

**Task 6.3.5** - Response Display
- [ ] Complete product information display
- [ ] Current inventory levels and pricing
- [ ] Product images and specifications
- [ ] Quick actions (edit, stock update, view details)
- [ ] Error handling for non-existent products

### **Endpoint 6.4: GET /api/inventory/product/:productId**

**Task 6.4.1** - API Verification
- [ ] Verify `StaffAPI.inventory.getProductById(productId)` implementation
- [ ] Confirm endpoint: `GET /api/inventory/product/:productId`
- [ ] Validate path parameter: `productId: number`
- [ ] Check comprehensive product response
- [ ] Handle product not found errors

**Task 6.4.2** - Component Implementation
- [ ] Create `ProductDetail` in `src/components/staff/inventory/`
- [ ] Build comprehensive product information display
- [ ] Add inventory management actions
- [ ] Include product editing capabilities
- [ ] Create product image gallery

**Task 6.4.3** - UI/UX Placement
- [ ] Product detail page at `/staff-dashboard/inventory/products/:id`
- [ ] Link from product lists and search results
- [ ] Include in inventory management workflow
- [ ] Add breadcrumb navigation
- [ ] Responsive design for all device sizes

**Task 6.4.4** - User Interaction & Parameters
- [ ] Edit product information inline
- [ ] Stock level management actions
- [ ] Price history and updates
- [ ] Product categorization and tagging
- [ ] Related products and recommendations

**Task 6.4.5** - Response Display
- [ ] Complete product information layout
- [ ] Inventory status with visual indicators
- [ ] Stock history and movement tracking
- [ ] Pricing information and cost analysis
- [ ] Product performance metrics

### **Endpoint 6.5: GET /api/inventory/products**

**Task 6.5.1** - API Verification
- [ ] Verify `StaffAPI.inventory.getProducts(params)` implementation
- [ ] Confirm endpoint: `GET /api/inventory/products`
- [ ] Validate query params: `{ page?, limit?, search? }`
- [ ] Check paginated response structure
- [ ] Ensure proper search functionality

**Task 6.5.2** - Component Implementation
- [ ] Create `ProductsList` in `src/components/staff/inventory/`
- [ ] Build paginated product table/grid
- [ ] Add search and filtering capabilities
- [ ] Implement sorting options
- [ ] Create product cards for mobile view

**Task 6.5.3** - UI/UX Placement
- [ ] Main products page at `/staff-dashboard/inventory/products`
- [ ] Primary navigation in inventory section
- [ ] Responsive table/grid layout
- [ ] Add to inventory dashboard
- [ ] Include in product management workflow

**Task 6.5.4** - User Interaction & Parameters
- [ ] Search by product name, barcode, SKU
- [ ] Filter by category, company, stock status
- [ ] Sort by name, price, stock level, date added
- [ ] Pagination with adjustable page size
- [ ] Bulk actions (edit, delete, stock update)

**Task 6.5.5** - Response Display
- [ ] Product grid/table with key information
- [ ] Stock level indicators with color coding
- [ ] Quick action buttons for each product
- [ ] Pagination controls with total count
- [ ] Empty state for no products found

### **Endpoint 6.6: POST /api/inventory/product**

**Task 6.6.1** - API Verification
- [ ] Verify `StaffAPI.inventory.addProduct(data)` implementation
- [ ] Confirm endpoint: `POST /api/inventory/product`
- [ ] Validate complex request body with all product fields
- [ ] Check response with created product information
- [ ] Handle validation errors properly

**Task 6.6.2** - Component Implementation
- [ ] Create `ProductCreateForm` in `src/components/staff/inventory/`
- [ ] Build comprehensive product creation form
- [ ] Add image upload capability
- [ ] Implement field validation with Zod
- [ ] Create category and company selection

**Task 6.6.3** - UI/UX Placement
- [ ] Add "New Product" button in products list
- [ ] Create page at `/staff-dashboard/inventory/products/new`
- [ ] Include in inventory management workflow
- [ ] Add to quick actions in dashboard
- [ ] Responsive form layout

**Task 6.6.4** - User Interaction & Parameters
- [ ] All product fields with proper validation
- [ ] Company selection with search/create option
- [ ] Category and specification selection
- [ ] Image upload with preview
- [ ] Pricing and cost information input

**Task 6.6.5** - Response Display
- [ ] Product creation success with details
- [ ] Redirect to product detail page
- [ ] Error handling for validation failures
- [ ] Integration with product list refresh
- [ ] Success notifications

### **Endpoint 6.7: PUT /api/inventory/product/:productId**

**Task 6.7.1** - API Verification
- [ ] Verify `StaffAPI.inventory.updateProduct(productId, data)` implementation
- [ ] Confirm endpoint: `PUT /api/inventory/product/:productId`
- [ ] Validate path parameter and request body
- [ ] Check response with updated product
- [ ] Handle product not found errors

**Task 6.7.2** - Component Implementation
- [ ] Create `ProductEditForm` in `src/components/staff/inventory/`
- [ ] Reuse ProductCreateForm with edit mode
- [ ] Pre-populate fields with existing data
- [ ] Add change tracking and confirmation
- [ ] Handle concurrent edit scenarios

**Task 6.7.3** - UI/UX Placement
- [ ] Edit button in product detail pages
- [ ] Inline editing in product lists
- [ ] Modal or dedicated edit page
- [ ] Include in product management workflow
- [ ] Mobile-friendly edit interface

**Task 6.7.4** - User Interaction & Parameters
- [ ] All editable product fields
- [ ] Change detection and highlighting
- [ ] Confirmation for significant changes
- [ ] Save draft functionality
- [ ] Cancel with unsaved changes warning

**Task 6.7.5** - Response Display
- [ ] Update success confirmation
- [ ] Display updated product information
- [ ] Error handling for conflicts or validation
- [ ] Integration with product detail refresh
- [ ] Change history tracking

### **Endpoint 6.8: POST /api/inventory/stock-in**

**Task 6.8.1** - API Verification
- [ ] Verify `StaffAPI.inventory.stockIn(data)` implementation
- [ ] Confirm endpoint: `POST /api/inventory/stock-in`
- [ ] Validate request: `{ productId, quantity, costPrice?, sellingPrice? }`
- [ ] Check response with updated inventory
- [ ] Handle validation errors

**Task 6.8.2** - Component Implementation
- [ ] Create `StockInForm` in `src/components/staff/inventory/`
- [ ] Build product selection and quantity input
- [ ] Add pricing fields with validation
- [ ] Implement batch stock-in capability
- [ ] Create stock receipt generation

**Task 6.8.3** - UI/UX Placement
- [ ] Add "Stock In" page at `/staff-dashboard/inventory/stock-in`
- [ ] Include in inventory management section
- [ ] Add to receiving workflow
- [ ] Quick stock-in from product pages
- [ ] Mobile-optimized for warehouse use

**Task 6.8.4** - User Interaction & Parameters
- [ ] Product search and selection
- [ ] Quantity input with validation
- [ ] Optional cost and selling price updates
- [ ] Batch entry for multiple products
- [ ] Supplier and receipt information

**Task 6.8.5** - Response Display
- [ ] Stock-in confirmation with new levels
- [ ] Updated inventory information
- [ ] Stock receipt generation
- [ ] Error handling for invalid products
- [ ] Integration with inventory alerts

### **Endpoint 6.9: POST /api/inventory/stock-out**

**Task 6.9.1** - API Verification
- [ ] Verify `StaffAPI.inventory.stockOut(data)` implementation
- [ ] Confirm endpoint: `POST /api/inventory/stock-out`
- [ ] Validate request: `{ productId, quantity }`
- [ ] Check response and insufficient stock handling
- [ ] Proper error management

**Task 6.9.2** - Component Implementation
- [ ] Create `StockOutForm` in `src/components/staff/inventory/`
- [ ] Build product selection with current stock display
- [ ] Add reason selection for stock out
- [ ] Implement quantity validation
- [ ] Create stock removal confirmation

**Task 6.9.3** - UI/UX Placement
- [ ] Add "Stock Out" page at `/staff-dashboard/inventory/stock-out`
- [ ] Include in inventory adjustments section
- [ ] Add to damage/return workflows
- [ ] Quick stock-out from product pages
- [ ] Integration with sales processes

**Task 6.9.4** - User Interaction & Parameters
- [ ] Product search with stock level display
- [ ] Quantity input with max available validation
- [ ] Reason selection (sale, damage, return, etc.)
- [ ] Confirmation with impact on stock levels
- [ ] Batch stock-out capability

**Task 6.9.5** - Response Display
- [ ] Stock-out confirmation with new levels
- [ ] Low stock warnings if applicable
- [ ] Error handling for insufficient inventory
- [ ] Stock adjustment receipt
- [ ] Integration with inventory reporting

### **Endpoint 6.10: GET /api/inventory/**

**Task 6.10.1** - API Verification
- [ ] Verify `StaffAPI.inventory.getCurrent()` implementation
- [ ] Confirm endpoint: `GET /api/inventory/`
- [ ] No parameters required
- [ ] Check response: inventory with stock levels and thresholds
- [ ] Proper authentication handling

**Task 6.10.2** - Component Implementation
- [ ] Create `InventoryOverview` in `src/components/staff/inventory/`
- [ ] Build inventory dashboard with key metrics
- [ ] Add stock level indicators and alerts
- [ ] Implement filtering and sorting
- [ ] Create inventory status widgets

**Task 6.10.3** - UI/UX Placement
- [ ] Main inventory dashboard at `/staff-dashboard/inventory`
- [ ] Primary landing page for inventory section
- [ ] Include key metrics and alerts
- [ ] Responsive dashboard layout
- [ ] Quick access to all inventory functions

**Task 6.10.4** - User Interaction & Parameters
- [ ] Filter by stock level (low, normal, high)
- [ ] Sort by various criteria
- [ ] Search inventory items
- [ ] Quick actions for stock adjustments
- [ ] Bulk operations on selected items

**Task 6.10.5** - Response Display
- [ ] Inventory summary with stock levels
- [ ] Color-coded stock status indicators
- [ ] Low stock alerts and notifications
- [ ] Inventory value and statistics
- [ ] Quick links to stock management actions

### **Endpoint 6.11: POST /api/inventory/company**

**Task 6.11.1** - API Verification
- [ ] Verify `StaffAPI.inventory.addCompany(data)` implementation
- [ ] Confirm endpoint: `POST /api/inventory/company`
- [ ] Validate request: `{ name: string, description?: string }`
- [ ] Check response with created company
- [ ] Handle duplicate company names

**Task 6.11.2** - Component Implementation
- [ ] Create `CompanyCreateForm` in `src/components/staff/inventory/`
- [ ] Build simple company creation form
- [ ] Add company validation and search
- [ ] Implement company logo upload
- [ ] Create company information display

**Task 6.11.3** - UI/UX Placement
- [ ] Add "New Company" in companies management
- [ ] Include in product creation workflow
- [ ] Create page at `/staff-dashboard/inventory/companies/new`
- [ ] Modal dialog for quick company creation
- [ ] Integration with product management

**Task 6.11.4** - User Interaction & Parameters
- [ ] Company name input with duplicate checking
- [ ] Optional description field
- [ ] Company logo/image upload
- [ ] Company contact information
- [ ] Integration with existing companies

**Task 6.11.5** - Response Display
- [ ] Company creation success confirmation
- [ ] Display new company information
- [ ] Integration with company list refresh
- [ ] Error handling for validation issues
- [ ] Redirect to company detail or products

### **Endpoint 6.12: GET /api/inventory/companies**

**Task 6.12.1** - API Verification
- [ ] Verify `StaffAPI.inventory.getCompanies()` implementation
- [ ] Confirm endpoint: `GET /api/inventory/companies`
- [ ] No parameters required
- [ ] Check response: array of companies
- [ ] Proper authentication handling

**Task 6.12.2** - Component Implementation
- [ ] Create `CompaniesList` in `src/components/staff/inventory/`
- [ ] Build companies table/grid display
- [ ] Add company search and filtering
- [ ] Include product count for each company
- [ ] Create company management actions

**Task 6.12.3** - UI/UX Placement
- [ ] Companies page at `/staff-dashboard/inventory/companies`
- [ ] Include in inventory management section
- [ ] Add to product management workflow
- [ ] Responsive companies display
- [ ] Integration with product filtering

**Task 6.12.4** - User Interaction & Parameters
- [ ] Search companies by name
- [ ] Sort by name, product count, date added
- [ ] Filter active/inactive companies
- [ ] View products by company
- [ ] Company management actions

**Task 6.12.5** - Response Display
- [ ] Companies list with key information
- [ ] Product count for each company
- [ ] Company management buttons
- [ ] Search and filter results
- [ ] Empty state for no companies

### **Endpoint 6.13: GET /api/inventory/company/:companyId/products**

**Task 6.13.1** - API Verification
- [ ] Verify `StaffAPI.inventory.getCompanyProducts(companyId)` implementation
- [ ] Confirm endpoint: `GET /api/inventory/company/:companyId/products`
- [ ] Validate path parameter: `companyId: number`
- [ ] Check response: products filtered by company
- [ ] Handle invalid company IDs

**Task 6.13.2** - Component Implementation
- [ ] Create `CompanyProducts` in `src/components/staff/inventory/`
- [ ] Reuse ProductsList component with company filter
- [ ] Add company header information
- [ ] Include add product to company action
- [ ] Create company-specific analytics

**Task 6.13.3** - UI/UX Placement
- [ ] Company products page at `/staff-dashboard/inventory/companies/:id/products`
- [ ] Link from companies list and company details
- [ ] Include in company management workflow
- [ ] Add breadcrumb navigation
- [ ] Integration with product management

**Task 6.13.4** - User Interaction & Parameters
- [ ] All product list interactions within company context
- [ ] Add new product to company
- [ ] Company product analytics
- [ ] Export company product list
- [ ] Company product performance metrics

**Task 6.13.5** - Response Display
- [ ] Company header with basic information
- [ ] Products list filtered by company
- [ ] Company product statistics
- [ ] Links to individual product details
- [ ] Company-specific actions and reports

---

## 🧾 **7. INVOICE CONTROLLER** (8 endpoints × 5 tasks = 40 tasks)

### **Endpoint 7.1: GET /api/invoice/**

**Task 7.1.1** - API Verification
- [ ] Verify `StaffAPI.invoices.getAll(params)` implementation
- [ ] Confirm endpoint: `GET /api/invoice/`
- [ ] Validate query params: `{ page?, limit?, status?, patientId?, customerId?, startDate?, endDate? }`
- [ ] Check paginated response with filtering
- [ ] Handle complex filtering combinations

**Task 7.1.2** - Component Implementation
- [ ] Create `InvoicesList` in `src/components/staff/invoices/`
- [ ] Build advanced filtering interface
- [ ] Add date range picker for filtering
- [ ] Implement status-based filtering
- [ ] Create invoice summary cards

**Task 7.1.3** - UI/UX Placement
- [ ] Main invoices page at `/staff-dashboard/invoices`
- [ ] Primary navigation in sales section
- [ ] Responsive table/card layout
- [ ] Include invoice analytics dashboard
- [ ] Add to financial reporting section

**Task 7.1.4** - User Interaction & Parameters
- [ ] Advanced filtering by multiple criteria
- [ ] Date range selection with presets
- [ ] Status filtering with visual indicators
- [ ] Patient/customer search integration
- [ ] Export filtered results

**Task 7.1.5** - Response Display
- [ ] Invoices table with key information
- [ ] Status indicators with color coding
- [ ] Pagination with filtering preservation
- [ ] Invoice totals and statistics
- [ ] Quick actions for each invoice

### **Endpoint 7.2: POST /api/invoice/**

**Task 7.2.1** - API Verification
- [ ] Verify `StaffAPI.invoices.create(data)` implementation
- [ ] Confirm endpoint: `POST /api/invoice/`
- [ ] Validate complex request body with items array
- [ ] Check response with created invoice
- [ ] Handle validation errors properly

**Task 7.2.2** - Component Implementation
- [ ] Create `InvoiceCreateForm` in `src/components/staff/invoices/`
- [ ] Build comprehensive invoice creation interface
- [ ] Add product selection with inventory lookup
- [ ] Implement tax calculation and discounts
- [ ] Create payment processing integration

**Task 7.2.3** - UI/UX Placement
- [ ] New invoice page at `/staff-dashboard/invoices/new`
- [ ] Add to POS system workflow
- [ ] Include in sales dashboard
- [ ] Quick invoice creation from various contexts
- [ ] Mobile-optimized for tablet POS

**Task 7.2.4** - User Interaction & Parameters
- [ ] Patient/prescription selection interface
- [ ] Product search and selection with barcode
- [ ] Quantity, pricing, and discount inputs
- [ ] Tax calculation and adjustment
- [ ] Payment method and amount processing

**Task 7.2.5** - Response Display
- [ ] Invoice creation success with invoice number
- [ ] Print invoice option immediately
- [ ] Invoice summary and totals
- [ ] Payment confirmation if paid
- [ ] Redirect to invoice detail or new invoice

### **Endpoint 7.3: GET /api/invoice/:id**

**Task 7.3.1** - API Verification
- [ ] Verify `StaffAPI.invoices.getById(id)` implementation
- [ ] Confirm endpoint: `GET /api/invoice/:id`
- [ ] Validate path parameter: `id: string`
- [ ] Check comprehensive invoice response
- [ ] Handle invoice not found errors

**Task 7.3.2** - Component Implementation
- [ ] Create `InvoiceDetail` in `src/components/staff/invoices/`
- [ ] Build detailed invoice display
- [ ] Add invoice management actions
- [ ] Include payment history and updates
- [ ] Create invoice printing interface

**Task 7.3.3** - UI/UX Placement
- [ ] Invoice detail page at `/staff-dashboard/invoices/:id`
- [ ] Link from invoices list and search results
- [ ] Include in customer/patient profiles
- [ ] Add breadcrumb navigation
- [ ] Responsive invoice display

**Task 7.3.4** - User Interaction & Parameters
- [ ] Invoice status management actions
- [ ] Add payment to invoice
- [ ] Edit invoice if allowed
- [ ] Print/email invoice options
- [ ] Invoice notes and comments

**Task 7.3.5** - Response Display
- [ ] Complete invoice information layout
- [ ] Itemized breakdown with totals
- [ ] Payment history and status
- [ ] Customer/patient information
- [ ] Invoice actions and options

### **Endpoint 7.4: PATCH /api/invoice/:id/status**

**Task 7.4.1** - API Verification
- [ ] Verify `StaffAPI.invoices.updateStatus(id, data)` implementation
- [ ] Confirm endpoint: `PATCH /api/invoice/:id/status`
- [ ] Validate request: `{ status: string, reason?: string }`
- [ ] Check response with updated invoice
- [ ] Handle status transition validation

**Task 7.4.2** - Component Implementation
- [ ] Create `InvoiceStatusUpdate` in `src/components/staff/invoices/`
- [ ] Build status selection interface
- [ ] Add reason input for status changes
- [ ] Implement status change confirmation
- [ ] Create status history tracking

**Task 7.4.3** - UI/UX Placement
- [ ] Status update in invoice detail page
- [ ] Bulk status update in invoices list
- [ ] Include in invoice management workflow
- [ ] Quick status change dropdown
- [ ] Modal dialog for status changes

**Task 7.4.4** - User Interaction & Parameters
- [ ] Status selection with available transitions
- [ ] Reason input for audit trail
- [ ] Confirmation for significant changes
- [ ] Bulk status updates for multiple invoices
- [ ] Status change notifications

**Task 7.4.5** - Response Display
- [ ] Status update confirmation
- [ ] Updated invoice status display
- [ ] Status change history
- [ ] Notifications for status changes
- [ ] Integration with invoice list refresh

### **Endpoint 7.5: POST /api/invoice/:id/payment**

**Task 7.5.1** - API Verification
- [ ] Verify `StaffAPI.invoices.addPayment(id, data)` implementation
- [ ] Confirm endpoint: `POST /api/invoice/:id/payment`
- [ ] Validate request: `{ amount: number, method: string, notes?: string }`
- [ ] Check response with payment information
- [ ] Handle overpayment and validation

**Task 7.5.2** - Component Implementation
- [ ] Create `InvoicePayment` in `src/components/staff/invoices/`
- [ ] Build payment processing interface
- [ ] Add payment method selection
- [ ] Implement amount validation and calculation
- [ ] Create payment confirmation dialog

**Task 7.5.3** - UI/UX Placement
- [ ] Payment section in invoice detail page
- [ ] Quick payment from invoices list
- [ ] Include in POS payment workflow
- [ ] Payment processing modal
- [ ] Mobile-optimized payment interface

**Task 7.5.4** - User Interaction & Parameters
- [ ] Payment amount input with remaining balance
- [ ] Payment method selection (cash, card, etc.)
- [ ] Optional payment notes
- [ ] Partial payment handling
- [ ] Payment receipt generation

**Task 7.5.5** - Response Display
- [ ] Payment success confirmation
- [ ] Updated invoice balance and status
- [ ] Payment receipt option
- [ ] Payment history update
- [ ] Integration with financial reporting

### **Endpoint 7.6: DELETE /api/invoice/:id**

**Task 7.6.1** - API Verification
- [ ] Verify `StaffAPI.invoices.delete(id)` implementation
- [ ] Confirm endpoint: `DELETE /api/invoice/:id`
- [ ] Validate path parameter: `id: string`
- [ ] Check deletion response and restrictions
- [ ] Handle paid invoice deletion restrictions

**Task 7.6.2** - Component Implementation
- [ ] Create `InvoiceDelete` in `src/components/staff/invoices/`
- [ ] Build deletion confirmation dialog
- [ ] Add deletion restrictions checking
- [ ] Implement cascade deletion warnings
- [ ] Create audit trail for deletions

**Task 7.6.3** - UI/UX Placement
- [ ] Delete button in invoice detail page
- [ ] Bulk delete option in invoices list
- [ ] Include deletion restrictions UI
- [ ] Confirmation dialog with warnings
- [ ] Admin-level deletion controls

**Task 7.6.4** - User Interaction & Parameters
- [ ] Deletion confirmation with invoice details
- [ ] Reason input for audit trail
- [ ] Cascade deletion warnings
- [ ] Alternative actions (void vs delete)
- [ ] Permanent deletion confirmation

**Task 7.6.5** - Response Display
- [ ] Deletion success confirmation
- [ ] Redirect to invoices list after deletion
- [ ] Error handling for deletion restrictions
- [ ] Audit trail documentation
- [ ] Integration with reporting systems

### **Endpoint 7.7: GET /api/invoice/:id/pdf**

**Task 7.7.1** - API Verification
- [ ] Verify `StaffAPI.invoices.getPdf(id)` implementation
- [ ] Confirm endpoint: `GET /api/invoice/:id/pdf`
- [ ] Validate path parameter: `id: string`
- [ ] Check PDF response handling (Blob)
- [ ] Handle PDF generation errors

**Task 7.7.2** - Component Implementation
- [ ] Create `InvoicePdfViewer` in `src/components/staff/invoices/`
- [ ] Build PDF download and preview interface
- [ ] Add print functionality
- [ ] Implement PDF loading states
- [ ] Create email PDF option

**Task 7.7.3** - UI/UX Placement
- [ ] PDF button in invoice detail page
- [ ] Print option in invoice actions
- [ ] Bulk PDF generation for multiple invoices
- [ ] Email invoice functionality
- [ ] PDF preview modal

**Task 7.7.4** - User Interaction & Parameters
- [ ] Download PDF to device
- [ ] Print PDF directly
- [ ] Email PDF to customer/patient
- [ ] PDF preview before actions
- [ ] Batch PDF operations

**Task 7.7.5** - Response Display
- [ ] PDF download initiation
- [ ] Print dialog opening
- [ ] Email confirmation for sent PDFs
- [ ] PDF generation progress indicator
- [ ] Error handling for PDF failures

### **Endpoint 7.8: GET /api/invoice/:id/thermal**

**Task 7.8.1** - API Verification
- [ ] Verify `StaffAPI.invoices.getThermal(id)` implementation
- [ ] Confirm endpoint: `GET /api/invoice/:id/thermal`
- [ ] Validate path parameter: `id: string`
- [ ] Check thermal receipt response format
- [ ] Handle thermal printer compatibility

**Task 7.8.2** - Component Implementation
- [ ] Create `InvoiceThermalPrint` in `src/components/staff/invoices/`
- [ ] Build thermal printer interface
- [ ] Add receipt format selection
- [ ] Implement printer connectivity
- [ ] Create receipt preview

**Task 7.8.3** - UI/UX Placement
- [ ] Thermal print button in invoice actions
- [ ] POS receipt printing workflow
- [ ] Quick receipt reprint option
- [ ] Thermal printer management interface
- [ ] Mobile POS integration

**Task 7.8.4** - User Interaction & Parameters
- [ ] Printer selection and configuration
- [ ] Receipt format customization
- [ ] Print queue management
- [ ] Receipt reprint functionality
- [ ] Printer status monitoring

**Task 7.8.5** - Response Display
- [ ] Thermal receipt preview
- [ ] Print job status confirmation
- [ ] Printer error handling
- [ ] Receipt printing success notification
- [ ] Queue management interface

---

## 🎯 **IMPLEMENTATION GUIDELINES**

### **🔧 Technical Requirements**
- **React 18** with latest features (Suspense, Concurrent Rendering)
- **TypeScript** with strict mode and proper type definitions
- **Shadcn/ui** components for consistent design system
- **TailwindCSS** for responsive styling
- **Redux Toolkit** for state management with RTK Query for API caching
- **React Router v6** with declarative routing and data loading
- **React Hook Form** with Zod validation
- **Recharts** for data visualization

### **📱 Responsive Design Standards**
- **Mobile First**: Design for 320px+ screens
- **Tablet Optimization**: 768px+ with touch-friendly interfaces
- **Desktop Enhancement**: 1024px+ with advanced features
- **Print Layouts**: Proper CSS for invoice/receipt printing

### **🎨 UI/UX Standards**
- **Accessibility**: WCAG 2.1 AA compliance
- **Loading States**: Skeleton screens and progress indicators
- **Error Handling**: User-friendly error messages with recovery options
- **Notifications**: Toast notifications for all actions
- **Confirmation Dialogs**: For destructive or important actions

### **🔐 Security Considerations**
- **Authentication**: JWT token management with auto-refresh
- **Authorization**: Role-based access control for all actions
- **Data Validation**: Client-side validation with server-side verification
- **Secure Storage**: Proper handling of sensitive data

### **📊 Performance Requirements**
- **Code Splitting**: Route-based and component-based lazy loading
- **Caching**: RTK Query for API response caching
- **Optimization**: React.memo and useMemo for expensive operations
- **Bundle Size**: Monitor and optimize bundle size

---

## ✅ **COMPLETION CHECKLIST**

Each task should be marked complete only when:
- [ ] Code is written and tested
- [ ] TypeScript types are properly defined
- [ ] Responsive design works on all screen sizes
- [ ] Error handling is implemented
- [ ] Loading states are included
- [ ] Accessibility requirements are met
- [ ] Integration with Redux state is working
- [ ] API endpoints are properly called and responses handled
- [ ] User experience is intuitive and efficient

**Total Tasks: 185**
**Target Completion: Progressive implementation with testing at each milestone**

This comprehensive task list ensures that every endpoint from the `staff.md` documentation is properly implemented with a complete, professional, and user-friendly frontend interface.

