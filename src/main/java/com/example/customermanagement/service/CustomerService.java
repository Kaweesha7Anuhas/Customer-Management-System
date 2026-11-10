package com.example.customermanagement.service;

import com.example.customermanagement.dto.CustomerRequestDTO;
import com.example.customermanagement.dto.CustomerResponseDTO;
import com.example.customermanagement.dto.DashboardStatsDTO;
import com.example.customermanagement.entity.Customer;
import com.example.customermanagement.entity.CustomerStatus;
import com.example.customermanagement.entity.CustomerType;
import com.example.customermanagement.exception.CustomerNotFoundException;
import com.example.customermanagement.exception.DuplicateResourceException;
import com.example.customermanagement.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // --- DASHBOARD STATISTICS LOGIC ---
    public DashboardStatsDTO getDashboardStatistics() {
        long total = customerRepository.count(); // Built-in JpaRepository method
        long active = customerRepository.countByCustomerStatus(CustomerStatus.ACTIVE);
        long inactive = customerRepository.countByCustomerStatus(CustomerStatus.INACTIVE);
        long individual = customerRepository.countByCustomerType(CustomerType.INDIVIDUAL);
        long business = customerRepository.countByCustomerType(CustomerType.BUSINESS);

        return new DashboardStatsDTO(total, active, inactive, individual, business);
    }

    // --- SEARCH AND FILTER LOGIC ---
    public List<CustomerResponseDTO> searchAndFilterCustomers(String searchTerm, CustomerType type, CustomerStatus status) {
        List<Customer> searchResults = customerRepository.searchAndFilterCustomers(searchTerm, type, status);
        
        return searchResults.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // CREATE CUSTOMER
    public CustomerResponseDTO createCustomer(CustomerRequestDTO dto) {
        if (customerRepository.existsByCustomerCode(dto.getCustomerCode())) {
            throw new DuplicateResourceException("Customer code '" + dto.getCustomerCode() + "' is already in use.");
        }
        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email '" + dto.getEmail() + "' is already in use.");
        }

        Customer customer = new Customer();
        updateEntityFromDto(customer, dto);
        Customer savedCustomer = customerRepository.save(customer);
        return mapToResponseDTO(savedCustomer);
    }

    // READ ALL CUSTOMERS
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // READ SINGLE CUSTOMER
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with ID " + id + " not found."));
        return mapToResponseDTO(customer);
    }

    // UPDATE CUSTOMER
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer with ID " + id + " not found."));

        if (!existingCustomer.getCustomerCode().equals(dto.getCustomerCode()) &&
            customerRepository.existsByCustomerCode(dto.getCustomerCode())) {
            throw new DuplicateResourceException("Customer code '" + dto.getCustomerCode() + "' is already in use.");
        }

        if (!existingCustomer.getEmail().equals(dto.getEmail()) &&
            customerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email '" + dto.getEmail() + "' is already in use.");
        }

        updateEntityFromDto(existingCustomer, dto);
        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return mapToResponseDTO(updatedCustomer);
    }

    // DELETE CUSTOMER
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer with ID " + id + " not found.");
        }
        customerRepository.deleteById(id);
    }

    // --- PRIVATE HELPER METHODS FOR MAPPING ---

    private void updateEntityFromDto(Customer customer, CustomerRequestDTO dto) {
        customer.setCustomerCode(dto.getCustomerCode());
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setAddress(dto.getAddress());
        customer.setCity(dto.getCity());
        customer.setCustomerType(dto.getCustomerType());
        customer.setCustomerStatus(dto.getCustomerStatus());
    }

    private CustomerResponseDTO mapToResponseDTO(Customer customer) {
        CustomerResponseDTO responseDTO = new CustomerResponseDTO();
        responseDTO.setId(customer.getId());
        responseDTO.setCustomerCode(customer.getCustomerCode());
        responseDTO.setFirstName(customer.getFirstName());
        responseDTO.setLastName(customer.getLastName());
        responseDTO.setEmail(customer.getEmail());
        responseDTO.setPhoneNumber(customer.getPhoneNumber());
        responseDTO.setAddress(customer.getAddress());
        responseDTO.setCity(customer.getCity());
        responseDTO.setCustomerType(customer.getCustomerType());
        responseDTO.setCustomerStatus(customer.getCustomerStatus());
        responseDTO.setCreatedAt(customer.getCreatedAt());
        responseDTO.setUpdatedAt(customer.getUpdatedAt());
        return responseDTO;
    }
}