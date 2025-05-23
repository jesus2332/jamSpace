package com.mc.rehearsal_rooms.service;

import com.mc.rehearsal_rooms.dto.BookingRequestDTO;
import com.mc.rehearsal_rooms.dto.BookingResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO, String authenticatedUsername);
    Optional<BookingResponseDTO> getBookingById(int bookingId);
    List<BookingResponseDTO> getBookingsByUserId(int userId); // Para un admin ver reservas de un usuario
    List<BookingResponseDTO> getMyBookings(String authenticatedUsername, Pageable pageable);
    Page<BookingResponseDTO> getAllBookings(Pageable pageable); // Para un admin
    boolean cancelBooking(int bookingId, String authenticatedUsername);
}
