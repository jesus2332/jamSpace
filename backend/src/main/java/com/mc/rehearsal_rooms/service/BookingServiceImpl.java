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



@Service
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

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

    // Método de ayuda para convertir Entidad a DTO
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

        if (bookingRequestDTO.getStartTime().isAfter(bookingRequestDTO.getEndTime()) ||
                bookingRequestDTO.getStartTime().isEqual(bookingRequestDTO.getEndTime())) {
            throw new InvalidDateTimeRangeException("End time must be after start time.");
        }
        if (bookingRequestDTO.getStartTime().isBefore(LocalDateTime.now())) {
            throw new InvalidDateTimeRangeException("Booking start time must be in the future.");
        }

        // VALIDACIÓN DE HORARIO
        LocalTime requestStartTime = bookingRequestDTO.getStartTime().toLocalTime();
        LocalTime requestEndTime = bookingRequestDTO.getEndTime().toLocalTime();

        if (requestStartTime.isBefore(EARLIEST_BOOKING_TIME)) {
            throw new InvalidDateTimeRangeException(
                    String.format("Booking start time cannot be before %s.", EARLIEST_BOOKING_TIME)
            );
        }


        if (bookingRequestDTO.getEndTime().toLocalDate().isAfter(bookingRequestDTO.getStartTime().toLocalDate())) {



            if (requestEndTime.isAfter(LATEST_BOOKING_END_TIME) && !requestEndTime.equals(LocalTime.MIDNIGHT)) { // Permitir que termine justo a medianoche si LATEST es 23:59:59
                throw new InvalidDateTimeRangeException(
                        String.format("Booking end time cannot be after %s on its day.", LATEST_BOOKING_END_TIME)
                );
            }


        } else { // Reserva en el mismo día
            if (requestEndTime.isAfter(LATEST_BOOKING_END_TIME)) {
                throw new InvalidDateTimeRangeException(
                        String.format("Booking end time cannot be after %s.", LATEST_BOOKING_END_TIME)
                );
            }
        }


        if (requestStartTime.isBefore(EARLIEST_BOOKING_TIME) || requestEndTime.isAfter(LATEST_BOOKING_END_TIME) || requestEndTime.isBefore(EARLIEST_BOOKING_TIME.plusMinutes(1))) {

            if(requestEndTime.equals(LocalTime.MIDNIGHT) && LATEST_BOOKING_END_TIME.equals(LocalTime.of(23,0))) {

            } else if (requestEndTime.isAfter(LATEST_BOOKING_END_TIME)) {
                throw new InvalidDateTimeRangeException(
                        String.format("Bookings must end by %s.", LATEST_BOOKING_END_TIME)
                );
            }
        }

        if (bookingRequestDTO.getStartTime().toLocalDate().equals(bookingRequestDTO.getEndTime().toLocalDate())) {
            if (requestStartTime.isBefore(EARLIEST_BOOKING_TIME) || requestEndTime.isAfter(LATEST_BOOKING_END_TIME) ) {
                throw new InvalidDateTimeRangeException(
                        String.format("Bookings must be between %s and %s on the same day.", EARLIEST_BOOKING_TIME, LATEST_BOOKING_END_TIME)
                );
            }
            if(requestEndTime.isBefore(requestStartTime)){
                throw new InvalidDateTimeRangeException("End time cannot be before start time.");
            }

        } else {

            if (requestStartTime.isBefore(EARLIEST_BOOKING_TIME)) {
                throw new InvalidDateTimeRangeException(
                        String.format("Booking start time cannot be before %s on the first day.", EARLIEST_BOOKING_TIME)
                );
            }
            if (requestEndTime.isAfter(LATEST_BOOKING_END_TIME)) {
                throw new InvalidDateTimeRangeException(
                        String.format("Booking end time cannot be after %s on the last day.", LATEST_BOOKING_END_TIME)
                );
            }
        }


        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                room.getId(),
                bookingRequestDTO.getStartTime(),
                bookingRequestDTO.getEndTime()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new BookingConflictException("The room is already booked for the selected time slot.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setStartTime(bookingRequestDTO.getStartTime());
        booking.setEndTime(bookingRequestDTO.getEndTime());

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


        return bookingRepository.findByUserIdAndStartTimeAfterOrderByStartTimeAsc(user.getId(), LocalDateTime.now().minusDays(1)) // Muestra reservas desde ayer
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
