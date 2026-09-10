package com.quantumcore.config;

import com.quantumcore.entity.Product;
import com.quantumcore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            List<Product> seedProducts = Arrays.asList(
                    Product.builder()
                            .itemCode("MSI-GE78")
                            .name("MSI Raider GE78 HX")
                            .brand("MSI")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(1828200.0)
                            .originalPrice(2050000.0)
                            .discount("11% OFF")
                            .specs("Intel i9-13980HX, 32GB DDR5, RTX 4090 16GB, 2TB NVMe SSD, 17\" QHD+ 240Hz")
                            .image("/images/images.jpg")
                            .badge("PRE ORDER")
                            .stock(5)
                            .rating(4.9)
                            .reviewCount(14)
                            .build(),

                    Product.builder()
                            .itemCode("MSI-GE68")
                            .name("MSI Raider GE68 HX")
                            .brand("MSI")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(1966800.0)
                            .originalPrice(2200000.0)
                            .discount("11% OFF")
                            .specs("Intel i9-13950HX, 32GB DDR5, RTX 4080 12GB, 2TB SSD, 16\" QHD+ 240Hz")
                            .image("/images/blk_sitewide_400x400.webp")
                            .badge("PRE ORDER")
                            .stock(8)
                            .rating(4.8)
                            .reviewCount(9)
                            .build(),

                    Product.builder()
                            .itemCode("MSI-TITAN-18")
                            .name("MSI Titan 18 HX AI")
                            .brand("MSI")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(2557500.0)
                            .originalPrice(2850000.0)
                            .discount("10% OFF")
                            .specs("Intel i9-14900HX, 64GB DDR5, RTX 4090 16GB, 4TB SSD, 18\" 4K Mini-LED 120Hz")
                            .image("/images/images.jpg")
                            .badge("FLAGSHIP")
                            .stock(3)
                            .rating(5.0)
                            .reviewCount(6)
                            .build(),

                    Product.builder()
                            .itemCode("ROG-G18")
                            .name("ASUS ROG Strix G18")
                            .brand("ASUS")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(1750000.0)
                            .originalPrice(1950000.0)
                            .discount("10% OFF")
                            .specs("Intel i9-13980HX, 32GB DDR5, RTX 4070 Ti, 1TB NVMe, 18\" Nebula Display 240Hz")
                            .image("/images/blk_sitewide_400x400.webp")
                            .badge("NEW")
                            .stock(12)
                            .rating(4.7)
                            .reviewCount(18)
                            .build(),

                    Product.builder()
                            .itemCode("LEN-LEGION-9")
                            .name("Lenovo Legion 9i Gen 8")
                            .brand("Lenovo")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(2350000.0)
                            .originalPrice(2600000.0)
                            .discount("10% OFF")
                            .specs("Intel i9-13980HX, 32GB DDR5, RTX 4090, 2TB SSD, Liquid Cooled Carbon Fiber")
                            .image("/images/images (1).jpg")
                            .badge("HOT")
                            .stock(4)
                            .rating(4.9)
                            .reviewCount(11)
                            .build(),

                    Product.builder()
                            .itemCode("HP-OMEN-16")
                            .name("HP Omen 16 Gaming")
                            .brand("HP")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(685000.0)
                            .originalPrice(750000.0)
                            .discount("9% OFF")
                            .specs("AMD Ryzen 7 7840HS, 16GB DDR5, RTX 4060 8GB, 1TB SSD, 16.1\" 165Hz")
                            .image("/images/images (2).jpg")
                            .badge("SALE")
                            .stock(7)
                            .rating(4.6)
                            .reviewCount(20)
                            .build(),

                    Product.builder()
                            .itemCode("ACER-PRED-16")
                            .name("Acer Predator Helios 16")
                            .brand("Acer")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(745000.0)
                            .originalPrice(820000.0)
                            .discount("9% OFF")
                            .specs("Intel i7-13700HX, 16GB DDR5, RTX 4070 8GB, 1TB SSD, 16\" WQXGA 240Hz")
                            .image("/images/images (3).jpg")
                            .badge("POPULAR")
                            .stock(9)
                            .rating(4.7)
                            .reviewCount(15)
                            .build(),

                    Product.builder()
                            .itemCode("MSI-CYBORG-15")
                            .name("MSI Cyborg 15 A12V")
                            .brand("MSI")
                            .category("Laptops")
                            .subCategory("Gaming Laptops")
                            .price(425000.0)
                            .originalPrice(465000.0)
                            .discount("8% OFF")
                            .specs("Intel i7-12650H, 16GB DDR5, RTX 4060 8GB, 512GB NVMe, Translucent Chassis")
                            .image("/images/images (4).jpg")
                            .badge("VALUE")
                            .stock(15)
                            .rating(4.5)
                            .reviewCount(28)
                            .build()
            );

            productRepository.saveAll(seedProducts);
            System.out.println("✅ Successfully seeded " + seedProducts.size() + " products into PostgreSQL!");
        }
    }
}
