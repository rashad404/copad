package com.drcopad.copad.dto;

import lombok.Data;

@Data
public class TagDTO {
    private Long id;
    private String name;
    private String slug;
    private int postCount;
}