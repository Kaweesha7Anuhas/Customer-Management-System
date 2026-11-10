package com.example.customermanagement.controller;

import com.example.customermanagement.dto.CustomerRequestDTO;
import com.example.customermanagement.dto.CustomerResponseDTO;
import com.example.customermanagement.dto.DashboardStatsDTO;
import com.example.customermanagement.entity.CustomerStatus;
import com.example.customermanagement.entity.CustomerType;
import com.example.customermanagement.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    // Constructor Injection
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // --- DASHBOARD STATISTICS ---
    // GET /api/customers/stats
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStatistics() {
        DashboardStatsDTO stats = customerService.getDashboardStatistics();
        return ResponseEntity.ok(stats); // Returns 200 OK
    }

    // --- SEARCH AND FILTER ---
    // GET /api/customers/search?searchTerm=kamal&type=INDIVIDUAL&status=ACTIVE
    @GetMapping("/search")
    public ResponseEntity<List<CustomerResponseDTO>> searchAndFilterCustomers(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) CustomerType type,
            @RequestParam(required = false) CustomerStatus status) {
        
        List<CustomerResponseDTO> response = customerService.searchAndFilterCustomers(searchTerm, type, status);
        return ResponseEntity.ok(response); // Returns 200 OK
    }

    // 1. CREATE - POST /api/customers
    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(@Valid @RequestBody CustomerRequestDTO requestDTO) {
        CustomerResponseDTO response = customerService.createCustomer(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED); // Returns 201 Created
    }

    // 2. READ ALL - GET /api/customers
    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        List<CustomerResponseDTO> response = customerService.getAllCustomers();
        return ResponseEntity.ok(response); // Returns 200 OK
    }

    // 3. READ SINGLE - GET /api/customers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long id) {
        CustomerResponseDTO response = customerService.getCustomerById(id);
        return ResponseEntity.ok(response); // Returns 200 OK
    }

    // 4. UPDATE - PUT /api/customers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerRequestDTO requestDTO) {
        CustomerResponseDTO response = customerService.updateCustomer(id, requestDTO);
        return ResponseEntity.ok(response); // Returns 200 OK
    }

    // 5. DELETE - DELETE /api/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build(); // Returns 204 No Content
    }
}