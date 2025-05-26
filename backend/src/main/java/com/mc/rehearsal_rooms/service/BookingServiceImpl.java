package com.mc.rehearsal_rooms.service;

import com.mc.rehearsal_rooms.dto.BookingRequestDTO;
import com.mc.rehearsal_rooms.dto.BookingResponseDTO;
import com.mc.rehearsal_rooms.exception.ResourceNotFoundException;
import com.mc.rehearsal_rooms.exception.BookingConflictException;
import com.mc.rehearsal_rooms.exception.InvalidDateTimeRangeException;
import com.mc.rehearsal_rooms.model.Booking;
import com.mc.rehearsal_rooms.model.Room;
import com.mc.rehearsal_rooms.model.User;
import com.mc.rehearsal_rooms.repository.BookingRepository;
import com.mc.rehearsal_rooms.repository.RoomRepository;
import com.mc.rehearsal_rooms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.ZoneId;


@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;


    private static final ZoneId BUSINESS_ZONE_ID = ZoneId.of("America/Chihuahua");


    private static final LocalTime EARLIEST_BOOKING_TIME = LocalTime.of(10, 0);
    private static final LocalTime LATEST_BOOKING_END_TIME = LocalTime.of(23, 0);

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository,
                              RoomRepository roomRepository,
                              UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getRoom().getId(),
                booking.getRoom().getName(),
                booking.getUser().getId(),
                booking.getUser().getUsername(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getCreatedAt(),
                booking.getTotalCost()
        );
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO, String authenticatedUsername) {
        User user = userRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authenticatedUsername));

        Room room = roomRepository.findById(bookingRequestDTO.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", bookingRequestDTO.getRoomId()));

        LocalDateTime requestLocalStartTime = LocalDateTime.ofInstant(bookingRequestDTO.getStartTime(), BUSINESS_ZONE_ID);
        LocalDateTime requestLocalEndTime = LocalDateTime.ofInstant(bookingRequestDTO.getEndTime(), BUSINESS_ZONE_ID);

        if (requestLocalStartTime.isAfter(requestLocalEndTime) || requestLocalStartTime.isEqual(requestLocalEndTime)) {
            throw new InvalidDateTimeRangeException("End time must be after start time.");
        }
        if (requestLocalStartTime.isBefore(LocalDateTime.now(BUSINESS_ZONE_ID))) {
            throw new InvalidDateTimeRangeException("Booking start time must be in the future.");
        }


        LocalTime requestStartTimeHour = requestLocalStartTime.toLocalTime();
        LocalTime requestEndTimeHour = requestLocalEndTime.toLocalTime();

        // Si la reserva es para el mismo día
        if (requestLocalStartTime.toLocalDate().equals(requestLocalEndTime.toLocalDate())) {
            if (requestStartTimeHour.isBefore(EARLIEST_BOOKING_TIME) || requestEndTimeHour.isAfter(LATEST_BOOKING_END_TIME)) {
                throw new InvalidDateTimeRangeException(
                        String.format("Las reservas deben de estar entre %s y %s del mismo día en el horario disponible.", EARLIEST_BOOKING_TIME, LATEST_BOOKING_END_TIME)
                );
            }
        } else { // Reserva cruza la medianoche
            if (requestStartTimeHour.isBefore(EARLIEST_BOOKING_TIME)) {
                throw new InvalidDateTimeRangeException(
                        String.format("El tiempo de la reserva no puede ser antes de %s en el primer día.", EARLIEST_BOOKING_TIME)
                );
            }

            if (requestEndTimeHour.isAfter(LATEST_BOOKING_END_TIME) && !requestEndTimeHour.equals(LocalTime.MIDNIGHT) ) {
                throw new InvalidDateTimeRangeException(
                        String.format("El final de la reserva no puede ser después de %s en el ultimo día.", LATEST_BOOKING_END_TIME)
                );
            }
        }

        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                room.getId(),
                requestLocalStartTime,
                requestLocalEndTime
        );

        if (!overlappingBookings.isEmpty()) {
            throw new BookingConflictException("La sala ya ha sido reservada para la hora seleccionada, por favor elija otro horario.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setStartTime(requestLocalStartTime);
        booking.setEndTime(requestLocalEndTime);

        Booking savedBooking = bookingRepository.save(booking);
        return convertToResponseDTO(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BookingResponseDTO> getBookingById(int bookingId) {
        return bookingRepository.findById(bookingId).map(this::convertToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByUserId(int userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getMyBookings(String authenticatedUsername, Pageable pageable) {
        User user = userRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authenticatedUsername));
        return bookingRepository.findByUserIdAndStartTimeAfterOrderByStartTimeAsc(user.getId(), LocalDateTime.now(BUSINESS_ZONE_ID).minusDays(1))
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDTO> getAllBookings(Pageable pageable) {
        Page<Booking> bookingPage = bookingRepository.findAll(pageable);
        List<BookingResponseDTO> bookingResponseDTOs = bookingPage.getContent().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(bookingResponseDTOs, pageable, bookingPage.getTotalElements());
    }

    @Override
    @Transactional
    public boolean cancelBooking(int bookingId, String authenticatedUsername) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        User requester = userRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", authenticatedUsername));

        int bookingUserId = booking.getUser().getId();
        int requesterId = requester.getId();


        if (bookingUserId != requesterId  && !requester.isAdmin()) {
            throw new AccessDeniedException("You are not authorized to cancel this booking.");
        }


        bookingRepository.delete(booking);
        return true;
    }
}
