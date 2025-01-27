package com.mp.MPlayer.Service;

import com.mp.MPlayer.Model.CustomUser;
import com.mp.MPlayer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerCustomUser(CustomUser customUser){
        Optional<CustomUser> optionalCustomUser = userRepository.findByEmail(customUser.getEmail());
        if(optionalCustomUser.isEmpty()){
            customUser.setPassword(passwordEncoder.encode(customUser.getPassword()));
            userRepository.save(customUser);
        }
    }

}
