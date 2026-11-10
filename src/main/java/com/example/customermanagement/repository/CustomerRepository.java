package com.example.customermanagement.repository;

import com.example.customermanagement.entity.Customer;
import com.example.customermanagement.entity.CustomerStatus;
import com.example.customermanagement.entity.CustomerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // --- Validation Methods (Already existed) ---
    boolean existsByCustomerCode(String customerCode);
    boolean existsByEmail(String email);

    // --- Dashboard Statistics Methods ---
    // count() is already provided by JpaRepository for "Total Customers"
    long countByCustomerStatus(CustomerStatus status);
    long countByCustomerType(CustomerType type);

    // --- Search and Filtering Method ---
    @Query("SELECT c FROM Customer c WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND (:type IS NULL OR c.customerType = :type) " +
           "AND (:status IS NULL OR c.customerStatus = :status)")
    List<Customer> searchAndFilterCustomers(
            @Param("searchTerm") String searchTerm,
            @Param("type") CustomerType type,
            @Param("status") CustomerStatus status);
}