package com.mc.rehearsal_rooms.controller;
import jakarta.validation.Valid;
import com.mc.rehearsal_rooms.dto.BookingRequestDTO;
import com.mc.rehearsal_rooms.dto.BookingResponseDTO;
import com.mc.rehearsal_rooms.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new IllegalStateException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()") // Cualquier usuario autenticado puede intentar crear una reserva
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO bookingRequestDTO) {
        String username = getAuthenticatedUsername();
        BookingResponseDTO createdBooking = bookingService.createBooking(bookingRequestDTO, username);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @GetMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable int bookingId) {

        return bookingService.getBookingById(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @PageableDefault(size = 10, sort = "startTime") Pageable pageable // Pageable para futuras mejoras
    ) {
        String username = getAuthenticatedUsername();
        List<BookingResponseDTO> bookings = bookingService.getMyBookings(username, pageable);
        return ResponseEntity.ok(bookings);
    }

    // --- Endpoints para Administrador ---
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(
            @PageableDefault(size = 10, sort = "startTime") Pageable pageable) {
        Page<BookingResponseDTO> bookingsPage = bookingService.getAllBookings(pageable);
        return ResponseEntity.ok(bookingsPage);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByUserId(@PathVariable int userId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()") // El servicio se encarga de la lógica de quién puede cancelar
    public ResponseEntity<Void> cancelBooking(@PathVariable int bookingId) {
        String username = getAuthenticatedUsername();
        boolean cancelled = bookingService.cancelBooking(bookingId, username);
        if (cancelled) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
