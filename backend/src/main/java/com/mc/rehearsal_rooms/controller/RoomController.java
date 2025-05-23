package com.mc.rehearsal_rooms.controller;

import com.mc.rehearsal_rooms.dto.RoomRequestDTO;
import com.mc.rehearsal_rooms.dto.RoomResponseDTO;
import com.mc.rehearsal_rooms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

import java.util.List;


@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Solo admins pueden crear
    public ResponseEntity<RoomResponseDTO> createRoom(@Valid @RequestBody RoomRequestDTO roomRequestDTO) {
        RoomResponseDTO createdRoom = roomService.createRoom(roomRequestDTO);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED); // 201 Created
    }

    @GetMapping
    public ResponseEntity<Page<RoomResponseDTO>> getAllRooms(
            @PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable) {

        Page<RoomResponseDTO> roomsPage = roomService.getAllRooms(pageable);
        return ResponseEntity.ok(roomsPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(@PathVariable int id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok) //
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<RoomResponseDTO> updateRoom(@PathVariable int id, @Valid @RequestBody RoomRequestDTO roomRequestDTO) {
        return roomService.updateRoom(id, roomRequestDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable int id) {
        boolean deleted = roomService.deleteRoom(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
