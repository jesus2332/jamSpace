package com.mc.rehearsal_rooms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDTO {
    private int id;
    private String name;
    private int capacity;
    private List<String> equipment;
    private String imageUrl;
    private String description;
    private BigDecimal pricePerHour;

}
