const API_BASE_URL = 'http://localhost:8080/api/customers';

$(document).ready(function () {
    loadDashboard();
});

function loadDashboard(successMessage = null) {
    $.ajax({
        url: API_BASE_URL + '/stats',
        type: 'GET',
        success: function (stats) {
            renderDashboardView(stats, successMessage);
            loadCustomers();
        },
        error: function (xhr, status, error) {
            console.error("Failed to load statistics:", error);
            $('#app-content').html(`<div class="alert alert-danger">Failed to connect to the backend server.</div>`);
        }
    });
}

function renderDashboardView(stats, successMessage) {
    let alertHtml = '';
    if (successMessage) {
        alertHtml = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>${successMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // UPDATED: Used row-cols to create a responsive 5-card layout
    const dashboardHtml = `
        ${alertHtml}
        <!-- Statistics Cards -->
        <div class="row g-3 mb-4 row-cols-1 row-cols-md-3 row-cols-xl-5">
            <div class="col">
                <div class="card dashboard-card bg-primary text-white h-100">
                    <div class="card-body">
                        <h6 class="card-title"><i class="fas fa-users me-2"></i>Total</h6>
                        <h3 class="display-6">${stats.totalCustomers}</h3>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card dashboard-card bg-success text-white h-100">
                    <div class="card-body">
                        <h6 class="card-title"><i class="fas fa-user-check me-2"></i>Active</h6>
                        <h3 class="display-6">${stats.activeCustomers}</h3>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card dashboard-card bg-secondary text-white h-100">
                    <div class="card-body">
                        <h6 class="card-title"><i class="fas fa-user-times me-2"></i>Inactive</h6>
                        <h3 class="display-6">${stats.inactiveCustomers}</h3>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card dashboard-card bg-info text-white h-100">
                    <div class="card-body">
                        <h6 class="card-title"><i class="fas fa-user me-2"></i>Individual</h6>
                        <h3 class="display-6">${stats.individualCustomers}</h3>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card dashboard-card bg-dark text-white h-100">
                    <div class="card-body">
                        <h6 class="card-title"><i class="fas fa-building me-2"></i>Business</h6>
                        <h3 class="display-6">${stats.businessCustomers}</h3>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Header & Add Button -->
        <div class="row mb-3 mt-4">
            <div class="col-12 d-flex justify-content-between align-items-center border-bottom pb-2">
                <h3><i class="fas fa-address-book me-2 text-primary"></i>Customer Directory</h3>
                <button class="btn btn-primary" onclick="showAddCustomerForm()">
                    <i class="fas fa-plus me-2"></i>Add Customer
                </button>
            </div>
        </div>
        
        <!-- Search and Filter Bar -->
        <div class="row mb-3 bg-white p-3 rounded shadow-sm">
            <div class="col-md-5 mb-2 mb-md-0">
                <input type="text" id="searchInput" class="form-control" placeholder="Search by name, email or code..." onkeyup="loadCustomers()">
            </div>
            <div class="col-md-3 mb-2 mb-md-0">
                <select id="typeFilter" class="form-select" onchange="loadCustomers()">
                    <option value="">All Types</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business</option>
                </select>
            </div>
            <div class="col-md-3 mb-2 mb-md-0">
                <select id="statusFilter" class="form-select" onchange="loadCustomers()">
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>
            <div class="col-md-1">
                <button class="btn btn-outline-secondary w-100" onclick="resetFilters()" title="Reset Filters">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>
        
        <!-- Table Container -->
        <div id="table-data-container" class="bg-white rounded shadow-sm overflow-hidden">
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Loading customer records...</p>
            </div>
        </div>
    `;
    
    $('#app-content').html(dashboardHtml);
}

function loadCustomers() {
    let searchTerm = $('#searchInput').val() || '';
    let type = $('#typeFilter').val() || '';
    let status = $('#statusFilter').val() || '';

    $.ajax({
        url: API_BASE_URL + '/search',
        type: 'GET',
        data: { searchTerm: searchTerm, type: type, status: status },
        success: function (customers) {
            renderCustomerTable(customers);
        },
        error: function (error) {
            console.error("Error fetching customers:", error);
            $('#table-data-container').html(`<div class="alert alert-danger m-3">Failed to load customer data.</div>`);
        }
    });
}

function renderCustomerTable(customers) {
    if (customers.length === 0) {
        $('#table-data-container').html(`
            <div class="text-center py-5">
                <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No customers found</h5>
            </div>
        `);
        return;
    }

    let tableHtml = `
        <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    customers.forEach(customer => {
        let statusBadge = customer.customerStatus === 'ACTIVE' ? 'badge-active' : 'badge-inactive';
        let typeIcon = customer.customerType === 'BUSINESS' ? '<i class="fas fa-building text-secondary me-1"></i>' : '<i class="fas fa-user text-secondary me-1"></i>';
        
        tableHtml += `
            <tr>
                <td class="fw-bold">${customer.customerCode}</td>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td><a href="mailto:${customer.email}" class="text-decoration-none">${customer.email}</a></td>
                <td>${typeIcon}${customer.customerType}</td>
                <td><span class="${statusBadge}">${customer.customerStatus}</span></td>
                <td class="text-end">
                    <!-- UPDATED: Added View Profile Button -->
                    <button class="btn btn-sm btn-outline-info btn-action" onclick="viewCustomerProfile(${customer.id})" title="View Profile">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary btn-action" onclick="showEditCustomerForm(${customer.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteCustomer(${customer.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tableHtml += `</tbody></table></div>`;
    $('#table-data-container').html(tableHtml);
}

function resetFilters() {
    $('#searchInput').val('');
    $('#typeFilter').val('');
    $('#statusFilter').val('');
    loadCustomers();
}

// --- NEW PROFILE FEATURE ---
function viewCustomerProfile(id) {
    $.ajax({
        url: API_BASE_URL + '/' + id,
        type: 'GET',
        success: function (customer) {
            renderCustomerProfile(customer);
        },
        error: function (error) {
            alert("Error fetching customer profile.");
        }
    });
}

function renderCustomerProfile(customer) {
    let statusBadge = customer.customerStatus === 'ACTIVE' ? 'badge-active' : 'badge-inactive';
    let typeIcon = customer.customerType === 'BUSINESS' ? 'fa-building' : 'fa-user';

    const profileHtml = `
        <div class="card shadow-sm mt-3 border-0">
            <div class="card-header bg-white pb-0 border-bottom-0 pt-4 px-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0"><i class="fas fa-id-badge text-info me-2"></i>Customer Profile</h4>
                    <button class="btn btn-outline-secondary" onclick="loadDashboard()">
                        <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
                    </button>
                </div>
            </div>
            <div class="card-body px-4 pb-5">
                <div class="row bg-light rounded p-4 mb-4 text-center">
                    <div class="col-12">
                        <div class="display-1 text-secondary mb-3"><i class="fas ${typeIcon}"></i></div>
                        <h2 class="fw-bold">${customer.firstName} ${customer.lastName}</h2>
                        <h5 class="text-muted mb-3">${customer.customerCode}</h5>
                        <span class="${statusBadge} fs-6">${customer.customerStatus}</span>
                    </div>
                </div>
                
                <h5 class="border-bottom pb-2 mb-3">Contact Information</h5>
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="text-muted small">Email Address</div>
                        <div class="fs-5"><a href="mailto:${customer.email}" class="text-decoration-none">${customer.email}</a></div>
                    </div>
                    <div class="col-md-6">
                        <div class="text-muted small">Phone Number</div>
                        <div class="fs-5">${customer.phoneNumber || '<span class="text-muted fst-italic">Not provided</span>'}</div>
                    </div>
                </div>

                <h5 class="border-bottom pb-2 mb-3">Location Details</h5>
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="text-muted small">Street Address</div>
                        <div class="fs-5">${customer.address || '<span class="text-muted fst-italic">Not provided</span>'}</div>
                    </div>
                    <div class="col-md-6">
                        <div class="text-muted small">City</div>
                        <div class="fs-5">${customer.city || '<span class="text-muted fst-italic">Not provided</span>'}</div>
                    </div>
                </div>
                
                <div class="mt-5 text-end">
                    <button class="btn btn-primary" onclick="showEditCustomerForm(${customer.id})">
                        <i class="fas fa-edit me-2"></i>Edit Customer
                    </button>
                </div>
            </div>
        </div>
    `;

    $('#app-content').html(profileHtml);
}

// --- FORM HANDLING (Unchanged) ---
function showAddCustomerForm() { renderCustomerForm(null); }

function showEditCustomerForm(id) {
    $.ajax({
        url: API_BASE_URL + '/' + id,
        type: 'GET',
        success: function (customer) { renderCustomerForm(customer); },
        error: function (error) { alert("Error fetching customer details."); }
    });
}

function renderCustomerForm(customer) {
    const isEdit = customer != null;
    const title = isEdit ? 'Edit Customer' : 'Add New Customer';
    const id = isEdit ? customer.id : '';
    const code = isEdit ? customer.customerCode : '';
    const firstName = isEdit ? customer.firstName : '';
    const lastName = isEdit ? customer.lastName : '';
    const email = isEdit ? customer.email : '';
    const phone = isEdit ? customer.phoneNumber : '';
    const address = isEdit ? customer.address : '';
    const city = isEdit ? customer.city : '';
    const type = isEdit ? customer.customerType : 'INDIVIDUAL';
    const status = isEdit ? customer.customerStatus : 'ACTIVE';

    const formHtml = `
        <div class="card shadow-sm mt-3">
            <div class="card-header bg-white pb-0 border-bottom-0 pt-4 px-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0"><i class="fas ${isEdit ? 'fa-user-edit' : 'fa-user-plus'} text-primary me-2"></i>${title}</h4>
                    <button class="btn btn-outline-secondary" onclick="loadDashboard()">
                        <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
                    </button>
                </div>
            </div>
            <div class="card-body px-4 pb-4">
                <div id="formErrorBanner" class="alert alert-danger d-none" role="alert"></div>
                <form id="customerForm" onsubmit="saveCustomer(event)">
                    <input type="hidden" id="formId" value="${id}">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label required-field">Customer Code</label>
                            <input type="text" class="form-control" id="formCode" value="${code}" required maxlength="50">
                            <div class="invalid-feedback" id="errorCode"></div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label required-field">First Name</label>
                            <input type="text" class="form-control" id="formFirstName" value="${firstName}" required maxlength="100">
                            <div class="invalid-feedback" id="errorFirstName"></div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label required-field">Last Name</label>
                            <input type="text" class="form-control" id="formLastName" value="${lastName}" required maxlength="100">
                            <div class="invalid-feedback" id="errorLastName"></div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label required-field">Email Address</label>
                            <input type="email" class="form-control" id="formEmail" value="${email}" required maxlength="150">
                            <div class="invalid-feedback" id="errorEmail"></div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Phone Number</label>
                            <input type="text" class="form-control" id="formPhone" value="${phone}" maxlength="20">
                            <div class="invalid-feedback" id="errorPhone"></div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Address</label>
                            <input type="text" class="form-control" id="formAddress" value="${address}" maxlength="255">
                            <div class="invalid-feedback" id="errorAddress"></div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">City</label>
                            <input type="text" class="form-control" id="formCity" value="${city}" maxlength="100">
                            <div class="invalid-feedback" id="errorCity"></div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label required-field">Customer Type</label>
                            <select class="form-select" id="formType" required>
                                <option value="INDIVIDUAL" ${type === 'INDIVIDUAL' ? 'selected' : ''}>Individual</option>
                                <option value="BUSINESS" ${type === 'BUSINESS' ? 'selected' : ''}>Business</option>
                            </select>
                            <div class="invalid-feedback" id="errorType"></div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label required-field">Account Status</label>
                            <select class="form-select" id="formStatus" required>
                                <option value="ACTIVE" ${status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                                <option value="INACTIVE" ${status === 'INACTIVE' ? 'selected' : ''}>Inactive</option>
                            </select>
                            <div class="invalid-feedback" id="errorStatus"></div>
                        </div>
                    </div>
                    <div class="mt-4 text-end">
                        <button type="button" class="btn btn-secondary me-2" onclick="loadDashboard()">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="btnSave">
                            <i class="fas fa-save me-2"></i>Save Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    $('#app-content').html(formHtml);
}

function saveCustomer(event) {
    event.preventDefault(); 
    $('.is-invalid').removeClass('is-invalid');
    $('#formErrorBanner').addClass('d-none');
    $('#btnSave').prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...');

    const id = $('#formId').val();
    const isEdit = id !== '';
    const requestData = {
        customerCode: $('#formCode').val().trim(),
        firstName: $('#formFirstName').val().trim(),
        lastName: $('#formLastName').val().trim(),
        email: $('#formEmail').val().trim(),
        phoneNumber: $('#formPhone').val().trim(),
        address: $('#formAddress').val().trim(),
        city: $('#formCity').val().trim(),
        customerType: $('#formType').val(),
        customerStatus: $('#formStatus').val()
    };
    const httpMethod = isEdit ? 'PUT' : 'POST';
    const ajaxUrl = isEdit ? API_BASE_URL + '/' + id : API_BASE_URL;

    $.ajax({
        url: ajaxUrl,
        type: httpMethod,
        contentType: 'application/json',
        data: JSON.stringify(requestData), 
        success: function () {
            const msg = isEdit ? "Customer updated successfully!" : "New customer created successfully!";
            loadDashboard(msg);
        },
        error: function (xhr) {
            $('#btnSave').prop('disabled', false).html('<i class="fas fa-save me-2"></i>Save Customer');
            if (xhr.status === 409) {
                const response = JSON.parse(xhr.responseText);
                $('#formErrorBanner').removeClass('d-none').text(response.error);
            } 
            else if (xhr.status === 400) {
                const errors = JSON.parse(xhr.responseText);
                if (errors.customerCode) { $('#formCode').addClass('is-invalid'); $('#errorCode').text(errors.customerCode); }
                if (errors.firstName) { $('#formFirstName').addClass('is-invalid'); $('#errorFirstName').text(errors.firstName); }
                if (errors.lastName) { $('#formLastName').addClass('is-invalid'); $('#errorLastName').text(errors.lastName); }
                if (errors.email) { $('#formEmail').addClass('is-invalid'); $('#errorEmail').text(errors.email); }
                if (errors.customerType) { $('#formType').addClass('is-invalid'); $('#errorType').text(errors.customerType); }
                if (errors.customerStatus) { $('#formStatus').addClass('is-invalid'); $('#errorStatus').text(errors.customerStatus); }
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }
    });
}

function deleteCustomer(id) {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
        $.ajax({
            url: API_BASE_URL + '/' + id,
            type: 'DELETE',
            success: function () {
                loadDashboard("Customer deleted successfully!");
            },
            error: function (xhr) {
                console.error("Delete failed:", xhr);
                alert("Failed to delete the customer.");
            }
        });
    }
}