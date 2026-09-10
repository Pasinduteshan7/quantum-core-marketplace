package com.quantumcore.service;

import com.quantumcore.entity.Product;
import com.quantumcore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts(String category, String brand, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return productRepository.searchProducts(search.trim());
        }
        if (category != null && brand != null) {
            return productRepository.findByCategoryIgnoreCaseAndBrandIgnoreCase(category, brand);
        }
        if (category != null) {
            return productRepository.findByCategoryIgnoreCase(category);
        }
        if (brand != null) {
            return productRepository.findByBrandIgnoreCase(brand);
        }
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
    }

    public Product getProductByItemCode(String itemCode) {
        return productRepository.findByItemCode(itemCode)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with itemCode: " + itemCode));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}
