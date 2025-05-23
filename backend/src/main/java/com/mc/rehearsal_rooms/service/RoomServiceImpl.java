package com.mc.rehearsal_rooms.service;

import com.mc.rehearsal_rooms.dto.RoomRequestDTO;
import com.mc.rehearsal_rooms.dto.RoomResponseDTO;
import com.mc.rehearsal_rooms.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import com.mc.rehearsal_rooms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    private RoomResponseDTO convertToResponseDTO(Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getName(),
                room.getCapacity(),
                room.getEquipment(),
                room.getImageUrl(),
                room.getDescription(),
                room.getPricePerHour()
        );
    }

    private Room convertToEntity(RoomRequestDTO dto) {
        Room room = new Room();
        room.setName(dto.getName());
        room.setCapacity(dto.getCapacity());
        room.setEquipment(dto.getEquipment() != null ? new ArrayList<>(dto.getEquipment()) : new ArrayList<>());
        room.setImageUrl(dto.getImageUrl());
        room.setDescription(dto.getDescription());
        room.setPricePerHour(dto.getPricePerHour());
        return room;
    }

    @Override
    @Transactional
    public RoomResponseDTO createRoom(RoomRequestDTO roomRequestDTO) {
        Room room = convertToEntity(roomRequestDTO);
        Room savedRoom = roomRepository.save(room);
        return convertToResponseDTO(savedRoom);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<RoomResponseDTO> getAllRooms(Pageable pageable) {
        Page<Room> roomPage = roomRepository.findAll(pageable);
        List<RoomResponseDTO> roomResponseDTOs = roomPage.getContent()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(roomResponseDTOs, pageable, roomPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RoomResponseDTO> getRoomById(int id) {
        return roomRepository.findById(id)
                .map(this::convertToResponseDTO); // Mapea el Room a RoomResponseDTO si está presente
    }

    @Override
    @Transactional
    public Optional<RoomResponseDTO> updateRoom(int id, RoomRequestDTO roomRequestDTO) {
        return roomRepository.findById(id)
                .map(existingRoom -> {
                    existingRoom.setName(roomRequestDTO.getName());
                    existingRoom.setCapacity(roomRequestDTO.getCapacity());
                    existingRoom.setEquipment(roomRequestDTO.getEquipment() != null ? new ArrayList<>(roomRequestDTO.getEquipment()) : new ArrayList<>());
                    existingRoom.setImageUrl(roomRequestDTO.getImageUrl());
                    existingRoom.setDescription(roomRequestDTO.getDescription());
                    existingRoom.setPricePerHour(roomRequestDTO.getPricePerHour()); // Añadido
                    Room updatedRoom = roomRepository.save(existingRoom);
                    return convertToResponseDTO(updatedRoom);
                });
    }

    @Override
    @Transactional
    public boolean deleteRoom(int id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }








}

