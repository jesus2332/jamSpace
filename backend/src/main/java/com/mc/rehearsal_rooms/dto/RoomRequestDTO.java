package com.mc.rehearsal_rooms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;


import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDTO {

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "Capacity cannot be null")
    @Min(value = 1, message = "Capacity must be greater than or equal to 1")
    @Max(value = 100, message = "Capacity must be less than or equal to 120")
    private int capacity;

    @NotEmpty(message = "Equipment cannot be empty")
    private List<String> equipment;


    private String imageUrl;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Price per hour cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per hour must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price format is invalid (max 8 integer digits, 2 fraction digits)") // Coincide con precision/scale - 2
    private BigDecimal pricePerHour;
}
