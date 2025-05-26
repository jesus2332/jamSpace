package com.mc.rehearsal_rooms.dto;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.Instant;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class BookingRequestDTO {


    @NotNull(message = "Room ID cannot be null")
    private int roomId;

    // userId se obtendrá del usuario autenticado

    @NotNull(message = "Start time cannot be null")
    @Future(message = "Start time must be in the future")
    private Instant startTime;

    @NotNull(message = "End time cannot be null")
    @Future(message = "End time must be in the future")
    private Instant endTime;
}
