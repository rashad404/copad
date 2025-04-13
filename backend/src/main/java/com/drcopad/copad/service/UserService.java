package com.drcopad.copad.service;

import com.drcopad.copad.dto.UserRegisterDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(UserRegisterDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setAge(dto.getAge());
        user.setGender(dto.getGender());
        return userRepository.save(user);
    }
}
