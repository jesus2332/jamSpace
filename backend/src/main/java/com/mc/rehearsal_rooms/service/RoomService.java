package com.mc.rehearsal_rooms.service;

import com.mc.rehearsal_rooms.dto.RoomRequestDTO;
import com.mc.rehearsal_rooms.dto.RoomResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

//import java.util.List;
import java.util.Optional;

public interface RoomService {
    RoomResponseDTO createRoom(RoomRequestDTO roomRequestDTO);
    //List<RoomResponseDTO> getAllRooms();
    Page<RoomResponseDTO> getAllRooms(Pageable pageable);
    Optional<RoomResponseDTO> getRoomById(int id);
    Optional<RoomResponseDTO> updateRoom(int id, RoomRequestDTO roomRequestDTO);
    boolean deleteRoom(int id);
}
