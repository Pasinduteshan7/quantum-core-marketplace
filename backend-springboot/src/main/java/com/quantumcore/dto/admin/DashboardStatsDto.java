package com.quantumcore.dto.admin;

import lombok.*;

/**
 * DTO for the Admin Dashboard stat cards.
 *
 * This is NOT stored in a database table — it's computed on the fly every time
 * the admin visits the dashboard. AdminController queries the existing orders,
 * products, and users tables, does the math, and packs it into this DTO.
 *
 * Think of it as a "report" — it's a snapshot of the store's health at this moment.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private double totalRevenue;   // Sum of totalAmount across all non-cancelled orders
    private long totalOrders;
    private long pendingOrders;    // Orders still in "PENDING" status — needs admin attention
    private long totalProducts;
    private long totalUsers;
}
