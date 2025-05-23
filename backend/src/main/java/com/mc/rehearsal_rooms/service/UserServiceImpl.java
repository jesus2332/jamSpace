package com.mc.rehearsal_rooms.service;


import com.mc.rehearsal_rooms.dto.UserResponseDTO;
import com.mc.rehearsal_rooms.dto.RegisterRequestDTO;
import com.mc.rehearsal_rooms.model.User;
import com.mc.rehearsal_rooms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mc.rehearsal_rooms.exception.EmailAlreadyInUseException;
import com.mc.rehearsal_rooms.exception.UsernameAlreadyExistsException;
@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //  mapear  Entidad User a UserResponseDTO
    private UserResponseDTO convertToResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName());
    }

    @Override
    @Transactional
    public UserResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByUsername(registerRequestDTO.getUsername())) {

            throw new UsernameAlreadyExistsException("Error: Username '" + registerRequestDTO.getUsername() + "' is already taken!");
        }

        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new EmailAlreadyInUseException("Error: Email '" + registerRequestDTO.getEmail() + "' is already in use!");
        }

        User user = new User();
        user.setUsername(registerRequestDTO.getUsername());
        user.setEmail(registerRequestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
        user.setFirstName(registerRequestDTO.getFirstName());
        user.setLastName(registerRequestDTO.getLastName());

        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }


}
