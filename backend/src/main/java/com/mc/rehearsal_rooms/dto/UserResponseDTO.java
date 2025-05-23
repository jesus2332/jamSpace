package com.mc.rehearsal_rooms.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private int id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}
