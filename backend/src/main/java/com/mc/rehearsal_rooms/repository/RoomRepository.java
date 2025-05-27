package com.mc.rehearsal_rooms.repository;

import com.mc.rehearsal_rooms.model.Room;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    @Query(value = "SELECT r FROM Room r",
            countQuery = "SELECT COUNT(r) FROM Room r")
    Page<Room> findAllRoomsOnly(Pageable pageable);

    @Query("SELECT DISTINCT r FROM Room r LEFT JOIN FETCH r.equipment WHERE r IN :rooms")
    List<Room> findAllWithEquipmentForGivenRooms(@Param("rooms") List<Room> rooms);
}
