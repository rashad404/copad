package com.drcopad.copad.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterDTO {
    private String name;
    private String email;
    private String password;
    private int age;
    private String gender;
}