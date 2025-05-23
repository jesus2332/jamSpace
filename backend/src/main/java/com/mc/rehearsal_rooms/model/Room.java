package com.mc.rehearsal_rooms.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name= "room")
public class Room {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Lob
    @Column(nullable = false)
    private String description;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_equipment", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "equipment_item")
    private List<String> equipment = new ArrayList<>();


    @Column(nullable = false)
    private int capacity;



    @Column(length = 2048)
    private String imageUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;


}
