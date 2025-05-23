package com.mc.rehearsal_rooms.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY) // Muchas reservas pueden pertenecer a una sala
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY) // Muchas reservas pueden ser hechas por un usuario
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, precision = 12, scale = 2) // Precisión mayor por si son muchas horas
    private BigDecimal totalCost;



    public void calculateTotalCost() {
        if (this.room != null && this.room.getPricePerHour() != null && this.startTime != null && this.endTime != null) {
            if (this.endTime.isAfter(this.startTime)) {
                Duration duration = Duration.between(this.startTime, this.endTime);

                long minutes = duration.toMinutes();
                if (minutes <= 0) {
                    this.totalCost = BigDecimal.ZERO;
                    return;
                }

                BigDecimal hours = BigDecimal.valueOf(Math.ceil(minutes / 60.0));

                this.totalCost = this.room.getPricePerHour().multiply(hours).setScale(2, RoundingMode.HALF_UP);
            } else {
                this.totalCost = BigDecimal.ZERO;
            }
        } else {
            this.totalCost = BigDecimal.ZERO;
        }
    }

    @PrePersist
    protected void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        calculateTotalCost();
    }



}
