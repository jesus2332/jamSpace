package com.mc.rehearsal_rooms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {

    private int id;
    private int roomId;
    private String roomName;
    private int userId;
    private String username;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private BigDecimal totalCost;
}
