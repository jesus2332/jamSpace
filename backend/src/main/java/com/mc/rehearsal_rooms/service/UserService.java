package com.mc.rehearsal_rooms.service;

import com.mc.rehearsal_rooms.dto.UserResponseDTO;
import com.mc.rehearsal_rooms.dto.RegisterRequestDTO;

public interface UserService {
    UserResponseDTO registerUser(RegisterRequestDTO registerRequestDTO);

}
