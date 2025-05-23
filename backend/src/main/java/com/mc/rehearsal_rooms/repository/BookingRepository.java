package com.mc.rehearsal_rooms.repository;

import com.mc.rehearsal_rooms.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {


    // Encontrar reservas para una sala específica que se solapan con un intervalo de tiempo dado
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND " +
            "((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findOverlappingBookings(@Param("roomId") int roomId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    List<Booking> findByUserId(int userId);

    List<Booking> findByRoomId(int roomId);


    List<Booking> findByUserIdAndStartTimeAfterOrderByStartTimeAsc(int userId, LocalDateTime startTime);

}
